import { NextResponse } from 'next/server'
import { request as httpsRequest } from 'node:https'

/**
 * Приём заявок с лид-форм лендинга (страницы /packaging, /audit, /prm,
 * /partner-channel).
 *
 * Транспорт. С прод-сервера (РФ) api.telegram.org недоступен, поэтому запрос
 * к Bot API идёт через nginx-прокси на нашей ноде вне РФ — ту же, через которую
 * ходят вызовы LLM. Прокси «тупой»: он лишь пробрасывает запрос, а текст
 * сообщения и токен живут здесь. Раньше вместо него стоял отдельный node-сервис
 * на 217.177.72.57:3388, слушавший голый HTTP на весь интернет без
 * аутентификации, — заменён 12.08.2026.
 * Конфиг:
 *   TELEGRAM_LEAD_BOT_TOKEN — токен бота
 *   TELEGRAM_LEAD_CHAT_ID   — чат, куда падают заявки
 *   TELEGRAM_PROXY_URL      — базовый адрес прокси (https://<ip>:8446)
 *   TELEGRAM_PROXY_SECRET   — общий секрет, заголовок x-proxy-secret
 * Пока транспорт не настроен, роут отвечает { ok:false, fallback:true },
 * а форма показывает честный фолбэк «напишите в Telegram». Каждая заявка
 * дублируется в server-лог (docker logs) как резервный след.
 *
 * TLS. Серт прокси самоподписанный и без SAN на IP, по которому мы к нему
 * идём, — проверку имени пришлось бы провалить в любом случае. Поэтому доверие
 * пиннится к общему секрету (прокси его и так требует), а не к серту; сам канал
 * при этом шифруется, и ПДн заявки не идут открытым текстом, как раньше.
 * Тот же приём, что в revroute/apps/web/lib/ai/anthropic-client.ts.
 *
 * Согласия. `consentPdn` обязателен: без согласия на обработку персональных
 * данных заявку принимать нельзя (ст. 9 152-ФЗ), и полагаться на атрибут
 * `required` в браузере тут нечего — запрос легко отправить мимо формы.
 * `consentMarketing` добровольный (ч. 1 ст. 18 38-ФЗ «О рекламе»): его
 * отсутствие ничего не блокирует, но состояние обеих отметок вместе со
 * временем и IP попадает и в лог, и в само сообщение — согласие имеет смысл
 * только тогда, когда его можно доказать.
 */

export const runtime = 'nodejs'

const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
const seen = new Map<string, number[]>()

// Экранирование под parse_mode: MarkdownV2 — Telegram требует его для всех
// перечисленных символов, иначе весь запрос отбивается с 400 и заявка теряется.
const md = (s: string) => s.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (c) => `\\${c}`)

/**
 * POST на прокси. Идём через node:https, а не fetch: под самоподписанный серт
 * нужен rejectUnauthorized:false, а задать его для fetch можно только своим
 * undici-Agent'ом — сам пакет undici в сборке падает на Node 20 из образа
 * (`markAsUncloneable is not a function`).
 */
function postJson(
  url: string,
  headers: Record<string, string>,
  body: string,
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      url,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
        rejectUnauthorized: false,
        timeout: 10_000,
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body: data }))
      },
    )
    req.on('error', reject)
    req.on('timeout', () => req.destroy(new Error('proxy timeout')))
    req.write(body)
    req.end()
  })
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 })
  }

  const field = (k: string, max: number) => String(body?.[k] ?? '').trim().slice(0, max)
  const name = field('name', 120)
  const company = field('company', 200)
  const contact = field('contact', 200)
  const about = field('about', 1000)
  const page = field('page', 40) || 'unknown'
  // Формы шлют булевы; строки 'yes'/'true' принимаем на случай отправки формой
  // без JS или сторонним клиентом.
  const flag = (k: string) => body?.[k] === true || body?.[k] === 'yes' || body?.[k] === 'true'
  const consentPdn = flag('consentPdn')
  const consentMarketing = flag('consentMarketing')

  // honeypot: боты заполняют скрытое поле — отвечаем «ок», ничего не делая
  if (field('website', 10)) return NextResponse.json({ ok: true })

  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }

  if (!consentPdn) {
    return NextResponse.json({ ok: false, error: 'consent_required' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const times = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (times.length >= MAX_PER_WINDOW) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }
  times.push(now)
  seen.set(ip, times)

  const at = new Date().toISOString()

  // резервный след в логах на случай сбоя транспорта — он же след согласий
  console.log('[lead]', JSON.stringify({ page, name, company, contact, about, consentPdn, consentMarketing, ip, at }))

  // Отметки едут в само сообщение: по нему видно, можно ли писать этому
  // контакту с предложениями, не поднимая логи.
  const consentLine =
    `Согласия: ПДн — да (${at}); рекламные рассылки — ${consentMarketing ? 'да' : 'нет'}`

  const token = process.env.TELEGRAM_LEAD_BOT_TOKEN
  const chatId = process.env.TELEGRAM_LEAD_CHAT_ID
  const proxyUrl = process.env.TELEGRAM_PROXY_URL
  const proxySecret = process.env.TELEGRAM_PROXY_SECRET
  if (!token || !chatId || !proxyUrl) {
    return NextResponse.json({ ok: false, fallback: true }, { status: 503 })
  }

  // Источник заявки — первой строкой: страниц несколько, в Telegram их иначе не различить
  const text = [
    `📝 *Новая заявка* \\[${md(page)}\\]`,
    '',
    `*Имя:* ${md(name)}`,
    `*Контакт:* ${md(contact)}`,
    `*Компания:* ${company ? md(company) : '—'}`,
    `*Сообщение:* ${about ? md(about) : '—'}`,
    '',
    md(consentLine),
  ].join('\n')

  try {
    const r = await postJson(
      `${proxyUrl.replace(/\/$/, '')}/bot${token}/sendMessage`,
      {
        'Content-Type': 'application/json',
        ...(proxySecret ? { 'x-proxy-secret': proxySecret } : {}),
      },
      JSON.stringify({ chat_id: chatId, text, parse_mode: 'MarkdownV2' }),
    )
    // Bot API отвечает 200 и на отказ (ok:false), поэтому смотрим тело, а не только статус
    const resp = JSON.parse(r.body) as { ok?: boolean; description?: string }
    if (r.status !== 200 || resp?.ok !== true) {
      throw new Error(`telegram ${r.status}: ${resp?.description ?? 'unknown'}`)
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[lead] telegram failed:', e)
    return NextResponse.json({ ok: false, fallback: true }, { status: 502 })
  }
}

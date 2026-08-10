import { NextResponse } from 'next/server'

/**
 * Приём заявок с лид-форм лендинга (страницы /packaging, /audit, /prm,
 * /partner-channel).
 * Транспорт — прокси на Fornex (217.177.72.57:3388) для преодоления блокировок
 * прямого доступа к Telegram API из Яндекс-датацентра.
 * Конфиг:
 *   TELEGRAM_LEAD_PROXY_URL — адрес прокси (по умолчанию http://217.177.72.57:3388)
 * Пока транспорт не настроен, роут отвечает { ok:false, fallback:true },
 * а форма показывает честный фолбэк «напишите в Telegram». Каждая заявка
 * дублируется в server-лог (docker logs) как резервный след.
 *
 * Согласия. `consentPdn` обязателен: без согласия на обработку персональных
 * данных заявку принимать нельзя (ст. 9 152-ФЗ), и полагаться на атрибут
 * `required` в браузере тут нечего — запрос легко отправить мимо формы.
 * `consentMarketing` добровольный (ч. 1 ст. 18 38-ФЗ «О рекламе»): его
 * отсутствие ничего не блокирует, но состояние обеих отметок вместе со
 * временем и IP попадает и в лог, и в само сообщение — согласие имеет смысл
 * только тогда, когда его можно доказать.
 */

const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5
const seen = new Map<string, number[]>()

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

  const proxyUrl = process.env.TELEGRAM_LEAD_PROXY_URL || 'http://217.177.72.57:3388'
  if (!proxyUrl) {
    return NextResponse.json({ ok: false, fallback: true }, { status: 503 })
  }

  try {
    const r = await fetch(`${proxyUrl}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Источник заявки — в начале message: страниц несколько, в Telegram их иначе не различить
      body: JSON.stringify({
        name,
        company,
        contact,
        message: [`[${page}]`, about, consentLine].filter(Boolean).join('\n'),
      }),
    })
    if (!r.ok) throw new Error(`proxy ${r.status}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[lead] proxy failed:', e)
    return NextResponse.json({ ok: false, fallback: true }, { status: 502 })
  }
}

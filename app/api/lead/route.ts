import { NextResponse } from 'next/server'

/**
 * Приём заявок с лид-форм лендинга (страницы /packaging, /audit, /partner-channel).
 * Транспорт — прокси на Fornex (217.177.72.57:3388) для преодоления блокировок
 * прямого доступа к Telegram API из Яндекс-датацентра.
 * Конфиг:
 *   TELEGRAM_LEAD_PROXY_URL — адрес прокси (по умолчанию http://217.177.72.57:3388)
 * Пока транспорт не настроен, роут отвечает { ok:false, fallback:true },
 * а форма показывает честный фолбэк «напишите в Telegram». Каждая заявка
 * дублируется в server-лог (docker logs) как резервный след.
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

  // honeypot: боты заполняют скрытое поле — отвечаем «ок», ничего не делая
  if (field('website', 10)) return NextResponse.json({ ok: true })

  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const times = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (times.length >= MAX_PER_WINDOW) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }
  times.push(now)
  seen.set(ip, times)

  // резервный след в логах на случай сбоя транспорта
  console.log('[lead]', JSON.stringify({ page, name, company, contact, about, ip, at: new Date().toISOString() }))

  const proxyUrl = process.env.TELEGRAM_LEAD_PROXY_URL || 'http://217.177.72.57:3388'
  if (!proxyUrl) {
    return NextResponse.json({ ok: false, fallback: true }, { status: 503 })
  }

  try {
    const r = await fetch(`${proxyUrl}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Источник заявки — в начале message: страниц несколько, в Telegram их иначе не различить
      body: JSON.stringify({ name, company, contact, message: about ? `[${page}]\n${about}` : `[${page}]` }),
    })
    if (!r.ok) throw new Error(`proxy ${r.status}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[lead] proxy failed:', e)
    return NextResponse.json({ ok: false, fallback: true }, { status: 502 })
  }
}

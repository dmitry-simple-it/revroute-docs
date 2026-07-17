import { NextResponse } from 'next/server'

/**
 * Приём заявок с лид-форм лендинга (страница /packaging).
 * Транспорт — Telegram Bot API; настраивается двумя env-переменными:
 *   TELEGRAM_LEAD_BOT_TOKEN — токен бота
 *   TELEGRAM_LEAD_CHAT_ID   — chat_id получателя (личка/группа)
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

  const token = process.env.TELEGRAM_LEAD_BOT_TOKEN
  const chatId = process.env.TELEGRAM_LEAD_CHAT_ID
  if (!token || !chatId) {
    return NextResponse.json({ ok: false, fallback: true }, { status: 503 })
  }

  const SUBJECTS: Record<string, string> = {
    packaging: 'упаковка партнёрской программы',
    audit: 'аудит партнёрской программы',
  }
  const text = [
    `🟣 Заявка: ${SUBJECTS[page] ?? page}`,
    '',
    `Имя: ${name}`,
    `Компания/сайт: ${company || '—'}`,
    `Контакт: ${contact}`,
    `О продукте: ${about || '—'}`,
    '',
    `Страница: /${page}`,
  ].join('\n')

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
    if (!r.ok) throw new Error(`telegram ${r.status}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[lead] transport failed:', e)
    return NextResponse.json({ ok: false, fallback: true }, { status: 502 })
  }
}

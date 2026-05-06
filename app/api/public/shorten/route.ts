import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'

// Endpoint у нас — копия Dub.co на app.revroute.ru. Базу и токен можно переопределить через
// окружение, чтобы держать разные ключи между staging/prod без правок кода.
const REVROUTE_API_KEY = (
  process.env.REVROUTE_SHORT_LINKER_API_KEY ?? process.env.REVROUTE_API_KEY
)?.trim()
const REVROUTE_API_URL = process.env.REVROUTE_API_URL ?? 'https://api.revroute.ru'
const REVROUTE_WORKSPACE_ID = process.env.REVROUTE_WORKSPACE_ID
const REVROUTE_DOMAIN = process.env.REVROUTE_PUBLIC_DOMAIN

// In-memory rate limit. На multi-instance / Edge — заменить на Redis/Upstash.
// Для self-hosted single-node (текущий деплой через pm2) этого достаточно.
const WINDOW_MS = 60 * 60 * 1000
const LIMIT_PER_HOUR = 10
const buckets = new Map<string, number[]>()

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

function takeToken(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now()
  const arr = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (arr.length >= LIMIT_PER_HOUR) {
    const retryAfterSec = Math.max(1, Math.ceil((WINDOW_MS - (now - arr[0])) / 1000))
    buckets.set(ip, arr)
    return { ok: false, retryAfterSec }
  }
  arr.push(now)
  buckets.set(ip, arr)
  return { ok: true }
}

function isValidHttpUrl(input: string): URL | null {
  try {
    const u = new URL(input)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    if (!u.hostname.includes('.')) return null
    return u
  } catch {
    return null
  }
}

type DubLinkResponse = {
  shortLink?: string
  url?: string
  key?: string
  domain?: string
  error?: { message?: string; code?: string }
}

export async function POST(req: NextRequest) {
  if (!REVROUTE_API_KEY) {
    return NextResponse.json(
      { error: 'not_configured', message: 'Missing REVROUTE_API_KEY.' },
      { status: 503 },
    )
  }

  let body: { url?: unknown }
  try {
    body = (await req.json()) as { url?: unknown }
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const raw = typeof body.url === 'string' ? body.url.trim() : ''
  if (!raw) return NextResponse.json({ error: 'url_required' }, { status: 400 })
  const target = isValidHttpUrl(raw)
  if (!target) return NextResponse.json({ error: 'invalid_url' }, { status: 400 })

  const ip = getClientIp(req)
  const limit = takeToken(ip)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSec: limit.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec ?? 60) } }
    )
  }

  try {
    const url = new URL(`${REVROUTE_API_URL.replace(/\/$/, '')}/links`)
    if (REVROUTE_WORKSPACE_ID) url.searchParams.set('workspaceId', REVROUTE_WORKSPACE_ID)

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REVROUTE_API_KEY}`,
      },
      body: JSON.stringify({
        url: target.toString(),
        tagNames: ['landing-widget'],
        testVariants: null,
        ...(REVROUTE_DOMAIN ? { domain: REVROUTE_DOMAIN } : {}),
      }),
      cache: 'no-store',
    })

    const raw = await res.text()
    const data = ((): DubLinkResponse => {
      try {
        return JSON.parse(raw) as DubLinkResponse
      } catch {
        return {}
      }
    })()

    if (!res.ok || !data.shortLink) {
      const message =
        data.error?.message ||
        (raw && raw.length <= 300 ? raw : undefined) ||
        res.statusText ||
        undefined
      return NextResponse.json(
        { error: 'provider_error', message },
        { status: 502 }
      )
    }

    return NextResponse.json({ shortUrl: data.shortLink, longUrl: target.toString() })
  } catch {
    return NextResponse.json({ error: 'provider_unreachable' }, { status: 502 })
  }
}

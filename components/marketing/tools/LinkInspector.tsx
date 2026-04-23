'use client'

import { useMemo, useState } from 'react'

type Parsed = {
  protocol: string
  host: string
  pathname: string
  params: [string, string][]
  utmCount: number
  tld: string
  punycode: boolean
}

function parseUrl(raw: string): Parsed | null {
  try {
    const u = new URL(raw.trim())
    const params = [...u.searchParams.entries()]
    const utmCount = params.filter(([k]) => k.toLowerCase().startsWith('utm_')).length
    const host = u.hostname
    const parts = host.split('.')
    const tld = parts[parts.length - 1] ?? ''
    return {
      protocol: u.protocol.replace(':', ''),
      host,
      pathname: u.pathname || '/',
      params,
      utmCount,
      tld,
      punycode: host.includes('xn--'),
    }
  } catch {
    return null
  }
}

export function LinkInspector() {
  const [input, setInput] = useState('https://revroute.ru/pricing?utm_source=google&utm_medium=cpc')
  const parsed = useMemo(() => parseUrl(input), [input])

  return (
    <div className="flex flex-col gap-6">
      <div
        className="border"
        style={{
          background: 'var(--bg-white)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            URL для проверки
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com"
            className="rounded-lg border px-3 py-2.5 text-sm"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          />
        </label>
      </div>

      {parsed ? (
        <div
          className="border"
          style={{
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
          }}
        >
          <div className="grid grid-cols-2 gap-4 text-sm max-md:grid-cols-1">
            <Row label="Протокол" value={parsed.protocol.toUpperCase()} warn={parsed.protocol !== 'https'} />
            <Row label="Хост" value={parsed.host} warn={parsed.punycode} hint={parsed.punycode ? 'Punycode — возможный фишинг' : undefined} />
            <Row label="Путь" value={parsed.pathname} />
            <Row label="UTM-меток" value={String(parsed.utmCount)} />
            <Row label="TLD" value={parsed.tld} />
            <Row label="Параметров всего" value={String(parsed.params.length)} />
          </div>

          {parsed.params.length > 0 && (
            <>
              <div
                className="mt-6 mb-2 text-[11px] font-semibold uppercase"
                style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
              >
                Параметры
              </div>
              <div className="rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                {parsed.params.map(([k, v], i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[160px_1fr] px-3 py-2 font-mono text-xs"
                    style={{ borderBottom: i < parsed.params.length - 1 ? '1px solid var(--border)' : undefined }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span className="break-all" style={{ color: 'var(--text)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          className="border p-6 text-sm"
          style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}
        >
          Введите валидный URL, начиная с <code>https://</code>.
        </div>
      )}

      <div
        className="border px-5 py-4 text-sm"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}
      >
        Проверка цепочки редиректов и сертификата — в приложении Revroute. Мы не делаем внешние запросы из браузера, чтобы ваши URL не утекали в сторонние API.
      </div>
    </div>
  )
}

function Row({ label, value, warn, hint }: { label: string; value: string; warn?: boolean; hint?: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div
        className="mt-1 font-mono break-all"
        style={{ color: warn ? '#b45309' : 'var(--text)' }}
      >
        {value}
      </div>
      {hint && <div className="mt-0.5 text-xs" style={{ color: '#b45309' }}>{hint}</div>}
    </div>
  )
}

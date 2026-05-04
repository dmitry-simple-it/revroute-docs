'use client'

import { useMemo, useState } from 'react'
import { TrackedAppLink } from '@/components/marketing/TrackedAppLink'

const fields = [
  { name: 'utm_source', placeholder: 'google', desc: 'Источник (google, yandex, newsletter)' },
  { name: 'utm_medium', placeholder: 'cpc', desc: 'Канал (cpc, email, social)' },
  { name: 'utm_campaign', placeholder: 'summer_sale', desc: 'Название кампании' },
  { name: 'utm_content', placeholder: 'hero_cta', desc: 'Вариант объявления' },
  { name: 'utm_term', placeholder: 'short+links', desc: 'Ключевое слово / таргет' },
] as const

export function UtmBuilder() {
  const [url, setUrl] = useState('https://revroute.ru/pricing')
  const [params, setParams] = useState<Record<string, string>>({
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'launch',
    utm_content: '',
    utm_term: '',
  })

  const result = useMemo(() => {
    try {
      const u = new URL(url)
      const sp = u.searchParams
      for (const f of fields) {
        const v = params[f.name]?.trim()
        if (v) sp.set(f.name, v)
      }
      return u.toString()
    } catch {
      return ''
    }
  }, [url, params])

  const [copied, setCopied] = useState(false)
  async function copy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* noop */
    }
  }

  return (
    <div
      className="border"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
          Целевой URL
        </span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="url"
          className="rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        />
      </label>

      <div className="mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {fields.map((f) => (
          <label key={f.name} className="flex flex-col gap-1.5 text-sm">
            <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
              {f.name}
            </span>
            <input
              value={params[f.name] ?? ''}
              onChange={(e) => setParams((p) => ({ ...p, [f.name]: e.target.value }))}
              placeholder={f.placeholder}
              className="rounded-lg border px-3 py-2.5 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            />
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {f.desc}
            </span>
          </label>
        ))}
      </div>

      <div
        className="mt-8 rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-dark)', color: '#fff' }}
      >
        <div
          className="mb-2 text-[11px] font-semibold uppercase"
          style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}
        >
          Готовая ссылка
        </div>
        <div className="font-mono break-all text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {result || '—'}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={copy}
          disabled={!result}
          className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          {copied ? 'Скопировано' : 'Скопировать'}
        </button>
        <TrackedAppLink
          goal="landing_signup_click"
          href="https://app.revroute.ru/"
          className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold"
          style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          Короткая ссылка в Revroute →
        </TrackedAppLink>
      </div>
    </div>
  )
}

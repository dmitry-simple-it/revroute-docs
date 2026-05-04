'use client'

import { useState } from 'react'

type Result = { shortUrl: string; longUrl: string }
type ApiError = { error: string; retryAfterSec?: number; message?: string }

const ERROR_MESSAGES: Record<string, string> = {
  url_required: 'Введите ссылку, которую нужно сократить.',
  invalid_url: 'Это не похоже на корректный URL — проверьте http(s) и домен.',
  rate_limited: 'Превышен лимит 10 запросов в час с одного IP. Попробуйте позже или зарегистрируйтесь.',
  provider_error: 'Сервис временно недоступен. Попробуйте ещё раз через минуту.',
  provider_unreachable: 'Не удалось связаться с сервисом. Проверьте соединение и попробуйте снова.',
  invalid_body: 'Не удалось обработать запрос.',
  not_configured: 'Сокращатель временно недоступен — администраторы уведомлены.',
}

export function ShortenerWidget() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    setResult(null)
    setCopied(false)
    setLoading(true)
    try {
      const res = await fetch('/api/public/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = (await res.json()) as ApiError | Result
      if (!res.ok || 'error' in data) {
        const e = data as ApiError
        setError(ERROR_MESSAGES[e.error] ?? 'Не удалось сократить ссылку.')
        return
      }
      setResult(data as Result)
    } catch {
      setError('Сеть недоступна. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  async function copyShort() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-stretch">
        <label className="flex-1 flex flex-col gap-1.5">
          <span
            className="text-[11px] font-semibold uppercase"
            style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
          >
            Длинная ссылка
          </span>
          <input
            type="url"
            inputMode="url"
            placeholder="https://example.com/very/long/path?utm_source=…"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg border px-3 py-3 text-sm"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            disabled={loading}
          />
        </label>
        <button
          type="submit"
          disabled={loading || !url}
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white md:self-end"
          style={{
            background: 'var(--accent)',
            opacity: loading || !url ? 0.6 : 1,
            cursor: loading || !url ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Сокращаем…' : 'Сократить'}
        </button>
      </form>

      {error && (
        <div
          className="mt-4 rounded-lg border p-3 text-sm"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(244, 63, 94, 0.06)',
            color: 'var(--text)',
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {result && (
        <div
          className="mt-4 rounded-lg border p-4"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}
        >
          <div
            className="text-[11px] font-semibold uppercase mb-1.5"
            style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
          >
            Готово
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold underline underline-offset-4"
              style={{ color: 'var(--text)' }}
            >
              {result.shortUrl}
            </a>
            <button
              type="button"
              onClick={copyShort}
              className="inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-white)', color: 'var(--text)' }}
            >
              {copied ? 'Скопировано' : 'Скопировать'}
            </button>
          </div>
          <div className="mt-2 text-xs break-all" style={{ color: 'var(--text-muted)' }}>
            ↳ {result.longUrl}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs" style={{ color: 'var(--text-dim)' }}>
        Лимит — 10 ссылок в час с одного IP. Нужны кастомный домен, аналитика, UTM-шаблоны
        и QR? <a href="https://app.revroute.ru/" className="underline underline-offset-2">Создайте аккаунт</a> — бесплатно.
      </p>
    </div>
  )
}

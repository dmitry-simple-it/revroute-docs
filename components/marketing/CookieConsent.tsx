'use client'

import Link from 'next/link'
import { useCookieConsent } from '@/lib/hooks/use-cookie-consent'

export function CookieConsent() {
  const { consent, hydrated, accept, reject } = useCookieConsent()

  if (!hydrated) return null
  if (consent !== undefined) return null

  return (
    <div
      role="dialog"
      aria-label="Согласие на использование cookie"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4"
    >
      <div
        className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border p-5 shadow-[0_10px_40px_rgba(0,0,0,0.12)] sm:flex-row sm:items-center"
        style={{
          background: 'var(--bg-white)',
          borderColor: 'var(--border)',
        }}
      >
        <p
          className="flex-1 text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Мы используем cookie и Яндекс Метрику (включая Вебвизор) для анализа
          поведения и улучшения сервиса. Подробнее в{' '}
          <Link
            href="/ru/legal/privacy"
            className="underline"
            style={{ color: 'var(--text)' }}
          >
            Политике конфиденциальности
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              background: 'var(--bg-white)',
            }}
          >
            Только необходимые
          </button>
          <button
            type="button"
            onClick={accept}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  )
}

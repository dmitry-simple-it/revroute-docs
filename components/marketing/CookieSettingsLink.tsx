'use client'

import { useCookieConsent } from '@/lib/hooks/use-cookie-consent'

export function CookieSettingsLink() {
  const { reset } = useCookieConsent()
  return (
    <button
      type="button"
      onClick={reset}
      className="text-sm transition-colors"
      style={{ color: 'var(--text-dim)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      Cookie-настройки
    </button>
  )
}

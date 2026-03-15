'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LOCALES: Record<string, string> = {
  en: 'EN',
  ru: 'RU',
}

export function LocaleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const currentLocale = pathname.split('/')[1] || 'en'
  const validLocale = LOCALES[currentLocale] ? currentLocale : 'en'

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    if (LOCALES[segments[1]]) {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    router.push(segments.join('/'))
  }

  if (!mounted) {
    return (
      <select
        defaultValue="en"
        style={{
          background: 'transparent',
          border: '1px solid var(--nextra-border, #e5e7eb)',
          borderRadius: '0.375rem',
          padding: '0.25rem 0.5rem',
          fontSize: '0.875rem',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        {Object.entries(LOCALES).map(([code, label]) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>
    )
  }

  return (
    <select
      value={validLocale}
      onChange={(e) => switchLocale(e.target.value)}
      style={{
        background: 'transparent',
        border: '1px solid var(--nextra-border, #e5e7eb)',
        borderRadius: '0.375rem',
        padding: '0.25rem 0.5rem',
        fontSize: '0.875rem',
        color: 'inherit',
        cursor: 'pointer',
      }}
    >
      {Object.entries(LOCALES).map(([code, label]) => (
        <option key={code} value={code}>{label}</option>
      ))}
    </select>
  )
}

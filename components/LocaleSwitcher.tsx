'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Переключатель локали докс-раздела.
 *
 * Раньше это был `<select>` с `router.push` в onChange: для человека работало,
 * но связи ru↔en в HTML не существовало — краулер не видел ни одной ссылки на
 * английскую ветку из 148 страниц. Теперь обе локали рендерятся настоящими
 * `<a href>` (`rel="alternate"` + `hreflang`), поведение прежнее: клик ставит
 * cookie NEXT_LOCALE и уходит на зеркальный URL клиентской навигацией.
 */
const LOCALES = [
  { code: 'ru', label: 'RU', hrefLang: 'ru-RU', name: 'Русский' },
  { code: 'en', label: 'EN', hrefLang: 'en', name: 'English' },
] as const

const CODES: string[] = LOCALES.map(l => l.code)

const LABELS: Record<string, { group: string; missing: string }> = {
  ru: { group: 'Язык страницы', missing: 'Английской версии этой страницы нет' },
  en: { group: 'Page language', missing: 'This page has no version in that language' },
}

export function LocaleSwitcher({
  /**
   * Маршруты (без префикса локали), которых в соответствующей локали нет.
   * Считается на сервере в app/(docs)/[locale]/layout.tsx. Для таких страниц
   * ссылка не выводится вовсе: crawlable-ссылка в 404 хуже, чем её отсутствие.
   */
  missingIn = {},
}: {
  missingIn?: Record<string, string[]>
}) {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/')
  const hasPrefix = CODES.includes(segments[1])
  const current = hasPrefix ? segments[1] : 'en'

  // Путь без префикса локали: '/ru/docs/guides' → '/docs/guides', '/ru' → '/'.
  const rest = hasPrefix ? `/${segments.slice(2).join('/')}` : pathname
  const bare = rest.length > 1 ? rest.replace(/\/$/, '') : '/'

  const hrefFor = (code: string) => (bare === '/' ? `/${code}` : `/${code}${bare}`)

  const strings = LABELS[current] ?? LABELS.en

  return (
    <div
      role="group"
      aria-label={strings.group}
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        border: '1px solid var(--nextra-border, #e5e7eb)',
        borderRadius: '0.375rem',
        overflow: 'hidden',
        fontSize: '0.875rem',
        lineHeight: 1.4,
      }}
    >
      {LOCALES.map(({ code, label, hrefLang, name }) => {
        const isCurrent = code === current
        const baseStyle = {
          padding: '0.25rem 0.5rem',
          color: 'inherit',
          textDecoration: 'none',
          fontWeight: isCurrent ? 600 : 400,
          background: isCurrent ? 'var(--nextra-bg-muted, rgba(127, 127, 127, 0.14))' : 'transparent',
        } as const

        if (isCurrent) {
          return (
            <span key={code} aria-current="true" lang={code} style={baseStyle}>
              {label}
            </span>
          )
        }

        if (missingIn[code]?.includes(bare)) {
          return (
            <span
              key={code}
              aria-disabled="true"
              title={strings.missing}
              style={{ ...baseStyle, opacity: 0.4, cursor: 'not-allowed' }}
            >
              {label}
            </span>
          )
        }

        return (
          <Link
            key={code}
            href={hrefFor(code)}
            rel="alternate"
            hrefLang={hrefLang}
            lang={code}
            title={name}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`
            }}
            style={{ ...baseStyle, opacity: 0.7 }}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}

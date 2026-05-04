import Link from 'next/link'
import { resourcesLearningItems, resourcesReferenceItems, solutionsNavItems } from '@/lib/nav-labels'
import { CookieSettingsLink } from './CookieSettingsLink'

const footerColumns = [
  {
    title: 'Продукт',
    links: [
      { label: 'Ссылки', href: '/links' },
      { label: 'Аналитика', href: '/analytics' },
      { label: 'Партнёрские программы', href: '/partners' },
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Интеграции', href: '/integrations' },
      { label: 'API', href: '/api' },
      { label: 'Тарифы', href: '/pricing' },
    ],
  },
  {
    title: 'Решения',
    links: solutionsNavItems.map(({ label, href }) => ({ label, href })),
  },
  {
    title: 'Ресурсы',
    links: [
      ...resourcesLearningItems.map(({ label, href }) => ({ label, href })),
      ...resourcesReferenceItems.map(({ label, href }) => ({ label, href })),
    ],
  },
  {
    title: 'Инструменты',
    links: [
      { label: 'QR-генератор', href: '/tools/qr' },
      { label: 'UTM-конструктор', href: '/tools/utm' },
      { label: 'Инспектор ссылок', href: '/tools/link-inspector' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'Поддержка', href: '/contact/support' },
      { label: 'Партнёрам', href: '/for-partners' },
      { label: 'Условия', href: '/ru/legal/terms' },
      { label: 'Конфиденциальность', href: '/ru/legal/privacy' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center text-xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
              revroute
              <span
                className="ml-0.5 inline-block rounded-full"
                style={{ width: 6, height: 6, background: 'var(--text)', marginBottom: -2 }}
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Платформа партнёрского маркетинга. Сокращение ссылок, аналитика конверсий и партнёрские программы.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            &copy; {new Date().getFullYear()} Revroute. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/ru/legal/privacy" className="text-sm transition-colors" style={{ color: 'var(--text-dim)' }}>
              Конфиденциальность
            </Link>
            <Link href="/ru/legal/terms" className="text-sm transition-colors" style={{ color: 'var(--text-dim)' }}>
              Условия
            </Link>
            <CookieSettingsLink />
          </div>
        </div>
      </div>
    </footer>
  )
}

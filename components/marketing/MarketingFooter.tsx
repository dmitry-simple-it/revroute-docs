import Link from 'next/link'

const footerColumns = [
  {
    title: 'Продукт',
    links: [
      { label: 'Короткие ссылки', href: '#' },
      { label: 'Аналитика', href: '#' },
      { label: 'Партнёры', href: '#' },
      { label: 'Тарифы', href: '/pricing' },
      { label: 'Enterprise', href: '#' },
    ],
  },
  {
    title: 'Ресурсы',
    links: [
      { label: 'Документация', href: '/ru/docs' },
      { label: 'API', href: '#' },
      { label: 'Блог', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Инструменты',
    links: [
      { label: 'QR-генератор', href: '#' },
      { label: 'UTM-конструктор', href: '#' },
      { label: 'Инспектор ссылок', href: '#' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О нас', href: '#' },
      { label: 'Клиенты', href: '#' },
      { label: 'Контакты', href: '/contact/support' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center text-xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
              revroute
              <span
                className="ml-0.5 inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: 'var(--text)',
                  marginBottom: -2,
                }}
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Платформа для управления ссылками нового поколения. Короткие ссылки, аналитика и партнёрские программы.
            </p>
          </div>

          {/* Link columns */}
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

        {/* Bottom bar */}
        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            &copy; 2025 Revroute. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm transition-colors"
              style={{ color: 'var(--text-dim)' }}
            >
              Конфиденциальность
            </Link>
            <Link
              href="#"
              className="text-sm transition-colors"
              style={{ color: 'var(--text-dim)' }}
            >
              Условия
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Тарифы', href: '/pricing' },
  { label: 'Интеграции', href: '/integrations' },
  { label: 'Документация', href: '/ru/docs' },
  { label: 'Поддержка', href: '/contact/support' },
]

const APP_URL = 'https://app.revroute.ru/'

export function MarketingHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 transition-shadow duration-300"
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        background: 'rgba(250,250,249,0.8)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 text-xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{
                color: isActive(href) ? 'var(--text)' : 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                if (!isActive(href)) e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onMouseLeave={(e) => {
                if (!isActive(href)) e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={APP_URL}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Войти
          </a>
          <a
            href={APP_URL}
            className="rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors"
            style={{
              background: 'var(--accent)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
          >
            Начать
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex size-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          style={{ color: 'var(--text)' }}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="border-t px-6 pb-6 pt-4 md:hidden"
          style={{
            background: 'rgba(250,250,249,0.98)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderColor: 'var(--border)',
          }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
                style={{
                  color: isActive(href) ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={APP_URL}
              className="rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              Войти
            </a>
            <a
              href={APP_URL}
              className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--accent)' }}
            >
              Начать
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

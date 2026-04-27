'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { resourcesLearningItems, resourcesReferenceItems, solutionsNavItems } from '@/lib/nav-labels'
import { trackGoal } from '@/lib/analytics/yandex-metrika'

type SubLink = { label: string; href: string; desc?: string }
type NavItem =
  | { label: string; href: string }
  | { label: string; groups: { title?: string; items: SubLink[] }[] }

const nav: NavItem[] = [
  {
    label: 'Продукт',
    groups: [
      {
        title: 'Платформа',
        items: [
          { label: 'Ссылки', href: '/links', desc: 'Брендированные короткие ссылки с суперспособностями' },
          { label: 'Аналитика', href: '/analytics', desc: 'Атрибуция от клика до выручки' },
          { label: 'Партнёрские программы', href: '/partners', desc: 'Реферальные и аффилиат-программы' },
        ],
      },
      {
        title: 'Инфраструктура',
        items: [
          { label: 'Enterprise', href: '/enterprise', desc: 'Безопасность, SSO, SLA' },
          { label: 'API', href: '/api', desc: 'REST API, SDK и вебхуки' },
          { label: 'Интеграции', href: '/integrations', desc: 'Подключите ваш стек' },
        ],
      },
    ],
  },
  {
    label: 'Решения',
    groups: [
      {
        items: [...solutionsNavItems],
      },
    ],
  },
  {
    label: 'Ресурсы',
    groups: [
      {
        title: 'Обучение',
        items: [...resourcesLearningItems],
      },
      {
        title: 'Справочник',
        items: [...resourcesReferenceItems],
      },
    ],
  },
  { label: 'Тарифы', href: '/pricing' },
  { label: 'Партнёрам', href: '/for-partners' },
]

const APP_URL = 'https://app.revroute.ru/'

export function MarketingHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  // Раскрытые секции мобильного меню (аккордеон). По умолчанию открыт «Продукт».
  const [mobileOpenGroups, setMobileOpenGroups] = useState<Record<string, boolean>>({
    'Продукт': true,
  })
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  function toggleMobileGroup(label: string) {
    setMobileOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150)
  }
  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
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
        <Link href="/" className="flex items-center text-xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
          revroute
          <span
            className="ml-0.5 inline-block rounded-full"
            style={{ width: 6, height: 6, background: 'var(--text)', marginBottom: -2 }}
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            if ('href' in item) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={{ color: isActive(item.href) ? 'var(--text)' : 'var(--text-muted)' }}
                >
                  {item.label}
                </Link>
              )
            }
            const open = openMenu === item.label
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose()
                  setOpenMenu(item.label)
                }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={{ color: open ? 'var(--text)' : 'var(--text-muted)' }}
                  aria-expanded={open}
                >
                  {item.label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {open && (
                  <div
                    className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div
                      className="grid gap-6 rounded-2xl border p-4 shadow-[var(--shadow-lg)]"
                      style={{
                        background: 'var(--bg-white)',
                        borderColor: 'var(--border)',
                        minWidth: item.groups.length > 1 ? 520 : 320,
                        gridTemplateColumns: `repeat(${item.groups.length}, minmax(0,1fr))`,
                      }}
                    >
                      {item.groups.map((group, gi) => (
                        <div key={gi}>
                          {group.title && (
                            <div
                              className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase"
                              style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
                            >
                              {group.title}
                            </div>
                          )}
                          <div className="flex flex-col">
                            {group.items.map((s) => (
                              <Link
                                key={s.href}
                                href={s.href}
                                className="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--bg-muted)]"
                              >
                                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                                  {s.label}
                                </div>
                                {s.desc && (
                                  <div className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                                    {s.desc}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={APP_URL}
            onClick={() => trackGoal('landing_login_click')}
            className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Войти
          </a>
          <a
            href={APP_URL}
            onClick={() => trackGoal('landing_signup_click')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            Начать
          </a>
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
          style={{ color: 'var(--text)' }}
        >
          {mobileOpen ? (
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

      {mobileOpen && (
        <div
          className="fixed inset-x-0 z-40 overflow-y-auto border-t px-5 pb-10 pt-2 md:hidden"
          style={{
            top: '64px',
            height: 'calc(100dvh - 64px)',
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
          }}
        >
          <nav className="flex flex-col">
            {nav.map((item) => {
              if ('href' in item) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center border-b py-4 text-[17px] font-semibold"
                    style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    {item.label}
                  </Link>
                )
              }
              const isGroupOpen = mobileOpenGroups[item.label] ?? false
              const groupItems = item.groups.flatMap((g) => g.items)
              return (
                <div
                  key={item.label}
                  className="border-b"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(item.label)}
                    className="flex w-full items-center justify-between py-4 text-[17px] font-semibold"
                    style={{ color: 'var(--text)' }}
                    aria-expanded={isGroupOpen}
                  >
                    <span>{item.label}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      style={{
                        transform: isGroupOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {isGroupOpen && (
                    <div className="flex flex-col gap-1 pb-4">
                      {groupItems.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 -mx-3 transition-colors active:bg-[var(--bg-muted)]"
                        >
                          <div
                            className="text-[15px] font-semibold"
                            style={{ color: 'var(--text)' }}
                          >
                            {s.label}
                          </div>
                          {s.desc && (
                            <div
                              className="text-[13px] leading-snug"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {s.desc}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
          <div className="mt-8 flex flex-col gap-2.5">
            <a
              href={APP_URL}
              onClick={() => trackGoal('landing_login_click')}
              className="rounded-xl px-4 py-3 text-center text-[15px] font-semibold"
              style={{ color: 'var(--text)', border: '1px solid var(--border)', background: 'var(--bg-white)' }}
            >
              Войти
            </a>
            <a
              href={APP_URL}
              onClick={() => trackGoal('landing_signup_click')}
              className="rounded-xl px-4 py-3 text-center text-[15px] font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              Начать бесплатно
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { SpotlightCard } from '@/components/marketing/shared/SpotlightCard'

export type MarketplaceOffer = {
  slug: string
  brand: string
  logoText: string
  logoAccent: string
  logoBg: string
  description: string
  reward: string
  category: string
  extraCategories: number
  featured?: boolean
}

export const offers: MarketplaceOffer[] = [
  {
    slug: 'orbo',
    brand: 'Orbo',
    logoText: 'O',
    logoAccent: '#2563eb',
    logoBg: 'rgba(37, 99, 235, 0.12)',
    description:
      'CRM участников для сообществ в Telegram и Max. Профили участников с AI-анализом интересов и автоматические сценарии.',
    reward: '50% за продажу пожизненно',
    category: 'AI',
    extraCategories: 2,
    featured: true,
  },
  {
    slug: 'a2claude',
    brand: 'A2Cloud',
    logoText: 'A2',
    logoAccent: '#dc2626',
    logoBg: 'rgba(220, 38, 38, 0.12)',
    description:
      'Провайдер облачных решений для бизнеса. Инфраструктура, платформы и сервисы с серверами в России.',
    reward: '15% за продажу пожизненно',
    category: 'Development',
    extraCategories: 2,
    featured: true,
  },
  {
    slug: 'revroute',
    brand: 'RevRoute',
    logoText: 'rev',
    logoAccent: 'var(--text)',
    logoBg: 'rgba(12, 10, 9, 0.06)',
    description:
      'Платформа партнёрского маркетинга: сокращение ссылок, аналитика конверсий и партнёрские программы.',
    reward: '20% за продажу пожизненно',
    category: 'Marketing',
    extraCategories: 1,
    featured: true,
  },
  {
    slug: 'adesk',
    brand: 'Adesk',
    logoText: 'Ad',
    logoAccent: '#ea580c',
    logoBg: 'rgba(234, 88, 12, 0.12)',
    description:
      'Простой и понятный сервис управленческого учёта для бизнеса: интеграция с банками и 14 дней бесплатно.',
    reward: '25% за продажу пожизненно',
    category: 'Finance',
    extraCategories: 2,
  },
  {
    slug: 'glabix',
    brand: 'Glabix',
    logoText: 'Gl',
    logoAccent: '#7c3aed',
    logoBg: 'rgba(124, 58, 237, 0.12)',
    description:
      'Сервис обмена асинхронными видеосообщениями с ИИ: быстрая запись, расшифровка и автоматическое резюме.',
    reward: '30% за продажу пожизненно',
    category: 'Productivity',
    extraCategories: 1,
  },
  {
    slug: 'airesponses',
    brand: 'AI Responses',
    logoText: 'AI',
    logoAccent: '#0891b2',
    logoBg: 'rgba(8, 145, 178, 0.12)',
    description:
      'AI-ассистент поддержки клиентов: готовые ответы, шаблоны и интеграция с мессенджерами и CRM.',
    reward: '40% за продажу пожизненно',
    category: 'AI',
    extraCategories: 2,
  },
]

function CoinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 10c0-1.1.9-2 3-2s3 .9 3 2-1 1.8-3 2-3 .9-3 2 .9 2 3 2 3-.9 3-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 3h8l10 10-8 8L3 11V3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OfferCard({ offer }: { offer: MarketplaceOffer }) {
  const href = `https://partners.revroute.ru/${offer.slug}`
  return (
    <SpotlightCard
      as="article"
      className="flex h-full flex-col border transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold"
            style={{ background: offer.logoBg, color: offer.logoAccent }}
          >
            {offer.logoText}
          </div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {offer.brand}
          </div>
        </div>
        {offer.featured ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
            Топ оффер
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
            Открыт
          </span>
        )}
      </div>

      <p
        className="mt-5 text-sm leading-snug"
        style={{
          color: 'var(--text-muted)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '60px',
        }}
      >
        {offer.description}
      </p>

      <div
        className="mt-5 flex flex-col gap-3 border-t pt-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
            Вознаграждение
          </div>
          <div
            className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--text)' }}
          >
            <span className="shrink-0" style={{ color: 'var(--text-muted)' }}>
              <CoinIcon />
            </span>
            <span className="min-w-0 truncate">{offer.reward}</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
            Категория
          </div>
          <div
            className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--text)' }}
          >
            <span className="shrink-0" style={{ color: 'var(--text-muted)' }}>
              <TagIcon />
            </span>
            <span className="truncate">{offer.category}</span>
            {offer.extraCategories > 0 && (
              <span
                className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
              >
                +{offer.extraCategories}
              </span>
            )}
          </div>
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-[var(--bg-muted)]"
        style={{
          borderColor: 'var(--border)',
          color: 'var(--text)',
        }}
      >
        Подробнее об оффере →
      </a>
    </SpotlightCard>
  )
}

export function OffersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  function update() {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < maxScroll - 8)
  }

  useEffect(() => {
    update()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  function scrollByCard(dir: -1 | 1) {
    const el = scrollRef.current
    if (!el) return
    const firstCard = el.querySelector<HTMLDivElement>('[data-offer-card]')
    const width = firstCard?.offsetWidth ?? 340
    const gap = 16
    el.scrollBy({ left: dir * (width + gap), behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Предыдущие офферы"
          onClick={() => scrollByCard(-1)}
          disabled={!canLeft}
          className="flex h-10 w-10 items-center justify-center rounded-full border transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--bg-muted)]"
          style={{
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          aria-label="Следующие офферы"
          onClick={() => scrollByCard(1)}
          disabled={!canRight}
          className="flex h-10 w-10 items-center justify-center rounded-full border transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--bg-muted)]"
          style={{
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        >
          <ChevronRight />
        </button>
      </div>

      <div className="relative">
        {canRight && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24"
            style={{
              background:
                'linear-gradient(to left, var(--bg, #fafaf9) 0%, transparent 100%)',
            }}
          />
        )}
        {canLeft && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24"
            style={{
              background:
                'linear-gradient(to right, var(--bg, #fafaf9) 0%, transparent 100%)',
            }}
          />
        )}
        <div
          ref={scrollRef}
          className="offers-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollPaddingInline: '4px',
          }}
        >
          {offers.map((o) => (
            <div
              key={o.slug}
              data-offer-card
              className="w-[340px] shrink-0 snap-start max-sm:w-[82vw]"
            >
              <OfferCard offer={o} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .offers-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

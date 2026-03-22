import Link from 'next/link'
import type { Integration } from '@/lib/integrations'

function IntegrationIcon({
  integration,
  size = 'sm',
}: {
  integration: Integration
  size?: 'sm' | 'lg'
}) {
  const sizeClasses = size === 'lg' ? 'size-16 text-[22px] rounded-2xl' : 'size-11 text-base rounded-xl'
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-bold text-white ${sizeClasses}`}
      style={{ background: integration.iconColor }}
    >
      {integration.iconLetters}
    </div>
  )
}

export { IntegrationIcon }

export function IntegrationCard({ integration }: { integration: Integration }) {
  const href = integration.isGuide
    ? integration.guideUrl!
    : integration.isComingSoon
      ? undefined
      : `/integrations/${integration.slug}`

  const inner = (
    <>
      <IntegrationIcon integration={integration} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-[15px] font-bold tracking-tight">
          {integration.name}
          {integration.isGuide && (
            <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>
              Гайд
            </span>
          )}
          {integration.isComingSoon && (
            <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: 'var(--orange-bg)', color: 'var(--orange)' }}>
              Скоро
            </span>
          )}
        </div>
        <div className="text-[13px] leading-snug" style={{ color: 'var(--text-muted)' }}>
          {integration.description}
        </div>
      </div>
      {!integration.isComingSoon && (
        <svg
          className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: 'var(--text-dim)' }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      )}
    </>
  )

  const baseClasses =
    'group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-200'

  if (integration.isComingSoon) {
    return (
      <div
        className={`${baseClasses} card-border-hover cursor-default opacity-70`}
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      href={href!}
      className={`${baseClasses} card-border-hover hover:shadow-sm`}
    >
      {inner}
    </Link>
  )
}

export function FeaturedCard({ integration }: { integration: Integration }) {
  const href = integration.isGuide
    ? integration.guideUrl!
    : `/integrations/${integration.slug}`

  const badgeColors: Record<string, { bg: string; color: string }> = {
    payments: { bg: '#ede9fe', color: '#635bff' },
    automation: { bg: '#fff7ed', color: '#ff4a00' },
    analytics: { bg: '#eff6ff', color: '#4285f4' },
    scheduling: { bg: '#f5f5f4', color: '#292929' },
    auth: { bg: '#e0f2fe', color: '#0ea5e9' },
    social: { bg: '#eef2ff', color: '#4f46e5' },
    productivity: { bg: '#fdf2f8', color: '#4a154b' },
    cms: { bg: '#e0f7fa', color: '#21759b' },
    crm: { bg: '#fff3e0', color: '#ff7a59' },
    oauth: { bg: '#f5f5f4', color: '#78716c' },
  }

  const badge = badgeColors[integration.category] ?? { bg: '#f5f5f4', color: '#78716c' }

  return (
    <Link
      href={href}
      className="card-border-hover group block rounded-3xl border p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="mb-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
        style={{ background: badge.bg, color: badge.color }}
      >
        {integration.categoryRu}
      </div>
      <div className="mb-4 flex items-center gap-3.5">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ background: integration.iconColor }}
        >
          {integration.iconLetters}
        </div>
        <div className="text-lg font-bold tracking-tight">{integration.name}</div>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {integration.description}
      </div>
    </Link>
  )
}

export function PopularCard({ integration }: { integration: Integration }) {
  const href = integration.isGuide
    ? integration.guideUrl!
    : integration.isComingSoon
      ? '/integrations'
      : `/integrations/${integration.slug}`

  return (
    <Link
      href={href}
      className="card-border-hover flex items-center gap-3.5 rounded-2xl border p-4 px-5 transition-all duration-200 hover:shadow-sm"
    >
      <IntegrationIcon integration={integration} />
      <div>
        <div className="text-[15px] font-bold tracking-tight">{integration.name}</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {integration.categoryRu}
        </div>
      </div>
    </Link>
  )
}

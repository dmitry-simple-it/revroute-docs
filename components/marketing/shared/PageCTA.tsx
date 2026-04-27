import type { ReactNode } from 'react'
import { PrimaryButton, SecondaryButton } from './PageHero'

export function PageCTA({
  title,
  desc,
  primary = { href: 'https://app.revroute.ru/', label: 'Начать бесплатно' },
  secondary = { href: '/contact/support', label: 'Запросить демо' },
}: {
  title: ReactNode
  desc?: ReactNode
  primary?: { href: string; label: string }
  secondary?: { href: string; label: string }
}) {
  return (
    <section className="relative text-center" style={{ padding: '120px 0' }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center bottom, rgba(231, 229, 228, 0.5) 0%, transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <h2
          className="mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.5px',
          }}
        >
          {title}
        </h2>
        {desc && (
          <p className="mx-auto mb-10 text-lg" style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            {desc}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 max-md:flex-col">
          <PrimaryButton
            href={primary.href}
            goal={primary.href.startsWith('https://app.revroute.ru') ? 'landing_signup_click' : undefined}
          >
            {primary.label}
          </PrimaryButton>
          <SecondaryButton href={secondary.href}>{secondary.label}</SecondaryButton>
        </div>
      </div>
    </section>
  )
}

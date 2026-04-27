import type { ReactNode } from 'react'
import { Eyebrow } from './Typography'

export function PageHero({
  eyebrow,
  eyebrowColor,
  title,
  desc,
  actions,
  align = 'center',
}: {
  eyebrow?: string
  eyebrowColor?: 'blue' | 'green' | 'orange' | 'purple'
  title: ReactNode
  desc?: ReactNode
  actions?: ReactNode
  align?: 'left' | 'center'
}) {
  const isCenter = align === 'center'
  const glowByColor: Record<string, string> = {
    blue: 'rgba(37, 99, 235, 0.18)',
    green: 'rgba(22, 163, 74, 0.18)',
    orange: 'rgba(234, 88, 12, 0.18)',
    purple: 'rgba(124, 58, 237, 0.22)',
  }
  const glow = (eyebrowColor && glowByColor[eyebrowColor]) || 'rgba(231, 229, 228, 0.6)'
  return (
    <section className={`relative overflow-hidden max-md:!pt-24 max-md:!pb-12 ${isCenter ? 'text-center' : ''}`} style={{ padding: '120px 0 60px' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid bg-fade-mask" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: '-200px',
          width: '1000px',
          height: '600px',
          background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
      <div className={`relative mx-auto max-w-[1200px] px-6`}>
        {eyebrow && (
          <div className={`mb-5 ${isCenter ? 'flex justify-center' : ''}`} style={{ animation: 'fadeUp 0.6s ease both' }}>
            <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>
          </div>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 7vw, 76px)',
            fontWeight: 400,
            letterSpacing: '-1.2px',
            lineHeight: 1.05,
            animation: 'fadeUp 0.8s ease 0.1s both',
          }}
        >
          {title}
        </h1>
        {desc && (
          <p
            className={`mt-6 text-lg leading-relaxed ${isCenter ? 'mx-auto' : ''}`}
            style={{ color: 'var(--text-muted)', maxWidth: 640, animation: 'fadeUp 0.8s ease 0.2s both' }}
          >
            {desc}
          </p>
        )}
        {actions && (
          <div
            className={`mt-10 flex flex-wrap gap-3 ${isCenter ? 'justify-center' : ''}`}
            style={{ animation: 'fadeUp 0.8s ease 0.3s both' }}
          >
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}

export function PrimaryButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl text-base font-semibold no-underline transition-all hover:-translate-y-px"
      style={{
        padding: '14px 32px',
        background: 'var(--accent)',
        color: '#fff',
        boxShadow:
          '0 10px 30px rgba(12,10,9,0.20), 0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="shimmer-sheen pointer-events-none absolute inset-0"
        style={{ mixBlendMode: 'overlay' }}
      />
    </a>
  )
}

export function SecondaryButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-xl border text-base font-semibold no-underline transition-all"
      style={{
        padding: '14px 32px',
        background: 'var(--bg-white)',
        color: 'var(--text)',
        borderColor: 'var(--border)',
      }}
    >
      {children}
    </a>
  )
}

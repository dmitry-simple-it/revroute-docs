import type { ReactNode } from 'react'

export type Testimonial = {
  text: ReactNode
  name: string
  role: string
  initials: string
  company?: string
  featured?: boolean
  stars?: boolean
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex flex-col border transition-all"
      style={{
        background: t.featured ? 'var(--bg-dark)' : 'var(--bg-white)',
        color: t.featured ? '#fff' : undefined,
        borderColor: t.featured ? 'transparent' : 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
      }}
    >
      {t.company && (
        <div
          className="mb-4 text-[13px] font-semibold"
          style={{
            color: t.featured ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)',
            letterSpacing: '-0.2px',
          }}
        >
          {t.company}
        </div>
      )}
      {t.stars && (
        <div className="mb-4 text-sm" style={{ color: '#fbbf24', letterSpacing: '2px' }}>
          {'\u2605\u2605\u2605\u2605\u2605'}
        </div>
      )}
      <div
        className="mb-6 flex-grow text-[15px] leading-relaxed"
        style={{ color: t.featured ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)' }}
      >
        {t.text}
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
          style={{
            background: t.featured ? 'rgba(255,255,255,0.12)' : 'var(--bg-muted)',
            color: t.featured ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
          }}
        >
          {t.initials}
        </div>
        <div>
          <div className="text-sm font-semibold">{t.name}</div>
          <div
            className="text-xs"
            style={{ color: t.featured ? 'rgba(255,255,255,0.45)' : 'var(--text-dim)' }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  )
}

export function InlineQuote({
  text,
  name,
  role,
}: {
  text: string
  name: string
  role: string
}) {
  return (
    <figure
      className="mx-auto my-10 max-w-3xl text-center"
      style={{ color: 'var(--text-secondary)' }}
    >
      <blockquote
        className="text-xl leading-relaxed"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
      >
        “{text}”
      </blockquote>
      <figcaption className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text)' }}>{name}</strong> — {role}
      </figcaption>
    </figure>
  )
}

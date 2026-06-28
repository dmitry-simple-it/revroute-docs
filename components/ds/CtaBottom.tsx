'use client'

/**
 * RevRoute Design System v2 — CtaBottom (native TSX port).
 * Closing call-to-action card.
 *   tone="light" (default) — white rounded card, faint line-grid, soft brand
 *     glow rising from the bottom-centre.
 *   tone="spectrum" — dark graphite card with the smooth multi-color
 *     iridescence («переливание») via the spectrum conic wash.
 * Render inside a .ds-scope container.
 */
import { useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Button } from './primitives'

export interface CtaAction {
  label: string
  href?: string
}

export interface CtaBottomProps {
  title?: ReactNode
  body?: ReactNode
  primary?: CtaAction
  secondary?: CtaAction
  /** light = white card + brand glow (default); spectrum = dark card + iridescent «переливание». */
  tone?: 'light' | 'spectrum'
  /** Bottom-centre glow fill (light tone). Default the brand ramp var(--heat). */
  glow?: string
  style?: CSSProperties
}

export function CtaBottom({
  title = 'Готовы расти быстрее?',
  body = 'Подключите RevRoute за пару минут — без карты и обязательств.',
  primary = { label: 'Начать бесплатно', href: '#' },
  secondary = { label: 'Поговорить с продажами', href: '#' },
  tone = 'light',
  glow = 'var(--heat)',
  style = {},
  ...rest
}: CtaBottomProps) {
  const gid = useId().replace(/:/g, '')
  const dark = tone === 'spectrum'

  if (dark) {
    return (
      <section style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
        <div style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', borderRadius: 28, background: 'linear-gradient(155deg, #2c2356 0%, #1d1838 100%)', padding: '76px 24px', textAlign: 'center', boxShadow: '0 24px 60px rgba(29,24,56,.32)' }}>
          {/* smooth iridescent spectrum glow */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: '-40% -12% -10%', background: 'var(--spectrum-conic)', filter: 'blur(72px)', opacity: 0.62, pointerEvents: 'none', zIndex: 0 }} />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 150% at 50% 130%, rgba(20,16,42,.42), transparent 58%)', pointerEvents: 'none', zIndex: 0 }} />
          {/* white line-grid, masked from top */}
          <svg aria-hidden="true" width="100%" height="100%" style={{ position: 'absolute', inset: 0, color: 'rgba(255,255,255,.06)', pointerEvents: 'none', zIndex: 0, WebkitMaskImage: 'radial-gradient(60% 80% at 50% 0%, #000, transparent)', maskImage: 'radial-gradient(60% 80% at 50% 0%, #000, transparent)' }}>
            <defs><pattern id={`gd${gid}`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs>
            <rect width="100%" height="100%" fill={`url(#gd${gid})`} />
          </svg>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.04, margin: 0, color: '#fff' }}>{title}</h2>
            {body && <p style={{ fontSize: 17, color: 'rgba(255,255,255,.82)', lineHeight: 1.5, margin: '16px 0 0' }}>{body}</p>}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '32px 0 0', flexWrap: 'wrap' }}>
              {primary && (
                <a href={primary.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 10, background: '#fff', color: '#0a0a0a', fontSize: 15, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.01em' }}>{primary.label}</a>
              )}
              {secondary && (
                <a href={secondary.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 10, background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.22)', fontSize: 15, fontWeight: 500, textDecoration: 'none', letterSpacing: '-0.01em' }}>{secondary.label}</a>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', borderRadius: 28, border: '1px solid var(--line)', background: '#fff', padding: '64px 24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <svg aria-hidden="true" width="100%" height="100%" style={{ position: 'absolute', inset: 0, color: 'rgba(0,0,0,.035)', pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(60% 80% at 50% 0%, #000, transparent)', maskImage: 'radial-gradient(60% 80% at 50% 0%, #000, transparent)' }}>
          <defs>
            <pattern id={`g${gid}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#g${gid})`} />
        </svg>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -160, left: '50%', transform: 'translateX(-50%)', width: 520, height: 520, borderRadius: 999, opacity: 0.14, filter: 'blur(80px)', background: glow, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 576, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 34, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, margin: 0, color: 'var(--ink)' }}>{title}</h2>
          {body && <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.5, margin: '16px 0 0' }}>{body}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '32px 0 0', flexWrap: 'wrap' }}>
            {primary && <Button variant="primary" href={primary.href}>{primary.label}</Button>}
            {secondary && <Button variant="ghost" href={secondary.href}>{secondary.label}</Button>}
          </div>
        </div>
      </div>
    </section>
  )
}

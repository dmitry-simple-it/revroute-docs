/**
 * Split hero — eyebrow / display headline / lead / CTAs + trust on the left,
 * a floating product visual on the right. Pass `mock` to fully override the
 * right column, or `shot` to render a real product screenshot inside a clean
 * browser frame (no fabricated numbers — honest by default).
 */
import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import { Button, Eyebrow } from './primitives'
import { shotSize } from './shot-sizes'

export function BrowserFrame({
  shot, alt = '', url = 'app.revroute.ru', maxWidth, style, priority = false,
}: {
  shot: string
  alt?: string
  url?: string
  maxWidth?: number
  style?: CSSProperties
  /** Ставить только для картинки первого экрана (LCP): добавляет preload и снимает lazy. */
  priority?: boolean
}) {
  const size = shotSize(shot)
  // Колонка .ds-split на десктопе — (1200 − 2×28 padding − 48 gap) / 2 ≈ 548px;
  // до 920px раскладка схлопывается в одну колонку во всю ширину (см. ds.css).
  const sizes = `(max-width: 920px) 100vw, ${maxWidth ?? 560}px`
  return (
    <div style={{ position: 'relative', maxWidth, marginInline: maxWidth ? 'auto' : undefined }}>
      <div className="dot-grid" style={{ inset: '-40px -10px' }} />
      <div style={{ position: 'absolute', inset: '-70px -10px -40px', zIndex: 0, background: 'radial-gradient(circle at 60% 40%, rgba(124,58,237,.16), transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, background: '#fff', border: '1px solid var(--line)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderBottom: '1px solid var(--line-2)', background: 'var(--bg)' }}>
          <span style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--line)' }} />)}
          </span>
          <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 7, padding: '3px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {url}
          </span>
        </div>
        {size ? (
          <Image
            src={shot}
            alt={alt}
            width={size.width}
            height={size.height}
            priority={priority}
            sizes={sizes}
            quality={90}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        ) : (
          // Размеров нет в реестре (components/ds/shot-sizes.ts) — отдаём как было,
          // чтобы не гадать про соотношение сторон и не поехала вёрстка.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shot} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
        )}
      </div>
    </div>
  )
}

/** `demoCta` — слот CTA, ведущего к лид-форме; уходит в цель demo_cta_click. */
type HeroCta = { label: string; href: string; ymGoal?: string; demoCta?: string }

export function Hero({
  eyebrow, title, body, primary, secondary, trust, mock, shot, shotAlt, shotUrl, style, titleMaxWidth = '13ch',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  primary?: HeroCta | null
  secondary?: HeroCta | null
  trust?: string[]
  mock?: ReactNode
  shot?: string
  shotAlt?: string
  shotUrl?: string
  style?: CSSProperties
  titleMaxWidth?: string
}) {
  return (
    <section style={{ position: 'relative', maxWidth: 'var(--content)', margin: '0 auto', padding: '64px 28px 80px', fontFamily: 'var(--font-sans)', ...style }}>
      <div className="ds-split" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="rr-display" style={{ marginTop: eyebrow ? 18 : 0, maxWidth: titleMaxWidth }}>{title}</h1>
          {body && <p className="rr-lead" style={{ maxWidth: '38ch', margin: '22px 0 0' }}>{body}</p>}
          {(primary || secondary) && (
            <div style={{ display: 'flex', gap: 12, margin: '32px 0 0', flexWrap: 'wrap' }}>
              {primary && <Button variant="primary" size="lg" href={primary.href} iconRight="arrow-right" data-ym-goal={primary.ymGoal} data-demo-cta={primary.demoCta}>{primary.label}</Button>}
              {secondary && <Button variant="ghost" size="lg" href={secondary.href} data-ym-goal={secondary.ymGoal} data-demo-cta={secondary.demoCta}>{secondary.label}</Button>}
            </div>
          )}
          {trust && trust.length > 0 && (
            <div className="rr-small" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, margin: '26px 0 0', color: 'var(--ink-3)' }}>
              {trust.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Скриншот героя — первый экран, поэтому priority: без него next/image
            повесил бы lazy и LCP просел бы относительно прежнего <img>. */}
        <div>{mock ?? (shot ? <BrowserFrame shot={shot} alt={shotAlt} url={shotUrl ?? 'app.revroute.ru'} priority /> : null)}</div>
      </div>
    </section>
  )
}

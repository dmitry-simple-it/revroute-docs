/**
 * HeroCentered — the /home-style centred hero without the product rail:
 * eyebrow, headline, lead, check-mark theses and centred CTAs over a soft
 * radial glow. Mirrors HeroPicker's head block for visual parity across pages.
 */
import type { CSSProperties, ReactNode } from 'react'
import { Button, Eyebrow, Icon } from './primitives'

/** `demoCta` — слот CTA, ведущего к лид-форме; уходит в цель demo_cta_click. */
type Cta = { label: string; href: string; ymGoal?: string; demoCta?: string }

export function HeroCentered({
  eyebrow, title, body, theses = [], primary, secondary, style,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  theses?: string[]
  primary?: Cta | null
  secondary?: Cta | null
  style?: CSSProperties
}) {
  return (
    <section style={{ position: 'relative', fontFamily: 'var(--font-sans)', overflow: 'hidden', ...style }}>
      <div aria-hidden style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 680, height: 460, borderRadius: 999, background: 'radial-gradient(circle, rgba(133,90,252,.16), transparent 62%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--content)', margin: '0 auto', padding: '64px 28px 56px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          {eyebrow && <div style={{ display: 'flex', justifyContent: 'center' }}><Eyebrow>{eyebrow}</Eyebrow></div>}
          <h1 className="rr-h1" style={{ marginTop: eyebrow ? 18 : 0 }}>{title}</h1>
          {body && <p className="rr-lead" style={{ maxWidth: '46ch', margin: '20px auto 0' }}>{body}</p>}
          {theses.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 22px', margin: '22px 0 0' }}>
              {theses.map((t) => (
                <span key={t} className="rr-small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-2)' }}>
                  <Icon name="check" size={16} color="var(--accent)" strokeWidth={2.6} />{t}
                </span>
              ))}
            </div>
          )}
          {(primary || secondary) && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '30px 0 0', flexWrap: 'wrap' }}>
              {primary && <Button variant="primary" size="lg" href={primary.href} iconRight="arrow-right" data-ym-goal={primary.ymGoal} data-demo-cta={primary.demoCta}>{primary.label}</Button>}
              {secondary && <Button variant="ghost" size="lg" href={secondary.href} data-ym-goal={secondary.ymGoal} data-demo-cta={secondary.demoCta}>{secondary.label}</Button>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

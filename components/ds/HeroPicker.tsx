'use client'

/**
 * HeroPicker — centred-headline hero with a floating product-picker rail at the
 * bottom (the Т-банк landing pattern, in the RevRoute system). Ported from
 * "RevRoute Design System v2"/components/landing/HeroPicker.jsx. Product tiles
 * with an `href` navigate; tiles without one just become the active selection.
 */
import { useState, type CSSProperties, type ReactNode } from 'react'
import { Button, Eyebrow, Icon, type IconName } from './primitives'

export interface PickerProduct {
  id: string
  icon: IconName
  label: string
  /** When set, the tile is a link to this destination. */
  href?: string
  soon?: boolean
}

type Cta = { label: string; href: string }
type RailCta = { label: string; sub?: string; href: string }

export interface HeroPickerProps {
  eyebrow?: ReactNode
  title?: ReactNode
  theses?: string[]
  body?: ReactNode
  primary?: Cta | null
  secondary?: Cta | null
  products?: PickerProduct[]
  defaultProduct?: number
  railCta?: RailCta | null
  style?: CSSProperties
}

export function HeroPicker({
  eyebrow, title, theses = [], body, primary, secondary,
  products = [], defaultProduct = 0, railCta, style = {},
}: HeroPickerProps) {
  const [active, setActive] = useState(defaultProduct)

  return (
    <section style={{ position: 'relative', fontFamily: 'var(--font-sans)', overflow: 'hidden', ...style }}>
      <div aria-hidden style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 680, height: 460, borderRadius: 999, background: 'radial-gradient(circle, rgba(133,90,252,.16), transparent 62%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 'var(--content)', margin: '0 auto', padding: '64px 28px 56px', display: 'flex', flexDirection: 'column', minHeight: 'clamp(540px, 72vh, 760px)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          {eyebrow && <div style={{ display: 'flex', justifyContent: 'center' }}><Eyebrow>{eyebrow}</Eyebrow></div>}
          {title && <h1 className="rr-h1" style={{ marginTop: 18 }}>{title}</h1>}
          {body && <p className="rr-lead" style={{ maxWidth: '46ch', margin: '20px auto 0' }}>{body}</p>}
          {theses.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 22px', margin: '22px 0 0' }}>
              {theses.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15, color: 'var(--ink-2)' }}>
                  <Icon name="check" size={16} color="var(--accent)" strokeWidth={2.6} />{t}
                </span>
              ))}
            </div>
          )}
          {(primary || secondary) && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '30px 0 0', flexWrap: 'wrap' }}>
              {primary && <Button variant="primary" size="lg" href={primary.href} iconRight="arrow-right">{primary.label}</Button>}
              {secondary && <Button variant="ghost" size="lg" href={secondary.href}>{secondary.label}</Button>}
            </div>
          )}
        </div>

        {/* floating product-picker rail */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 1120, marginInline: 'auto', marginTop: 'auto', paddingTop: 56 }}>
          <div role="group" aria-label="Продукты канала" className="rr-pickrail" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 24, boxShadow: 'var(--shadow-lg)', padding: 10 }}>
            {products.map((p, i) => {
              const on = i === active
              const tile = (
                <>
                  <span style={{ display: 'inline-flex', width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center', background: on ? 'var(--accent-bg)' : 'var(--chip-bg)', border: `1px solid ${on ? 'var(--accent-line)' : 'var(--line)'}`, color: on ? 'var(--accent)' : 'var(--ink-2)', transition: 'all .15s' }}>
                    <Icon name={p.icon} size={22} strokeWidth={1.8} />
                  </span>
                  <span style={{ fontSize: 13, lineHeight: 1.25, fontWeight: on ? 600 : 500, color: on ? 'var(--ink)' : 'var(--ink-2)', textAlign: 'center', maxWidth: 96 }}>
                    {p.label}
                    {p.soon && <span style={{ display: 'block', fontWeight: 500, fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>Скоро</span>}
                  </span>
                </>
              )
              const tileStyle: CSSProperties = { flex: '1 0 auto', minWidth: 104, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, padding: '14px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 16, position: 'relative', fontFamily: 'var(--font-sans)', textDecoration: 'none', transition: 'background .15s' }
              return p.href ? (
                <a key={p.id} href={p.href} aria-label={p.label} onMouseEnter={() => setActive(i)} style={tileStyle}>{tile}</a>
              ) : (
                <button key={p.id} aria-pressed={on} aria-label={p.label} onClick={() => setActive(i)} style={tileStyle}>{tile}</button>
              )
            })}
            {railCta && (
              <a href={railCta.href} style={{ flex: '1 0 auto', minWidth: 118, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9, padding: '14px 12px', borderRadius: 16, textDecoration: 'none', borderLeft: '1px solid var(--line)', marginLeft: 4 }}>
                <span style={{ display: 'inline-flex', width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center', background: 'var(--action)', color: '#fff' }}>
                  <Icon name="arrow-right" size={22} color="#fff" strokeWidth={2} />
                </span>
                <span style={{ fontSize: 12.5, lineHeight: 1.25, fontWeight: 600, color: 'var(--ink)', textAlign: 'center', maxWidth: 100 }}>
                  {railCta.label}
                  {railCta.sub && <span style={{ display: 'block', fontWeight: 400, color: 'var(--ink-3)', fontSize: 11.5 }}>{railCta.sub}</span>}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

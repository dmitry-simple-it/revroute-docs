'use client'

/**
 * RevRoute Design System v2 — FeatureTabs (native TSX port).
 * Left list reveals each feature's description; a framed screenshot updates
 * on the right. Autoplay with progress bar, pause on hover, off under
 * prefers-reduced-motion. Render inside a .ds-scope container.
 */
import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Icon, type IconName } from './primitives'

export interface Feature {
  icon: IconName
  title: string
  body: string
  /** Absolute screenshot path, e.g. "/images/screenshots/overview.png". Omit for a branded placeholder. */
  shot?: string
  /** object-position for the screenshot crop, e.g. "50% 20%". */
  pos?: string
  /** Faux browser URL in the frame. */
  url?: string
}

export interface FeatureTabsProps {
  features?: Feature[]
  defaultIndex?: number
  /** Auto-advance through tabs (pauses on hover, off under reduced-motion). Default true. */
  autoplay?: boolean
  /** Autoplay interval in ms. Default 5200. */
  interval?: number
  style?: CSSProperties
}

/** Right-hand visual: a browser-framed screenshot, or a branded placeholder mock. */
function Panel({ feature }: { feature: Feature }) {
  const url = feature.url || 'app.revroute.ru'
  return (
    <div className="rr-tab-panel" key={feature.title} style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: '-70px -10px', zIndex: 0, background: 'radial-gradient(circle at 60% 40%, rgba(133,90,252,.16), transparent 62%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, background: '#fff', border: '1px solid var(--line)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderBottom: '1px solid var(--line-2)', background: 'var(--bg)' }}>
          <span style={{ display: 'flex', gap: 6 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--line)' }} />)}</span>
          <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', background: '#fff', border: '1px solid var(--line-2)', borderRadius: 7, padding: '3px 10px' }}>{url}</span>
        </div>
        {feature.shot ? (
          <div style={{ aspectRatio: '16 / 10.5', overflow: 'hidden' }}>
            <img src={feature.shot} alt={feature.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: feature.pos || '50% 20%', display: 'block' }} />
          </div>
        ) : (
          <div style={{ aspectRatio: '16 / 10.5', padding: 26, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--wash), #fff' }}>
            <span style={{ display: 'inline-flex', width: 52, height: 52, borderRadius: 14, background: 'var(--brand-ramp)', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-accent)' }}>
              <Icon name={feature.icon} size={26} color="#fff" strokeWidth={1.9} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
              {[88, 64, 74].map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', border: '1px solid var(--line)', flexShrink: 0 }} />
                  <span style={{ height: 9, width: `${w}%`, borderRadius: 999, background: 'var(--line)' }} />
                  <span style={{ marginLeft: 'auto', height: 9, width: 44, borderRadius: 999, background: i === 0 ? 'var(--accent-soft)' : 'var(--line)' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Feature tabs — a vertical list of features on the left; the active one
 * reveals its description (and an autoplay progress bar) while a framed
 * screenshot updates on the right. Click a tab to focus it; autoplay pauses
 * on hover and respects prefers-reduced-motion.
 */
export function FeatureTabs({ features = [], defaultIndex = 0, autoplay = true, interval = 5200, style = {} }: FeatureTabsProps) {
  const [active, setActive] = useState(defaultIndex)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (!autoplay || paused || reduced.current || features.length < 2) return undefined
    const id = setTimeout(() => setActive((a) => (a + 1) % features.length), interval)
    return () => clearTimeout(id)
  }, [autoplay, paused, interval, features.length, active])

  const playing = autoplay && !paused && !reduced.current && features.length > 1

  if (features.length === 0) return null

  return (
    <div className="rr-ftabs" style={{ fontFamily: 'var(--font-sans)', ...style }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map((f, i) => {
          const on = i === active
          return (
            <Fragment key={f.title}>
            <button
              onClick={() => setActive(i)}
              style={{
                textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 14, padding: on ? '18px 20px' : '14px 20px',
                background: on ? '#fff' : 'transparent', boxShadow: on ? 'var(--shadow-md)' : 'none',
                position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-sans)', transition: 'background .2s, padding .2s',
              }}
            >
              {on && <span style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 3, borderRadius: 999, background: 'var(--accent)' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 10, flexShrink: 0, alignItems: 'center', justifyContent: 'center', background: on ? 'var(--accent-bg)' : 'var(--chip-bg)', border: `1px solid ${on ? 'var(--accent-line)' : 'var(--line)'}`, color: on ? 'var(--accent)' : 'var(--ink-3)' }}>
                  <Icon name={f.icon} size={18} strokeWidth={1.9} />
                </span>
                <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: on ? 'var(--ink)' : 'var(--ink-2)' }}>{f.title}</span>
              </div>
              {on && (
                <div style={{ overflow: 'hidden' }}>
                  <p className="rr-small" style={{ margin: '10px 0 0 46px', color: 'var(--ink-2)' }}>{f.body}</p>
                  {playing && (
                    <div style={{ margin: '14px 0 2px 46px', height: 3, borderRadius: 999, background: 'var(--line)', overflow: 'hidden' }}>
                      <div key={active} style={{ height: '100%', background: 'var(--accent)', transformOrigin: 'left', animation: `rr-tab-progress ${interval}ms linear both` }} />
                    </div>
                  )}
                </div>
              )}
            </button>
            {/* На мобильной раскладке (одна колонка) панель со скриншотом встаёт сразу под активным табом */}
            {on && (
              <div className="rr-ftabs-inline-panel">
                <Panel feature={f} />
              </div>
            )}
            </Fragment>
          )
        })}
      </div>
      <div className="rr-ftabs-side-panel">
        <Panel feature={features[active]} />
      </div>
    </div>
  )
}

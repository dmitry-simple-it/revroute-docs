/**
 * RevRoute Design System v2 — ValueStack (native TSX port).
 * Offer value-stack — a 2-col grid of green-check "что входит" items, plus an
 * optional pair of highlight cards (guarantee / bonus) with a soft corner wash.
 * Server-compatible (no hooks). Render inside a .ds-scope container.
 */
import type { CSSProperties, HTMLAttributes } from 'react'
import { Icon } from './primitives'

export interface ValueItem {
  title: string
  body?: string
}

export interface ValueHighlight {
  title: string
  body: string
  icon?: string
}

export interface ValueStackProps {
  items?: ValueItem[]
  guarantee?: ValueHighlight
  bonus?: ValueHighlight
  columns?: number
  style?: CSSProperties
}

export function ValueStack({
  items = [],
  guarantee,
  bonus,
  columns = 2,
  style = {},
  ...rest
}: ValueStackProps & Omit<HTMLAttributes<HTMLDivElement>, keyof ValueStackProps>) {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns},1fr)`, gap: 12 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 13,
              padding: '16px 18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                width: 26,
                height: 26,
                borderRadius: 8,
                background: 'var(--green-bg)',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="check" size={15} color="var(--green-fg)" strokeWidth={2.6} />
            </span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{it.title}</div>
              {it.body && (
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>
                  {it.body}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {(guarantee || bonus) && (
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: guarantee && bonus ? '1fr 1fr' : '1fr',
            gap: 12,
          }}
        >
          {guarantee && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 20px',
                borderRadius: 14,
                background:
                  'radial-gradient(120% 140% at 0% 0%, rgba(144,113,249,.12), transparent 60%), #fff',
                border: '1px solid var(--line)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: 'var(--accent-bg)',
                  border: '1px solid var(--accent-line)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--accent)',
                }}
              >
                <Icon name="shield-check" size={20} strokeWidth={1.9} />
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  {guarantee.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
                  {guarantee.body}
                </div>
              </div>
            </div>
          )}
          {bonus && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 20px',
                borderRadius: 14,
                background:
                  'radial-gradient(120% 140% at 100% 0%, rgba(99,102,241,.10), transparent 60%), #fff',
                border: '1px solid var(--line)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: '#eef2ff',
                  border: '1px solid #c7d2fe',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#4f46e5',
                }}
              >
                <Icon name={bonus.icon || 'sparkles'} size={20} strokeWidth={1.9} />
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                  {bonus.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>
                  {bonus.body}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

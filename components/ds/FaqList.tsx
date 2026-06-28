/**
 * RevRoute Design System v2 — FaqList (native TSX port).
 * FAQ accordion built on native <details> — one open by default. Chevron
 * rotates via the .rr-faq / .rr-chev CSS in ds.css. Render inside a .ds-scope container.
 * Presentational — no hooks.
 */
import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './primitives'

export interface FaqItem {
  q: ReactNode
  a: ReactNode
  open?: boolean
}

export interface FaqListProps {
  items?: FaqItem[]
  style?: CSSProperties
}

export function FaqList({ items = [], style = {}, ...rest }: FaqListProps) {
  return (
    <div
      className="rr-faq"
      style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {items.map((it, i) => (
        <details
          key={i}
          open={it.open}
          style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '4px 22px', boxShadow: 'var(--shadow-sm)' }}
        >
          <summary
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 0', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}
          >
            {it.q}
            <span className="rr-chev" style={{ display: 'flex', color: 'var(--ink-3)' }}>
              <Icon name="chevron-down" size={20} strokeWidth={2} />
            </span>
          </summary>
          <div style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.55, padding: '0 0 20px' }}>{it.a}</div>
        </details>
      ))}
    </div>
  )
}

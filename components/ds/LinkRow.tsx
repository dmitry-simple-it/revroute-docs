/**
 * RevRoute Design System v2 — LinkRow (native TSX port).
 * Server-compatible (no hooks). Render inside a .ds-scope container.
 *
 * Short-link row — gradient favicon (letter), mono short URL over its
 * destination, and a live click count in a track pill. Used in the Links
 * table and hero mocks.
 *
 * The Favicon tile is inlined verbatim from the DS core/Favicon source
 * (the kit dependency is not part of ./primitives).
 */
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface LinkRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Letter shown in the favicon tile. */
  letter: ReactNode
  /** Favicon gradient (per-link color). Defaults to the violet brand ramp. */
  grad?: string
  /** Mono short URL, e.g. "rev.to/launch". */
  short: ReactNode
  /** Destination URL (truncates). */
  dest: ReactNode
  /** Click count, e.g. "12,4K". */
  clicks: ReactNode
  shadow?: boolean
  style?: CSSProperties
}

export function LinkRow({
  letter,
  grad = 'linear-gradient(135deg,#8b5cf6,#6366f1)',
  short,
  dest,
  clicks,
  shadow = false,
  style = {},
  ...rest
}: LinkRowProps) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 16,
        padding: '13px 18px', background: '#fff', border: '1px solid var(--line)', borderRadius: 12,
        fontSize: 16, boxShadow: shadow ? 'var(--shadow-md)' : 'var(--shadow-sm)', fontFamily: 'var(--font-sans)', ...style,
      }}
      {...rest}
    >
      <div
        style={{
          width: 32, height: 32, borderRadius: 8, background: grad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 600, fontSize: 32 * 0.44, flexShrink: 0,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {letter}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.005em', color: 'var(--ink)' }}>{short}</div>
        <small style={{ color: 'var(--ink-3)', display: 'block', fontSize: 13, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dest}</small>
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontVariantNumeric: 'tabular-nums', fontSize: 14, color: 'var(--ink-2)', background: 'var(--chip-bg)', borderRadius: 999, padding: '5px 11px', whiteSpace: 'nowrap' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />{clicks}
      </span>
    </div>
  )
}

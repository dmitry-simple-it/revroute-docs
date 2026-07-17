/**
 * RevRoute Design System v2 — StatBand (native TSX port).
 *
 * Stat band — three big tabular numbers on the soft unified wash, framed by
 * hairline rules. The "проверенные цифры" moment between sections.
 * Server-compatible (no hooks). Render inside a .ds-scope container.
 */
import type { CSSProperties } from 'react'

export interface StatBandProps {
  /** Tuples of [number, label]. */
  stats?: [string, string][]
  /** Soft unified wash background (default true). */
  wash?: boolean
  style?: CSSProperties
}

export function StatBand({ stats = [], wash = true, style, ...rest }: StatBandProps) {
  return (
    <section
      style={{
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        background: wash
          ? 'var(--wash), linear-gradient(180deg,var(--cream-top),var(--cream-bot))'
          : 'var(--bg)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          maxWidth: 'var(--content)',
          margin: '0 auto',
          padding: '72px 28px',
          display: 'grid',
          gridTemplateColumns: `repeat(${stats.length || 1},1fr)`,
          gap: 40,
        }}
      >
        {stats.map(([n, l], i) => (
          <div key={i}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
                color: 'var(--ink)',
              }}
            >
              {n}
            </div>
            <div style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 8 }}>{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

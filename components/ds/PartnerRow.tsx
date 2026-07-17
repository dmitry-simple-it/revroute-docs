/**
 * RevRoute Design System v2 — PartnerRow (native TSX port).
 * Server-compatible (no hooks). Render inside a .ds-scope container.
 *
 * Partner revenue / payout row — round flag, name, and two tabular stat
 * columns. The workhorse row of the partner dashboard and hero mocks.
 * Visual language ported verbatim from
 * "RevRoute Design System v2"/components/data/PartnerRow.jsx.
 */
import type { CSSProperties } from 'react'

export interface PartnerRowProps {
  /** Two-letter country code; resolved to `${base}<code>.svg`. */
  flag: string
  name: string
  /** Tabular money, e.g. "₽ 22,6M". */
  rev: string
  payout: string
  revLabel?: string
  payoutLabel?: string
  /** Stronger shadow when floating (hero). */
  shadow?: boolean
  /** Base path for flag SVGs. */
  base?: string
  style?: CSSProperties
}

export function PartnerRow({
  flag,
  name,
  rev,
  payout,
  revLabel = 'Выручка',
  payoutLabel = 'Выплаты',
  shadow = false,
  base = '/ds/flags/',
  style = {},
}: PartnerRowProps) {
  const stat: CSSProperties = {
    display: 'block',
    color: 'var(--ink)',
    fontSize: 15,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  }
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '36px 1fr auto',
        alignItems: 'center',
        gap: 14,
        padding: '13px 18px',
        background: '#fff',
        border: '1px solid var(--line)',
        borderRadius: 12,
        fontSize: 16,
        boxShadow: shadow ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <img
        src={`${base}${flag}.svg`}
        alt={flag}
        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{name}</div>
      <div style={{ display: 'flex', gap: 22, fontSize: 13, color: 'var(--ink-3)' }}>
        <div>
          <b style={stat}>{rev}</b>
          {revLabel}
        </div>
        <div>
          <b style={stat}>{payout}</b>
          {payoutLabel}
        </div>
      </div>
    </div>
  )
}

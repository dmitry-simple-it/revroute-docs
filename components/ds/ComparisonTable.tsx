/**
 * RevRoute Design System v2 — ComparisonTable (native TSX port).
 * Server-compatible (no hooks). Render inside a .ds-scope container.
 * Visual language ported verbatim from "RevRoute Design System v2"/components/landing/ComparisonTable.jsx.
 *
 * "Готовая инфраструктура vs самосбор" comparison table. Rows take a label
 * plus `ours`/`theirs` that are true (check), false (cross) or a string.
 */
import type { CSSProperties } from 'react'
import { Icon, Logo } from './primitives'

export interface ComparisonRow {
  label: string
  /** true = green check, false = cross, string = text. */
  ours: boolean | string
  theirs: boolean | string
}

export interface ComparisonTableProps {
  rows?: ComparisonRow[]
  ours?: string
  theirs?: string
  style?: CSSProperties
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Icon name="check" size={20} color="var(--green)" strokeWidth={2.4} />
  if (value === false) return <Icon name="x" size={18} color="var(--line-strong)" strokeWidth={2.2} />
  return <span style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: 15 }}>{value}</span>
}

export function ComparisonTable({ rows = [], ours = 'RevRoute', theirs = 'Самосбор / таблицы', style = {}, ...rest }: ComparisonTableProps) {
  const grid = '1.6fr 1fr 1fr'
  return (
    <div
      style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 18, boxShadow: 'var(--shadow-md)', overflow: 'hidden', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <div style={{ display: 'grid', gridTemplateColumns: grid, alignItems: 'center', padding: '18px 26px', borderBottom: '1px solid var(--line)', background: '#fcfcfc' }}>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Возможность</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}><Logo size={19} />{ours}</div>
        <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--ink-3)' }}>{theirs}</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: grid, alignItems: 'center', padding: '17px 26px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
          <div style={{ fontSize: 16, color: 'var(--ink)' }}>{r.label}</div>
          <div style={{ display: 'flex', justifyContent: 'center', fontWeight: typeof r.ours === 'string' ? 600 : 400, color: 'var(--ink)', fontSize: 15 }}><Cell value={r.ours} /></div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Cell value={r.theirs} /></div>
        </div>
      ))}
    </div>
  )
}

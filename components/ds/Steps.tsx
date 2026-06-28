/**
 * Steps — a 3-up "how it works" row. Each card pairs a violet glyph tile with
 * a big ghost step number, a title and a line of body.
 * Ported verbatim from "RevRoute Design System v2"/components/landing/Steps.jsx.
 */
import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from './primitives'

export interface Step {
  icon?: IconName
  n?: string
  title: ReactNode
  body: ReactNode
}

export interface StepsProps {
  steps?: Step[]
  columns?: number
  className?: string
  style?: CSSProperties
}

export function Steps({ steps = [], columns, className = 'rr-steps', style = {} }: StepsProps) {
  const cols = columns || steps.length || 3
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols},1fr)`,
        gap: 20,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: 26,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                background: 'var(--accent-bg)',
                border: '1px solid var(--accent-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <Icon name={s.icon || 'rocket'} size={20} />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 34,
                fontWeight: 500,
                color: 'var(--line)',
                lineHeight: 1,
              }}
            >
              {s.n || String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              margin: '18px 0 0',
              color: 'var(--ink)',
            }}
          >
            {s.title}
          </h3>
          <p
            style={{
              fontSize: 15,
              color: 'var(--ink-2)',
              lineHeight: 1.5,
              margin: '8px 0 0',
            }}
          >
            {s.body}
          </p>
        </div>
      ))}
    </div>
  )
}

'use client'

/**
 * RevRoute Design System v2 — PricingTable (native TSX port).
 * Месяц/Год toggle + три карточки тарифов. «Популярный» план получает
 * фиолетовую рамку, бейдж, подъём и акцентную тень (var(--shadow-accent)).
 * Управляет своим состоянием периода, если его не контролируют через
 * `period` + `onPeriodChange`. Рендерить внутри контейнера .ds-scope.
 */
import { useState, type CSSProperties, type ReactNode } from 'react'
import { Button, Icon } from './primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'

export type Period = 'Месяц' | 'Год'

export interface Plan {
  name: string
  priceMonth: ReactNode
  priceYear: ReactNode
  per: ReactNode
  perYear: ReactNode
  cta: ReactNode
  /** Real CTA destination (e.g. the app register URL or a contact link). */
  href?: string
  popular?: boolean
  features: ReactNode[]
}

export interface PricingTableProps {
  plans?: Plan[]
  /** Контролируемый период ('Месяц' | 'Год'); опустить — компонент сам управляет. */
  period?: Period
  /** Начальный период при самостоятельном управлении. По умолчанию 'Год'. */
  initialPeriod?: Period
  onPeriodChange?: (p: Period) => void
  discountLabel?: ReactNode
  style?: CSSProperties
}

const DEFAULT_PLANS: Plan[] = []

export function PricingTable({
  plans = DEFAULT_PLANS,
  period,
  initialPeriod = 'Год',
  onPeriodChange,
  discountLabel = '−20%',
  style = {},
  ...rest
}: PricingTableProps) {
  const [internal, setInternal] = useState<Period>(initialPeriod)
  const value = period ?? internal
  const isYear = value === 'Год'
  const setPeriod = (p: Period) => (onPeriodChange ? onPeriodChange(p) : setInternal(p))

  const tab = (active: boolean): CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 8,
    fontSize: 14, cursor: 'pointer', border: 'none', fontFamily: 'var(--font-sans)', transition: 'all .15s',
    background: active ? '#fff' : 'transparent', color: active ? 'var(--ink)' : 'var(--ink-3)',
    fontWeight: active ? 600 : 500, boxShadow: active ? '0 1px 3px rgba(17,17,26,.14)' : 'none',
  })

  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 4, background: '#f2f2f2', borderRadius: 11, border: '1px solid var(--line)' }}>
          <button style={tab(!isYear)} onClick={() => setPeriod('Месяц')}>Помесячно</button>
          <button style={tab(isYear)} onClick={() => setPeriod('Год')}>За год
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', padding: '1px 6px', borderRadius: 999 }}>{discountLabel}</span>
          </button>
        </div>
      </div>
      <div className="rr-pricing-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${plans.length},1fr)`, gap: 20, alignItems: 'start' }}>
        {plans.map((p) => {
          const pop = p.popular
          return (
            <div key={p.name} style={{
              position: 'relative', background: '#fff', borderRadius: 18, padding: 28,
              border: pop ? '1.5px solid var(--accent)' : '1px solid var(--line)',
              boxShadow: pop ? 'var(--shadow-accent)' : 'var(--shadow-sm)',
              transform: pop ? 'translateY(-6px)' : 'none',
            }}>
              {pop && (
                <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 13px', background: 'var(--brand-ramp)', color: '#fff', borderRadius: 999, fontSize: 12, fontWeight: 600, boxShadow: '0 4px 12px rgba(124,58,237,.3)', whiteSpace: 'nowrap' }}>★ Популярный</span>
              )}
              <div className="rr-caption" style={{ color: pop ? 'var(--accent)' : 'var(--ink-2)' }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '16px 0 2px' }}>
                <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink)' }}>{isYear ? p.priceYear : p.priceMonth}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', height: 18 }}>{isYear ? p.perYear : p.per}</div>
              <div style={{ margin: '22px 0 24px' }}>
                <Button variant={pop ? 'primary' : 'ghost'} href={p.href || APP_REGISTER} style={{ width: '100%' }}>{p.cta}</Button>
              </div>
              <div className="rr-small" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Icon name="check" size={17} color={pop ? 'var(--accent)' : 'var(--green)'} strokeWidth={2.4} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={i === 0 ? { color: 'var(--ink)' } : undefined}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

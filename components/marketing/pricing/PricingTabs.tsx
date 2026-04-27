'use client'

import { useState } from 'react'
import PricingCards from './PricingCards'
import CompareTable from './CompareTable'
import type { BillingPeriod } from './PricingCards'

export function PricingTabs() {
  const [variant, setVariant] = useState<'partners' | 'links'>('partners')
  const [billing, setBilling] = useState<BillingPeriod>('annual')

  return (
    <div>
      {/* Product tab switcher */}
      <div className="flex justify-center">
        <div
          className="inline-flex gap-1 rounded-full p-1"
          style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
        >
          {(
            [
              { id: 'partners', label: 'Партнёрские программы' },
              { id: 'links', label: 'Ссылки' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setVariant(t.id)}
              className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
              style={{
                background: variant === t.id ? 'var(--bg-white)' : 'transparent',
                color: variant === t.id ? 'var(--text)' : 'var(--text-muted)',
                boxShadow: variant === t.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Billing period toggle */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => setBilling('monthly')}
          className="text-sm font-medium transition-colors"
          style={{ color: billing === 'monthly' ? 'var(--text)' : 'var(--text-muted)' }}
        >
          Ежемесячно
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={billing === 'annual'}
          onClick={() => setBilling(billing === 'annual' ? 'monthly' : 'annual')}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
          style={{ background: billing === 'annual' ? 'var(--accent)' : 'var(--border)' }}
        >
          <span
            className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{ transform: billing === 'annual' ? 'translateX(20px)' : 'translateX(0px)' }}
          />
        </button>

        <button
          type="button"
          onClick={() => setBilling('annual')}
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: billing === 'annual' ? 'var(--text)' : 'var(--text-muted)' }}
        >
          Ежегодно
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors"
            style={{
              background: billing === 'annual' ? 'var(--green-bg)' : 'var(--bg-muted)',
              color: billing === 'annual' ? 'var(--green)' : 'var(--text-dim)',
            }}
          >
            −17%
          </span>
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <PricingCards variant={variant} billing={billing} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <CompareTable variant={variant} />
      </div>
    </div>
  )
}

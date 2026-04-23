'use client'

import { useState } from 'react'
import PricingCards from './PricingCards'
import CompareTable from './CompareTable'

export function PricingTabs() {
  const [variant, setVariant] = useState<'partners' | 'links'>('partners')

  return (
    <div>
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

      <div className="max-w-[1200px] mx-auto px-6">
        <PricingCards variant={variant} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <CompareTable variant={variant} />
      </div>
    </div>
  )
}

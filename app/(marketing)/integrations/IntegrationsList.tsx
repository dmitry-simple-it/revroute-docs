'use client'

import { useState } from 'react'
import type { Integration } from '@/lib/integrations'
import { IntegrationCard, FeaturedCard } from '@/components/marketing/IntegrationCard'

interface Props {
  integrations: Integration[]
  featured: Integration[]
  categories: { key: string; label: string }[]
}

export function IntegrationsList({ integrations, featured, categories }: Props) {
  const [filter, setFilter] = useState('all')

  const filtered =
    filter === 'all'
      ? integrations
      : integrations.filter((i) => i.category === filter)

  return (
    <>
      {/* Filter tabs */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === key ? 'var(--accent)' : 'var(--bg-white)',
                color: filter === key ? '#fff' : 'var(--text-muted)',
                borderColor: filter === key ? 'var(--accent)' : 'var(--border)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured (only on "all" filter) */}
      {filter === 'all' && (
        <section className="mx-auto mb-16 max-w-7xl px-6">
          <div
            className="mb-5 text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Популярные интеграции
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((i) => (
              <FeaturedCard key={i.slug} integration={i} />
            ))}
          </div>
        </section>
      )}

      {/* All integrations grid */}
      <section className="mx-auto mb-20 max-w-7xl px-6">
        <div
          className="mb-5 text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {filter === 'all' ? 'Все интеграции' : categories.find((c) => c.key === filter)?.label}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <IntegrationCard key={i.slug} integration={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Интеграции в этой категории скоро появятся.
          </p>
        )}
      </section>
    </>
  )
}

import type { ReactNode } from 'react'
import { SpotlightCard } from './SpotlightCard'

export type Feature = {
  title: string
  desc: string
  icon?: ReactNode
}

export function FeatureGrid({
  cards,
  cols = 3,
  className = '',
}: {
  cards: Feature[]
  cols?: 2 | 3 | 4
  className?: string
}) {
  const gridCols = {
    2: 'grid-cols-2 max-md:grid-cols-1',
    3: 'grid-cols-3 max-md:grid-cols-1',
    4: 'grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1',
  }[cols]

  return (
    <div className={`stagger-children grid gap-4 ${gridCols} ${className}`}>
      {cards.map((card) => (
        <SpotlightCard
          key={card.title}
          className="border transition-all hover:-translate-y-0.5"
          style={{
            padding: '28px',
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {card.icon && <div className="mb-3">{card.icon}</div>}
          <h4 className="mb-1.5 text-base font-bold">{card.title}</h4>
          <p className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
            {card.desc}
          </p>
        </SpotlightCard>
      ))}
    </div>
  )
}

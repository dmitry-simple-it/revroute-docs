'use client'

import type { ReactNode } from 'react'
import { trackGoal } from '@/lib/analytics/yandex-metrika'

type Goal = 'landing_login_click' | 'landing_signup_click'

export function PrimaryButton({
  href,
  children,
  goal,
}: {
  href: string
  children: ReactNode
  goal?: Goal
}) {
  const handleClick = goal ? () => trackGoal(goal) : undefined
  return (
    <a
      href={href}
      onClick={handleClick}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl text-base font-semibold no-underline transition-all hover:-translate-y-px"
      style={{
        padding: '14px 32px',
        background: 'var(--accent)',
        color: '#fff',
        boxShadow:
          '0 10px 30px rgba(12,10,9,0.20), 0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="shimmer-sheen pointer-events-none absolute inset-0"
        style={{ mixBlendMode: 'overlay' }}
      />
    </a>
  )
}

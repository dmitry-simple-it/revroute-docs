'use client'

import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { trackGoal } from '@/lib/analytics/yandex-metrika'

type Goal = 'landing_login_click' | 'landing_signup_click'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  goal: Goal
}

export function TrackedAppLink({ goal, onClick, children, ...rest }: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackGoal(goal)
    onClick?.(e)
  }
  return (
    <a {...rest} onClick={handleClick}>
      {children}
    </a>
  )
}

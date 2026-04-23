'use client'

import { forwardRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'article'
}

export const SpotlightCard = forwardRef<HTMLDivElement, Props>(function SpotlightCard(
  { children, className = '', style, as = 'div' },
  ref,
) {
  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mx', `${x}%`)
    e.currentTarget.style.setProperty('--my', `${y}%`)
  }

  const Tag = as as 'div'
  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      className={`spotlight ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
})

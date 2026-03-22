'use client'

import { useInView } from './useInView'

export function AnimateOnScroll({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, isVisible } = useInView()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {children}
    </div>
  )
}

import type { CSSProperties, ReactNode } from 'react'

const accentColor: Record<string, string> = {
  blue: 'var(--blue)',
  green: 'var(--green)',
  orange: 'var(--orange)',
  purple: 'var(--purple)',
}

export function Eyebrow({
  children,
  color = 'blue',
  className = '',
}: {
  children: ReactNode
  color?: keyof typeof accentColor
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[13px] font-semibold uppercase ${className}`}
      style={{ color: accentColor[color], letterSpacing: '1.5px' }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {children}
    </span>
  )
}

export function SectionHeading({
  children,
  align = 'left',
  size = 'lg',
  className = '',
  style,
}: {
  children: ReactNode
  align?: 'left' | 'center'
  size?: 'md' | 'lg' | 'xl'
  className?: string
  style?: CSSProperties
}) {
  const fontSize = {
    md: 'clamp(28px, 3.5vw, 40px)',
    lg: 'clamp(32px, 4vw, 48px)',
    xl: 'clamp(40px, 6vw, 64px)',
  }[size]
  return (
    <h2
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize,
        fontWeight: 400,
        letterSpacing: '-0.5px',
        lineHeight: 1.1,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

export function SectionDesc({
  children,
  align = 'left',
  className = '',
  maxWidth = 600,
}: {
  children: ReactNode
  align?: 'left' | 'center'
  className?: string
  maxWidth?: number
}) {
  return (
    <p
      className={`text-lg leading-relaxed ${className}`}
      style={{
        color: 'var(--text-muted)',
        maxWidth,
        marginLeft: align === 'center' ? 'auto' : undefined,
        marginRight: align === 'center' ? 'auto' : undefined,
        textAlign: align,
      }}
    >
      {children}
    </p>
  )
}

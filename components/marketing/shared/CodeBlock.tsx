import type { ReactNode } from 'react'

export function CodeBlock({
  children,
  label,
  className = '',
}: {
  children: ReactNode
  label?: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-x-auto ${className}`}
      style={{
        background: 'var(--bg-dark)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: '13px',
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.85)',
      }}
    >
      <div
        className="absolute top-4 left-4 h-3 w-3 rounded-full"
        style={{ background: '#ef4444', boxShadow: '18px 0 0 #fbbf24, 36px 0 0 #22c55e' }}
      />
      {label && (
        <div
          className="absolute right-5 top-4 text-[11px] font-semibold uppercase"
          style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}
        >
          {label}
        </div>
      )}
      <pre className="mt-5 whitespace-pre">{children}</pre>
    </div>
  )
}

export const Keyword = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#c084fc' }}>{children}</span>
)
export const StringLit = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#34d399' }}>{children}</span>
)
export const Ident = ({ children }: { children: ReactNode }) => (
  <span style={{ color: '#60a5fa' }}>{children}</span>
)
export const Comment = ({ children }: { children: ReactNode }) => (
  <span style={{ color: 'rgba(255,255,255,0.3)' }}>{children}</span>
)

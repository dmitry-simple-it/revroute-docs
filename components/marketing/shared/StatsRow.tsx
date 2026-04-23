export type Stat = { value: string; label: string }

export function StatsRow({
  stats,
  className = '',
}: {
  stats: Stat[]
  className?: string
}) {
  const cols = `grid-cols-${stats.length}`
  return (
    <div
      className={`mx-auto grid gap-8 max-md:grid-cols-1 max-md:gap-4 ${cols} ${className}`}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="border"
          style={{
            padding: '32px 24px',
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div
            className="mb-2 leading-none"
            style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-2px' }}
          >
            {s.value}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

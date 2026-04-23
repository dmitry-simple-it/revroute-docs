import worldMap from './world-map.json'

const { image, points, pins } = worldMap as {
  image: { width: number; height: number }
  points: { x: number; y: number }[]
  pins: { x: number; y: number; label: string }[]
}

export function WorldMap({
  height = 280,
  className,
  showLabels = true,
  ariaLabel = 'Карта кликов по миру',
}: {
  height?: number
  className?: string
  showLabels?: boolean
  ariaLabel?: string
}) {
  const vbW = image.width
  const vbH = image.height

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        background:
          'radial-gradient(ellipse at center, rgba(37,99,235,0.06), transparent 70%), var(--bg-white)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        border: '1px solid var(--border)',
      }}
    >
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={ariaLabel}
      >
        {points.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={0.35} fill="var(--text-dim)" opacity={0.45} />
        ))}

        {pins.map((d, i) => (
          <g key={i}>
            <circle
              cx={d.x}
              cy={d.y}
              r={2.2}
              fill="rgba(37, 99, 235, 0.18)"
              style={{
                transformOrigin: `${d.x}px ${d.y}px`,
                animation: `pulseDot 2.4s ease-in-out ${(i * 0.2) % 2.4}s infinite`,
              }}
            />
            <circle cx={d.x} cy={d.y} r={1} fill="var(--blue)" />
            <circle
              cx={d.x}
              cy={d.y}
              r={1.6}
              fill="none"
              stroke="rgba(37, 99, 235, 0.4)"
              strokeWidth={0.25}
              style={{
                transformOrigin: `${d.x}px ${d.y}px`,
                animation: `pulseRing 2.4s ease-out ${(i * 0.15) % 2.4}s infinite`,
              }}
            />
          </g>
        ))}
      </svg>

      {showLabels && (
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--blue)' }} />
            Кликов сейчас
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--text-dim)' }} />
            География покрытия
          </span>
          <span className="ml-auto font-mono text-[11px]" style={{ color: 'var(--text-dim)' }}>
            обновляется в реальном времени
          </span>
        </div>
      )}
    </div>
  )
}

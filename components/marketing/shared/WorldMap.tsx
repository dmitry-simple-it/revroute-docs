type Dot = { x: number; y: number; label?: string; value?: string; size?: number }

/**
 * Dotted world-map. Not geographically precise — a stylized grid of dots that
 * roughly outlines continents, with a few highlighted "live click" points.
 *
 * Coordinates are in a 360×180 viewBox so x,y correspond (loosely) to
 * lon/lat: x = (lon + 180) / 360 * 360  = lon + 180; y = (90 - lat).
 */
const highlightDots: Dot[] = [
  { x: 217, y: 34, label: 'Москва', value: '+12 кликов' }, // ~37E 56N
  { x: 210, y: 40, label: 'СПб' },
  { x: 260, y: 36, label: 'Новосибирск' },
  { x: 281, y: 35, label: 'Алматы' },
  { x: 115, y: 62, label: 'Дубай' },
  { x: 80, y: 48, label: 'Берлин', value: '+4' },
  { x: 70, y: 54, label: 'Лондон' },
  { x: 95, y: 52, label: 'Стамбул' },
  { x: 320, y: 54, label: 'Токио', value: '+7' },
  { x: 295, y: 60, label: 'Сингапур' },
  { x: 305, y: 72, label: 'Сидней' },
  { x: 248, y: 50, label: 'Нью-Дели' },
  { x: 290, y: 48, label: 'Шанхай' },
  { x: 56, y: 62, label: 'Мадрид' },
  { x: 310, y: 46, label: 'Сеул' },
  { x: 120, y: 90, label: 'Кейптаун' },
  { x: 135, y: 60, label: 'Каир' },
  { x: 60, y: 92, label: 'Лагос' },
  { x: 55, y: 72, label: 'Париж' },
  { x: 235, y: 38, label: 'Екатеринбург' },
]

// Very rough continental outline as dotted grid
function buildDots() {
  const pattern: { x: number; y: number; kind: 'land' | 'sea' }[] = []
  // Only include a subset of grid positions that roughly cover continents
  const landBoxes: [number, number, number, number][] = [
    // [x1, y1, x2, y2]
    [40, 30, 140, 80], // Europe + W Asia
    [130, 25, 210, 55], // N/Russia
    [200, 20, 310, 80], // Asia
    [135, 58, 205, 120], // Africa
    [10, 75, 95, 145], // S America
    [10, 20, 90, 70], // N America - west
    [75, 30, 125, 80], // N America - east (Atlantic)
    [280, 85, 340, 130], // Australia
  ]
  const inside = (x: number, y: number) =>
    landBoxes.some(([x1, y1, x2, y2]) => x >= x1 && x <= x2 && y >= y1 && y <= y2)

  for (let y = 12; y < 150; y += 5) {
    for (let x = 4; x < 356; x += 5) {
      if (inside(x, y)) pattern.push({ x, y, kind: 'land' })
    }
  }
  return pattern
}

const worldDots = buildDots()

export function WorldMap({
  height = 280,
  className,
  showLabels = true,
  dots = highlightDots,
}: {
  height?: number
  className?: string
  showLabels?: boolean
  dots?: Dot[]
}) {
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
        viewBox="0 0 360 170"
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Карта кликов по миру"
      >
        {worldDots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={0.9}
            fill="var(--text-dim)"
            opacity={0.45}
          />
        ))}

        {dots.map((d, i) => (
          <g key={i}>
            <circle
              cx={d.x}
              cy={d.y}
              r={(d.size ?? 3) + 4}
              fill="rgba(37, 99, 235, 0.18)"
              style={{
                transformOrigin: `${d.x}px ${d.y}px`,
                animation: `pulseDot 2.4s ease-in-out ${(i * 0.2) % 2.4}s infinite`,
              }}
            />
            <circle
              cx={d.x}
              cy={d.y}
              r={d.size ?? 3}
              fill="var(--blue)"
            />
            <circle
              cx={d.x}
              cy={d.y}
              r={(d.size ?? 3) + 2}
              fill="none"
              stroke="rgba(37, 99, 235, 0.4)"
              strokeWidth={0.8}
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

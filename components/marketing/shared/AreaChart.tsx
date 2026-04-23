import { useId, type CSSProperties } from 'react'

type Props = {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  fillTop?: string
  fillBottom?: string
  gridLines?: number
  showAxis?: boolean
  animate?: boolean
  className?: string
  style?: CSSProperties
  ariaLabel?: string
  padding?: { top: number; right: number; bottom: number; left: number }
}

/**
 * Pure-SVG animated area chart.
 * No deps. Draws smooth path with cardinal-ish curve via quadratic Beziers,
 * then animates the stroke with `drawLine` keyframe and fades the fill in.
 */
export function AreaChart({
  data,
  width = 800,
  height = 220,
  stroke = 'var(--text)',
  fillTop = 'rgba(12, 10, 9, 0.18)',
  fillBottom = 'rgba(12, 10, 9, 0)',
  gridLines = 4,
  showAxis = true,
  animate = true,
  className,
  style,
  ariaLabel = 'Chart',
  padding = { top: 16, right: 12, bottom: 24, left: 12 },
}: Props) {
  if (data.length === 0) return null

  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = padding.left + (i / (data.length - 1)) * innerW
    const y = padding.top + innerH - ((v - min) / range) * innerH
    return { x, y }
  })

  // Build a smooth path (Catmull-Rom → Bezier)
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }

  const areaD =
    d +
    ` L ${points[points.length - 1].x},${padding.top + innerH}` +
    ` L ${points[0].x},${padding.top + innerH} Z`

  // Estimate path length for stroke-dash animation
  const approxLen = Math.round(width * 1.2)

  const rawId = useId()
  const gradId = `area-grad-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <svg
      className={className}
      style={style}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillTop} />
          <stop offset="100%" stopColor={fillBottom} />
        </linearGradient>
      </defs>

      {showAxis &&
        Array.from({ length: gridLines }).map((_, i) => {
          const y = padding.top + (innerH / (gridLines - 1)) * i
          return (
            <line
              key={i}
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              stroke="var(--border)"
              strokeDasharray="2 4"
              strokeWidth="1"
              opacity={0.6}
            />
          )
        })}

      <path
        d={areaD}
        fill={`url(#${gradId})`}
        style={
          animate
            ? {
                transformOrigin: `${padding.left + innerW / 2}px ${padding.top + innerH}px`,
                animation: 'fillArea 1.1s ease 0.25s both',
              }
            : undefined
        }
      />

      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          animate
            ? {
                strokeDasharray: approxLen,
                strokeDashoffset: approxLen,
                animation: `drawLine 1.6s ease forwards`,
                ['--draw-length' as string]: `${approxLen}`,
              }
            : undefined
        }
      />

      {/* Highlight last point */}
      <g>
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={14}
          fill={stroke}
          opacity={0.12}
          style={animate ? { animation: 'pulseDot 2.2s ease-in-out infinite 1.6s' } : undefined}
        />
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={4}
          fill={stroke}
          style={animate ? { animation: 'fadeIn 0.4s ease 1.6s both' } : undefined}
        />
      </g>
    </svg>
  )
}

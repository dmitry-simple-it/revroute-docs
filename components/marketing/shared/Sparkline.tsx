type Props = {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
  strokeWidth?: number
  className?: string
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  stroke = 'var(--text)',
  fill = 'rgba(12, 10, 9, 0.08)',
  strokeWidth = 1.6,
  className,
}: Props) {
  if (data.length === 0) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = data.length > 1 ? width / (data.length - 1) : width
  const points = data.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * (height - 2) - 1
    return { x, y }
  })
  let line = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    line += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
  }
  const area = `${line} L ${width},${height} L 0,${height} Z`
  const last = points[points.length - 1]

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <path d={area} fill={fill} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="5.5" fill={stroke} opacity="0.14" />
      <circle cx={last.x} cy={last.y} r="2.1" fill={stroke} />
    </svg>
  )
}

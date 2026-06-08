import type { ReactElement, SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconLink(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  )
}

export function IconAnalytics(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-7" />
    </svg>
  )
}

export function IconPartners(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6" />
      <path d="M15 20c0-2 1.3-3.7 3-4.4" />
    </svg>
  )
}

export function IconQR(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14h1M14 20h1M18 18h3v3" />
    </svg>
  )
}

export function IconTarget(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function IconGlobe(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3 3 15 0 18c-3-3-3-15 0-18Z" />
    </svg>
  )
}

export function IconBolt(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  )
}

export function IconShield(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function IconCode(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="m8 8-5 4 5 4" />
      <path d="m16 8 5 4-5 4" />
      <path d="m14 4-4 16" />
    </svg>
  )
}

export function IconWebhook(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M8 14a4 4 0 1 1 5-3l3 5" />
      <path d="M20 16a4 4 0 1 1-6 3l-3-5" />
      <path d="M9 19a4 4 0 1 1 2-7" />
    </svg>
  )
}

export function IconUsers(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  )
}

export function IconCash(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 10v4M18 10v4" />
    </svg>
  )
}

export function IconSparkles(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3Z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
    </svg>
  )
}

export function IconLayers(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="m2 13 10 5 10-5" />
      <path d="m2 18 10 5 10-5" />
    </svg>
  )
}

export function IconLock(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  )
}

export function IconMouseCursor(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M5 3l5 17 2-7 7-2L5 3Z" />
    </svg>
  )
}

// Брендовые иконки мессенджеров — многоцветные (не наследуют currentColor).
export function IconTelegram(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...p}>
      <defs>
        <linearGradient id="rr-tg-grad" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2AABEE" />
          <stop offset="1" stopColor="#229ED9" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#rr-tg-grad)" />
      <g transform="translate(12 12) scale(0.62) translate(-11.8 -11.6)">
        <path
          fill="#fff"
          d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z"
        />
      </g>
    </svg>
  )
}

// Логотип мессенджера MAX (max.ru) — градиентный сквиркл с белым «пузырём».
export function IconMax(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 48 48" fill="none" {...p}>
      <defs>
        <linearGradient id="rr-max-grad" x1="5" y1="43" x2="43" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2C7DF7" />
          <stop offset="0.5" stopColor="#5956EE" />
          <stop offset="1" stopColor="#8C42E6" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13.2" fill="url(#rr-max-grad)" />
      <path
        fill="#fff"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.4 32.5 A12.5 12.5 0 1 0 14.8 26.0 L13.6 31.0 Q13.1 33.4 15.5 32.5 Z M19.2 21.5 a7.3 7.3 0 1 0 14.6 0 a7.3 7.3 0 1 0 -14.6 0 Z"
      />
    </svg>
  )
}

export function FeatureIcon({
  icon: Icon,
  color = 'var(--blue)',
  bg = 'var(--blue-bg)',
  size = 44,
}: {
  icon: (p: SVGProps<SVGSVGElement>) => ReactElement
  color?: string
  bg?: string
  size?: number
}) {
  return (
    <div
      className="mb-4 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        background: bg,
        color,
      }}
    >
      <Icon width={22} height={22} />
    </div>
  )
}

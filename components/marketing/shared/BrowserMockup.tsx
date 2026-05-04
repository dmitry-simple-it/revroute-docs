import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'

type GlowColor = 'purple' | 'green' | 'blue' | 'orange' | 'none'

const GLOW: Record<GlowColor, string> = {
  purple: 'rgba(124, 58, 237, 0.22)',
  green: 'rgba(22, 163, 74, 0.18)',
  blue: 'rgba(37, 99, 235, 0.18)',
  orange: 'rgba(234, 88, 12, 0.18)',
  none: 'transparent',
}

export type BrowserMockupProps = {
  src: string
  alt: string
  width: number
  height: number
  url?: string
  caption?: ReactNode
  glow?: GlowColor
  priority?: boolean
  maxWidth?: number
  className?: string
  style?: CSSProperties
  /**
   * 'browser' (по умолчанию) — рамка с traffic-lights и URL-баром.
   * 'none' — только скриншот с тенью и glow, чтобы кадр «растекался» в страницу.
   */
  chrome?: 'browser' | 'none'
}

/**
 * Браузер-фрейм с реальным app-скриншотом.
 * Единый стиль обрамления для всех продуктовых иллюстраций на маркетинге.
 */
export function BrowserMockup({
  src,
  alt,
  width,
  height,
  url,
  caption,
  glow = 'purple',
  priority = false,
  maxWidth = 1160,
  className = '',
  style,
  chrome = 'browser',
}: BrowserMockupProps) {
  const glowColor = GLOW[glow]
  const showChrome = chrome === 'browser'

  const imageEl = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={`(max-width: 768px) 100vw, ${maxWidth}px`}
      quality={90}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
      }}
    />
  )

  return (
    <div className={`relative mx-auto ${className}`} style={{ maxWidth, ...style }}>
      {glow !== 'none' && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -inset-y-10"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 65%)`,
            filter: 'blur(28px)',
            zIndex: 0,
          }}
        />
      )}

      {showChrome ? (
        <div
          className="relative overflow-hidden rounded-2xl border max-md:mx-4"
          style={{
            borderColor: 'rgba(0,0,0,0.08)',
            boxShadow:
              '0 4px 6px -1px rgba(0,0,0,0.05), 0 24px 60px -12px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.6) inset',
            background: 'var(--bg-white, #fff)',
            zIndex: 1,
          }}
        >
          <div
            className="flex items-center gap-3 border-b px-5 py-3"
            style={{
              borderColor: 'rgba(0,0,0,0.07)',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
              <div className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
            </div>
            {url && (
              <div
                className="flex-1 rounded-md px-3 py-1.5 text-center font-mono text-[11px]"
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  color: 'var(--text-dim)',
                  maxWidth: 360,
                  margin: '0 auto',
                }}
              >
                {url}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg, #fafaf9)' }}>{imageEl}</div>
        </div>
      ) : (
        <div
          className="relative overflow-hidden rounded-xl max-md:mx-4"
          style={{
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.04), 0 18px 50px -16px rgba(0,0,0,0.18)',
            zIndex: 1,
          }}
        >
          {imageEl}
        </div>
      )}

      {caption && (
        <div
          className="mt-4 text-center text-xs"
          style={{ color: 'var(--text-dim)', position: 'relative', zIndex: 1 }}
        >
          {caption}
        </div>
      )}
    </div>
  )
}

'use client'

/**
 * RevRoute DS v2 — UpgradeStatTeaser: вариант B оффера аккаунта в инструментах.
 *
 * Идея снята с лидеров рынка (конкурентный обход 11.08.2026): Bitly/QRCG
 * показывает под созданным кодом пустой скелетон статистики («Total scans —,
 * Unique scans —, Top location —»), QRCode Monkey открывает картинку дашборда —
 * будущая ценность ВИЗУАЛИЗИРУЕТСЯ, а не описывается текстом. Мы переносим
 * только визуальный приём: файл никогда не запирается за регистрацию
 * (у Bitly — запирается; нам нельзя, на бесплатности держится конверсия 59%).
 *
 * Компонент презентационный: цели трекает родитель через onCtaClick.
 */
import type { ReactNode } from 'react'
import { Button } from './primitives'

function SkeletonBar({ w }: { w: number }) {
  return (
    <span
      aria-hidden
      style={{ display: 'inline-block', width: w, height: 10, borderRadius: 5, background: 'var(--line-2)' }}
    />
  )
}

export function UpgradeStatTeaser({
  title,
  rows,
  note,
  ctaLabel,
  ctaHref,
  onCtaClick,
  onDismiss,
}: {
  title: string
  /** Строки скелетона: подпись метрики + ширина заглушки значения. */
  rows: { label: string; barWidth: number }[]
  note: ReactNode
  ctaLabel: string
  ctaHref: string
  onCtaClick: () => void
  /** «Мне хватит» — показывается только если передан обработчик. */
  onDismiss?: () => void
}) {
  return (
    <div style={{ marginTop: 24, padding: '20px 22px', borderRadius: 14, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)' }}>
      <h3 className="rr-h3" style={{ margin: 0 }}>{title}</h3>
      {/* пустой мини-дашборд: то, чего у статического кода не будет никогда */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, padding: '12px 14px', borderRadius: 10, background: '#fff', border: '1px solid var(--line-2)', maxWidth: 340 }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span className="rr-small" style={{ color: 'var(--ink-3)' }}>{r.label}</span>
            <SkeletonBar w={r.barWidth} />
          </div>
        ))}
      </div>
      <p className="rr-small" style={{ margin: '10px 0 0', color: 'var(--ink-2)' }}>{note}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
        <Button variant="accent" size="sm" href={ctaHref} iconRight="arrow-right" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rr-small"
            style={{ background: 'none', border: 'none', padding: '6px 4px', color: 'var(--ink-3)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Мне хватит
          </button>
        )}
      </div>
    </div>
  )
}

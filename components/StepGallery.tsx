'use client'

import { useCallback, useState } from 'react'

type StepShot = { src: string; alt?: string; caption?: string }

/**
 * Прокликиваемая пошаговая галерея скриншотов с подписями — замена
 * анимированных луп-видео в доках (решение владельца 19.09.2026: кадры легче
 * по весу, каждый шаг подписан, читатель листает в своём темпе).
 *
 * Использование в MDX:
 *   <StepGallery
 *     images={[
 *       { src: '/images/ru/links/step-1.jpg', alt: '…', caption: 'Откройте конструктор' },
 *       { src: '/images/ru/links/step-2.jpg', alt: '…', caption: 'Вставьте URL' },
 *     ]}
 *   />
 *
 * Клик по кадру и стрелки ←/→ листают шаги; список закольцован.
 */
export function StepGallery({ images }: { images: StepShot[] }) {
  const [i, setI] = useState(0)
  const n = images.length

  const go = useCallback(
    (delta: number) => setI(prev => (prev + delta + n) % n),
    [n],
  )

  if (n === 0) return null
  const shot = images[i]

  const navBtn: React.CSSProperties = {
    cursor: 'pointer',
    border: '1px solid var(--nextra-border, #e5e7eb)',
    background: 'transparent',
    color: 'inherit',
    borderRadius: '0.375rem',
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: 1.4,
  }

  return (
    <figure
      style={{ margin: '1.5rem 0' }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          borderRadius: '0.5rem',
          border: '1px solid var(--nextra-border, #e5e7eb)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- кадры уже в нужном размере, оптимизатор не нужен */}
        <img
          src={shot.src}
          alt={shot.alt || shot.caption || `Шаг ${i + 1}`}
          style={{ width: '100%', display: 'block', cursor: n > 1 ? 'pointer' : 'default' }}
          onClick={() => n > 1 && go(1)}
          title={n > 1 ? 'Следующий шаг' : undefined}
        />
      </div>
      <figcaption
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        {n > 1 && (
          <span style={{ display: 'inline-flex', gap: '0.375rem', flexShrink: 0 }}>
            <button type="button" aria-label="Предыдущий шаг" style={navBtn} onClick={() => go(-1)}>
              ←
            </button>
            <button type="button" aria-label="Следующий шаг" style={navBtn} onClick={() => go(1)}>
              →
            </button>
          </span>
        )}
        <span style={{ opacity: 0.7 }}>
          {n > 1 && (
            <b style={{ fontVariantNumeric: 'tabular-nums' }}>
              {i + 1}/{n}.{' '}
            </b>
          )}
          {shot.caption}
        </span>
      </figcaption>
    </figure>
  )
}

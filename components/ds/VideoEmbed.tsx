'use client'

/**
 * VideoEmbed — designed click-to-play cover for the promo/demo video.
 *
 * Renders the DS browser-frame chrome, then a real product still under a
 * brand scrim with a centered play button, a value hook and a duration chip.
 * Click reveals the real <video> (sound on — the click is the user gesture).
 * No baked-in poster art: the cover is live DS, crisp at any resolution.
 */
import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

type Source = { src: string; type: string }

export function VideoEmbed({
  sources,
  poster,
  posterAlt = '',
  chrome = 'Промо RevRoute',
  title,
  duration = '0:50',
  maxWidth = 980,
  style,
}: {
  sources: Source[]
  poster: string
  posterAlt?: string
  chrome?: string
  title?: ReactNode
  duration?: string
  maxWidth?: number
  style?: CSSProperties
}) {
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  return (
    <div style={{ position: 'relative', maxWidth, marginInline: 'auto', ...style }}>
      {/* violet wash behind the frame — matches BrowserFrame */}
      <div aria-hidden style={{ position: 'absolute', inset: '-70px -10px -40px', zIndex: 0, background: 'radial-gradient(circle at 60% 40%, rgba(124,58,237,.16), transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, background: '#fff', border: '1px solid var(--line)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        {/* browser chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderBottom: '1px solid var(--line-2)', background: 'var(--bg)' }}>
          <span style={{ display: 'flex', gap: 6 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--line)' }} />)}</span>
          <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>{chrome}</span>
        </div>

        {/* media — fixed 16:9 to avoid layout shift on play */}
        <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#0a0a0a' }}>
          {playing ? (
            <video
              ref={ref}
              controls
              autoPlay
              playsInline
              preload="auto"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
            >
              {sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
            </video>
          ) : (
            <button
              type="button"
              className="rr-video-cover"
              aria-label="Воспроизвести демо-ролик RevRoute"
              onClick={() => setPlaying(true)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <img src={poster} alt={posterAlt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />

              {/* brand scrim — strong top & bottom bands so title/chip read on any frame */}
              <span
                aria-hidden
                className="rr-video-scrim"
                style={{
                  position: 'absolute', inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(8,6,18,.66) 0%, rgba(8,6,18,0) 34%), ' +
                    'linear-gradient(0deg, rgba(8,6,18,.58) 0%, rgba(8,6,18,0) 30%), ' +
                    'radial-gradient(44% 54% at 50% 50%, rgba(133,90,252,.40), transparent 70%), ' +
                    'linear-gradient(0deg, rgba(10,8,20,.14), rgba(10,8,20,.14))',
                }}
              />

              {/* value hook — top-left */}
              {title && (
                <span style={{ position: 'absolute', top: 'clamp(16px, 3.4vw, 28px)', left: 'clamp(16px, 3.4vw, 28px)', right: 'clamp(16px, 3.4vw, 28px)', textAlign: 'left', color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'clamp(0.95rem, 2.4vw, 1.35rem)', lineHeight: 1.25, letterSpacing: '-0.01em', textShadow: '0 1px 16px rgba(0,0,0,.35)' }}>
                  {title}
                </span>
              )}

              {/* play button — centered */}
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="rr-video-play" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'clamp(58px, 8vw, 76px)', height: 'clamp(58px, 8vw, 76px)', borderRadius: '50%', background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,.25), 0 0 0 1px rgba(133,90,252,.18)' }}>
                  <svg viewBox="0 0 24 24" width="40%" height="40%" style={{ marginLeft: '8%' }} aria-hidden><path d="M8 5v14l11-7z" fill="var(--accent-2)" /></svg>
                </span>
              </span>

              {/* duration chip — bottom-right */}
              <span style={{ position: 'absolute', right: 'clamp(12px, 2.6vw, 20px)', bottom: 'clamp(12px, 2.6vw, 20px)', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'rgba(10,8,20,.55)', backdropFilter: 'blur(6px)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, letterSpacing: '.01em' }}>
                <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden><path d="M8 5v14l11-7z" fill="#fff" /></svg>
                {duration}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

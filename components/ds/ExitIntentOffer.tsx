'use client'

/**
 * RevRoute DS v2 — ExitIntentOffer: оффер при попытке уйти со страницы.
 *
 * Механика снята с Bitly (обход 14.08.2026): на уводе курсора к верхней кромке
 * окна показывается карточка «Want to try Bitly for free?» с тремя буллетами,
 * снимающими страх обязательств («100% free, no credit card, no pressure»).
 *
 * Наши отличия — под охранную метрику и ТЗ моста:
 * - показывается ТОЛЬКО после успешного действия (создан код / сокращена
 *   ссылка): человек уже получил своё, мы не встаём между ним и результатом.
 *   У Bitly попап вылетает и на холодную — нам так нельзя: требование
 *   модерации Директа из lp-qr-brief («без всплывающих окон, перекрывающих
 *   контент») читаем строго для момента захода с объявления;
 * - только desktop (pointer: fine): на тач-устройствах честного exit-intent
 *   не существует, а перехват кнопки «назад» — тёмный паттерн;
 * - один показ за сессию (sessionStorage), навсегда отключается ссылкой
 *   «Больше не предлагать» (общий ключ OFFER_DISMISS_KEY со всеми офферами
 *   инструментов) и уважает уже сделанный отказ «Мне хватит»;
 * - закрывается крестиком, Esc и кликом по фону.
 *
 * Цели: показ — tool_upgrade_view {trigger:'exit_intent'} (модалка поверх
 * контента, видимость гарантирована — IntersectionObserver не нужен),
 * клик CTA — tool_signup_click {trigger:'exit_intent'}.
 */
import { useEffect, useRef, useState } from 'react'
import { trackGoal } from '@/lib/analytics/yandex-metrika'
import { Button, Icon } from './primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'
const SESSION_KEY = 'rr_exit_offer_shown'
const OFFER_DISMISS_KEY = 'rr_tools_offer_dismissed'

export function ExitIntentOffer({
  tool,
  variant,
  enabled,
  title,
  bullets,
  ctaLabel = 'Попробовать бесплатно',
}: {
  /** Источник для параметров целей: 'qr' | 'shortener'. */
  tool: string
  /** Вариант A/B родительского оффера — для сегментации в Метрике. */
  variant: string
  /** true — только после первого успешного действия в инструменте. */
  enabled: boolean
  title: string
  bullets: string[]
  ctaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const armedRef = useRef(false)

  useEffect(() => {
    if (!enabled || armedRef.current) return
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let dismissed = false
    try {
      dismissed =
        !!localStorage.getItem(OFFER_DISMISS_KEY) || !!sessionStorage.getItem(SESSION_KEY)
    } catch { /* приватный режим — не рискуем показом */ }
    if (dismissed) return

    armedRef.current = true
    const onMouseOut = (e: MouseEvent) => {
      // Курсор покинул окно через верхнюю кромку — намерение закрыть вкладку
      // или уйти в адресную строку. Уводы вбок/вниз не считаем.
      if (e.relatedTarget) return
      if (e.clientY > 10) return
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch { /* noop */ }
      document.removeEventListener('mouseout', onMouseOut)
      setOpen(true)
      trackGoal('tool_upgrade_view', { tool, trigger: 'exit_intent', variant })
    }
    document.addEventListener('mouseout', onMouseOut)
    return () => document.removeEventListener('mouseout', onMouseOut)
  }, [enabled, tool, variant])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function dismissForever() {
    setOpen(false)
    try { localStorage.setItem(OFFER_DISMISS_KEY, '1') } catch { /* noop */ }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20, background: 'rgba(23, 23, 23, 0.45)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ position: 'relative', maxWidth: 460, width: '100%', background: '#fff', boxShadow: 'var(--shadow-lg, var(--shadow-md))' }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть"
          style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', padding: 6, cursor: 'pointer', color: 'var(--ink-3)' }}
        >
          <Icon name="x" size={18} />
        </button>

        <p className="rr-caption" style={{ margin: 0 }}>Пока вы не ушли</p>
        <h3 className="rr-h3" style={{ margin: '10px 24px 0 0' }}>{title}</h3>

        <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bullets.map((b) => (
            <li key={b} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Icon name="check" size={16} color="var(--accent-strong)" strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 3 }} />
              <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{b}</span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 18 }}>
          <Button
            variant="accent"
            href={APP_REGISTER}
            iconRight="arrow-right"
            onClick={() => trackGoal('tool_signup_click', { tool, trigger: 'exit_intent', variant })}
          >
            {ctaLabel}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Доделаю без аккаунта
          </Button>
        </div>

        <button
          type="button"
          onClick={dismissForever}
          className="rr-small"
          style={{ marginTop: 12, background: 'none', border: 'none', padding: 0, color: 'var(--ink-4)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
        >
          Больше не предлагать
        </button>
      </div>
    </div>
  )
}

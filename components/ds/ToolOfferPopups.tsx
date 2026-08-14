'use client'

/**
 * RevRoute DS v2 — ToolOfferPopups: вся попап-политика бесплатных инструментов
 * в одном месте, по модели Bitly (обход + скриншоты владельца, 14.08.2026).
 *
 * У Bitly два попапа: exit-intent (вылетает и на холодного посетителя) и
 * стена при скачивании. Их сила — не в перечислении фич, а в отработке
 * страхов: «It's 100% free — no commitment, no risk and no pressure»,
 * «No credit card needed». Переносим психологию, не кальку.
 *
 * ТРИ ТРИГГЕРА (решение владельца 15.08.2026 — показывать и до целевого
 * действия, как Bitly):
 *   popup_complete — через ~1с после первого скачивания / копирования:
 *                    самый ценный момент, файл уже у человека, мы ничего
 *                    не блокируем (стену Bitly не копируем принципиально —
 *                    на бесплатной выдаче держится конверсия 59%);
 *   exit_engaged   — увод курсора к верхней кромке ПОСЛЕ создания кода или
 *                    ссылки, но без скачивания/копирования;
 *   exit_cold      — увод курсора, когда человек не сделал ничего.
 *
 * АНТИСПАМ-ПОЛИТИКА (требование владельца «не заспамить»):
 *   - максимум ОДИН попап за сессию на все инструменты (общий ключ
 *     sessionStorage rr_tool_popup_shown); popup_complete приоритетнее —
 *     если он показан, exit-intent уже не сработает;
 *   - «Больше не предлагать» пишет общий OFFER_DISMISS_KEY — гасит попапы
 *     и inline-офферы навсегда, на всех инструментах;
 *   - только desktop (pointer: fine): честного exit-intent на таче нет,
 *     а попап после скачивания на мобиле закрывал бы весь экран;
 *   - inline-офферы под результатом остаются постоянной точкой контакта —
 *     они не попапы и в лимит не входят.
 *
 * Цели: показ — tool_upgrade_view, клик — tool_signup_click; в параметрах
 * tool ('qr'|'shortener'), trigger (см. выше) и variant A/B-эксперимента.
 */
import { useEffect, useRef, useState } from 'react'
import { trackGoal } from '@/lib/analytics/yandex-metrika'
import { Button, Icon } from './primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'
const SESSION_KEY = 'rr_tool_popup_shown'
const OFFER_DISMISS_KEY = 'rr_tools_offer_dismissed'
const COMPLETE_DELAY_MS = 1000

type Kind = 'popup_complete' | 'exit_engaged' | 'exit_cold'

type PopupCopy = {
  caption: string
  title: string
  bullets: string[]
  cta: string
  /** Вторая кнопка: мягкий возврат к задаче, просто закрывает попап. */
  secondary: string
}

/**
 * Тексты. Отработка страхов — адаптация Bitly («100% free — no commitment,
 * no risk and no pressure», «No credit card needed», «Multiple upgrade
 * options when you're ready»), продуктовые факты сверены с
 * content/ru/legal/tariffs.mdx п. 3.3.2 (Free: 1 000 ссылок, 50 000
 * переходов/мес, 1 свой домен).
 */
const COPY: Record<string, Record<Kind, PopupCopy>> = {
  qr: {
    popup_complete: {
      caption: 'Файл у вас',
      title: 'Код готов. Один момент про печать',
      bullets: [
        'Этот код — ваш навсегда: он статический, бесплатный и не зависит от нас.',
        'Но адрес внутри уже не поменять. В аккаунте код становится изменяемым — даже после печати тиража.',
        'Аккаунт бесплатный, карта не нужна. Платные тарифы подождут, пока не понадобятся.',
      ],
      cta: 'Сделать изменяемый код',
      secondary: 'Мне хватит этого',
    },
    exit_engaged: {
      caption: 'Секунду…',
      title: 'Код останется работать. Но кое-что он не умеет',
      bullets: [
        'Ваш код бесплатен навсегда и ни от кого не зависит.',
        'В аккаунте код становится изменяемым: адрес можно поменять после печати, переходы видны.',
        'Это тоже бесплатно — Free-тариф без карты и без ограничений по времени.',
      ],
      cta: 'Попробовать бесплатно',
      secondary: 'Доделаю без аккаунта',
    },
    exit_cold: {
      caption: 'Секунду…',
      title: 'Попробуете RevRoute бесплатно?',
      bullets: [
        'Free-тариф — насовсем: пользуйтесь сколько захотите, он не закончится.',
        'Банковская карта не нужна — совсем.',
        'Захотите больше — платные тарифы подождут: никакого давления.',
      ],
      cta: 'Попробовать бесплатно',
      secondary: 'Сначала сделаю код',
    },
  },
  shortener: {
    popup_complete: {
      caption: 'Ссылка в буфере',
      title: 'Готово. Но ссылка ничего не расскажет',
      bullets: [
        'Ссылка рабочая и бесплатная навсегда — можно вставлять куда угодно.',
        'Сколько по ней перешли, откуда и с каких устройств — видно только в аккаунте. Там же свой домен: go.вашбренд.ru.',
        'Аккаунт бесплатный, карта не нужна. Платные тарифы подождут, пока не понадобятся.',
      ],
      cta: 'Включить статистику',
      secondary: 'Мне хватит этого',
    },
    exit_engaged: {
      caption: 'Секунду…',
      title: 'Ссылка будет работать. Но она ничего не расскажет',
      bullets: [
        'Короткая ссылка бесплатна навсегда — она уже ваша.',
        'В аккаунте она начнёт считать переходы, а домен станет вашим: go.вашбренд.ru.',
        'Это тоже бесплатно — Free-тариф без карты и без ограничений по времени.',
      ],
      cta: 'Попробовать бесплатно',
      secondary: 'Доделаю без аккаунта',
    },
    exit_cold: {
      caption: 'Секунду…',
      title: 'Попробуете RevRoute бесплатно?',
      bullets: [
        'Free-тариф — насовсем: пользуйтесь сколько захотите, он не закончится.',
        'Банковская карта не нужна — совсем.',
        'Захотите больше — платные тарифы подождут: никакого давления.',
      ],
      cta: 'Попробовать бесплатно',
      secondary: 'Сначала сокращу ссылку',
    },
  },
}

function popupAlreadyShown(): boolean {
  try {
    return !!sessionStorage.getItem(SESSION_KEY) || !!localStorage.getItem(OFFER_DISMISS_KEY)
  } catch {
    // приватный режим: рисковать двойным показом нельзя — не показываем
    return true
  }
}

function markShown() {
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* noop */ }
}

export function ToolOfferPopups({
  tool,
  variant,
  created,
  completed,
  onDismissForever,
}: {
  /** Источник для параметров целей: 'qr' | 'shortener'. */
  tool: 'qr' | 'shortener'
  /** Вариант A/B родительского оффера — для сегментации в Метрике. */
  variant: string
  /** Создан код / сокращена ссылка. */
  created: boolean
  /** Скачан файл / скопирована ссылка — целевое действие завершено. */
  completed: boolean
  /** Родительский dismiss: скрыть и inline-офферы сразу, не после перезагрузки. */
  onDismissForever?: () => void
}) {
  const [kind, setKind] = useState<Kind | null>(null)
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Актуальные значения для колбэков без пересоздания слушателей.
  const stateRef = useRef({ created, completed })
  stateRef.current = { created, completed }

  const desktop = () =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

  function show(k: Kind) {
    if (popupAlreadyShown()) return
    markShown()
    setKind(k)
    trackGoal('tool_upgrade_view', { tool, trigger: k, variant })
  }

  /* popup_complete: через паузу после первого целевого действия — файл успел
     уйти в загрузки, человек выдохнул. */
  useEffect(() => {
    if (!completed || !desktop()) return
    completeTimer.current = setTimeout(() => show('popup_complete'), COMPLETE_DELAY_MS)
    return () => {
      if (completeTimer.current) clearTimeout(completeTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed])

  /* exit-intent: контент зависит от того, успел ли человек что-то сделать. */
  useEffect(() => {
    if (!desktop()) return
    const onMouseOut = (e: MouseEvent) => {
      // Курсор ушёл из окна через верхнюю кромку — к вкладкам или адресной
      // строке. Уводы вбок и вниз не считаем намерением уйти.
      if (e.relatedTarget) return
      if (e.clientY > 10) return
      const s = stateRef.current
      // после целевого действия exit-попап не нужен: либо popup_complete уже
      // был (лимит сессии), либо вот-вот покажется по своему таймеру
      if (s.completed) return
      show(s.created ? 'exit_engaged' : 'exit_cold')
    }
    document.addEventListener('mouseout', onMouseOut)
    return () => document.removeEventListener('mouseout', onMouseOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!kind) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setKind(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [kind])

  function dismissForever() {
    setKind(null)
    try { localStorage.setItem(OFFER_DISMISS_KEY, '1') } catch { /* noop */ }
    onDismissForever?.()
  }

  if (!kind) return null
  const copy = COPY[tool][kind]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      data-tool-popup={kind}
      onClick={() => setKind(null)}
      style={{
        position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20, background: 'rgba(23, 23, 23, 0.45)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ position: 'relative', maxWidth: 470, width: '100%', background: '#fff', boxShadow: 'var(--shadow-lg, var(--shadow-md))' }}
      >
        <button
          type="button"
          onClick={() => setKind(null)}
          aria-label="Закрыть"
          style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', padding: 6, cursor: 'pointer', color: 'var(--ink-3)' }}
        >
          <Icon name="x" size={18} />
        </button>

        <p className="rr-caption" style={{ margin: 0 }}>{copy.caption}</p>
        <h3 className="rr-h3" style={{ margin: '10px 24px 0 0' }}>{copy.title}</h3>

        <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {copy.bullets.map((b) => (
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
            onClick={() => trackGoal('tool_signup_click', { tool, trigger: kind, variant })}
          >
            {copy.cta}
          </Button>
          <Button variant="ghost" onClick={() => setKind(null)}>
            {copy.secondary}
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

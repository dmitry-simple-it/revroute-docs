'use client'

/**
 * LeadForm — лид-форма услуги (страницы /packaging, /audit, /prm). Отправляет
 * заявку в POST /api/lead; при ненастроенном транспорте показывает честный
 * фолбэк «напишите в Telegram». Поля 16px и min-height 48px — мобильные
 * тач-цели, без зума на iOS. Honeypot-поле `website` отсекает ботов.
 *
 * Согласия на обработку ПДн и на рекламные рассылки — в ConsentFields; оба
 * уходят в теле запроса, серверная проверка обязательного согласия дублирует
 * браузерную (см. app/api/lead/route.ts).
 */
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Button, Icon } from '@/components/ds/primitives'
import { pageFromPath, trackGoal } from '@/lib/analytics/yandex-metrika'
import { ConsentFields } from './ConsentFields'

const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

type Status = 'idle' | 'sending' | 'done' | 'failed'

export function LeadForm({
  page = 'packaging',
  aboutLabel = 'Пара слов о продукте',
  aboutPlaceholder = 'Что за продукт и кто его обычно рекомендует',
  submitLabel = 'Отправить заявку',
  doneText,
}: {
  page?: string
  aboutLabel?: string
  aboutPlaceholder?: string
  submitLabel?: string
  /** Текст под «Заявка отправлена» — если у страницы своё обещание ответа. */
  doneText?: ReactNode
}) {
  const [status, setStatus] = useState<Status>('idle')
  // Один demo_form_start на экземпляр формы. Ref, а не state: перерисовка не
  // нужна, а в StrictMode эффекты и обработчики зовутся дважды — ref переживает
  // повторный прогон, потому что инстанс компонента тот же.
  const startedRef = useRef(false)

  // Проп `page` — метка для Telegram-уведомления ('prm-demo' на /prm), в целях
  // он бы разошёлся с demo_cta_click. Для аналитики берём адрес страницы.
  const goalPage = () => pageFromPath()

  function onFirstTouch() {
    if (startedRef.current) return
    startedRef.current = true
    trackGoal('demo_form_start', { page: goalPage() })
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    setStatus('sending')
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Неотмеченный чекбокс в FormData не попадает вовсе — приводим к булеву
        // явно, чтобы сервер не гадал между «не отмечен» и «поля не было».
        body: JSON.stringify({
          ...data,
          page,
          consentPdn: data.consentPdn === 'yes',
          consentMarketing: data.consentMarketing === 'yes',
        }),
      })
      const j = await r.json().catch(() => ({}))
      const ok = r.ok && (j as { ok?: boolean }).ok
      // Цель — до setState: смена состояния размонтирует форму (ветка 'done'),
      // и отправка из неё уже не гарантирована.
      if (ok) trackGoal('demo_request', { page: goalPage() })
      else trackGoal('demo_request_failed', { page: goalPage(), reason: String(r.status) })
      setStatus(ok ? 'done' : 'failed')
    } catch {
      // Сеть не дошла до сервера — статуса нет вовсе.
      trackGoal('demo_request_failed', { page: goalPage(), reason: 'network' })
      setStatus('failed')
    }
  }

  if (status === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
        <span style={{ display: 'inline-flex', width: 52, height: 52, borderRadius: 14, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)' }}>
          <Icon name="check" size={26} strokeWidth={2.4} />
        </span>
        <h3 className="rr-h3" style={{ marginTop: 18 }}>Заявка отправлена.</h3>
        <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
          {doneText ?? 'Свяжемся в ближайшее время.'} Если срочно —{' '}
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>напишите Алексу в Telegram</a>.
        </p>
      </div>
    )
  }

  return (
    // Цели формы шлём из обработчиков, а не через data-ym-goal: глобальный
    // слушатель в LandingAnalytics ловит submit в фазе перехвата, то есть до
    // ответа сервера, и мерил бы попытку, называя её отправкой. Успех и провал
    // теперь разведены (demo_request / demo_request_failed), прежняя цель
    // `${page}_lead_submit` снята — решение владельца 15.08.2026.
    <form
      className="card"
      style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
      onSubmit={onSubmit}
      // Capture: focus не всплывает, а onInput нужен для автозаполнения и
      // вставки без предварительного фокуса. Оба ведут в один ref-флаг.
      onFocusCapture={onFirstTouch}
      onInputCapture={onFirstTouch}
    >
      <div>
        <label className="rr-label" htmlFor="lead-name">Имя *</label>
        <input className="rr-input" id="lead-name" name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Как к вам обращаться" />
      </div>
      <div>
        <label className="rr-label" htmlFor="lead-company">Компания или сайт</label>
        <input className="rr-input" id="lead-company" name="company" type="text" maxLength={200} autoComplete="organization" placeholder="Название или ссылка на продукт" />
      </div>
      <div>
        <label className="rr-label" htmlFor="lead-contact">Контакт *</label>
        <input className="rr-input" id="lead-contact" name="contact" type="text" required maxLength={200} placeholder="Telegram, телефон или email" />
      </div>
      <div>
        <label className="rr-label" htmlFor="lead-about">{aboutLabel}</label>
        <textarea className="rr-input" id="lead-about" name="about" maxLength={1000} placeholder={aboutPlaceholder} />
      </div>
      {/* honeypot — скрытое поле для ботов */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }} />

      <ConsentFields idPrefix="lead" />

      <Button variant="primary" size="lg" type="submit" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
        {status === 'sending' ? 'Отправляем…' : submitLabel}
      </Button>

      {status === 'failed' && (
        <div style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', borderRadius: 12, padding: '14px 16px' }}>
          <p className="rr-small" style={{ margin: 0, color: 'var(--ink)' }}>
            Не получилось отправить автоматически.{' '}
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 600 }}>Напишите Алексу в Telegram</a>{' '}
            или на{' '}
            <a href={`mailto:${PARTNERS_EMAIL}`} style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 600 }}>{PARTNERS_EMAIL}</a> — ответит лично.
          </p>
        </div>
      )}

      {/* Прежняя строка «отправляя заявку, вы соглашаетесь с политикой» убрана:
          согласие теперь выражается отметкой чекбокса, а не самим фактом
          отправки. Держать оба основания рядом — значит противоречить
          собственной Политике, которая требует активного действия. */}
    </form>
  )
}

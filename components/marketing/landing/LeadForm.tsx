'use client'

/**
 * LeadForm — лид-форма услуги (страница /packaging). Отправляет заявку в
 * POST /api/lead; при ненастроенном транспорте показывает честный фолбэк
 * «напишите в Telegram». Поля 16px и min-height 48px — мобильные тач-цели,
 * без зума на iOS. Honeypot-поле `website` отсекает ботов.
 */
import { useState, type FormEvent } from 'react'
import { Button, Icon } from '@/components/ds/primitives'

const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

type Status = 'idle' | 'sending' | 'done' | 'failed'

export function LeadForm({ page = 'packaging' }: { page?: string }) {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    setStatus('sending')
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, page }),
      })
      const j = await r.json().catch(() => ({}))
      setStatus(r.ok && (j as { ok?: boolean }).ok ? 'done' : 'failed')
    } catch {
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
          Свяжемся в ближайшее время. Если срочно —{' '}
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>напишите Алексу в Telegram</a>.
        </p>
      </div>
    )
  }

  return (
    <form className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={onSubmit}>
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
        <label className="rr-label" htmlFor="lead-about">Пара слов о продукте</label>
        <textarea className="rr-input" id="lead-about" name="about" maxLength={1000} placeholder="Что за продукт и кто его обычно рекомендует" />
      </div>
      {/* honeypot — скрытое поле для ботов */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }} />

      <Button variant="primary" size="lg" type="submit" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }} data-ym-goal="packaging_lead_submit">
        {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
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

      <p className="rr-small" style={{ color: 'var(--ink-4)', margin: 0, fontSize: 12.5 }}>
        Отправляя заявку, вы соглашаетесь с{' '}
        <a href="/ru/legal/privacy" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>политикой конфиденциальности</a>.
      </p>
    </form>
  )
}

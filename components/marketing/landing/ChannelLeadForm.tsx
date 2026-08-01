'use client'

/**
 * ChannelLeadForm — форма записи на разбор канала (страница /partner-channel).
 * Квалифицирующие поля из спеки оффера «Канал под ключ» (чек/LTV, динамика
 * выручки, наличие партнёрки) — предварительная самооценка для приоритизации
 * слотов, не отсев. Ответы упаковываются в поле `about` и уходят в
 * POST /api/lead (транспорт общий с LeadForm); page='partner-channel'.
 */
import { useState, type FormEvent } from 'react'
import { Button, Icon } from '@/components/ds/primitives'

const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

const PROGRAM_OPTIONS = [
  'Да, программа действует',
  'Ведём в таблицах и чатах',
  'Была, но не взлетела',
  'Нет — планируем запуск',
]

const CHECK_OPTIONS = [
  'До 50 тыс. ₽',
  '50–100 тыс. ₽',
  '100–300 тыс. ₽',
  'Более 300 тыс. ₽',
]

const REVENUE_OPTIONS = [
  'Снижается',
  'Стабильно',
  'Растёт до 30% в год',
  'Растёт на 30%+ в год',
  'Растёт два и более квартала подряд',
]

type Status = 'idle' | 'sending' | 'done' | 'failed'

export function ChannelLeadForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>
    setStatus('sending')
    const about = [
      data.role && `Роль: ${data.role}`,
      `Партнёрка: ${data.program}`,
      `Чек/LTV клиента за год: ${data.check}`,
      `Динамика выручки: ${data.revenue}`,
    ].filter(Boolean).join('\n')
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          contact: data.contact,
          about,
          website: data.website,
          page: 'partner-channel',
        }),
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
          Вернёмся с датой разбора. Если срочно —{' '}
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>напишите Алексу в Telegram</a>.
        </p>
      </div>
    )
  }

  return (
    // Цель Метрики — на самой <form>: LandingAnalytics ловит submit-событие
    // по data-ym-goal формы (с кнопок цели не снимаются).
    <form className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={onSubmit} data-ym-goal="pc_form_submit">
      <div>
        <label className="rr-label" htmlFor="pc-name">Имя *</label>
        <input className="rr-input" id="pc-name" name="name" type="text" required maxLength={120} autoComplete="name" placeholder="Как к вам обращаться" />
      </div>
      <div>
        <label className="rr-label" htmlFor="pc-company">Компания или сайт *</label>
        <input className="rr-input" id="pc-company" name="company" type="text" required maxLength={200} autoComplete="organization" placeholder="Название или ссылка на продукт" />
      </div>
      <div>
        <label className="rr-label" htmlFor="pc-role">Ваша роль</label>
        <input className="rr-input" id="pc-role" name="role" type="text" maxLength={120} autoComplete="organization-title" placeholder="Основатель, директор по маркетингу…" />
      </div>
      <div>
        <label className="rr-label" htmlFor="pc-program">Есть ли партнёрская программа? *</label>
        <select className="rr-input" id="pc-program" name="program" required defaultValue="">
          <option value="" disabled>Выберите вариант</option>
          {PROGRAM_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="rr-label" htmlFor="pc-check">Средний чек — или доход с клиента за первый год *</label>
        <select className="rr-input" id="pc-check" name="check" required defaultValue="">
          <option value="" disabled>Выберите вилку</option>
          {CHECK_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="rr-label" htmlFor="pc-revenue">Динамика выручки *</label>
        <select className="rr-input" id="pc-revenue" name="revenue" required defaultValue="">
          <option value="" disabled>Выберите вариант</option>
          {REVENUE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="rr-label" htmlFor="pc-contact">Телефон или Telegram *</label>
        <input className="rr-input" id="pc-contact" name="contact" type="text" required maxLength={200} placeholder="+7… или @username" />
      </div>
      {/* honeypot — скрытое поле для ботов */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }} />

      <Button variant="primary" size="lg" type="submit" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
        {status === 'sending' ? 'Отправляем…' : 'Записаться на разбор'}
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
        Ответы — предварительная самооценка для приоритизации слотов, не отсев. Отправляя заявку, вы соглашаетесь с{' '}
        <a href="/ru/legal/privacy" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>политикой конфиденциальности</a>.
      </p>
    </form>
  )
}

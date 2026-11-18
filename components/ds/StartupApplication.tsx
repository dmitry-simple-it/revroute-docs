'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Button, Icon } from './primitives'
import { ConsentFields } from '@/components/marketing/landing/ConsentFields'
import { CONTACT_EMAILS, CONTACT_MESSENGERS } from '@/lib/contacts'
import { trackGoal } from '@/lib/analytics/yandex-metrika'
import { STARTUP_OPTIONS, STARTUP_ROUTES, type StartupRoute } from '@/lib/startup-application'

const HASH_ROUTES: Record<string, StartupRoute> = {
  '#apply': 'direct',
  '#partner-application': 'partner',
  '#invitation': 'invitation',
  '#organization-application': 'organization',
}

const INTRO: Record<StartupRoute, string> = {
  direct: 'Расскажите о продукте и готовности к запуску. Инвестиции и большая партнёрская сеть не обязательны.',
  partner: 'Укажите организацию и подтвердите участие в её программе. Рекомендация помогает проверить компанию, но не гарантирует одобрение заявки.',
  invitation: 'Короткая форма для победителей конкурсов и отобранных компаний. Проверим, кому выдано приглашение, и согласуем условия — заполнять общую анкету не нужно.',
  organization: 'Расскажите о ваших участниках. До объявления программы согласуем условия, порядок подачи рекомендаций и объём помощи.',
}

function Field({ name, label, children, hint }: { name: string; label: string; children: ReactNode; hint?: string }) {
  return <div className="startup-field">
    <label className="rr-label" htmlFor={`startup-${name}`}>{label} *</label>
    {children}
    {hint && <p className="rr-small startup-field-hint" id={`startup-${name}-hint`}>{hint}</p>}
  </div>
}

function SelectField({ name, label, options, hint }: { name: string; label: string; options: Record<string, string>; hint?: string }) {
  return <Field name={name} label={label} hint={hint}>
    <select className="rr-input" id={`startup-${name}`} name={name} defaultValue="" required aria-describedby={hint ? `startup-${name}-hint` : undefined}>
      <option value="" disabled>Выберите вариант</option>
      {Object.entries(options).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
    </select>
  </Field>
}

export function StartupApplication() {
  const [route, setRoute] = useState<StartupRoute>('direct')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle')
  const [error, setError] = useState('')
  const sending = useRef(false)
  const started = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const result = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function selectHash(hash: string, navigate = false) {
      const next = HASH_ROUTES[hash]
      if (!next || sending.current) return
      setRoute(next)
      setStatus('idle')
      setError('')
      if (navigate) window.history.pushState(null, '', hash)
      window.requestAnimationFrame(() => {
        document.getElementById('apply')?.scrollIntoView()
        heading.current?.focus({ preventScroll: true })
      })
    }
    const fromHash = () => selectHash(window.location.hash)
    function fromLink(event: MouseEvent) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      const hash = anchor?.getAttribute('href')
      if (hash && HASH_ROUTES[hash]) {
        event.preventDefault()
        selectHash(hash, true)
      }
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    document.addEventListener('click', fromLink)
    return () => {
      window.removeEventListener('hashchange', fromHash)
      document.removeEventListener('click', fromLink)
    }
  }, [])

  useEffect(() => {
    if (status === 'done' || status === 'failed') result.current?.focus()
  }, [status])

  function onFirstTouch() {
    if (started.current) return
    started.current = true
    trackGoal('demo_form_start', { page: 'startups', route })
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current) return
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    // Whitespace is not an answer; native required does not cover this case.
    const blank = Array.from(event.currentTarget.elements).find((element) =>
      (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.required && !element.value.trim(),
    ) as HTMLInputElement | HTMLTextAreaElement | undefined
    if (blank) {
      blank.setCustomValidity('Заполните поле')
      blank.reportValidity()
      blank.focus()
      return
    }
    sending.current = true
    setStatus('sending')
    setError('')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: data.name, company: data.company, contact: data.contact, site: data.site,
          website: data.website, page: 'startups',
          startup: {
            route,
            ...(route === 'direct' || route === 'partner' ? {
              product: data.product, age: data.age, team: data.team,
              readiness: data.readiness, eligibility: data.eligibility, launchPlan: data.launchPlan,
            } : {}),
            ...(route === 'partner' || route === 'invitation' ? { organization: data.organization, evidence: data.evidence } : {}),
            ...(route === 'organization' ? { audience: data.audience, format: data.format } : {}),
          },
          consentPdn: data.consentPdn === 'yes',
          consentMarketing: data.consentMarketing === 'yes',
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (response.ok && payload.ok === true) {
        trackGoal('demo_request', { page: 'startups', route })
        setStatus('done')
      } else {
        trackGoal('demo_request_failed', { page: 'startups', route, reason: String(response.status) })
        setError(response.status === 429
          ? 'Слишком много попыток. Повторите через 10 минут или свяжитесь с нами напрямую.'
          : response.status === 400
            ? 'Проверьте заполненные поля и согласие на обработку персональных данных. Если ошибка повторится, свяжитесь с нами напрямую.'
            : 'Не удалось подтвердить отправку. Данные остались в форме — попробуйте ещё раз или свяжитесь с нами напрямую.')
        setStatus('failed')
      }
    } catch {
      trackGoal('demo_request_failed', { page: 'startups', route, reason: 'network' })
      setError('Не удалось подтвердить отправку. Данные остались в форме — попробуйте ещё раз или свяжитесь с нами напрямую.')
      setStatus('failed')
    } finally {
      window.clearTimeout(timeout)
      sending.current = false
    }
  }

  return <div className="startup-application">
    <div className="startup-anchor" id="apply" />
    <div className="startup-anchor" id="partner-application" />
    <div className="startup-anchor" id="invitation" />
    <div className="startup-anchor" id="organization-application" />
    <h3 className="rr-h3" ref={heading} tabIndex={-1}>Расскажите о себе</h3>
    {status === 'done' ? <div ref={result} className="startup-result" role="status" tabIndex={-1}>
      <span className="startup-icon"><Icon name="check" size={24} /></span>
      <h4 className="rr-h3">Заявка отправлена</h4>
      <p className="rr-body">{route === 'organization'
        ? 'Свяжемся с вами по электронной почте, чтобы обсудить участников и формат сотрудничества. Участие организации в программе ещё не подтверждено.'
        : 'Свяжемся с вами по электронной почте, проверим данные и обсудим следующий шаг. Специальные условия пока не согласованы и не подключены.'}</p>
      <Button variant="ghost" onClick={() => { setStatus('idle'); started.current = false }}>Подать ещё одну заявку</Button>
    </div> : <form onSubmit={onSubmit} onFocusCapture={onFirstTouch} onInputCapture={(event) => {
      onFirstTouch()
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) event.target.setCustomValidity('')
    }} aria-busy={status === 'sending'}>
      <fieldset disabled={status === 'sending'} className="startup-fields">
        <div>
          <label className="rr-label" htmlFor="startup-route">Вариант участия</label>
          <select id="startup-route" className="rr-input" value={route} onChange={(event) => {
            setRoute(event.target.value as StartupRoute)
            setStatus('idle')
            setError('')
          }} aria-describedby="startup-form-intro">
            {Object.entries(STARTUP_ROUTES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <p id="startup-form-intro" className="rr-small startup-form-intro">{INTRO[route]}</p>
        </div>
        <div className="startup-form-grid">
          <Field name="name" label={route === 'organization' ? 'Ваше имя' : 'Имя ответственного'}>
            <input className="rr-input" id="startup-name" name="name" autoComplete="name" required maxLength={120} />
          </Field>
          <Field name="contact" label="Электронная почта">
            <input className="rr-input" id="startup-contact" name="contact" type="email" autoComplete="email" required maxLength={200} />
          </Field>
          <Field name="company" label={route === 'organization' ? 'Название организации' : 'Компания или продукт'}>
            <input className="rr-input" id="startup-company" name="company" autoComplete="organization" required maxLength={200} />
          </Field>
          <Field name="site" label={route === 'organization' ? 'Сайт организации' : 'Сайт продукта'}>
            <input className="rr-input" id="startup-site" name="site" type="url" pattern="https?://.+" autoComplete="url" placeholder="https://" required maxLength={200} />
          </Field>
        </div>

        {(route === 'direct' || route === 'partner') && <>
          <Field name="product" label="Что продаёте и кому">
            <textarea className="rr-input" id="startup-product" name="product" placeholder="Опишите продукт, целевую аудиторию и успешные продажи" required maxLength={300} />
          </Field>
          <div className="startup-form-grid">
            <SelectField name="age" label="Возраст проекта" options={STARTUP_OPTIONS.age} />
            <SelectField name="team" label="Размер команды" options={STARTUP_OPTIONS.team} />
          </div>
          <SelectField name="eligibility" label="Соответствует ли компания условиям?" options={STARTUP_OPTIONS.eligibility}
            hint="Выручка за последние 12 месяцев — не более 100 млн ₽. Раньше не пользовались платными тарифами RevRoute и не получали специальные условия для стартапов. Бесплатный аккаунт подходит." />
          <SelectField name="readiness" label="Когда готовы начать внедрение?" options={STARTUP_OPTIONS.readiness} />
          <Field name="launchPlan" label="План запуска" hint="Кто мог бы рекомендовать продукт? За что будете платить партнёрам? Где учитываете заявки или сделки? Контакты партнёров не нужны.">
            <textarea className="rr-input" id="startup-launchPlan" name="launchPlan" required maxLength={450} aria-describedby="startup-launchPlan-hint" />
          </Field>
        </>}

        {(route === 'partner' || route === 'invitation') && <div className="startup-fields" key={route}>
          <Field name="organization" label={route === 'invitation' ? 'Кто вас пригласил или номинировал' : 'Организация и набор участников'}>
            <input className="rr-input" id="startup-organization" name="organization" required maxLength={150} />
          </Field>
          <Field name="evidence" label={route === 'invitation' ? 'Основание приглашения' : 'Как подтвердить участие'}
            hint="Название программы, результат отбора или общедоступная ссылка. Секретный код или персональную ссылку приглашения передадите менеджеру, когда он с вами свяжется.">
            <textarea className="rr-input" id="startup-evidence" name="evidence" required maxLength={route === 'partner' ? 250 : 350} aria-describedby="startup-evidence-hint" />
          </Field>
        </div>}

        {route === 'organization' && <>
          <SelectField name="format" label="Формат сотрудничества" options={STARTUP_OPTIONS.format} />
          <Field name="audience" label="Кому хотите предложить поддержку" hint="Опишите компании, набор или мероприятие. Как вы подтверждаете участие в программе или номинацию?">
            <textarea className="rr-input" id="startup-audience" name="audience" required maxLength={450} aria-describedby="startup-audience-hint" />
          </Field>
        </>}

        <div hidden aria-hidden="true"><input name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
        <ConsentFields idPrefix="startup" showMarketingNote={false} />
        <p className="rr-small startup-form-note">{route === 'organization'
          ? 'Заявка — начало обсуждения. Условия участия и формат сотрудничества согласуем отдельно.'
          : 'Подача заявки не активирует скидку. После проверки согласуем условия, даты и порядок дальнейшей оплаты. Заранее оплачивать подписку не нужно.'}</p>
        <Button type="submit" size="lg" style={{ width: '100%', whiteSpace: 'normal' }} disabled={status === 'sending'}>
          {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
        </Button>
      </fieldset>
      {status === 'failed' && <div ref={result} className="startup-error" role="alert" tabIndex={-1}><p className="rr-small">{error}</p><DirectContact /></div>}
    </form>}
    {status !== 'failed' && <DirectContact />}
  </div>
}

function DirectContact() {
  return <p className="rr-small startup-contact">Связаться с нами: <a href={CONTACT_MESSENGERS.telegram} target="_blank" rel="noopener noreferrer">Telegram</a> или <a href={`mailto:${CONTACT_EMAILS.partners}`}>{CONTACT_EMAILS.partners}</a>.</p>
}

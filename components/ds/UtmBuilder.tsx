'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Icon } from './primitives'
import { trackGoal } from '@/lib/analytics/yandex-metrika'
import { buildUtmUrl, EMPTY_UTM, missingUtmFields, parseDestination, readUtmParams, UTM_FIELDS, UTM_PRESETS, type UtmKey, type UtmParams } from '@/lib/tools/utm'
import './utm.css'

export function UtmBuilder() {
  const [url, setUrl] = useState('')
  const [params, setParams] = useState<UtmParams>({ ...EMPTY_UTM })
  const [touched, setTouched] = useState<Partial<Record<UtmKey, boolean>>>({})
  const [urlTouched, setUrlTouched] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const outputRef = useRef<HTMLTextAreaElement>(null)
  const parsed = useMemo(() => parseDestination(url), [url])
  const imported = useMemo(() => readUtmParams(url), [url])
  const result = useMemo(() => buildUtmUrl(url, params), [url, params])
  const missing = missingUtmFields(params)
  const ready = Boolean(parsed.url && missing.length === 0)
  const preset = UTM_PRESETS.find((item) => item.source === params.utm_source && item.medium === params.utm_medium)

  useEffect(() => { setCopyStatus('idle') }, [result])
  useEffect(() => {
    if (copyStatus !== 'copied') return
    const timer = setTimeout(() => setCopyStatus('idle'), 2500)
    return () => clearTimeout(timer)
  }, [copyStatus])

  function changeUrl(value: string) {
    setUrl(value)
    const existing = readUtmParams(value)
    if (existing.found) {
      setParams(existing.params)
      setTouched({})
    }
  }

  function example() {
    changeUrl('https://example.ru/catalog?category=books&utm_source=telegram&utm_medium=messenger&utm_campaign=autumn-sale-2026&utm_content=post-1#offers')
    setUrlTouched(false)
  }

  async function copy() {
    if (!ready) return
    try {
      await navigator.clipboard.writeText(result)
      setCopyStatus('copied')
      trackGoal('utm_link_copy', { preset: preset?.id ?? 'custom', has_content: Boolean(params.utm_content.trim()), has_term: Boolean(params.utm_term.trim()) })
    } catch {
      outputRef.current?.focus()
      outputRef.current?.select()
      setCopyStatus('error')
    }
  }

  const status = !parsed.url ? 'Добавьте ссылку на страницу' : missing.length ? 'Заполните источник, канал и кампанию' : 'Ссылка готова'

  return (
    <div className="rr-utm">
      <div className="rr-utm-editor">
        <div className="rr-utm-editor-head">
          <h2 className="rr-h3">Разметка ссылки</h2>
          <button type="button" className="rr-utm-text-button" onClick={example}>Заполнить пример</button>
        </div>

        <label className="rr-label" htmlFor="utm-destination">Ссылка на страницу</label>
        <input
          id="utm-destination" type="text" inputMode="url" autoComplete="url" spellCheck={false}
          className="rr-input" placeholder="example.ru/page" value={url}
          onChange={(event) => changeUrl(event.target.value)} onBlur={() => setUrlTouched(true)}
          aria-invalid={Boolean(parsed.error)} aria-describedby="utm-url-hint"
        />
        <p id="utm-url-hint" className={`rr-utm-hint${parsed.error ? ' rr-utm-error' : ''}`}>
          {parsed.error ?? (urlTouched && !url.trim() ? 'Добавьте страницу, на которую ведёте трафик.' : imported.found ? 'Метки из ссылки подставлены в поля — их можно изменить.' : parsed.addedHttps ? 'В готовую ссылку добавлен https://.' : 'Можно вставить адрес с параметрами и уже готовыми UTM-метками.')}
        </p>

        <fieldset className="rr-utm-presets">
          <legend className="rr-label">Где разместите ссылку?</legend>
          <div className="rr-utm-preset-list">
            {UTM_PRESETS.map((item) => (
              <button
                key={item.id} type="button" className="rr-utm-preset" aria-pressed={preset?.id === item.id}
                onClick={() => {
                  setParams((current) => ({ ...current, utm_source: item.source, utm_medium: item.medium }))
                  trackGoal('utm_preset_select', { preset: item.id })
                }}
              >{item.label}</button>
            ))}
          </div>
          <p className="rr-utm-hint">Шаблон заполнит источник и канал. Остальные поля сохранятся.</p>
        </fieldset>

        <div className="rr-utm-fields">
          {UTM_FIELDS.map((field) => {
            const error = touched[field.key] && field.required && !params[field.key].trim()
            return (
              <div key={field.key} className={field.key === 'utm_campaign' ? 'rr-utm-field-wide' : undefined}>
                <label htmlFor={field.key} className="rr-label">
                  {field.label}{!field.required && <span className="rr-utm-optional"> · необязательно</span>}
                  <span className="rr-utm-key">{field.key}</span>
                </label>
                <input
                  id={field.key} className="rr-input" placeholder={field.placeholder}
                  value={params[field.key]} autoComplete="off" spellCheck={false}
                  onChange={(event) => setParams((current) => ({ ...current, [field.key]: event.target.value }))}
                  onBlur={() => setTouched((current) => ({ ...current, [field.key]: true }))}
                  aria-required={field.required} aria-invalid={Boolean(error)} aria-describedby={`${field.key}-hint`}
                />
                <p id={`${field.key}-hint`} className={`rr-utm-hint${error ? ' rr-utm-error' : ''}`}>{error ? `Заполните поле «${field.label}».` : field.hint}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rr-utm-result">
        <div className="rr-utm-result-head">
          <span className="rr-utm-result-icon"><Icon name="link-2" size={21} /></span>
          <h2 className="rr-h3">Ваша ссылка</h2>
        </div>
        <p className={`rr-utm-status${ready ? ' rr-utm-status-ready' : ''}`} aria-live="polite">
          {ready && <Icon name="check" size={16} />}{status}
        </p>
        {result ? (
          <textarea ref={outputRef} className="rr-utm-output" aria-label="Готовая ссылка с UTM-метками" readOnly value={result} rows={6} spellCheck={false} />
        ) : (
          <div className="rr-utm-output rr-utm-output-empty">Здесь появится размеченная ссылка. Параметры страницы и якорь сохранятся.</div>
        )}
        <div className="rr-utm-copy">
          <Button onClick={copy} disabled={!ready} style={{ width: '100%', minHeight: 48 }} icon={copyStatus === 'copied' ? 'check' : undefined}>
            {copyStatus === 'copied' ? 'Скопировано' : 'Скопировать ссылку'}
          </Button>
          <p className="rr-utm-hint" role="status">
            {copyStatus === 'error' ? 'Не удалось скопировать. Ссылка выделена — скопируйте её вручную.' : copyStatus === 'copied' ? 'Вставьте ссылку в объявление, письмо или пост.' : 'Для копирования нужны ссылка и три основные метки.'}
          </p>
        </div>

        <dl className="rr-utm-summary">
          {UTM_FIELDS.filter((field) => field.required).map((field) => (
            <div key={field.key}><dt>{field.label}</dt><dd>{params[field.key].trim() || '—'}</dd></div>
          ))}
        </dl>
        {imported.duplicates && <p className="rr-utm-notice">Повторяющиеся UTM-метки заменены одним значением из соответствующего поля.</p>}
        <p className="rr-utm-hint rr-utm-result-note">Очистите поле, чтобы убрать эту метку. Регистр и язык значений сохраняются.</p>
        <div className="rr-utm-local"><Icon name="lock" size={15} />Сборка ссылки происходит в браузере</div>
      </div>
    </div>
  )
}

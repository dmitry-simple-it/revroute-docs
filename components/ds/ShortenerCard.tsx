'use client'

/**
 * RevRoute Design System v2 — ShortenerCard.
 * Бесплатный сокращатель без регистрации: POST /api/public/shorten
 * (server-side ключ, см. app/api/public/shorten/route.ts). Логика
 * перенесена из components/marketing/tools/ShortenerWidget.tsx,
 * разметка — на токенах DS v2 (использовать внутри .ds-scope).
 */
import { useState } from 'react'
import { trackGoal } from '@/lib/analytics/yandex-metrika'
import { useGoalOnVisible } from '@/lib/analytics/use-goal-on-visible'
import { useExperimentVariant } from '@/lib/analytics/experiment'
import { UpgradeStatTeaser } from './UpgradeStatTeaser'
import { Button, Icon } from './primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'

type Result = { shortUrl: string; longUrl: string }
type ApiError = { error: string; retryAfterSec?: number; message?: string }

const ERROR_MESSAGES: Record<string, string> = {
  url_required: 'Введите ссылку, которую нужно сократить.',
  invalid_url: 'Это не похоже на корректный URL — проверьте http(s) и домен.',
  rate_limited: 'Превышен лимит 10 запросов в час с одного IP. Попробуйте позже или зарегистрируйтесь.',
  provider_error: 'Сервис временно недоступен. Попробуйте ещё раз через минуту.',
  unsafe_url:
    'Этот адрес отклонён проверкой безопасности — сократить его нельзя. Если это ошибка, напишите на support@revroute.ru.',
  provider_unreachable: 'Не удалось связаться с сервисом. Проверьте соединение и попробуйте снова.',
  invalid_body: 'Не удалось обработать запрос.',
  not_configured: 'Сокращатель временно недоступен — администраторы уведомлены.',
}

export function ShortenerCard() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  /* A/B: 'a' — текстовая строка оффера, 'b' — скелетон статистики. */
  const variant = useExperimentVariant('tools_bridge_offer')

  /* tool_upgrade_view — по реальной видимости оффера в карточке результата
     (≥60% ≥1с), см. use-goal-on-visible.ts. */
  const offerViewRef = useGoalOnVisible(
    'tool_upgrade_view',
    { tool: 'shortener', trigger: 'result', variant },
    !!result,
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    setResult(null)
    setCopied(false)
    setLoading(true)
    try {
      const res = await fetch('/api/public/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = (await res.json()) as ApiError | Result
      if (!res.ok || 'error' in data) {
        const e = data as ApiError
        setError(ERROR_MESSAGES[e.error] ?? 'Не удалось сократить ссылку.')
        return
      }
      setResult(data as Result)
      // НЕ link_created: этот идентификатор занят продуктовой целью «Создание
      // ссылки» (ID 546770629) — создание ссылки в кабинете, звено воронки
      // «Активация». Лендинговый бесплатный сокращатель — отдельная цель
      // «Сокращатель: ссылка создана» (ID 595139270), иначе халявные сокращения
      // раздули бы метрику активации продукта.
      trackGoal('shortener_created')
    } catch {
      setError('Сеть недоступна. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  async function copyShort() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      // Пара к shortener_created — «Сокращатель: ссылка скопирована» (ID 595139699).
      trackGoal('shortener_copied')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* noop */
    }
  }

  return (
    <div className="card" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="rr-caption">Длинная ссылка</span>
          <input
            type="url"
            inputMode="url"
            placeholder="https://example.com/very/long/path?utm_source=…"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              // 16px и min-height 48px — конвенция мобильных полей (ds.css .rr-input):
              // при меньшем кегле iOS зумит страницу на фокусе, для рекламного
              // трафика /tools/krasivaya-ssylka это провал первого экрана.
              fontSize: 16,
              minHeight: 48,
              fontFamily: 'var(--font-sans)',
              color: 'var(--ink)',
              background: 'var(--bg-sunken)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              outline: 'none',
            }}
          />
        </label>
        <Button type="submit" variant="accent" size="lg" disabled={loading || !url} iconRight="arrow-right">
          {loading ? 'Сокращаем…' : 'Сократить'}
        </Button>
      </form>

      {error && (
        <div
          role="alert"
          className="rr-small"
          style={{
            marginTop: 16,
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid var(--line)',
            background: 'rgba(244, 63, 94, 0.06)',
            color: 'var(--ink)',
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            border: '1px solid var(--accent-line)',
            background: 'var(--accent-bg)',
          }}
        >
          <p className="rr-caption" style={{ margin: 0 }}>Готово</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              {result.shortUrl}
            </a>
            <Button type="button" variant="ghost" size="sm" onClick={copyShort} icon={copied ? 'check' : undefined}>
              {copied ? 'Скопировано' : 'Скопировать'}
            </Button>
          </div>
          <p className="rr-small" style={{ margin: '8px 0 0', color: 'var(--ink-3)', wordBreak: 'break-all' }}>
            ↳ {result.longUrl}
          </p>

          {/* Оффер — часть момента успеха, а не серая приписка про лимиты
              внизу карточки (там его читали как дисклеймер). Показ меряет
              tool_upgrade_view, клик — tool_signup_click {tool:'shortener'}.
              A/B: 'a' — текстовая строка, 'b' — скелетон статистики. */}
          {variant === 'a' ? (
            <div ref={offerViewRef} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--accent-line)' }}>
              <p className="rr-small" style={{ margin: 0, color: 'var(--ink-2)', flex: '1 1 260px' }}>
                Эта ссылка не считает переходы. В аккаунте — свой домен вида go.вашбренд.ru,
                статистика и редактирование адреса после публикации.
              </p>
              <Button
                variant="accent"
                size="sm"
                href={APP_REGISTER}
                iconRight="arrow-right"
                onClick={() => trackGoal('tool_signup_click', { tool: 'shortener', trigger: 'result', variant })}
              >
                Забрать в аккаунт
              </Button>
            </div>
          ) : (
            <div ref={offerViewRef}>
              <UpgradeStatTeaser
                title="Что покажет ссылка со статистикой"
                rows={[
                  { label: 'Переходы', barWidth: 56 },
                  { label: 'Источники', barWidth: 88 },
                  { label: 'География', barWidth: 40 },
                ]}
                note="Эта ссылка не считает переходы. В аккаунте — статистика, свой домен вида go.вашбренд.ru и редактирование адреса после публикации."
                ctaLabel="Включить статистику"
                ctaHref={APP_REGISTER}
                onCtaClick={() => trackGoal('tool_signup_click', { tool: 'shortener', trigger: 'result', variant })}
              />
            </div>
          )}
        </div>
      )}

      <p className="rr-small" style={{ margin: '16px 0 0', color: 'var(--ink-3)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <Icon name="info" size={15} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Лимит — 10 ссылок в час с одного IP. Нужны свой домен, статистика и редактирование?{' '}
          {/* tool_signup_click вместо landing_signup_click: иначе клики с
              инструментов неотделимы от остального лендинга (ТЗ моста, п. 3). */}
          <a
            href={APP_REGISTER}
            onClick={() => trackGoal('tool_signup_click', { tool: 'shortener', trigger: 'footnote' })}
            style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            Создайте аккаунт
          </a>{' '}
          — бесплатно.
        </span>
      </p>
    </div>
  )
}

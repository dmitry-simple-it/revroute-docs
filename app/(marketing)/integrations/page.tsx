import type { Metadata } from 'next'
import { integrations, categories, featuredSlugs } from '@/lib/integrations'
import { IntegrationsList } from './IntegrationsList'

export const metadata: Metadata = {
  title: 'Интеграции',
  description:
    'Подключайте ваши любимые инструменты к Revroute. Бесшовные интеграции с Stripe, Shopify, Zapier, Slack и другими сервисами.',
}

export default function IntegrationsPage() {
  const featured = featuredSlugs
    .map((s) => integrations.find((i) => i.slug === s)!)
    .filter(Boolean)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-30 pb-12 text-center md:pt-32">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[800px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(231,229,228,0.5) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <h1
            className="mb-5 text-center leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 64px)',
              fontWeight: 400,
              letterSpacing: '-1px',
            }}
          >
            Бесшовные интеграции
            <br />
            с{' '}
            <em
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #0c0a09 20%, #78716c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Revroute
            </em>
          </h1>
          <p className="mx-auto max-w-lg text-lg" style={{ color: 'var(--text-muted)' }}>
            Подключайте ваши любимые инструменты в несколько кликов.
          </p>
        </div>
      </section>

      {/* Client-side filtering + grid */}
      <IntegrationsList
        integrations={integrations}
        featured={featured}
        categories={categories}
      />

      {/* CTA */}
      <section
        className="relative overflow-hidden py-20 text-center md:py-24"
        style={{ background: 'var(--bg-dark)', color: '#fff' }}
      >
        <div
          className="pointer-events-none absolute -top-52 left-1/2 h-96 w-[800px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(120,113,108,0.3) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <h2
            className="relative mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Создайте интеграцию
            <br />
            <em className="italic">с Revroute</em>
          </h2>
          <p
            className="mx-auto mb-9 max-w-md text-lg"
            style={{ color: 'var(--text-dim)' }}
          >
            Используйте API и SDK для создания собственных интеграций и расширения
            возможностей платформы.
          </p>
          <div className="relative flex justify-center gap-3">
            <a
              href="https://app.revroute.ru/"
              className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold transition-all hover:-translate-y-px"
              style={{
                background: '#fff',
                color: 'var(--text)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              Начать бесплатно
            </a>
            <a
              href="/ru/docs"
              className="inline-flex items-center justify-center rounded-xl border px-8 py-3.5 text-base font-semibold transition-all hover:-translate-y-px"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              Документация API
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

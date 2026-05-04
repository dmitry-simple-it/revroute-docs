import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { integrations } from '@/lib/integrations'
import { IntegrationIcon, PopularCard } from '@/components/marketing/IntegrationCard'

export function generateStaticParams() {
  return integrations
    .filter((i) => !i.isComingSoon && !i.isGuide)
    .map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const integration = integrations.find((i) => i.slug === slug)
  if (!integration) return {}
  return {
    title: `${integration.name} — интеграция с Revroute`,
    description: integration.description,
    alternates: { canonical: `/integrations/${integration.slug}` },
  }
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const integration = integrations.find((i) => i.slug === slug)
  if (!integration || integration.isComingSoon || integration.isGuide) {
    notFound()
  }

  // Pick 6 popular integrations, excluding current
  const popular = integrations
    .filter((i) => !i.isComingSoon && !i.isGuide && i.slug !== slug)
    .slice(0, 6)

  return (
    <>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-22 md:pt-24">
        <Link
          href="/integrations"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--text)]"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Все интеграции
        </Link>
      </div>

      {/* Integration header */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <IntegrationIcon integration={integration} size="lg" />
            <div>
              <div className="text-[32px] font-extrabold tracking-tight">
                {integration.name}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {integration.categoryRu}
              </div>
            </div>
          </div>
          <a
            href="https://app.revroute.ru/"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-px"
            style={{
              background: 'var(--accent)',
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            Подключить к Revroute
          </a>
        </div>

        {/* Metadata */}
        <div
          className="mb-12 flex flex-wrap gap-8 border-y py-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex flex-col gap-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-dim)' }}
            >
              Разработчик
            </span>
            <span className="text-sm font-semibold">{integration.builtBy}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-dim)' }}
            >
              Категория
            </span>
            <span className="text-sm font-semibold">{integration.categoryRu}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-dim)' }}
            >
              Сайт
            </span>
            <a
              href={integration.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline underline-offset-2"
              style={{ color: 'var(--text)' }}
            >
              {integration.website}
            </a>
          </div>
        </div>
      </section>

      {/* Content: description + features */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-3xl">
          <p
            className="mb-12 text-lg leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {integration.detailedDescription || integration.description}
          </p>

          {integration.features && integration.features.length > 0 && (
            <>
              <h2
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: 400,
                }}
              >
                Возможности
              </h2>
              <div className="space-y-8">
                {integration.features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border p-6 transition-all duration-200 hover:shadow-sm"
                    style={{
                      background: 'var(--bg-white)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <h3 className="mb-2 text-base font-bold tracking-tight">
                      {f.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {f.text}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Popular integrations */}
      <section
        className="mx-auto max-w-7xl border-t px-6 py-16"
        style={{ borderColor: 'var(--border)' }}
      >
        <h2
          className="mb-8"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 400,
          }}
        >
          Популярные интеграции
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((i) => (
            <PopularCard key={i.slug} integration={i} />
          ))}
        </div>
      </section>

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

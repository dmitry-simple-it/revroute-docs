import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { customers } from '@/content/customers'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { InlineQuote } from '@/components/marketing/shared/TestimonialCard'

export function generateStaticParams() {
  return customers.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = customers.find((x) => x.slug === slug)
  if (!c) return { title: 'Клиент не найден' }
  return {
    title: `${c.company} — кейс клиента | Revroute`,
    description: c.summary,
    alternates: { canonical: `/customers/${c.slug}` },
  }
}

export default async function CustomerCasePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const c = customers.find((x) => x.slug === slug)
  if (!c) notFound()

  return (
    <>
      <section className="relative" style={{ padding: '120px 0 60px' }}>
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            top: '-200px',
            width: '1000px',
            height: '600px',
            background:
              'radial-gradient(ellipse at center, rgba(231, 229, 228, 0.6) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-[860px] px-6">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Все кейсы
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold text-white"
              style={{ background: c.logoColor }}
            >
              {c.logoInitial}
            </div>
            <div>
              <div
                className="text-[11px] font-semibold uppercase"
                style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
              >
                {c.industry}
              </div>
              <div className="text-xl font-bold">{c.company}</div>
            </div>
          </div>
          <h1
            className="mt-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.8px',
              lineHeight: 1.1,
            }}
          >
            {c.summary}
          </h1>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {c.hero}
          </p>
        </div>
      </section>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {c.stats.map((s) => (
              <div
                key={s.label}
                className="border p-6"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div className="text-2xl font-extrabold" style={{ letterSpacing: '-1px' }}>
                  {s.value}
                </div>
                <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 80px' }}>
        <div className="mx-auto max-w-[760px] px-6">
          {c.content.map((block, i) => (
            <div key={i} className="mb-12">
              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 400,
                  letterSpacing: '-0.3px',
                }}
              >
                {block.heading}
              </h2>
              {block.body.map((p, pi) => (
                <p
                  key={pi}
                  className="mb-4 text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <InlineQuote text={c.quote.text} name={c.quote.name} role={c.quote.role} />

      <PageCTA
        title={
          <>
            Станьте следующей
            <br />
            <em style={{ fontStyle: 'italic' }}>историей роста</em>
          </>
        }
        desc="Обсудим ваш сценарий и покажем Revroute на ваших данных за 30 минут."
      />
    </>
  )
}

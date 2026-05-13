import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { glossary, getGlossaryBySlug, type GlossaryBlock } from '@/content/glossary'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import {
  breadcrumbs,
  definedTerm,
  faqPage,
  type JsonLdGraph,
} from '@/lib/seo/schemas'

export function generateStaticParams() {
  return glossary.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const g = getGlossaryBySlug(slug)
  if (!g) return { title: 'Термин не найден' }
  return {
    title: `${g.metaTitle ?? g.title} | Глоссарий Revroute`,
    description: g.definition,
    alternates: { canonical: `/glossary/${g.slug}` },
    openGraph: { url: `/glossary/${g.slug}` },
  }
}

function renderBlock(block: GlossaryBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={i}
          className="mt-10 mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 400,
            letterSpacing: '-0.3px',
          }}
        >
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3
          key={i}
          className="mt-8 mb-3 text-xl font-bold"
          style={{ color: 'var(--text)' }}
        >
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul key={i} className="mb-6 flex flex-col gap-2">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="flex items-start gap-2 text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: 'var(--text-muted)' }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={i} className="mb-6 flex flex-col gap-3">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="flex items-start gap-3 text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: 'var(--accent)' }}
              >
                {j + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )
    default:
      return (
        <p
          key={i}
          className="mb-5 text-base leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {block.text}
        </p>
      )
  }
}

export default async function GlossaryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const g = getGlossaryBySlug(slug)
  if (!g) notFound()

  const related = (g.relatedTerms ?? [])
    .map((s) => getGlossaryBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x)

  const schemaBlocks: JsonLdGraph[] = [
    breadcrumbs([
      { name: 'Главная', url: '/' },
      { name: 'Глоссарий', url: '/glossary' },
      { name: g.title },
    ]),
    definedTerm({
      name: g.title,
      url: `/glossary/${g.slug}`,
      description: g.definition,
      inDefinedTermSet: {
        name: 'Глоссарий Revroute — партнёрский маркетинг и атрибуция',
        url: '/glossary',
      },
    }),
  ]
  if (g.faq && g.faq.length) schemaBlocks.push(faqPage(g.faq))

  return (
    <>
      <JsonLd data={schemaBlocks} />

      <section className="relative" style={{ padding: '120px 0 40px' }}>
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
        <div className="relative mx-auto max-w-[760px] px-6">
          <Link
            href="/glossary"
            className="inline-flex items-center gap-1.5 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Все термины
          </Link>
          <div
            className="mt-6 text-[11px] font-semibold uppercase"
            style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
          >
            {g.category}
          </div>
          <h1
            className="mt-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}
          >
            {g.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {g.definition}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-[720px] px-6 py-12">
        {g.content.map((block, i) => renderBlock(block, i))}

        {g.faq && g.faq.length > 0 && (
          <section className="mt-16">
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 400,
                letterSpacing: '-0.3px',
              }}
            >
              Частые вопросы
            </h2>
            <div className="flex flex-col gap-3">
              {g.faq.map((item, i) => (
                <details
                  key={i}
                  className="border"
                  style={{
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 20px',
                  }}
                >
                  <summary
                    className="cursor-pointer text-base font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.q}
                  </summary>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 400,
                letterSpacing: '-0.3px',
              }}
            >
              Смежные термины
            </h2>
            <div className="flex flex-col gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}`}
                  className="block border p-5 no-underline transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div className="text-base font-bold" style={{ color: 'var(--text)' }}>
                    {r.title}
                  </div>
                  <div className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {r.definition}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {g.relatedPages && g.relatedPages.length > 0 && (
          <section className="mt-16">
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 400,
                letterSpacing: '-0.3px',
              }}
            >
              Продолжить
            </h2>
            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
              {g.relatedPages.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="block border p-5 no-underline transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    {p.label}
                  </div>
                  <div className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {p.desc}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <PageCTA
        title={
          <>
            Запустите свою <em style={{ fontStyle: 'italic' }}>партнёрку</em>
          </>
        }
        desc="Российская PRM-платформа с поддержкой самозанятых, СБП-выплатами и атрибуцией от клика до MRR."
        primary={{ href: '/partners', label: 'Revroute Partners' }}
        secondary={{ href: '/pricing', label: 'Тарифы' }}
      />
    </>
  )
}

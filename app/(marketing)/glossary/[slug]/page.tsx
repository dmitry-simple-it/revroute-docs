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
    case 'table':
      return (
        <figure key={i} className="my-8 overflow-x-auto">
          <table
            className="w-full border-collapse text-sm"
            style={{
              background: 'var(--bg-white)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}
          >
            {block.caption && (
              <caption
                className="caption-bottom mt-3 text-xs"
                style={{ color: 'var(--text-dim)' }}
              >
                {block.caption}
              </caption>
            )}
            <thead>
              <tr style={{ background: 'var(--bg-muted)' }}>
                {block.headers.map((h, j) => (
                  <th
                    key={j}
                    className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase"
                    style={{
                      color: 'var(--text-dim)',
                      letterSpacing: '0.06em',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, j) => (
                <tr key={j}>
                  {row.map((cell, k) => (
                    <td
                      key={k}
                      className="px-3 py-2.5 align-top"
                      style={{
                        borderBottom:
                          j === block.rows.length - 1 ? 'none' : '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )
    case 'attribution':
      return (
        <figure key={i} className="my-8 overflow-x-auto">
          <div
            className="border p-5"
            style={{
              background: 'var(--bg-white)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div
              className="mb-4 grid items-center gap-2 text-[11px] font-semibold uppercase"
              style={{
                gridTemplateColumns: `170px repeat(${block.touchpoints.length}, 1fr)`,
                color: 'var(--text-dim)',
                letterSpacing: '0.06em',
              }}
            >
              <div>Модель</div>
              {block.touchpoints.map((tp, j) => (
                <div key={j} className="text-center">{tp}</div>
              ))}
            </div>
            {block.models.map((m, j) => (
              <div
                key={j}
                className="grid items-center gap-2 py-2"
                style={{
                  gridTemplateColumns: `170px repeat(${block.touchpoints.length}, 1fr)`,
                  borderTop: j === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {m.name}
                </div>
                {m.weights.map((w, k) => (
                  <div key={k} className="flex flex-col items-center justify-center gap-1">
                    <div className="h-12 w-full overflow-hidden rounded" style={{ background: 'var(--bg-muted)' }}>
                      <div
                        className="h-full"
                        style={{
                          width: '100%',
                          height: `${Math.max(4, w * 100)}%`,
                          marginTop: `${Math.max(0, (1 - w) * 100)}%`,
                          background:
                            w >= 0.4
                              ? 'var(--accent)'
                              : w >= 0.2
                              ? 'var(--purple)'
                              : 'var(--text-muted)',
                        }}
                      />
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {Math.round(w * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {block.note && (
            <figcaption className="mt-3 text-xs" style={{ color: 'var(--text-dim)' }}>
              {block.note}
            </figcaption>
          )}
        </figure>
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

        {g.sources && g.sources.length > 0 && (
          <section className="mt-16">
            <h2
              className="mb-4 text-lg font-bold"
              style={{ color: 'var(--text)' }}
            >
              Источники
            </h2>
            <ul className="flex flex-col gap-2">
              {g.sources.map((s, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    style={{ color: 'var(--text)' }}
                  >
                    {s.label}
                  </a>
                  {s.note ? <span> — {s.note}</span> : null}
                </li>
              ))}
            </ul>
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
          g.cta ? (
            g.cta.title
          ) : (
            <>
              Запустите свою <em style={{ fontStyle: 'italic' }}>партнёрку</em>
            </>
          )
        }
        desc={
          g.cta
            ? g.cta.desc
            : 'Российская PRM-платформа с поддержкой самозанятых, СБП-выплатами и атрибуцией от клика до MRR.'
        }
        primary={g.cta?.primary ?? { href: '/partners', label: 'Revroute Partners' }}
        secondary={g.cta?.secondary ?? { href: '/pricing', label: 'Тарифы' }}
      />
    </>
  )
}

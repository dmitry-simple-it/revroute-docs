import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { FaqList } from '@/components/ds/FaqList'
import { Eyebrow, Icon } from '@/components/ds/primitives'
import { glossary, getGlossaryBySlug, type GlossaryBlock } from '@/content/glossary'
import { ArticleReadTracker } from '@/components/analytics/ArticleReadTracker'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import {
  breadcrumbs,
  definedTerm,
  faqPage,
  type JsonLdGraph,
} from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

/** Ширина колонки чтения (проза, FAQ) и колонки карточных дек. */
const READ = 780
const DECK = 980

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
    // absolute: metaTitle терминов уже оптимизирован под выдачу, добавление
    // « | Revroute» или суффикса шаблона уводило заголовок за 100 символов.
    // Объект в `title` допустим только здесь: каталог `[slug]` динамический,
    // Nextra его не глобит в page map (см. scripts/check-app-metadata.mjs).
    title: { absolute: g.metaTitle ?? g.title },
    description: g.definition,
    alternates: { canonical: `/glossary/${g.slug}` },
    openGraph: og(`/glossary/${g.slug}`),
  }
}

const linkStyle = { color: 'var(--accent-strong)', textDecoration: 'underline', textUnderlineOffset: 3 } as const

/** Вес касания → цвет столбика: акцент / светлый акцент / нейтраль. */
function weightColor(w: number): string {
  if (w >= 0.4) return 'var(--accent)'
  if (w >= 0.2) return 'var(--accent-soft)'
  return 'var(--line-strong)'
}

function renderBlock(block: GlossaryBlock, i: number) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={i} className="rr-h2" style={{ marginTop: 52 }}>
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={i} className="rr-h3" style={{ marginTop: 34 }}>
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul
          key={i}
          style={{ listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {block.items.map((item, j) => (
            <li key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span
                aria-hidden
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 10 }}
              />
              <span className="rr-body">{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol
          key={i}
          style={{ listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {block.items.map((item, j) => (
            <li key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span
                style={{
                  display: 'inline-flex', width: 24, height: 24, borderRadius: 8,
                  background: 'var(--accent-bg)', border: '1px solid var(--accent-line)',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)',
                  fontSize: 12.5, fontWeight: 600, flexShrink: 0, marginTop: 2,
                }}
              >
                {j + 1}
              </span>
              <span className="rr-body">{item}</span>
            </li>
          ))}
        </ol>
      )
    case 'table':
      return (
        <figure key={i} style={{ margin: '32px 0 0' }}>
          <div
            style={{
              overflowX: 'auto', background: '#fff', border: '1px solid var(--line)',
              borderRadius: 18, boxShadow: 'var(--shadow-md)',
            }}
          >
            <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
              <thead>
                <tr style={{ background: '#fcfcfc' }}>
                  {block.headers.map((h, j) => (
                    <th
                      key={j}
                      className="rr-caption"
                      style={{ textAlign: 'left', padding: '14px 18px', borderBottom: '1px solid var(--line)', fontWeight: 400, whiteSpace: 'nowrap' }}
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
                        className="rr-small"
                        style={{
                          padding: '14px 18px', verticalAlign: 'top',
                          borderBottom: j === block.rows.length - 1 ? 'none' : '1px solid var(--line-2)',
                          color: k === 0 ? 'var(--ink)' : 'var(--ink-2)',
                          fontWeight: k === 0 ? 500 : 400,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'attribution': {
      const cols = `minmax(140px, 168px) repeat(${block.touchpoints.length}, minmax(44px, 1fr))`
      return (
        <figure key={i} style={{ margin: '32px 0 0' }}>
          <div className="card-flat" style={{ overflowX: 'auto', padding: 22 }}>
            <div style={{ minWidth: 520 }}>
              <div
                style={{
                  display: 'grid', gridTemplateColumns: cols, gap: 10, alignItems: 'end',
                  paddingBottom: 12, borderBottom: '1px solid var(--line)',
                }}
              >
                <div className="rr-caption">Модель</div>
                {block.touchpoints.map((tp, j) => (
                  <div key={j} className="rr-caption" style={{ textAlign: 'center' }}>{tp}</div>
                ))}
              </div>
              {block.models.map((m, j) => (
                <div
                  key={j}
                  style={{
                    display: 'grid', gridTemplateColumns: cols, gap: 10, alignItems: 'end',
                    paddingTop: 14, marginTop: 14,
                    borderTop: j === 0 ? 'none' : '1px solid var(--line-2)',
                  }}
                >
                  <div className="rr-small" style={{ color: 'var(--ink)', fontWeight: 500 }}>{m.name}</div>
                  {m.weights.map((w, k) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          width: '100%', height: 48, borderRadius: 6, background: 'var(--bg-sunken)',
                          border: '1px solid var(--line-2)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
                        }}
                      >
                        <div style={{ width: '100%', height: `${Math.max(4, w * 100)}%`, background: weightColor(w) }} />
                      </div>
                      <span className="rr-caption" style={{ fontSize: 11 }}>{Math.round(w * 100)}%</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {block.note && (
            <figcaption className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 12 }}>
              {block.note}
            </figcaption>
          )}
        </figure>
      )
    }
    default:
      return (
        <p key={i} className="rr-body" style={{ marginTop: 20 }}>
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
        name: 'Глоссарий RevRoute — партнёрский маркетинг и атрибуция',
        url: '/glossary',
      },
    }),
  ]
  // FAQPage собирается из того же g.faq, что рендерит FaqList: тексты в разметке
  // физически не могут разойтись с видимыми (ответы — plain-строки, без JSX).
  if (g.faq && g.faq.length) schemaBlocks.push(faqPage(g.faq))

  return (
    <>
      <JsonLd data={schemaBlocks} />
      <ArticleReadTracker slug={g.slug} type="glossary" />

      <article>
        {/* ── 1. Крошки, категория, H1 и определение ── */}
        <section className="ds-container" style={{ paddingTop: 64 }}>
          <div style={{ maxWidth: READ, marginInline: 'auto' }}>
            <nav aria-label="Хлебные крошки" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <a href="/" className="rr-small" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Главная</a>
              <Icon name="chevron-right" size={14} color="var(--ink-4)" />
              <a href="/glossary" className="rr-small" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>Глоссарий</a>
              <Icon name="chevron-right" size={14} color="var(--ink-4)" />
              <span className="rr-small" style={{ color: 'var(--ink-3)' }}>{g.title}</span>
            </nav>
            <div style={{ marginTop: 24 }}>
              <Eyebrow>{g.category}</Eyebrow>
            </div>
            <h1 className="rr-h1" style={{ marginTop: 14 }}>{g.title}</h1>
            <div
              className="card-flat"
              style={{ marginTop: 26, background: 'var(--accent-bg)', borderColor: 'var(--accent-line)' }}
            >
              <p className="rr-caption" style={{ margin: 0 }}>Определение</p>
              <p className="rr-lead" style={{ marginTop: 10, color: 'var(--ink)' }}>{g.definition}</p>
            </div>
          </div>
        </section>

        {/* ── 2. Тело статьи ── */}
        <section className="ds-container" style={{ paddingTop: 8 }}>
          <div style={{ maxWidth: READ, marginInline: 'auto' }}>
            {g.content.map((block, i) => renderBlock(block, i))}
          </div>
        </section>

        {/* ── 3. FAQ ── */}
        {g.faq && g.faq.length > 0 && (
          <section className="ds-container" style={{ paddingTop: 72 }}>
            <div style={{ maxWidth: READ, marginInline: 'auto' }}>
              <Eyebrow>Вопросы</Eyebrow>
              <h2 className="rr-h2" style={{ marginTop: 14, marginBottom: 26 }}>Частые вопросы</h2>
              <FaqList items={g.faq.map((f) => ({ q: f.q, a: f.a }))} />
            </div>
          </section>
        )}

        {/* ── 4. Смежные термины ── */}
        {related.length > 0 && (
          <section className="ds-container" style={{ paddingTop: 72 }}>
            <div style={{ maxWidth: DECK, marginInline: 'auto' }}>
              <Eyebrow>Глоссарий</Eyebrow>
              <h2 className="rr-h2" style={{ marginTop: 14, marginBottom: 26 }}>Смежные термины</h2>
              <div className="ds-grid-3">
                {related.map((r) => (
                  <a
                    key={r.slug}
                    href={`/glossary/${r.slug}`}
                    className="card-flat"
                    style={{ display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3 className="rr-h3">{r.title}</h3>
                    <p className="rr-small" style={{ color: 'var(--ink-3)', margin: 0 }}>{r.definition}</p>
                    <span
                      className="rr-small"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 14, color: 'var(--accent-strong)', fontWeight: 500 }}
                    >
                      Открыть статью
                      <Icon name="arrow-right" size={16} color="var(--accent-strong)" strokeWidth={2} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 5. Источники ── */}
        {g.sources && g.sources.length > 0 && (
          <section className="ds-container" style={{ paddingTop: 64 }}>
            <div style={{ maxWidth: READ, marginInline: 'auto' }}>
              <h2 className="rr-h3">Источники</h2>
              <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {g.sources.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Icon name="file-text" size={17} color="var(--ink-4)" style={{ marginTop: 3 }} />
                    <span className="rr-small">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{s.label}</a>
                      {s.note ? <span style={{ color: 'var(--ink-3)' }}> — {s.note}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── 6. Продолжить ── */}
        {g.relatedPages && g.relatedPages.length > 0 && (
          <section className="ds-container" style={{ paddingTop: 72 }}>
            <div style={{ maxWidth: DECK, marginInline: 'auto' }}>
              <Eyebrow>По теме</Eyebrow>
              <h2 className="rr-h2" style={{ marginTop: 14, marginBottom: 26 }}>Продолжить</h2>
              <div className="ds-grid-3">
                {g.relatedPages.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    className="card-flat"
                    style={{ display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', color: 'inherit' }}
                  >
                    <h3 className="rr-h3">{p.label}</h3>
                    <p className="rr-small" style={{ color: 'var(--ink-3)', margin: 0 }}>{p.desc}</p>
                    <span
                      className="rr-small"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 14, color: 'var(--accent-strong)', fontWeight: 500 }}
                    >
                      Перейти
                      <Icon name="arrow-right" size={16} color="var(--accent-strong)" strokeWidth={2} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* ── 7. Финальный CTA. Контекстный из content/glossary.ts; fallback —
             /partners (аффилиатская витрина), как описано в самом файле данных. ── */}
      <section className="ds-container" style={{ paddingTop: 80, paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum"
          title={g.cta ? g.cta.title : 'Запустите свою партнёрку.'}
          body={
            g.cta
              ? g.cta.desc
              : 'Российская PRM-платформа с поддержкой самозанятых, СБП-выплатами и атрибуцией от клика до MRR.'
          }
          primary={g.cta?.primary ?? { href: '/partners', label: 'RevRoute Partners' }}
          secondary={g.cta?.secondary ?? { href: '/pricing', label: 'Тарифы' }}
        />
      </section>
    </>
  )
}

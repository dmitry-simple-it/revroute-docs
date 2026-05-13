import type { Metadata } from 'next'
import Link from 'next/link'
import { glossary } from '@/content/glossary'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, itemList } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Глоссарий — термины партнёрского маркетинга и атрибуции',
  description:
    'Краткие и точные определения ключевых терминов партнёрского маркетинга, атрибуции и PRM-систем: что такое PRM, как выбрать платформу, виды партнёрских программ и модели атрибуции.',
  alternates: { canonical: '/glossary' },
  openGraph: { url: '/glossary' },
}

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) => a.title.localeCompare(b.title, 'ru'))

  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Глоссарий' },
          ]),
          itemList({
            name: 'Глоссарий партнёрского маркетинга и атрибуции',
            ordered: false,
            items: sorted.map((g) => ({
              name: g.title,
              url: `/glossary/${g.slug}`,
              description: g.definition,
            })),
          }),
        ]}
      />

      <PageHero
        eyebrow="Глоссарий"
        eyebrowColor="purple"
        title={
          <>
            Термины <em style={{ fontStyle: 'italic' }}>партнёрского маркетинга</em>
          </>
        }
        desc="Точные определения понятий PRM, атрибуции, партнёрских программ и реферального маркетинга. Без воды — короткое определение в первой строке и детальное объяснение ниже."
      />

      <section style={{ padding: '20px 0 100px' }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {sorted.map((g) => (
              <Link
                key={g.slug}
                href={`/glossary/${g.slug}`}
                className="group block rounded-2xl border p-7 no-underline transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  className="mb-3 text-[11px] font-semibold uppercase"
                  style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
                >
                  {g.category}
                </div>
                <h2 className="mb-3 text-xl font-bold leading-snug" style={{ letterSpacing: '-0.3px' }}>
                  {g.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {g.definition}
                </p>
                <div
                  className="mt-5 flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2"
                  style={{ color: 'var(--purple)' }}
                >
                  Открыть статью
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

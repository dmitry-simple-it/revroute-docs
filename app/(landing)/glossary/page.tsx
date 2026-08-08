import type { Metadata } from 'next'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Chip } from '@/components/ds/primitives'
import { glossary } from '@/content/glossary'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, itemList } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

/**
 * ВНИМАНИЕ: `title` здесь обязан быть СТРОКОЙ.
 * Nextra строит page map по всем статическим `app/**​/page.tsx` и кладёт
 * `metadata.title` в page map как есть, а тема рендерит это React-ребёнком.
 * Объект (`{ absolute }`, `{ default, template }`) роняет весь раздел
 * документации: «Objects are not valid as a React child». Страж — на prebuild:
 * `node scripts/check-app-metadata.mjs`.
 */
export const metadata: Metadata = {
  title: 'Глоссарий — партнёрский маркетинг и атрибуция',
  description:
    'Термины партнёрского маркетинга, атрибуции и PRM-систем простыми словами: что такое PRM, как выбрать платформу, виды партнёрских программ и модели атрибуции.',
  alternates: { canonical: '/glossary' },
  openGraph: og('/glossary'),
}

export default function GlossaryPage() {
  /**
   * Единственный источник карточек и ItemList: имя в разметке физически не может
   * разойтись с видимым заголовком карточки, описание — с видимым определением.
   * Порядок — по алфавиту (ru), как и было в легаси-версии страницы.
   */
  const sorted = [...glossary].sort((a, b) => a.title.localeCompare(b.title, 'ru'))
  /** Рубрики для чипов — считаются по данным, а не вписаны руками. */
  const categories = [...new Set(glossary.map((g) => g.category))]

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

      {/* ── 1. Заголовок раздела ── */}
      <section className="ds-container" style={{ paddingTop: 72, paddingBottom: 8 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Глоссарий</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 16 }}>Термины партнёрского маркетинга</h1>
          <p className="rr-lead" style={{ marginTop: 18, marginInline: 'auto', maxWidth: '54ch' }}>
            Точные определения понятий PRM, атрибуции, партнёрских программ
            и&nbsp;реферального маркетинга. Без&nbsp;воды — короткое определение в&nbsp;первой
            строке и&nbsp;детальное объяснение ниже.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          {categories.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </section>

      {/* ── 2. Карточки терминов ── */}
      <section className="ds-band ds-container">
        <div className="ds-grid-2">
          {sorted.map((g) => (
            <a
              key={g.slug}
              href={`/glossary/${g.slug}`}
              className="card-flat"
              style={{ display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', color: 'inherit' }}
            >
              <p className="rr-caption" style={{ margin: 0 }}>{g.category}</p>
              {/*
                Уровень h2, а не h3: карточки — единственное содержимое своей секции,
                над ними нет заголовка-секции, поэтому h3 давал скачок h1 → h3.
                Размер держим классом rr-h3 (тот же приём — /tools, /solutions).
              */}
              <h2 className="rr-h3" style={{ marginTop: 4 }}>{g.title}</h2>
              <p className="rr-small" style={{ color: 'var(--ink-3)', margin: 0 }}>{g.definition}</p>
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
      </section>

      {/* ── 3. Финальный CTA ── */}
      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum"
          title="Запустите свою партнёрку."
          body="Российская PRM-платформа с поддержкой самозанятых, СБП-выплатами и атрибуцией от клика до MRR."
          primary={{ label: 'Платформа PRM', href: '/prm' }}
          secondary={{ label: 'Тарифы', href: '/pricing' }}
        />
      </section>
    </>
  )
}

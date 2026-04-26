import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compares } from '@/content/compare'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { ComparisonTable } from '@/components/marketing/shared/ComparisonTable'

export function generateStaticParams() {
  return compares.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = compares.find((x) => x.slug === slug)
  if (!c) return { title: 'Сравнение не найдено' }
  return {
    title: `Revroute vs ${c.competitor} — сравнение возможностей`,
    description: c.summary,
    alternates: { canonical: `/compare/${c.slug}` },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const c = compares.find((x) => x.slug === slug)
  if (!c) notFound()

  const tagParts = c.tagline.split(/\s[—–-]\s/)
  const titleLead = tagParts[0]?.trim() ?? c.tagline
  const titleAccent = tagParts.length > 1 ? tagParts.slice(1).join(' — ').trim() : ''

  return (
    <>
      <PageHero
        eyebrow={`Revroute vs ${c.competitor}`}
        eyebrowColor="purple"
        title={
          titleAccent ? (
            <>
              {titleLead}
              <br />
              <em style={{ fontStyle: 'italic' }}>{titleAccent}</em>
            </>
          ) : (
            c.tagline
          )
        }
        desc={c.heroDesc ?? c.description}
        actions={
          <>
            <PrimaryButton href="https://app.revroute.ru/">Начать бесплатно</PrimaryButton>
            <SecondaryButton href="/contact/support">Обсудить миграцию</SecondaryButton>
          </>
        }
      />

      <section style={{ padding: '40px 0 80px' }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-10 text-center">
            <SectionHeading align="center">
              Сравнение <em style={{ fontStyle: 'italic' }}>возможностей</em>
            </SectionHeading>
            <p className="mx-auto mt-6 max-w-[640px] text-base" style={{ color: 'var(--text-muted)' }}>
              Мы собрали честное сравнение по ключевым возможностям. Данные актуальны на апрель 2026.
            </p>
          </div>
          <ComparisonTable competitor={c.competitor} rows={c.rows} />
        </div>
      </section>

      {c.postTableTakeaways && c.postTableTakeaways.length > 0 && (
        <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-10 text-center">
              <Eyebrow color="purple">Итог сравнения</Eyebrow>
              <SectionHeading className="mt-5" align="center">
                Кратко <em style={{ fontStyle: 'italic' }}>по сути</em>
              </SectionHeading>
              <SectionDesc align="center" className="mt-6" maxWidth={560}>
                Четыре тезиса вместо длинного абзаца: что закрывает каждый сервис и кому что ближе.
              </SectionDesc>
            </div>
            <FeatureGrid cards={c.postTableTakeaways} cols={2} />
          </div>
        </section>
      )}

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Почему Revroute</Eyebrow>
            <SectionHeading className="mt-5">
              Три причины <em style={{ fontStyle: 'italic' }}>выбрать нас</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Сильные стороны, которые реально отличают Revroute от {c.competitor}.
            </SectionDesc>
          </div>
          <FeatureGrid cards={c.why} cols={3} />
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[760px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Миграция</Eyebrow>
            <SectionHeading className="mt-5">
              Переезд с {c.competitor} —<br />
              <em style={{ fontStyle: 'italic' }}>без простоя</em>
            </SectionHeading>
          </div>
          <ol className="flex flex-col gap-4">
            {c.migrationSteps.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-4 border p-5"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 text-base" style={{ color: 'var(--text-secondary)' }}>
                  {s}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <a
              href="/contact/support"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              Запросить помощь с миграцией
            </a>
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Переходите с {c.competitor}
            <br />
            на <em style={{ fontStyle: 'italic' }}>Revroute</em>
          </>
        }
        desc="Расскажем, как перевезти ваши ссылки, партнёров и атрибуцию без потерь."
      />
    </>
  )
}

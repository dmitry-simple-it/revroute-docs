import type { ReactNode } from 'react'
import { PageHero, PrimaryButton, SecondaryButton } from './PageHero'
import { PageCTA } from './PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from './Typography'
import { FeatureGrid, type Feature } from './FeatureGrid'
import { InlineQuote } from './TestimonialCard'
import { StatsRow, type Stat } from './StatsRow'

export type SolutionConfig = {
  eyebrow: string
  eyebrowColor?: 'blue' | 'green' | 'orange' | 'purple'
  title: ReactNode
  desc: string
  primary?: { href: string; label: string }
  secondary?: { href: string; label: string }
  stats?: Stat[]
  sections: {
    eyebrow: string
    eyebrowColor?: 'blue' | 'green' | 'orange' | 'purple'
    title: ReactNode
    desc: string
    features: Feature[]
  }[]
  quote?: { text: string; name: string; role: string }
  relatedLinks?: { href: string; label: string; desc: string }[]
}

export function SolutionPage({ cfg }: { cfg: SolutionConfig }) {
  return (
    <>
      <PageHero
        eyebrow={cfg.eyebrow}
        eyebrowColor={cfg.eyebrowColor}
        title={cfg.title}
        desc={cfg.desc}
        actions={
          <>
            <PrimaryButton href={cfg.primary?.href ?? 'https://app.revroute.ru/'}>
              {cfg.primary?.label ?? 'Начать бесплатно'}
            </PrimaryButton>
            <SecondaryButton href={cfg.secondary?.href ?? '/contact/support'}>
              {cfg.secondary?.label ?? 'Запросить демо'}
            </SecondaryButton>
          </>
        }
      />

      {cfg.stats && (
        <section style={{ padding: '20px 0 80px' }}>
          <div className="mx-auto max-w-[1200px] px-6">
            <StatsRow stats={cfg.stats} />
          </div>
        </section>
      )}

      {cfg.sections.map((s, i) => (
        <section
          key={i}
          className="border-t"
          style={{ padding: '80px 0', borderColor: 'var(--border)' }}
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mb-10">
              <Eyebrow color={s.eyebrowColor}>{s.eyebrow}</Eyebrow>
              <SectionHeading className="mt-5">{s.title}</SectionHeading>
              <SectionDesc className="mt-6">{s.desc}</SectionDesc>
            </div>
            <FeatureGrid cards={s.features} cols={3} />
          </div>
        </section>
      ))}

      {cfg.quote && (
        <InlineQuote text={cfg.quote.text} name={cfg.quote.name} role={cfg.quote.role} />
      )}

      {cfg.relatedLinks && (
        <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-[1200px] px-6">
            <SectionHeading className="mb-10">Смотрите также</SectionHeading>
            <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
              {cfg.relatedLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="block border transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '28px',
                  }}
                >
                  <div className="text-base font-bold" style={{ color: 'var(--text)' }}>
                    {l.label} →
                  </div>
                  <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {l.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageCTA
        title={
          <>
            Начните использовать
            <br />
            <em style={{ fontStyle: 'italic' }}>Revroute</em>
          </>
        }
        desc="Объединение коротких ссылок, аналитики и партнёрских программ в одной платформе."
      />
    </>
  )
}

import type { ReactNode } from 'react'
import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'
import { BrowserMockup } from './BrowserMockup'
import { PageHero, PrimaryButton, SecondaryButton } from './PageHero'
import { PageCTA } from './PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from './Typography'
import { FeatureGrid, type Feature } from './FeatureGrid'
import { InlineQuote } from './TestimonialCard'
import { StatsRow, type Stat } from './StatsRow'

type GlowColor = 'blue' | 'green' | 'orange' | 'purple' | 'none'

export type Screenshot = {
  src: string
  alt: string
  url?: string
  glow?: GlowColor
  width?: number
  height?: number
  chrome?: 'browser' | 'none'
}

export type PricingCut = {
  plan: string
  price: string
  priceSuffix?: string
  perks: string[]
  href?: string
  ctaLabel?: string
  hint?: string
}

export type SolutionConfig = {
  eyebrow: string
  eyebrowColor?: 'blue' | 'green' | 'orange' | 'purple'
  title: ReactNode
  desc: string
  primary?: { href: string; label: string }
  secondary?: { href: string; label: string }
  heroScreenshot?: Screenshot
  stats?: Stat[]
  sections: {
    eyebrow: string
    eyebrowColor?: 'blue' | 'green' | 'orange' | 'purple'
    title: ReactNode
    desc: string
    features: Feature[]
    screenshot?: Screenshot
  }[]
  quote?: { text: string; name: string; role: string }
  pricingCut?: PricingCut
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
            {(() => {
              const href = cfg.primary?.href ?? 'https://app.revroute.ru/'
              const goal = href.startsWith('https://app.revroute.ru') ? 'landing_signup_click' : undefined
              return (
                <PrimaryButton href={href} goal={goal}>
                  {cfg.primary?.label ?? 'Начать бесплатно'}
                </PrimaryButton>
              )
            })()}
            <SecondaryButton href={cfg.secondary?.href ?? '/contact/support'}>
              {cfg.secondary?.label ?? 'Запросить демо'}
            </SecondaryButton>
          </>
        }
      />

      {cfg.heroScreenshot && (
        <section style={{ padding: '0 0 60px' }}>
          <AnimateOnScroll>
            <BrowserMockup
              src={cfg.heroScreenshot.src}
              alt={cfg.heroScreenshot.alt}
              url={cfg.heroScreenshot.url}
              width={cfg.heroScreenshot.width ?? 2048}
              height={cfg.heroScreenshot.height ?? 1180}
              glow={cfg.heroScreenshot.glow ?? cfg.eyebrowColor ?? 'purple'}
              chrome={cfg.heroScreenshot.chrome ?? 'browser'}
              priority
            />
          </AnimateOnScroll>
        </section>
      )}

      {cfg.stats && (
        <section
          className={cfg.heroScreenshot ? 'border-t' : ''}
          style={{ padding: cfg.heroScreenshot ? '60px 0 80px' : '20px 0 80px', borderColor: 'var(--border)' }}
        >
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
            {s.screenshot && (
              <div className="mb-10">
                <AnimateOnScroll>
                  <BrowserMockup
                    src={s.screenshot.src}
                    alt={s.screenshot.alt}
                    url={s.screenshot.url}
                    width={s.screenshot.width ?? 2048}
                    height={s.screenshot.height ?? 1180}
                    glow={s.screenshot.glow ?? s.eyebrowColor ?? 'purple'}
                    chrome={s.screenshot.chrome ?? 'browser'}
                  />
                </AnimateOnScroll>
              </div>
            )}
            <FeatureGrid cards={s.features} cols={3} />
          </div>
        </section>
      ))}

      {cfg.quote && (
        <InlineQuote text={cfg.quote.text} name={cfg.quote.name} role={cfg.quote.role} />
      )}

      {cfg.pricingCut && (
        <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-[640px] px-6 text-center">
            <Eyebrow color="green">Тариф</Eyebrow>
            <SectionHeading className="mt-5">
              Готовы попробовать <em style={{ fontStyle: 'italic' }}>в боевых условиях?</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              {cfg.pricingCut.hint ?? 'Стартуйте с бесплатного плана — масштабируйтесь, когда продукт поедет.'}
            </SectionDesc>

            <div
              className="mx-auto mt-10 border text-left"
              style={{
                background: 'var(--bg-white)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div className="flex items-baseline justify-between">
                <div className="text-sm font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                  {cfg.pricingCut.plan}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold" style={{ letterSpacing: '-0.5px' }}>
                    {cfg.pricingCut.price}
                  </span>
                  {cfg.pricingCut.priceSuffix && (
                    <span className="ml-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {cfg.pricingCut.priceSuffix}
                    </span>
                  )}
                </div>
              </div>
              <ul className="mt-6 flex flex-col gap-2.5">
                {cfg.pricingCut.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: 'var(--green)' }}
                    >
                      ✓
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{perk}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryButton href={cfg.pricingCut.href ?? 'https://app.revroute.ru/'}>
                  {cfg.pricingCut.ctaLabel ?? 'Начать бесплатно'}
                </PrimaryButton>
                <SecondaryButton href="/pricing">Все тарифы →</SecondaryButton>
              </div>
            </div>
          </div>
        </section>
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

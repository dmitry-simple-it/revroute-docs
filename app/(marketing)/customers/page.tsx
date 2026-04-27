import type { Metadata } from 'next'
import Link from 'next/link'
import { customers } from '@/content/customers'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'

export const metadata: Metadata = {
  title: 'Клиенты и кейсы — истории роста на Revroute',
  description:
    'Кейсы SaaS, EdTech и FinTech: как команды растут с Revroute — короткие ссылки, сквозная атрибуция и партнёрские программы.',
  alternates: { canonical: '/customers' },
}

export default function CustomersPage() {
  return (
    <>
      <PageHero
        eyebrow="Клиенты и кейсы"
        eyebrowColor="green"
        title={
          <>
            Рост на <em style={{ fontStyle: 'italic' }}>Revroute</em>
          </>
        }
        desc="Как команды используют нашу платформу, чтобы масштабировать маркетинг, запускать партнёрские программы и видеть реальную выручку."
        actions={
          <>
            <PrimaryButton href="https://app.revroute.ru/">Начать бесплатно</PrimaryButton>
            <SecondaryButton href="/contact/support">Обсудить кейс</SecondaryButton>
          </>
        }
      />

      <section style={{ padding: '40px 0 80px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {customers.map((c) => (
              <Link
                key={c.slug}
                href={`/customers/${c.slug}`}
                className="group flex flex-col overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div
                  className="flex h-40 items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${c.logoColor} 0%, #0c0a09 100%)`,
                  }}
                >
                  <span className="text-6xl font-bold text-white/90" style={{ letterSpacing: '-2px' }}>
                    {c.company}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div
                    className="text-[11px] font-semibold uppercase"
                    style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
                  >
                    {c.industry}
                  </div>
                  <h2 className="mt-2 text-lg font-bold">{c.company}</h2>
                  <p
                    className="mt-2 flex-1 text-sm leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {c.summary}
                  </p>
                  <div
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    Читать кейс →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Готовы стать
            <br />
            <em style={{ fontStyle: 'italic' }}>следующим кейсом?</em>
          </>
        }
        desc="Покажем, как Revroute закрывает ваши задачи по ссылкам, аналитике и партнёрским программам."
      />
    </>
  )
}

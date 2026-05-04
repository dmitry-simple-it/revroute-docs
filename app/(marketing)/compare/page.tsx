import type { Metadata } from 'next'
import Link from 'next/link'
import { compares } from '@/content/compare'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'

export const metadata: Metadata = {
  title: 'Revroute vs конкурентов — сравнение сервисов',
  description:
    'Сравните Revroute с Goo.su, Bitly, Short.io, Rewardful и другими сервисами: атрибуция, партнёрские программы, API и цены.',
  alternates: { canonical: '/compare' },
}

export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Revroute vs конкурентов"
        eyebrowColor="purple"
        title={
          <>
            Revroute vs{' '}
            <em style={{ fontStyle: 'italic' }}>конкуренты</em>
          </>
        }
        desc="Честное сравнение по ключевым параметрам: атрибуция конверсий, партнёрские программы, цены и российские интеграции."
      />

      <section style={{ padding: '0 0 100px' }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {compares.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group block rounded-2xl border p-7 no-underline transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* VS badge */}
                <div className="mb-5 flex items-center gap-3">
                  {/* Revroute dot */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    R
                  </div>
                  <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                    vs
                  </span>
                  {/* Competitor */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-black"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)' }}
                  >
                    {c.competitor[0]}
                  </div>
                  <span className="text-sm font-bold">{c.competitor}</span>
                </div>

                <h2 className="mb-3 text-lg font-bold leading-snug" style={{ letterSpacing: '-0.3px' }}>
                  {c.tagline}
                </h2>

                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {c.summary}
                </p>

                {/* Key wins */}
                <div className="mt-5 flex flex-col gap-2">
                  {c.why.slice(0, 3).map((w) => (
                    <div key={w.title} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-xs" style={{ color: 'var(--green)' }}>✓</span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{w.title}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-6 flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2"
                  style={{ color: 'var(--purple)' }}
                >
                  Смотреть сравнение
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom note */}
          <p className="mt-10 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
            Не нашли нужный сервис?{' '}
            <a href="/contact/support" style={{ color: 'var(--blue)' }} className="font-medium">
              Напишите нам
            </a>{' '}
            — добавим сравнение.
          </p>
        </div>
      </section>

      <PageCTA
        title={<>Переходите на&nbsp;<em style={{ fontStyle: 'italic' }}>Revroute</em></>}
        desc="Атрибуция, партнёрские программы и короткие ссылки — в одной платформе. Миграция за один день."
      />
    </>
  )
}

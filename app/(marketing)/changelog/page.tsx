import type { Metadata } from 'next'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { changelog } from '@/content/changelog'

export const metadata: Metadata = {
  title: 'Что нового в продукте — обновления Revroute',
  description:
    'Релизы, улучшения и исправления платформы Revroute: новые возможности, скорость и точность атрибуции.',
  alternates: { canonical: '/changelog' },
}

const categoryStyle: Record<string, { bg: string; color: string }> = {
  'Новое': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'Улучшение': { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  'Исправление': { bg: 'var(--orange-bg)', color: 'var(--orange)' },
}

const monthFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Что нового в продукте"
        eyebrowColor="blue"
        title={
          <>
            Что <em style={{ fontStyle: 'italic' }}>нового</em>
          </>
        }
        desc="Все релизы, улучшения и исправления платформы Revroute."
      />

      <section style={{ padding: '20px 0 120px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <div className="flex flex-col gap-12">
            {changelog.map((entry) => {
              const style = categoryStyle[entry.category]
              return (
                <article
                  key={entry.version}
                  className="relative grid grid-cols-[160px_1fr] gap-8 max-md:grid-cols-1"
                >
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {monthFmt.format(new Date(entry.date))}
                    </div>
                    <div className="mt-1 text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
                      {entry.version}
                    </div>
                  </div>
                  <div
                    className="border p-7"
                    style={{
                      background: 'var(--bg-white)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
                      style={{ background: style.bg, color: style.color, letterSpacing: '0.05em' }}
                    >
                      {entry.category}
                    </span>
                    <h2 className="mt-3 text-xl font-bold">{entry.title}</h2>
                    <p className="mt-2 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {entry.summary}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {entry.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: style.color }}
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

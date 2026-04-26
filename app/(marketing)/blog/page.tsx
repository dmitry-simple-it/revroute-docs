import type { Metadata } from 'next'
import Link from 'next/link'
import { posts } from '@/content/blog'
import { PageHero } from '@/components/marketing/shared/PageHero'

export const metadata: Metadata = {
  title: 'Статьи и публикации — Revroute',
  description:
    'Статьи, гайды и разборы: атрибуция, партнёрские программы, короткие ссылки и практики маркетинга на Revroute.',
  alternates: { canonical: '/blog' },
}

const monthFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
  const [featured, ...rest] = sorted

  return (
    <>
      <PageHero
        eyebrow="Статьи и публикации"
        eyebrowColor="orange"
        title={
          <>
            Мысли и <em style={{ fontStyle: 'italic' }}>практика</em>
          </>
        }
        desc="Разборы продукта, гайды и заметки команды Revroute и наших клиентов."
      />

      <section style={{ padding: '20px 0 120px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Featured */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-2 gap-8 overflow-hidden border transition-all hover:shadow-[var(--shadow)] max-md:grid-cols-1"
            style={{
              background: 'var(--bg-white)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div className="h-80" style={{ background: featured.cover.gradient }} />
            <div className="flex flex-col justify-center p-8">
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                <span>{featured.category}</span>
                <span>·</span>
                <span>{monthFmt.format(new Date(featured.date))}</span>
              </div>
              <h2
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(26px, 3vw, 36px)',
                  fontWeight: 400,
                  letterSpacing: '-0.3px',
                  lineHeight: 1.15,
                }}
              >
                {featured.title}
              </h2>
              <p className="mt-3 text-base" style={{ color: 'var(--text-muted)' }}>
                {featured.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-bold"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {featured.author.initials}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{featured.author.name}</span>
                  <span className="mx-2" style={{ color: 'var(--text-dim)' }}>
                    ·
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{featured.author.role}</span>
                </div>
              </div>
            </div>
          </Link>

          <div className="mt-10 grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden border transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div className="h-40" style={{ background: p.cover.gradient }} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                    {p.category} · {monthFmt.format(new Date(p.date))}
                  </div>
                  <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {p.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

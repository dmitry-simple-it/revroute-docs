import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts } from '@/content/blog'
import { PageCTA } from '@/components/marketing/shared/PageCTA'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = posts.find((x) => x.slug === slug)
  if (!p) return { title: 'Статья не найдена' }
  return {
    title: `${p.title} — Блог Revroute`,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
  }
}

const monthFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const p = posts.find((x) => x.slug === slug)
  if (!p) notFound()

  return (
    <>
      <section className="relative" style={{ padding: '120px 0 40px' }}>
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            top: '-200px',
            width: '1000px',
            height: '600px',
            background:
              'radial-gradient(ellipse at center, rgba(231, 229, 228, 0.6) 0%, transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-[760px] px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Все статьи
          </Link>
          <div
            className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase"
            style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
          >
            <span>{p.category}</span>
            <span>·</span>
            <span>{monthFmt.format(new Date(p.date))}</span>
          </div>
          <h1
            className="mt-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4.5vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}
          >
            {p.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {p.excerpt}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-xs font-bold"
              style={{ color: 'var(--text-muted)' }}
            >
              {p.author.initials}
            </div>
            <div className="text-sm">
              <span className="font-semibold">{p.author.name}</span>
              <span className="mx-2" style={{ color: 'var(--text-dim)' }}>
                ·
              </span>
              <span style={{ color: 'var(--text-muted)' }}>{p.author.role}</span>
            </div>
          </div>
        </div>
      </section>

      <div
        className="mx-auto mt-4 h-64 max-w-[1000px] overflow-hidden max-md:h-40"
        style={{ borderRadius: 'var(--radius-xl)' }}
      >
        <div className="h-full w-full" style={{ background: p.cover.gradient }} />
      </div>

      <article className="mx-auto max-w-[720px] px-6 py-16">
        {p.content.map((block, i) => {
          if (block.type === 'h2') {
            return (
              <h2
                key={i}
                className="mt-10 mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3vw, 32px)',
                  fontWeight: 400,
                  letterSpacing: '-0.3px',
                }}
              >
                {block.text}
              </h2>
            )
          }
          if (block.type === 'ul') {
            return (
              <ul key={i} className="mb-6 flex flex-col gap-2">
                {block.items?.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-base leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--text-muted)' }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          }
          return (
            <p
              key={i}
              className="mb-5 text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {block.text}
            </p>
          )
        })}
      </article>

      <PageCTA
        title={
          <>
            Пробуйте <em style={{ fontStyle: 'italic' }}>Revroute</em>
          </>
        }
        desc="Бесплатный старт без карты — подключайте ссылки, аналитику и партнёрки за 5 минут."
      />
    </>
  )
}

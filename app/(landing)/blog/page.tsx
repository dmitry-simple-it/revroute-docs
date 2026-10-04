import type { Metadata } from 'next'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Chip, Eyebrow } from '@/components/ds/primitives'
import { BlogCard } from '@/components/ds/blog/BlogCard'
import { posts } from '@/content/blog'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, itemList } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

export const metadata: Metadata = {
  title: 'Блог об атрибуции и партнёрском маркетинге',
  description:
    'Разборы продукта, гайды и заметки команды: атрибуция, партнёрские программы, короткие ссылки и рабочие практики маркетинга — опыт RevRoute и наших клиентов.',
  alternates: { canonical: '/blog' },
  openGraph: og('/blog'),
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  const categories = [...new Set(sorted.map((post) => post.category))]

  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([{ name: 'Главная', url: '/' }, { name: 'Блог' }]),
          itemList({
            name: 'Статьи и публикации RevRoute',
            ordered: false,
            items: sorted.map((post) => ({
              name: post.title, url: `/blog/${post.slug}`, description: post.excerpt,
            })),
          }),
        ]}
      />
      <section className="ds-container" style={{ paddingTop: 72, paddingBottom: 8 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Блог RevRoute</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 16 }}>Мысли и практика</h1>
          <p className="rr-lead" style={{ marginTop: 18, marginInline: 'auto', maxWidth: '54ch' }}>
            Разборы продукта, гайды и заметки команды RevRoute и наших клиентов.
            Партнёрский маркетинг, атрибуция и работа со ссылками.
          </p>
        </div>
        <div className="rr-blog-categories">
          {categories.map((category) => <Chip key={category}>{category}</Chip>)}
        </div>
      </section>
      <section className="ds-band ds-container" aria-label="Статьи и публикации">
        <div className="ds-grid-2">
          {sorted.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
      </section>
      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum" title="Попробуйте RevRoute."
          body="Ссылки, аналитика и партнёрские программы в одной платформе."
          primary={{ label: 'Начать бесплатно', href: 'https://app.revroute.ru/register' }}
          secondary={{ label: 'Тарифы', href: '/pricing' }}
        />
      </section>
    </>
  )
}

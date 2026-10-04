import Link from 'next/link'
import type { BlogContentBlock, BlogPost } from '@/content/blog'
import type { BlogInline } from '@/lib/dzen/types'
import { BlogInlineText } from '@/components/marketing/blog/BlogInlineText'
import { BlogPostMock } from '@/components/marketing/blog/BlogPostMock'
import { ArticleReadTracker } from '@/components/analytics/ArticleReadTracker'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { article, breadcrumbs, faqPage, howTo, itemList, type JsonLdGraph } from '@/lib/seo/schemas'
import { CtaBottom } from '../CtaBottom'
import { FaqList } from '../FaqList'
import { Eyebrow, Icon } from '../primitives'
import './blog.css'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
})

function inlineText(nodes: BlogInline[]): string {
  return nodes.map((node) => node.type === 'text' ? node.text : inlineText(node.children)).join('')
}

function renderBlock(block: BlogContentBlock, index: number) {
  switch (block.type) {
    case 'p':
      return <p key={index} className="rr-body">{block.text}</p>
    case 'rich-p':
      return <p key={index} className="rr-body"><BlogInlineText nodes={block.children} /></p>
    case 'h2':
      return <h2 key={index} className="rr-h2">{block.text}</h2>
    case 'h3':
      return <h3 key={index} className="rr-h3">{block.text}</h3>
    case 'ul':
    case 'ol': {
      const List = block.type
      return <List key={index} className="rr-body rr-blog-list">{block.items.map((item, i) => <li key={i}>{item}</li>)}</List>
    }
    case 'rich-list': {
      const List = block.ordered ? 'ol' : 'ul'
      return <List key={index} className="rr-body rr-blog-list">{block.items.map((item, i) => <li key={i}><BlogInlineText nodes={item} /></li>)}</List>
    }
    case 'image':
      return (
        <figure key={index} className="rr-blog-figure">
          <img src={block.image.url} alt={block.alt} width={block.image.width} height={block.image.height} loading="lazy" className="rr-blog-image" />
          {block.caption && <figcaption className="rr-small">{block.caption}</figcaption>}
        </figure>
      )
    case 'quote':
      return <blockquote key={index} className="rr-blog-quote"><p className="rr-body">{block.text}</p></blockquote>
    case 'mock':
      return <BlogPostMock key={index} variant={block.variant} />
    case 'stats':
      return (
        <figure key={index} className="rr-blog-figure">
          <div className="rr-blog-stats">
            {block.stats.map((stat, i) => (
              <div key={i} className="card-flat">
                <div className="rr-h2" style={{ fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
                <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 10 }}>{stat.label}</p>
              </div>
            ))}
          </div>
          {block.caption && <figcaption className="rr-small">{block.caption}</figcaption>}
        </figure>
      )
    case 'cta':
      return (
        <aside key={index} className="card-flat rr-blog-inline-cta">
          <p className="rr-body">{block.body}</p>
          <Link href={block.href} className="rr-small rr-blog-read">{block.label} <Icon name="arrow-right" size={16} strokeWidth={2} /></Link>
        </aside>
      )
    case 'table':
      return (
        <figure key={index} className="rr-blog-figure">
          <div className="rr-blog-table-wrap">
            <table className="rr-blog-table">
              {block.caption && <caption className="rr-small">{block.caption}</caption>}
              <thead><tr>{block.headers.map((heading, i) => <th key={i} scope="col" className="rr-caption">{heading}</th>)}</tr></thead>
              <tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="rr-small">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </figure>
      )
  }
}

export function BlogArticle({ post, preview = false }: { post: BlogPost; preview?: boolean }) {
  const firstBlock = post.content[0]
  const firstParagraph = firstBlock?.type === 'p' ? firstBlock.text
    : firstBlock?.type === 'rich-p' ? inlineText(firstBlock.children) : undefined
  const content = firstParagraph?.trim() === post.excerpt.trim() ? post.content.slice(1) : post.content
  const schemas: JsonLdGraph[] = [
    breadcrumbs([{ name: 'Главная', url: '/' }, { name: 'Блог', url: '/blog' }, { name: post.title }]),
    article({
      url: `/blog/${post.slug}`, headline: post.title, description: post.excerpt,
      datePublished: post.date, author: { name: post.author.name, role: post.author.role }, articleSection: post.category,
    }),
  ]
  if (post.howTo) schemas.push(howTo(post.howTo))
  if (post.itemList) schemas.push(itemList(post.itemList))
  if (post.faq?.length) schemas.push(faqPage(post.faq))

  return (
    <>
      {!preview && <JsonLd data={schemas} />}
      {!preview && <ArticleReadTracker slug={post.slug} type="blog" />}
      <article>
        <section className="ds-container" style={{ paddingTop: 64 }}>
          <div className="rr-blog-column">
            <nav aria-label="Хлебные крошки" className="rr-blog-breadcrumbs">
              <Link href="/" className="rr-small">Главная</Link>
              <Icon name="chevron-right" size={14} color="var(--ink-4)" />
              <Link href="/blog" className="rr-small">Блог</Link>
              <Icon name="chevron-right" size={14} color="var(--ink-4)" />
              <span className="rr-small" aria-current="page">{post.title}</span>
            </nav>
            {preview && <div className="card-flat rr-blog-preview rr-small">Локальный черновик — для просмотра перед публикацией.</div>}
            <div className="rr-blog-meta" style={{ marginTop: 24 }}>
              <Eyebrow>{post.category}</Eyebrow>
              {!preview && <time className="rr-small" dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>}
            </div>
            <h1 className="rr-h1" style={{ marginTop: 14 }}>{post.title}</h1>
            <div className="rr-blog-author">
              <span className="rr-blog-avatar" aria-hidden>{post.author.initials}</span>
              <div>
                <p className="rr-small" style={{ color: 'var(--ink)', fontWeight: 500 }}>{post.author.name}</p>
                <p className="rr-small" style={{ color: 'var(--ink-3)' }}>{post.author.role}</p>
              </div>
            </div>
            <div className="card-flat rr-blog-summary"><p className="rr-lead" style={{ color: 'var(--ink)' }}>{post.excerpt}</p></div>
          </div>
        </section>
        <section className="ds-container" style={{ paddingTop: 8 }} aria-label="Текст статьи">
          <div className="rr-blog-column rr-blog-body">{content.map(renderBlock)}</div>
        </section>
        {post.faq && post.faq.length > 0 && (
          <section className="ds-container" style={{ paddingTop: 72 }}>
            <div className="rr-blog-column">
              <Eyebrow>Вопросы</Eyebrow>
              <h2 className="rr-h2" style={{ marginTop: 14, marginBottom: 26 }}>Часто задаваемые вопросы</h2>
              <FaqList items={post.faq} />
            </div>
          </section>
        )}
        {post.sources && post.sources.length > 0 && (
          <section className="ds-container" style={{ paddingTop: 72 }}>
            <div className="rr-blog-column">
              <h2 className="rr-h3">Источники</h2>
              <ul className="rr-blog-sources">
                {post.sources.map((source, i) => (
                  <li key={i} className="rr-small">
                    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>
                    {source.note && <span> — {source.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>
      <section className="ds-container" style={{ paddingTop: 80, paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum" title="Попробуйте RevRoute."
          body="Ссылки, аналитика и партнёрские программы в одной платформе."
          primary={{ label: 'Начать бесплатно', href: 'https://app.revroute.ru/register' }}
          secondary={{ label: 'Запросить демо', href: '/contact/support' }}
        />
      </section>
    </>
  )
}

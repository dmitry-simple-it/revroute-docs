import Link from 'next/link'
import type { BlogPost } from '@/content/blog'
import { Icon } from '../primitives'
import './blog.css'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
})

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card-flat rr-blog-card">
      <div className="rr-blog-meta">
        <span className="rr-caption">{post.category}</span>
        <time className="rr-small" dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
      </div>
      <h2 className="rr-h3">{post.title}</h2>
      <p className="rr-small rr-blog-card-excerpt">{post.excerpt}</p>
      <div className="rr-blog-card-footer">
        <span className="rr-small" style={{ color: 'var(--ink-3)' }}>{post.author.name}</span>
        <span className="rr-small rr-blog-read">
          Читать статью <Icon name="arrow-right" size={16} strokeWidth={2} />
        </span>
      </div>
    </Link>
  )
}

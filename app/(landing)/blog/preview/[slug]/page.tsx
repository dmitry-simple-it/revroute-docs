import type { Metadata } from 'next'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { BlogPost } from '@/content/blog'
import { BlogArticle } from '@/components/ds/blog/BlogArticle'

export const dynamic = 'force-dynamic'

// Review drafts only on the local dev server. They never join posts or the RSS feed.
const getDraft = cache(async (slug: string): Promise<BlogPost> => {
  if (process.env.NODE_ENV !== 'development' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound()
  let text: string
  try {
    text = await readFile(join(process.cwd(), 'content', 'dzen', 'drafts', `${slug}.json`), 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') notFound()
    throw error
  }
  const draft = JSON.parse(text) as { post: BlogPost }
  if (draft.post.slug !== slug) notFound()
  return draft.post
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getDraft((await params).slug)
  return { title: { absolute: `Черновик: ${post.title}` }, robots: { index: false, follow: false } }
}

export default async function BlogPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getDraft((await params).slug)
  return <BlogArticle post={post} preview />
}

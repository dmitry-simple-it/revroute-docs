import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogArticle } from '@/components/ds/blog/BlogArticle'
import { posts } from '@/content/blog'
import { og } from '@/lib/seo/og'

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((entry) => entry.slug === slug)
  if (!post) return { title: 'Статья не найдена' }
  return {
    title: { absolute: post.title },
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: og(`/blog/${post.slug}`),
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find((entry) => entry.slug === slug)
  if (!post) notFound()
  return <BlogArticle post={post} />
}

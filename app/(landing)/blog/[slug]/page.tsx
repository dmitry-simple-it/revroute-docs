import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogArticle } from '@/components/ds/blog/BlogArticle'
import { posts } from '@/content/blog'
import { blogArticleAuthor, blogMetaDescription, blogPublishedAt, blogSocialImagePath } from '@/lib/seo/blog'
import { SITE } from '@/lib/seo/schemas'

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((entry) => entry.slug === slug)
  if (!post) return { title: 'Статья не найдена' }
  const description = blogMetaDescription(post)
  const url = `${SITE}/blog/${post.slug}`
  const image = `${SITE}${blogSocialImagePath(post.slug)}`
  const author = blogArticleAuthor(post.author)
  return {
    title: { absolute: post.title },
    description,
    authors: [{ name: author.name, ...(author.url ? { url: author.url } : {}) }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: 'RevRoute',
      locale: 'ru_RU',
      url,
      title: post.title,
      description,
      publishedTime: blogPublishedAt(post),
      ...(author.url ? { authors: [author.url] } : {}),
      section: post.category,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [{ url: image, alt: post.title }],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find((entry) => entry.slug === slug)
  if (!post) notFound()
  return <BlogArticle post={post} />
}

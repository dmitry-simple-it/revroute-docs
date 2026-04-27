import type { MetadataRoute } from 'next'
import path from 'path'
import { customers } from '@/content/customers'
import { posts } from '@/content/blog'
import { compares } from '@/content/compare'
import { integrations } from '@/lib/integrations'
import { mdxFilesToSitemapEntries } from '@/lib/sitemap-mdx'

const SITE = 'https://revroute.ru'

function dedupeByUrl(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const map = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const e of entries) {
    map.set(e.url, e)
  }
  return [...map.values()]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const contentRoot = path.join(process.cwd(), 'content')

  const staticRoutes = [
    '/',
    '/links',
    '/analytics',
    '/partners',
    '/for-partners',
    '/enterprise',
    '/api',
    '/integrations',
    '/pricing',
    '/solutions/affiliate-marketing',
    '/solutions/content-creators',
    '/solutions/saas',
    '/solutions/ecommerce',
    '/customers',
    '/blog',
    '/changelog',
    '/compare',
    '/contact/support',
    '/tools/qr',
    '/tools/utm',
    '/tools/link-inspector',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: p === '/' ? 1 : p === '/compare' ? 0.85 : 0.7,
  }))

  const customerEntries: MetadataRoute.Sitemap = customers.map((c) => ({
    url: `${SITE}/customers/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const compareEntries: MetadataRoute.Sitemap = compares.map((c) => ({
    url: `${SITE}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const integrationEntries: MetadataRoute.Sitemap = integrations
    .filter((i) => !i.isComingSoon && !i.isGuide)
    .map((i) => ({
      url: `${SITE}/integrations/${i.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))

  const docHelpEntries = mdxFilesToSitemapEntries(contentRoot, SITE, now)

  return dedupeByUrl([
    ...staticEntries,
    ...customerEntries,
    ...blogEntries,
    ...compareEntries,
    ...integrationEntries,
    ...docHelpEntries,
  ])
}

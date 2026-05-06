import type { MetadataRoute } from 'next'
import path from 'path'
import { customers } from '@/content/customers'
import { posts } from '@/content/blog'
import { compares } from '@/content/compare'
import { integrations } from '@/lib/integrations'
import { mdxFilesToSitemapEntries } from '@/lib/sitemap-mdx'

const SITE = 'https://revroute.ru'

// Per-route sitemap priority. Money pages are 0.9, listings 0.85, solutions 0.8,
// utility tools 0.75, low-value pages 0.5. Falls back to 0.7 for unknown paths.
const STATIC_PRIORITY: Record<string, number> = {
  '/': 1.0,
  '/links': 0.9,
  '/analytics': 0.9,
  '/partners': 0.9,
  '/pricing': 0.9,
  '/for-partners': 0.8,
  '/enterprise': 0.8,
  '/api': 0.8,
  '/integrations': 0.85,
  '/customers': 0.85,
  '/blog': 0.85,
  '/changelog': 0.7,
  '/compare': 0.85,
  '/contact/support': 0.5,
  '/solutions/affiliate-marketing': 0.8,
  '/solutions/content-creators': 0.8,
  '/solutions/saas': 0.8,
  '/solutions/ecommerce': 0.8,
  '/tools/qr': 0.75,
  '/tools/utm': 0.75,
  '/tools/link-inspector': 0.75,
}

const TOOL_PRIORITY: Record<string, number> = {
  '/tools/link-shortener': 0.85,
}

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

  const staticRoutes = Object.keys(STATIC_PRIORITY)

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: STATIC_PRIORITY[p] ?? 0.7,
  }))

  const toolRoutes = Object.keys(TOOL_PRIORITY)
  const toolEntries: MetadataRoute.Sitemap = toolRoutes.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: TOOL_PRIORITY[p] ?? 0.7,
  }))

  const customerEntries: MetadataRoute.Sitemap = customers.map((c) => ({
    url: `${SITE}/customers/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const compareEntries: MetadataRoute.Sitemap = compares.map((c) => ({
    url: `${SITE}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
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
    ...toolEntries,
    ...customerEntries,
    ...blogEntries,
    ...compareEntries,
    ...integrationEntries,
    ...docHelpEntries,
  ])
}

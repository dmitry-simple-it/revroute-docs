import type { MetadataRoute } from 'next'
import { customers } from '@/content/customers'
import { posts } from '@/content/blog'
import { compares } from '@/content/compare'

const SITE = 'https://revroute.ru'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

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
    '/tools/qr',
    '/tools/utm',
    '/tools/link-inspector',
    '/ru/docs',
    '/ru/help',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))

  const customerEntries: MetadataRoute.Sitemap = customers.map((c) => ({
    url: `${SITE}/customers/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const compareEntries: MetadataRoute.Sitemap = compares.map((c) => ({
    url: `${SITE}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...customerEntries, ...blogEntries, ...compareEntries]
}

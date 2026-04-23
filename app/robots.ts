import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/draft/'],
      },
    ],
    sitemap: 'https://revroute.ru/sitemap.xml',
    host: 'https://revroute.ru',
  }
}

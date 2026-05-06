import type { MetadataRoute } from 'next'

const DEFAULT_DISALLOW = ['/api/', '/_next/', '/draft/']

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
  'MistralAI-User',
  'Bytespider',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DEFAULT_DISALLOW,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DEFAULT_DISALLOW,
      })),
    ],
    sitemap: 'https://revroute.ru/sitemap.xml',
    host: 'https://revroute.ru',
  }
}

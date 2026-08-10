import type { MetadataRoute } from 'next'

/**
 * Закрываем ровно два серверных роута (`app/api/lead/route.ts`,
 * `app/api/public/shorten/route.ts`) и служебную статику Next.
 *
 * Общее `/api/` здесь стояло раньше и цепляло `/api` — публичную маркетинговую
 * страницу документации API (`app/(marketing)/api/page.tsx`, canonical `/api`).
 * Правило `/draft/` тоже убрано: такого раздела в `app/` нет.
 */
const DEFAULT_DISALLOW = ['/api/lead', '/api/public/', '/_next/']

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

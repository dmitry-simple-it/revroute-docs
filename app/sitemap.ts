import type { MetadataRoute } from 'next'
import path from 'path'
import { customers } from '@/content/customers'
import { posts } from '@/content/blog'
import { changelog } from '@/content/changelog'
import { compares } from '@/content/compare'
import { glossary } from '@/content/glossary'
import { integrations } from '@/lib/integrations'
import { lastModOf, lastModOfFirst, mdxFilesToSitemapEntries, newestDate } from '@/lib/sitemap-mdx'

const SITE = 'https://revroute.ru'

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

/**
 * Per-route sitemap priority. Money pages are 0.9, listings 0.85, solutions 0.8,
 * utility tools 0.75, low-value pages 0.5. Falls back to 0.7 for unknown paths.
 *
 * `/for-partners` здесь намеренно нет: страница каноникализируется на
 * `/partners`, и объявлять её отдельным URL карты — противоречить canonical.
 */
const STATIC_PRIORITY: Record<string, number> = {
  '/': 1.0,
  '/prm': 0.95,
  '/partner-channel': 0.9,
  '/packaging': 0.8,
  '/audit': 0.8,
  '/links': 0.9,
  '/partners': 0.9,
  '/pricing': 0.9,
  '/enterprise': 0.8,
  '/api': 0.8,
  '/integrations': 0.85,
  '/customers': 0.85,
  '/blog': 0.85,
  '/changelog': 0.7,
  '/compare': 0.85,
  '/glossary': 0.8,
  '/contact/support': 0.5,
  '/solutions/affiliate-marketing': 0.8,
  '/solutions/content-creators': 0.8,
  '/tools': 0.85,
  // '/solutions' убран вместе со страницей: путь отдаёт 301 на /solutions/saas,
  // а редирект в карте сайта — противоречие самому себе.
  '/solutions/saas': 0.8,
  '/solutions/ecommerce': 0.8,
  '/anti-fraud': 0.85,
  '/tools/qr': 0.75,
  '/tools/utm': 0.75,
  '/tools/link-inspector': 0.75,
}

const TOOL_PRIORITY: Record<string, number> = {
  '/tools/link-shortener': 0.85,
}

/**
 * Реальная частота правок, снятая по истории git: ни один статический маршрут
 * не переписывается чаще раза в месяц (4–9 коммитов за полгода), поэтому
 * прежний поголовный `weekly` был просто неправдой. Правовые документы и
 * опубликованные материалы живут дольше — `yearly`.
 */
const STATIC_CHANGE_FREQUENCY: ChangeFrequency = 'monthly'

/** Файлы-источники маршрута: страница может лежать в любой из двух групп. */
function routeSources(route: string): string[] {
  const suffix = route === '/' ? '' : route
  return [`app/(landing)${suffix}/page.tsx`, `app/(marketing)${suffix}/page.tsx`]
}

function dedupeByUrl(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const map = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const e of entries) {
    map.set(e.url, e)
  }
  return [...map.values()]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentRoot = path.join(process.cwd(), 'content')

  // Даты последних коммитов дата-файлов: у карточек клиентов, сравнений,
  // глоссария и интеграций своей даты в данных нет, поэтому берём дату файла,
  // из которого они собираются.
  const customersDate = lastModOf('content/customers.ts')
  const comparesDate = lastModOf('content/compare.ts')
  const glossaryDate = lastModOf('content/glossary.ts')
  const integrationsDate = lastModOf('lib/integrations.ts')

  const staticEntries: MetadataRoute.Sitemap = Object.keys(STATIC_PRIORITY).map((p) => {
    const fileDate = lastModOfFirst(routeSources(p))
    // Листинги живут не правками шаблона, а появлением записей.
    const lastModified =
      p === '/blog'
        ? newestDate(posts.map((post) => post.date), fileDate)
        : p === '/changelog'
          ? newestDate(changelog.map((entry) => entry.date), fileDate)
          : fileDate
    return {
      url: `${SITE}${p}`,
      lastModified,
      changeFrequency: STATIC_CHANGE_FREQUENCY,
      priority: STATIC_PRIORITY[p] ?? 0.7,
    }
  })

  const toolEntries: MetadataRoute.Sitemap = Object.keys(TOOL_PRIORITY).map((p) => ({
    url: `${SITE}${p}`,
    lastModified: lastModOfFirst(routeSources(p)),
    changeFrequency: STATIC_CHANGE_FREQUENCY,
    priority: TOOL_PRIORITY[p] ?? 0.7,
  }))

  const customerEntries: MetadataRoute.Sitemap = customers.map((c) => ({
    url: `${SITE}/customers/${c.slug}`,
    lastModified: customersDate,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'yearly' as const,
    priority: 0.65,
  }))

  const compareEntries: MetadataRoute.Sitemap = compares.map((c) => ({
    url: `${SITE}/compare/${c.slug}`,
    lastModified: comparesDate,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const glossaryEntries: MetadataRoute.Sitemap = glossary.map((g) => ({
    url: `${SITE}/glossary/${g.slug}`,
    lastModified: glossaryDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // isDemo — витринная заглушка (Acme): страница существует, но выдавать её за
  // реальную интеграцию нельзя, поэтому в карту она не попадает.
  const integrationEntries: MetadataRoute.Sitemap = integrations
    .filter((i) => !i.isComingSoon && !i.isGuide && !i.isDemo)
    .map((i) => ({
      url: `${SITE}/integrations/${i.slug}`,
      lastModified: integrationsDate,
      changeFrequency: 'yearly' as const,
      priority: 0.65,
    }))

  const docHelpEntries = mdxFilesToSitemapEntries(contentRoot, SITE)

  return dedupeByUrl([
    ...staticEntries,
    ...toolEntries,
    ...customerEntries,
    ...blogEntries,
    ...compareEntries,
    ...glossaryEntries,
    ...integrationEntries,
    ...docHelpEntries,
  ])
}

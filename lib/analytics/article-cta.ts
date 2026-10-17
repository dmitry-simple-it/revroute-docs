export const ARTICLE_CTA_SLOTS = ['inline', 'bottom', 'header', 'footer'] as const

export type ArticleCtaSlot = typeof ARTICLE_CTA_SLOTS[number]
export type ArticleContext = {
  article_slug: string
  article_cta_slot: ArticleCtaSlot
}

/** Page-local context only: validate and pick known fields without persisting it. */
export function normalizeArticleContext(input: unknown): ArticleContext | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const candidate = input as Record<string, unknown>
  if (typeof candidate.article_slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.article_slug)) return null
  if (!ARTICLE_CTA_SLOTS.includes(candidate.article_cta_slot as ArticleCtaSlot)) return null
  return { article_slug: candidate.article_slug, article_cta_slot: candidate.article_cta_slot as ArticleCtaSlot }
}

/** Keep URL validation shared by the goal payload and the app URL decorator. */
export function parseAppAttributionUrl(href: string): URL | null {
  try {
    const url = new URL(href)
    if (url.protocol !== 'https:' || url.host !== 'app.revroute.ru' || url.username || url.password) return null
    return url
  } catch { return null }
}

/** A CTA is an app navigation from a published article, not a registration. */
export function articleCtaParams(input: { href: string; slug?: string; slot?: string }): {
  slug: string; slot: ArticleCtaSlot; destination: 'register' | 'login' | 'app'
} | null {
  const context = normalizeArticleContext({ article_slug: input.slug, article_cta_slot: input.slot })
  const url = parseAppAttributionUrl(input.href)
  if (!context || !url) return null
  const destination = /^\/register\/?$/.test(url.pathname) ? 'register'
    : /^\/login\/?$/.test(url.pathname) ? 'login' : 'app'
  return { slug: context.article_slug, slot: context.article_cta_slot, destination }
}

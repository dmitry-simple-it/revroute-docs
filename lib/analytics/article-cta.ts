/** A CTA is an app navigation from a published article, not a registration. */
export function articleCtaParams(input: { href: string; slug?: string; slot?: string }): {
  slug: string; slot: 'inline' | 'bottom'; destination: 'register' | 'login' | 'app'
} | null {
  if (!input.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) return null
  if (input.slot !== 'inline' && input.slot !== 'bottom') return null
  try {
    const url = new URL(input.href)
    if (url.protocol !== 'https:' || url.host !== 'app.revroute.ru' || url.username || url.password) return null
    const destination = /^\/register\/?$/.test(url.pathname) ? 'register'
      : /^\/login\/?$/.test(url.pathname) ? 'login' : 'app'
    return { slug: input.slug, slot: input.slot, destination }
  } catch { return null }
}

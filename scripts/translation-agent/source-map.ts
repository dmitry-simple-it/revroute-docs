import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { REPO_ROOT } from './paths'
import type { SourceRef } from './types'

const MARKETING_STATIC: Record<string, string> = {
  '/': 'app/(marketing)/page.tsx',
  '/links': 'app/(marketing)/links/page.tsx',
  '/analytics': 'app/(marketing)/analytics/page.tsx',
  '/partners': 'app/(marketing)/partners/page.tsx',
  '/for-partners': 'app/(marketing)/for-partners/page.tsx',
  '/enterprise': 'app/(marketing)/enterprise/page.tsx',
  '/api': 'app/(marketing)/api/page.tsx',
  '/integrations': 'app/(marketing)/integrations/page.tsx',
  '/pricing': 'app/(marketing)/pricing/page.tsx',
  '/changelog': 'app/(marketing)/changelog/page.tsx',
  '/customers': 'app/(marketing)/customers/page.tsx',
  '/blog': 'app/(marketing)/blog/page.tsx',
  '/tools/qr': 'app/(marketing)/tools/qr/page.tsx',
  '/tools/utm': 'app/(marketing)/tools/utm/page.tsx',
  '/tools/link-inspector': 'app/(marketing)/tools/link-inspector/page.tsx',
  '/solutions/affiliate-marketing': 'app/(marketing)/solutions/affiliate-marketing/page.tsx',
  '/solutions/content-creators': 'app/(marketing)/solutions/content-creators/page.tsx',
  '/solutions/saas': 'app/(marketing)/solutions/saas/page.tsx',
  '/solutions/ecommerce': 'app/(marketing)/solutions/ecommerce/page.tsx',
}

function resolveMdx(section: 'docs' | 'help', pathname: string): string | null {
  const prefix = `/ru/${section}`
  if (!pathname.startsWith(prefix)) return null
  let rest = pathname.slice(prefix.length).replace(/^\//, '')
  if (!rest) {
    const idx = join(REPO_ROOT, 'content', 'ru', section, 'index.mdx')
    return existsSync(idx) ? `content/ru/${section}/index.mdx` : null
  }
  const candidates = [
    join(REPO_ROOT, 'content', 'ru', section, `${rest}.mdx`),
    join(REPO_ROOT, 'content', 'ru', section, rest, 'index.mdx'),
  ]
  for (const abs of candidates) {
    if (existsSync(abs)) {
      return abs.replace(REPO_ROOT + '\\', '').replace(REPO_ROOT + '/', '').replace(/\\/g, '/')
    }
  }
  return null
}

export function pathToSources(pathname: string): SourceRef[] {
  const sources: SourceRef[] = []

  if (pathname.startsWith('/ru/docs')) {
    const mdx = resolveMdx('docs', pathname)
    if (mdx) sources.push({ file: mdx, kind: 'mdx' })
    return sources
  }

  if (pathname.startsWith('/ru/help')) {
    const mdx = resolveMdx('help', pathname)
    if (mdx) sources.push({ file: mdx, kind: 'mdx' })
    return sources
  }

  const blogM = pathname.match(/^\/blog\/([^/]+)$/)
  if (blogM) {
    sources.push({
      file: 'content/blog.ts',
      kind: 'blog-data',
      slug: blogM[1],
    })
    sources.push({ file: 'app/(marketing)/blog/[slug]/page.tsx', kind: 'tsx-page' })
    return sources
  }

  const custM = pathname.match(/^\/customers\/([^/]+)$/)
  if (custM) {
    sources.push({
      file: 'content/customers.ts',
      kind: 'customers-data',
      slug: custM[1],
    })
    sources.push({ file: 'app/(marketing)/customers/[slug]/page.tsx', kind: 'tsx-page' })
    return sources
  }

  const cmpM = pathname.match(/^\/compare\/([^/]+)$/)
  if (cmpM) {
    sources.push({
      file: 'content/compare.ts',
      kind: 'compare-data',
      slug: cmpM[1],
    })
    sources.push({ file: 'app/(marketing)/compare/[slug]/page.tsx', kind: 'tsx-page' })
    return sources
  }

  if (pathname.startsWith('/integrations/')) {
    const slug = pathname.replace('/integrations/', '')
    const page = `app/(marketing)/integrations/[slug]/page.tsx`
    if (existsSync(join(REPO_ROOT, page))) {
      sources.push({ file: page, kind: 'tsx-page' })
    }
    return sources
  }

  const staticFile = MARKETING_STATIC[pathname]
  if (staticFile) {
    sources.push({ file: staticFile, kind: 'tsx-page' })
    return sources
  }

  if (pathname === '/contact/support') {
    sources.push({ file: 'app/(marketing)/contact/support/page.tsx', kind: 'tsx-page' })
    return sources
  }

  return sources
}

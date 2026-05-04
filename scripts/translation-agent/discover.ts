import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import fg from 'fast-glob'
import { customers } from '../../content/customers'
import { posts } from '../../content/blog'
import { compares } from '../../content/compare'
import { REPO_ROOT, URLS_JSON, CACHE_ROOT } from './paths'
import type { PageTarget, UrlsManifest } from './types'
import { pathToSources } from './source-map'
import { mkdir } from 'node:fs/promises'

/** Mirrors `app/sitemap.ts` static routes + dynamic slugs + all RU MDX docs/help. */
const STATIC_ROUTES = [
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

function mdxFilesToPaths(section: 'docs' | 'help'): string[] {
  const base = join(REPO_ROOT, 'content', 'ru', section)
  const files = fg.sync(`**/*.mdx`, { cwd: base, onlyFiles: true })
  const paths: string[] = []
  for (const f of files) {
    const rel = f.replace(/\\/g, '/')
    const noExt = rel.replace(/\.mdx$/, '')
    const routeRest = noExt.endsWith('/index') ? noExt.slice(0, -'/index'.length) : noExt
    const path =
      routeRest === '' || routeRest === 'index'
        ? `/ru/${section}`
        : `/ru/${section}/${routeRest}`
    paths.push(path)
  }
  return paths
}

export function collectAllPaths(): string[] {
  const set = new Set<string>()
  for (const p of STATIC_ROUTES) set.add(p)
  for (const c of customers) set.add(`/customers/${c.slug}`)
  for (const p of posts) set.add(`/blog/${p.slug}`)
  for (const c of compares) set.add(`/compare/${c.slug}`)
  for (const p of mdxFilesToPaths('docs')) set.add(p)
  for (const p of mdxFilesToPaths('help')) set.add(p)
  return [...set].sort()
}

export async function loadRedirectsTargets(): Promise<string[]> {
  const raw = await readFile(join(REPO_ROOT, 'redirects.json'), 'utf8')
  const map = JSON.parse(raw) as Record<string, string>
  const out = new Set<string>()
  for (const to of Object.values(map)) {
    out.add(to)
    out.add(`/ru${to}`)
    out.add(`/en${to}`)
  }
  return [...out]
}

export function pathsToPageTargets(paths: string[]): PageTarget[] {
  return paths.map((path) => ({
    path,
    sources: pathToSources(path),
  }))
}

export async function runDiscover(baseUrl: string): Promise<UrlsManifest> {
  await mkdir(CACHE_ROOT, { recursive: true })
  const redirectExtras = await loadRedirectsTargets()
  const all = new Set([...collectAllPaths(), ...redirectExtras])
  const pages = pathsToPageTargets([...all].sort())
  const manifest: UrlsManifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: baseUrl.replace(/\/$/, ''),
    pages,
  }
  const { writeFile } = await import('node:fs/promises')
  await writeFile(URLS_JSON, JSON.stringify(manifest, null, 2), 'utf8')
  return manifest
}

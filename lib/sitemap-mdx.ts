import { readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import type { MetadataRoute } from 'next'

const LOCALES = new Set(['en', 'ru'])

/** Walks content en|ru trees for .mdx files; URLs match Nextra (index.mdx → directory). */
export function mdxFilesToSitemapEntries(
  contentRoot: string,
  site: string,
  now: Date,
): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = []

  function walk(dir: string): void {
    let names: string[]
    try {
      names = readdirSync(dir)
    } catch {
      return
    }
    for (const name of names) {
      if (name.startsWith('_') || name.startsWith('.')) continue
      const p = join(dir, name)
      let st: ReturnType<typeof statSync>
      try {
        st = statSync(p)
      } catch {
        continue
      }
      if (st.isDirectory()) {
        walk(p)
        continue
      }
      if (!name.endsWith('.mdx')) continue

      const rel = relative(contentRoot, p).replace(/\\/g, '/')
      const segments = rel.split('/')
      const locale = segments[0]
      if (!LOCALES.has(locale)) continue

      const rest = segments.slice(1)
      const file = rest[rest.length - 1]
      const dirs = rest.slice(0, -1)

      if (file === 'index.mdx') {
        const pathPart = dirs.join('/')
        const urlPath = pathPart ? `/${locale}/${pathPart}` : `/${locale}`
        out.push({
          url: `${site}${urlPath}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: pathPart.startsWith('docs') || pathPart.startsWith('help') ? 0.55 : 0.45,
        })
      } else {
        const slug = file.replace(/\.mdx$/, '')
        const pathPart = [...dirs, slug].join('/')
        out.push({
          url: `${site}/${locale}/${pathPart}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  }

  walk(contentRoot)
  return out
}

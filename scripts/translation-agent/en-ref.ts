import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { EN_REFERENCE_CACHE, REPO_ROOT } from './paths'

function dubUrlForPath(pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `https://dub.co${p}`
}

function cachePath(url: string): string {
  const h = createHash('sha256').update(url).digest('hex').slice(0, 24)
  return join(EN_REFERENCE_CACHE, `${h}.html`)
}

/** Plain-text-ish excerpt from HTML for LLM context (no full readability dep here). */
function stripHtml(html: string, maxLen = 12000): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

export async function getEnReferenceSnippet(
  pagePath: string,
  ruMdxRelativePath?: string | null,
): Promise<string | null> {
  if (ruMdxRelativePath?.startsWith('content/ru/')) {
    const enRel = ruMdxRelativePath.replace('content/ru/', 'content/en/')
    const abs = join(REPO_ROOT, enRel)
    if (existsSync(abs)) {
      const body = await readFile(abs, 'utf8')
      return body.slice(0, 14000)
    }
  }

  if (pagePath.startsWith('/ru/')) {
    return null
  }

  await mkdir(EN_REFERENCE_CACHE, { recursive: true })
  const url = dubUrlForPath(pagePath)
  const cache = cachePath(url)
  try {
    if (existsSync(cache)) {
      const html = await readFile(cache, 'utf8')
      return stripHtml(html)
    }
    const res = await fetch(url, {
      headers: {
        'user-agent': 'RevrouteTranslationAgent/1.0 (+https://revroute.ru)',
        accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const html = await res.text()
    await writeFile(cache, html, 'utf8')
    return stripHtml(html)
  } catch {
    return null
  }
}

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium, type Browser } from 'playwright'
import type { UrlsManifest } from './types'
import { PAGES_CACHE } from './paths'
import type { CrawlPageResult } from './types'

function pathToFilename(pathname: string): string {
  const safe = pathname.replace(/^\//, '').replace(/\//g, '_') || 'index'
  return `${safe}.json`
}

export async function crawlUrls(
  manifest: UrlsManifest,
  pathFilter?: Set<string>,
  browser?: Browser,
): Promise<CrawlPageResult[]> {
  await mkdir(PAGES_CACHE, { recursive: true })
  const ownBrowser = !browser
  const br = browser ?? (await chromium.launch())
  const ctx = await br.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'ru-RU',
  })
  const page = await ctx.newPage()
  const results: CrawlPageResult[] = []

  try {
    for (const { path: p } of manifest.pages) {
      if (pathFilter && !pathFilter.has(p)) continue
      const url = `${manifest.baseUrl}${p}`
      let status = 0
      let title = ''
      let textSample = ''
      let shotRel: string | null = null
      let crawlError: string | undefined
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        status = res?.status() ?? 0
        await new Promise((r) => setTimeout(r, 1500))
        title = await page.title()
        const text = await page.evaluate(() => document.body?.innerText ?? '')
        textSample = text.slice(0, 4000)
        const shotName = pathToFilename(p).replace('.json', '.png')
        const shotPath = join(PAGES_CACHE, shotName)
        await page.screenshot({ path: shotPath, fullPage: false })
        shotRel = join('translation-agent/pages', shotName).replace(/\\/g, '/')
      } catch (err) {
        status = status || 599
        const msg = err instanceof Error ? err.message : String(err)
        crawlError = msg
        textSample = `(navigation error: ${msg})`
      }
      const rec: CrawlPageResult = {
        path: p,
        url,
        status,
        ok: status >= 200 && status < 400,
        title,
        textSample,
        screenshotRelative: shotRel,
        fetchedAt: new Date().toISOString(),
        ...(crawlError ? { error: crawlError } : {}),
      }
      results.push(rec)
      await writeFile(join(PAGES_CACHE, pathToFilename(p)), JSON.stringify(rec, null, 2), 'utf8')
    }
  } finally {
    await ctx.close()
    if (ownBrowser) await br.close()
  }
  return results
}

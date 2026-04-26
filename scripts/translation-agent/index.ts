/**
 * Translation / copy QA agent CLI.
 *
 * Usage (from revroute-docs):
 *   npx tsx scripts/translation-agent/index.ts discover --base=https://revroute.ru
 *   npx tsx scripts/translation-agent/index.ts crawl --base=https://revroute.ru
 *   npx tsx scripts/translation-agent/index.ts review --pages=/,/pricing,/ru/help/...
 *   npx tsx scripts/translation-agent/index.ts review --offline   # passthrough, no API key
 *   npx tsx scripts/translation-agent/index.ts report
 *   npx tsx scripts/translation-agent/index.ts patch --apply
 *   npx tsx scripts/translation-agent/index.ts pr --report=reports/audit-YYYY-MM-DD/README.md
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { runDiscover } from './discover'
import { crawlUrls } from './crawl'
import { extractAllPages } from './extract'
import { reviewAll } from './reviewer'
import { writeAuditReport, defaultReportDir } from './report'
import { applyReviews, createBranchAndPr } from './apply'
import { PageReviewSchema, type CrawlPageResult, type Segment, type UrlsManifest } from './types'
import {
  URLS_JSON,
  REVIEW_AGGREGATE_JSON,
  SEGMENTS_JSON,
  REPO_ROOT,
} from './paths'

function argValue(args: string[], name: string): string | undefined {
  const pref = `${name}=`
  const hit = args.find((a) => a.startsWith(pref))
  if (hit) return hit.slice(pref.length)
  const idx = args.indexOf(name)
  if (idx >= 0) return args[idx + 1]
  return undefined
}

function parsePagesArg(args: string[]): Set<string> | undefined {
  const raw = argValue(args, '--pages')
  if (!raw) return undefined
  return new Set(
    raw.split(',').map((s) => {
      const t = s.trim()
      if (!t) return '/'
      return t.startsWith('/') ? t : `/${t}`
    }),
  )
}

function groupSegmentsByPath(segments: Segment[]): Map<string, Segment[]> {
  const m = new Map<string, Segment[]>()
  for (const s of segments) {
    const list = m.get(s.pagePath) ?? []
    list.push(s)
    m.set(s.pagePath, list)
  }
  return m
}

async function loadManifest(): Promise<UrlsManifest> {
  if (!existsSync(URLS_JSON)) {
    throw new Error(`Missing ${URLS_JSON}. Run: npm run agent:discover`)
  }
  return JSON.parse(await readFile(URLS_JSON, 'utf8')) as UrlsManifest
}

async function loadCrawlMap(
  manifest: UrlsManifest,
  filter?: Set<string>,
): Promise<Map<string, CrawlPageResult>> {
  const m = new Map<string, CrawlPageResult>()
  for (const { path: p } of manifest.pages) {
    if (filter && !filter.has(p)) continue
    const f = join(REPO_ROOT, '.cache/translation-agent/pages', `${p.replace(/^\//, '').replace(/\//g, '_') || 'index'}.json`)
    if (existsSync(f)) {
      m.set(p, JSON.parse(await readFile(f, 'utf8')) as CrawlPageResult)
    }
  }
  return m
}

async function main() {
  const [, , cmd, ...rest] = process.argv
  const base = argValue(rest, '--base') ?? 'https://revroute.ru'
  const filter = parsePagesArg(rest)
  const dryRun = !rest.includes('--apply')

  if (cmd === 'discover') {
    const m = await runDiscover(base)
    console.log(`Wrote ${m.pages.length} pages to ${URLS_JSON}`)
    return
  }

  if (cmd === 'crawl') {
    const manifest = await loadManifest()
    manifest.baseUrl = base.replace(/\/$/, '')
    const results = await crawlUrls(manifest, filter)
    console.log(`Crawled ${results.length} pages. Screens under .cache/translation-agent/pages/`)
    return
  }

  if (cmd === 'extract') {
    const manifest = await loadManifest()
    const segments = await extractAllPages(manifest.pages, filter)
    await writeFile(SEGMENTS_JSON, JSON.stringify(segments, null, 2), 'utf8')
    console.log(`Extracted ${segments.length} segments -> ${SEGMENTS_JSON}`)
    return
  }

  if (cmd === 'review') {
    if (rest.includes('--offline')) process.env.TRANSLATION_AGENT_OFFLINE = '1'
    const manifest = await loadManifest()
    const segments = await extractAllPages(manifest.pages, filter)
    await writeFile(SEGMENTS_JSON, JSON.stringify(segments, null, 2), 'utf8')
    const byPage = groupSegmentsByPath(segments)
    if (filter) {
      for (const p of filter) {
        if (!byPage.has(p)) byPage.set(p, [])
      }
    }
    const concurrency = Number(argValue(rest, '--concurrency') ?? '3')
    const reviews = await reviewAll(byPage, concurrency)
    const serial = Object.fromEntries(reviews)
    await writeFile(REVIEW_AGGREGATE_JSON, JSON.stringify(serial, null, 2), 'utf8')
    console.log(`Reviewed ${reviews.size} pages -> ${REVIEW_AGGREGATE_JSON}`)
    return
  }

  if (cmd === 'report') {
    const manifest = await loadManifest()
    const segments = existsSync(SEGMENTS_JSON)
      ? (JSON.parse(await readFile(SEGMENTS_JSON, 'utf8')) as Segment[])
      : await extractAllPages(manifest.pages, filter)
    const byPage = groupSegmentsByPath(segments)
    if (!existsSync(REVIEW_AGGREGATE_JSON)) {
      throw new Error(`Missing ${REVIEW_AGGREGATE_JSON}. Run: npm run agent:review`)
    }
    const rawAgg = JSON.parse(await readFile(REVIEW_AGGREGATE_JSON, 'utf8')) as Record<string, unknown>
    const reviews = new Map<string, import('./types').PageReview>()
    for (const [path, data] of Object.entries(rawAgg)) {
      const parsed = PageReviewSchema.safeParse(data)
      if (!parsed.success) {
        console.warn(`Skip invalid review for ${path}:`, parsed.error.message)
        continue
      }
      reviews.set(path, parsed.data)
    }
    const crawlMap = await loadCrawlMap(manifest, filter ?? new Set(reviews.keys()))
    const outDir = argValue(rest, '--out') ?? defaultReportDir()
    await writeAuditReport(outDir, crawlMap, reviews, byPage)
    console.log(`Report written to ${outDir}`)
    return
  }

  if (cmd === 'patch') {
    const segments = JSON.parse(await readFile(SEGMENTS_JSON, 'utf8')) as Segment[]
    const byPage = groupSegmentsByPath(segments)
    const rawAgg = JSON.parse(await readFile(REVIEW_AGGREGATE_JSON, 'utf8')) as Record<string, unknown>
    const reviews = new Map<string, import('./types').PageReview>()
    for (const [path, data] of Object.entries(rawAgg)) {
      const parsed = PageReviewSchema.safeParse(data)
      if (parsed.success) reviews.set(path, parsed.data)
    }
    const { files, diff } = await applyReviews(reviews, byPage, dryRun)
    console.log(dryRun ? `Dry-run: would touch ${files.join(', ')}` : `Patched ${files.length} files`)
    if (diff) console.log(diff.slice(0, 2000))
    return
  }

  if (cmd === 'pr') {
    const reportMd = argValue(rest, '--report')
    if (!reportMd) throw new Error('Usage: ... pr --report=reports/audit-.../README.md')
    const abs = join(REPO_ROOT, reportMd)
    const branch = `translation-polish-${new Date().toISOString().slice(0, 10)}`
    await createBranchAndPr(abs, branch)
    return
  }

  if (cmd === 'all') {
    if (rest.includes('--offline')) process.env.TRANSLATION_AGENT_OFFLINE = '1'
    await runDiscover(base)
    const manifest = await loadManifest()
    manifest.baseUrl = base.replace(/\/$/, '')
    await crawlUrls(manifest, filter)
    const segments = await extractAllPages(manifest.pages, filter)
    await writeFile(SEGMENTS_JSON, JSON.stringify(segments, null, 2), 'utf8')
    const byPage = groupSegmentsByPath(segments)
    if (filter) for (const p of filter) if (!byPage.has(p)) byPage.set(p, [])
    const concurrency = Number(argValue(rest, '--concurrency') ?? '3')
    const reviews = await reviewAll(byPage, concurrency)
    await writeFile(REVIEW_AGGREGATE_JSON, JSON.stringify(Object.fromEntries(reviews), null, 2), 'utf8')
    const crawlMap = await loadCrawlMap(manifest, filter ?? new Set(reviews.keys()))
    const outDir = defaultReportDir()
    await writeAuditReport(outDir, crawlMap, reviews, byPage)
    console.log(`Done. Report: ${outDir}`)
    return
  }

  console.log(`Commands: discover | crawl | extract | review | report | patch | pr | all`)
  process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

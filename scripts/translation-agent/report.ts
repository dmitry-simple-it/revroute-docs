import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { CrawlPageResult, PageReview, Segment } from './types'
import { REPO_ROOT } from './paths'

export type AuditBundle = {
  generatedAt: string
  pages: {
    path: string
    crawl?: CrawlPageResult
    review: PageReview
    segmentCount: number
  }[]
  summary: {
    avgScore: number
    totalIssues: number
    bySeverity: Record<string, number>
  }
}

export async function writeAuditReport(
  outDir: string,
  crawlByPath: Map<string, CrawlPageResult>,
  reviews: Map<string, PageReview>,
  segmentsByPath: Map<string, Segment[]>,
): Promise<AuditBundle> {
  await mkdir(outDir, { recursive: true })
  const pages: AuditBundle['pages'] = []
  let scoreSum = 0
  let n = 0
  const bySeverity: Record<string, number> = { minor: 0, major: 0, critical: 0 }
  let totalIssues = 0

  for (const [path, review] of [...reviews.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const crawl = crawlByPath.get(path)
    const segs = segmentsByPath.get(path) ?? []
    pages.push({
      path,
      crawl,
      review,
      segmentCount: segs.length,
    })
    scoreSum += review.page_score
    n += 1
    for (const issue of review.issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1
      totalIssues += 1
    }
  }

  const bundle: AuditBundle = {
    generatedAt: new Date().toISOString(),
    pages,
    summary: {
      avgScore: n ? Math.round((scoreSum / n) * 10) / 10 : 0,
      totalIssues,
      bySeverity,
    },
  }

  await writeFile(join(outDir, 'audit.json'), JSON.stringify(bundle, null, 2), 'utf8')

  const lines: string[] = []
  lines.push(`# Translation & copy audit`)
  lines.push('')
  lines.push(`Generated: ${bundle.generatedAt}`)
  lines.push('')
  lines.push(`## Summary`)
  lines.push('')
  lines.push(`| Metric | Value |`)
  lines.push(`|--------|-------|`)
  lines.push(`| Pages reviewed | ${pages.length} |`)
  lines.push(`| Average page score | ${bundle.summary.avgScore} |`)
  lines.push(`| Total issues | ${bundle.summary.totalIssues} |`)
  lines.push(`| Critical | ${bundle.summary.bySeverity.critical ?? 0} |`)
  lines.push(`| Major | ${bundle.summary.bySeverity.major ?? 0} |`)
  lines.push(`| Minor | ${bundle.summary.bySeverity.minor ?? 0} |`)
  lines.push('')

  lines.push(`## Pages`)
  lines.push('')
  lines.push(`| Path | Score | Issues | Segments | Crawl |`)
  lines.push(`|------|-------|--------|----------|-------|`)
  for (const p of pages) {
    const iss = p.review.issues.length
    const cr = p.crawl ? `${p.crawl.status} ${p.crawl.ok ? '✓' : '✗'}` : '—'
    lines.push(`| ${p.path} | ${p.review.page_score} | ${iss} | ${p.segmentCount} | ${cr} |`)
  }
  lines.push('')

  for (const p of pages) {
    lines.push(`### ${p.path}`)
    lines.push('')
    if (p.crawl?.screenshotRelative) {
      lines.push(`![Screenshot](../../.cache/${p.crawl.screenshotRelative})`)
      lines.push('')
    }
    if (p.review.issues.length === 0) {
      lines.push('_No issues reported._')
      lines.push('')
      continue
    }
    for (const issue of p.review.issues) {
      lines.push(`- **${issue.severity}** · ${issue.category} · \`${issue.segment_id}\``)
      lines.push(`  - Было: ${issue.quote}`)
      lines.push(`  - Лучше: ${issue.suggestion}`)
      lines.push(`  - Почему: ${issue.reason}`)
      if (issue.reference_en) lines.push(`  - EN ref: ${issue.reference_en}`)
      lines.push('')
    }
  }

  await writeFile(join(outDir, 'README.md'), lines.join('\n'), 'utf8')
  return bundle
}

export function defaultReportDir(): string {
  const d = new Date()
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return join(REPO_ROOT, 'reports', `audit-${stamp}`)
}

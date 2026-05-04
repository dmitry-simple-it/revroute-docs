/**
 * Mobile layout smoke: visit URLs at narrow viewport, check HTTP + horizontal overflow.
 *
 * Full site: `npx tsx scripts/mobile-layout-audit.ts`
 * Только пункты главного меню (продукт, решения, ресурсы, тарифы, партнёрам): `--landing-nav`
 *
 * Перед запуском: `npm run dev` (или задайте MOBILE_AUDIT_BASE).
 */
import path from 'path'
import http from 'http'
import { mkdirSync, writeFileSync } from 'fs'
import { chromium } from 'playwright'
import { customers } from '../content/customers'
import { posts } from '../content/blog'
import { compares } from '../content/compare'
import { integrations } from '../lib/integrations'
import { mdxFilesToSitemapEntries } from '../lib/sitemap-mdx'
import {
  resourcesLearningItems,
  resourcesReferenceItems,
  solutionsNavItems,
} from '../lib/nav-labels'

const OUT_DIR = path.join(process.cwd(), 'tmp', 'mobile-audit')
/** Subpixel / scrollbar gutter; real layout bugs are usually tens of px wider than viewport */
const OVERFLOW_TOLERANCE_PX = 48
const BETWEEN_PAGES_MS = 120
/** Между запросами на dev (Turbopack) — дольше, чтобы сервер не отваливался при компиляции */
const BETWEEN_PAGES_LANDING_MS = 2000
const GOTO_RETRIES = 3

function probeDevServer(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}/`, { timeout: 4000 }, (res) => {
      res.resume()
      resolve((res.statusCode ?? 0) < 500)
    })
    req.on('error', () => resolve(false))
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function resolveBase(): Promise<string> {
  const fromEnv = process.env.MOBILE_AUDIT_BASE?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  for (const port of [3000, 3001, 3002, 3003]) {
    for (const host of ['127.0.0.1', 'localhost']) {
      if (await probeDevServer(host, port)) {
        return `http://${host}:${port}`
      }
    }
  }
  throw new Error(
    'Не найден отвечающий dev-сервер на 3000–3003. Запустите `npm run dev` или задайте MOBILE_AUDIT_BASE.',
  )
}

function marketingPaths(): string[] {
  const staticRoutes = [
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
    '/compare',
    '/contact/support',
    '/tools/qr',
    '/tools/utm',
    '/tools/link-inspector',
  ]
  const paths = [...staticRoutes]
  for (const c of customers) paths.push(`/customers/${c.slug}`)
  for (const p of posts) paths.push(`/blog/${p.slug}`)
  for (const c of compares) paths.push(`/compare/${c.slug}`)
  for (const i of integrations) {
    if (!i.isComingSoon && !i.isGuide) paths.push(`/integrations/${i.slug}`)
  }
  return paths
}

function allPaths(base: string): string[] {
  const contentRoot = path.join(process.cwd(), 'content')
  const docEntries = mdxFilesToSitemapEntries(contentRoot, base, new Date())
  const docPaths = docEntries.map((e) => new URL(e.url).pathname)
  return [...new Set([...marketingPaths(), ...docPaths])].sort()
}

/** Публичные URL из шапки главного лендинга (синхронно с MarketingHeader + nav-labels). */
function mainLandingNavPublicPaths(): string[] {
  const product = ['/links', '/analytics', '/partners', '/enterprise', '/api', '/integrations']
  const solutions = solutionsNavItems.map((i) => i.href)
  const resources = [
    ...resourcesLearningItems.map((i) => i.href),
    ...resourcesReferenceItems.map((i) => i.href),
  ]
  return [...new Set(['/', ...product, ...solutions, ...resources, '/pricing', '/for-partners'])].sort(
    (a, b) => a.localeCompare(b),
  )
}

async function main() {
  const landingNavOnly = process.argv.includes('--landing-nav')
  const outDir = landingNavOnly ? path.join(OUT_DIR, 'landing-nav') : OUT_DIR
  mkdirSync(outDir, { recursive: true })
  const BASE = await resolveBase()
  const paths = landingNavOnly ? mainLandingNavPublicPaths() : allPaths(BASE)
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage', '--no-sandbox'],
  })
  // Narrow viewport only (isMobile/hasTouch can crash Chromium on some Windows GPU setups).
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })
  let page = await context.newPage()

  const failures: { path: string; issue: string }[] = []
  let ok = 0

  for (let i = 0; i < paths.length; i++) {
    const pathname = paths[i]
    const url = `${BASE}${pathname}`
    if (i % 25 === 0 || paths.length <= 30) {
      console.error(`[mobile-audit] ${i + 1}/${paths.length} ${pathname}`)
    }
    try {
      let resp = null
      for (let attempt = 0; attempt < GOTO_RETRIES; attempt++) {
        try {
          resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
          break
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          if (msg.includes('ERR_CONNECTION_REFUSED') && attempt < GOTO_RETRIES - 1) {
            console.error(`[mobile-audit] retry ${attempt + 1}/${GOTO_RETRIES} after refused: ${pathname}`)
            await page.waitForTimeout(3000)
            continue
          }
          throw err
        }
      }
      const status = resp?.status() ?? 0
      if (!resp?.ok()) {
        failures.push({ path: pathname, issue: `HTTP ${status}` })
        await page.screenshot({ path: path.join(outDir, `fail-${safeName(pathname)}.png`), fullPage: true }).catch(() => {})
        continue
      }
      await page.waitForTimeout(250)
      const { scrollWidth, clientWidth, overflow } = await page.evaluate((tol) => {
        const el = document.documentElement
        const body = document.body
        const sw = Math.max(el.scrollWidth, body?.scrollWidth ?? 0)
        const cw = el.clientWidth
        return { scrollWidth: sw, clientWidth: cw, overflow: sw > cw + tol }
      }, OVERFLOW_TOLERANCE_PX)
      if (overflow) {
        failures.push({
          path: pathname,
          issue: `horizontal overflow scrollWidth=${scrollWidth} clientWidth=${clientWidth}`,
        })
        await page.screenshot({ path: path.join(outDir, `overflow-${safeName(pathname)}.png`), fullPage: true })
      } else {
        ok++
      }
    } catch (e) {
      failures.push({ path: pathname, issue: e instanceof Error ? e.message : String(e) })
      await page.screenshot({ path: path.join(outDir, `err-${safeName(pathname)}.png`), fullPage: true }).catch(() => {})
      try {
        await page.close()
      } catch {
        /* ignore */
      }
      page = await context.newPage()
    }
    await page.waitForTimeout(landingNavOnly ? BETWEEN_PAGES_LANDING_MS : BETWEEN_PAGES_MS)
  }

  await page.close()
  await browser.close()

  const report = {
    scope: landingNavOnly ? 'landing-nav' : 'full',
    base: BASE,
    viewport: { width: 390, height: 844 },
    tested: paths.length,
    paths,
    ok,
    failures,
  }
  const reportPath = path.join(outDir, 'report.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')
  console.log(`Mobile audit: ${ok}/${paths.length} OK, ${failures.length} issues. Report: ${reportPath}`)
  if (failures.length) {
    console.log(JSON.stringify(failures, null, 2))
    process.exitCode = 1
  }
}

function safeName(p: string): string {
  return p.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 120) || 'root'
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

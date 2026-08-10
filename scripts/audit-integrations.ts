/**
 * Аудит каталога интеграций.
 *
 * Для каждой записи `lib/integrations.ts` показывает четыре факта:
 *   1. должна ли у неё быть страница `/integrations/<slug>` (правило isPublished
 *      из app/(marketing)/integrations/[slug]/page.tsx) — колонка «ожид.»;
 *   2. какой HTTP-статус реально отдаёт этот URL — колонка «факт»;
 *   3. сколько ссылок на неё есть в дереве исходников (доки, лендинги) — «в коде»;
 *   4. сколько ссылок на неё стоит в отрендеренном HTML индекса каталога —
 *      «с индекса»; карточки там генерируются из данных, в исходниках их не видно.
 *
 * Плюс две обратные проверки: нет ли ссылок на `/integrations/<slug>`, которого
 * нет в каталоге, и не ссылается ли индекс на страницу, отдающую 404.
 *
 * Запуск:  npm run audit:integrations -- --base=http://localhost:3087
 * Без --base сетевые проверки пропускаются (колонки «факт»/«с индекса» пусты).
 * Флаг --strict возвращает ненулевой код выхода при любой найденной проблеме.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { request as httpRequest } from 'node:http'
import { dirname, join, relative, sep } from 'node:path'
import { integrations, type Integration } from '../lib/integrations'

/** Корень репозитория: ближайший вверх каталог с package.json. */
function findRoot(start: string): string {
  let dir = start
  while (!existsSync(join(dir, 'package.json'))) {
    const up = dirname(dir)
    if (up === dir) throw new Error('package.json не найден выше ' + start)
    dir = up
  }
  return dir
}

const ROOT = findRoot(process.cwd())

/** Копия правила публикации со страницы `[slug]`. Расходиться они не должны. */
const isPublished = (i: Integration) => !i.isComingSoon && !i.isGuide && !i.isDemo

const baseArg = process.argv.find((a) => a.startsWith('--base='))
const BASE = baseArg ? baseArg.slice('--base='.length).replace(/\/$/, '') : null

/** Каталоги, где ссылки писать негде: артефакты сборки и зависимости. */
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  '.cache',
  '.claude',
  '.vercel',
  'tmp',
  'public',
  'out',
  'offers-static',
])
const SCAN_EXT = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mdx', '.md', '.json']

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue
      walk(full, acc)
    } else if (SCAN_EXT.some((e) => entry.endsWith(e))) {
      acc.push(full)
    }
  }
  return acc
}

/**
 * Файлы, которые не считаются источником входящих ссылок:
 *  - сама страница `[slug]` (её `/integrations/<slug>` — это canonical и
 *    og самой себя, а не ссылка извне);
 *  - sitemap (машинная карта, не навигация);
 *  - служебные манифесты и скрипты аудита.
 */
const NOT_A_LINK_SOURCE = [
  join('app', '(marketing)', 'integrations', '[slug]', 'page.tsx'),
  join('app', 'sitemap.ts'),
  join('lib', 'generated', 'lastmod.json'),
  join('scripts', 'audit-integrations.ts'),
  join('scripts', 'mobile-layout-audit.ts'),
  join('scripts', 'translation-agent', 'source-map.ts'),
  join('scripts', 'translation-agent', 'discover.ts'),
]

type Hit = { file: string; line: number; text: string }

const files = walk(ROOT).filter(
  (f) => !NOT_A_LINK_SOURCE.some((skip) => f.endsWith(sep + skip) || f.endsWith(skip)),
)

/**
 * Ссылка на карточку каталога: либо относительный путь `/integrations/<slug>`
 * от корня сайта, либо абсолютный URL на revroute.ru.
 *
 * Лидирующий разделитель обязателен — иначе в выборку попадают чужие пути,
 * у которых `/integrations/` в середине: `/docs/integrations/quickstart`
 * (документация), `app.revroute.ru/integrations/hubspot` (кабинет),
 * `app.short.io/settings/integrations/api-key` (сторонний сервис).
 */
const LINK_RE = /(^|[\s"'(\[=,])(?:https?:\/\/(?:www\.)?revroute\.ru)?\/integrations\/([a-z0-9-]+)/gi

const hitsBySlug = new Map<string, Hit[]>()
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  if (!src.includes('/integrations/')) continue
  const lines = src.split('\n')
  lines.forEach((text, idx) => {
    for (const m of text.matchAll(LINK_RE)) {
      const slug = m[2].toLowerCase()
      const arr = hitsBySlug.get(slug) ?? []
      arr.push({ file: relative(ROOT, file), line: idx + 1, text: text.trim().slice(0, 120) })
      hitsBySlug.set(slug, arr)
    }
  })
}

/**
 * Ходим через `node:http` без keep-alive, а не через `fetch`: дев-сервер Next
 * рвёт переиспользованные сокеты, и undici отдаёт «fetch failed» вместо
 * реального статуса. Плюс ретраи — первая сборка маршрута занимает секунды.
 */
function once(path: string): Promise<{ code: number; body: string }> {
  return new Promise((resolve, reject) => {
    const target = new URL(BASE + path)
    const req = httpRequest(
      {
        host: target.hostname,
        port: target.port,
        path: target.pathname,
        agent: false,
        headers: { connection: 'close' },
      },
      (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (c) => (body += c))
        res.on('end', () => resolve({ code: res.statusCode ?? 0, body }))
      },
    )
    req.on('error', reject)
    req.setTimeout(120_000, () => req.destroy(new Error('timeout')))
    req.end()
  })
}

async function request(path: string): Promise<{ code: string; body: string }> {
  if (!BASE) return { code: '—', body: '' }
  let lastError = ''
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await once(path)
      return { code: String(res.code), body: res.body }
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e)
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  return { code: `ERR(${lastError.slice(0, 14)})`, body: '' }
}

const status = async (path: string) => (await request(path)).code

const pad = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - s.length))
const W = [18, 12, 8, 7, 12, 12]

async function main() {
  // Карточки индекса каталога генерируются из данных, поэтому в исходниках
  // строки `/integrations/<slug>` нет — увидеть их можно только в отрендеренном
  // HTML. Без этой проверки сироты «чинятся» на бумаге, а не на странице.
  const index = await request('/integrations')
  const fromIndex = new Map<string, number>()
  for (const m of index.body.matchAll(/href="\/integrations\/([a-z0-9-]+)"/g)) {
    fromIndex.set(m[1], (fromIndex.get(m[1]) ?? 0) + 1)
  }

  const rows: {
    slug: string
    kind: string
    expected: string
    code: string
    links: number
    onIndex: number
  }[] = []

  for (const i of integrations) {
    const kind = i.isGuide
      ? 'guide'
      : i.isComingSoon
        ? 'coming-soon'
        : i.isDemo
          ? 'demo'
          : 'page'
    rows.push({
      slug: i.slug,
      kind,
      expected: isPublished(i) ? '200' : '404',
      code: await status(`/integrations/${i.slug}`),
      links: (hitsBySlug.get(i.slug) ?? []).length,
      onIndex: fromIndex.get(i.slug) ?? 0,
    })
  }

  console.log('')
  console.log(
    pad('slug', W[0]) +
      pad('тип', W[1]) +
      pad('ожид.', W[2]) +
      pad('факт', W[3]) +
      pad('в коде', W[4]) +
      pad('с индекса', W[5]),
  )
  console.log('-'.repeat(W.reduce((a, b) => a + b, 0)))

  let bad = 0
  for (const r of rows) {
    const mismatch = Boolean(BASE) && r.code !== r.expected
    // Сирота — страница, на которую не ведёт ни одна внутренняя ссылка:
    // ни из исходников (доки, лендинги), ни с индекса каталога.
    const orphan = r.expected === '200' && r.links === 0 && r.onIndex === 0
    // Ссылка с индекса на страницу, которой нет, — это внутренний 404.
    const linkTo404 = r.expected === '404' && r.onIndex > 0
    if (mismatch || orphan || linkTo404) bad++
    console.log(
      pad(r.slug, W[0]) +
        pad(r.kind, W[1]) +
        pad(r.expected, W[2]) +
        pad(r.code, W[3]) +
        pad(String(r.links), W[4]) +
        pad(String(r.onIndex), W[5]) +
        (mismatch ? '  ✗ статус не совпал' : '') +
        (orphan ? '  ✗ сирота: ни одной входящей ссылки' : '') +
        (linkTo404 ? '  ✗ индекс каталога ссылается на 404' : ''),
    )
  }

  // Ссылки на слаги, которых нет в каталоге, — это гарантированный 404.
  const known = new Set(integrations.map((i) => i.slug))
  const dangling = [...hitsBySlug.keys()].filter((s) => !known.has(s))
  if (dangling.length) {
    console.log('')
    console.log('ВНУТРЕННИЕ ССЫЛКИ НА НЕСУЩЕСТВУЮЩИЕ СЛАГИ:')
    for (const s of dangling) {
      for (const h of hitsBySlug.get(s)!) {
        console.log(`  ✗ /integrations/${s} ← ${h.file}:${h.line}`)
      }
    }
    bad += dangling.length
  }

  console.log('')
  console.log(`/integrations → ${index.code}`)
  console.log('')
  console.log(
    `Записей: ${integrations.length}; со страницей: ${integrations.filter(isPublished).length}; проблем: ${bad}`,
  )

  if (process.argv.includes('--strict') && bad > 0) process.exit(1)
}

void main()

#!/usr/bin/env node
/**
 * Генератор public/docs-index.json — индекса документации для админского MCP
 * (инструмент search_docs в приложении RevRoute).
 *
 * Формат — контракт с приложением (apps/web/lib/admin-mcp/docs-search.ts),
 * менять только вместе с ним:
 *   { version: 1, generatedAt, pages: [{ url, locale, section, title,
 *     sidebarTitle, description, headings: [{ id, level, text }], body }] }
 *
 * Страницы — те же, что в карте сайта и llms-full.txt (scripts/lib/mdx-text.mjs):
 * обе локали, без оферт из LEGAL_NOINDEX, без noindex во frontmatter и без
 * заглушек короче STUB_MIN_CHARS. Якоря заголовков берутся так же, как их
 * ставит Nextra: явный `[#id]` в тексте заголовка, иначе авто-слаг.
 *
 * Совместимость: сборка идёт на node:20-slim (Dockerfile), поэтому только API
 * Node 20 и никаких зависимостей.
 *
 * Запуск: node scripts/build-docs-index.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  STUB_MIN_CHARS,
  collectPages,
  isNoindex,
  mdxToText,
  parseFrontmatter,
  readLegalNoindex,
} from './lib/mdx-text.mjs'

const SITE = 'https://revroute.ru'
const LOCALES = ['ru', 'en']

/** Потолок тела страницы: privacy.mdx — 76 КБ, без потолка оферты съедят заметную часть индекса. */
const MAX_BODY_CHARS = 40000

const HEADING = /^(#{2,6})\s+(.*?)(?:\s+\[#([a-z0-9_-]+)\])?\s*$/
const FENCE = /^[ \t]*(```+|~~~+)/
const EXPLICIT_ANCHOR = /^(#{1,6}[ \t]+.*?)[ \t]+\[#[a-z0-9_-]+\][ \t]*$/gm

/** Текст заголовка без inline-разметки — так его видит читатель и слаггер Nextra. */
function plainHeading(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*]/g, '')
    .trim()
}

/**
 * Слаг по правилу github-slugger (им пользуется Nextra): нижний регистр,
 * выкинуть всё, кроме букв (включая кириллицу), цифр, `-`, `_` и пробелов,
 * затем каждый пробел → `-`.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-')
}

/**
 * Заголовки H2–H6 страницы из сырого MDX (до mdxToText), вне блоков кода.
 * Повторы слага нумеруются `-1`, `-2`, как у github-slugger.
 */
export function headingsOf(body) {
  const headings = []
  const seen = new Map()
  let fence = null
  for (const line of body.replace(/\r\n/g, '\n').split('\n')) {
    const f = line.match(FENCE)
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null
      continue
    }
    if (f) {
      fence = f[1]
      continue
    }
    const m = line.match(HEADING)
    if (!m) continue
    const text = plainHeading(m[2])
    let id = m[3] ?? slugify(text)
    if (seen.has(id)) {
      const n = seen.get(id) + 1
      seen.set(id, n)
      id = `${id}-${n}`
    }
    seen.set(id, seen.get(id) ?? 0)
    headings.push({ id, level: m[1].length, text })
  }
  return headings
}

/** Обрезка по границе абзаца, без приписок (clampBody генератора llms-full добавляет URL). */
function clampPlain(text, max) {
  if (text.length <= max) return text
  const head = text.slice(0, max)
  let cut = head.lastIndexOf('\n\n')
  if (cut < max * 0.4) cut = head.lastIndexOf('\n')
  if (cut <= 0) cut = max
  return text.slice(0, cut).trimEnd()
}

const str = (v) => (typeof v === 'string' ? v : '')

export function buildIndex({ repoRoot, site }) {
  const legalNoindex = readLegalNoindex(repoRoot)
  const contentRoot = join(repoRoot, 'content')
  const pages = []
  const seen = new Set()

  for (const locale of LOCALES) {
    for (const page of collectPages({ contentRoot, locale, site, legalNoindex })) {
      if (seen.has(page.url)) continue
      const { data, body } = parseFrontmatter(readFileSync(page.file, 'utf8'))
      if (isNoindex(data)) continue

      const title = str(data.title) || (page.route[page.route.length - 1] ?? 'RevRoute')
      let text = mdxToText(body.replace(EXPLICIT_ANCHOR, '$1'))
      // Первый H1 обычно дублирует frontmatter-title — убираем повтор, как в llms-full.
      const h1 = text.match(/^#[ \t]+(.+?)[ \t]*\n/)
      if (h1 && h1[1].replace(/[*_`]/g, '').trim() === title.trim()) {
        text = text.slice(h1[0].length).trimStart()
      }
      if (text.length < STUB_MIN_CHARS) continue

      seen.add(page.url)
      pages.push({
        url: page.url,
        locale: page.locale,
        section: page.section,
        title,
        sidebarTitle: str(data.sidebarTitle),
        description: str(data.description),
        headings: headingsOf(body),
        body: clampPlain(text, MAX_BODY_CHARS),
      })
    }
  }

  return { version: 1, generatedAt: new Date().toISOString(), pages }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const index = buildIndex({ repoRoot, site: SITE })
  const json = JSON.stringify(index)
  const outFile = join(repoRoot, 'public', 'docs-index.json')
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, json)
  console.log(`docs-index: ${index.pages.length} страниц, ${Math.round(Buffer.byteLength(json) / 1024)} КБ`)
}

#!/usr/bin/env node
/**
 * Защита от регрессии, которая роняет ВЕСЬ раздел документации.
 *
 * Nextra строит page map не только по content/, но и по app/: она глобит
 * `app/**\/page.tsx` (пропуская каталоги на `_` и `[`), достаёт из модуля
 * `metadata` и кладёт `metadata.title` в page map КАК ЕСТЬ. Дальше
 * nextra-theme-docs рендерит это значение React-ребёнком. Если title — объект
 * (`{ absolute: … }` или `{ default, template }`), падают все 322 страницы
 * докс: «Objects are not valid as a React child (found: object with keys
 * {absolute})», и прод-сборка не проходит вовсе.
 *
 * Правило: в статических app/**\/page.tsx `title` должен быть СТРОКОЙ.
 * В динамических маршрутах (каталог в квадратных скобках) объект допустим —
 * Nextra такие файлы не глобит.
 *
 * Исключение — app/layout.tsx: это layout, а не page, в page map он не идёт.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Статические app/**\/page.tsx — ровно те, что попадают в page map Nextra.
 *
 * Обход рукописный, БЕЗ `fs.globSync`: глоб появился в Node 22, а образ сборки —
 * `node:20-slim` (Dockerfile, стадия builder). Там `globSync` === undefined, и
 * этот скрипт ронял бы `prebuild` на проде — то есть страж падал бы вместо того,
 * что он охраняет.
 *
 * Каталоги на `[` (динамические маршруты) и на `_` (приватные) Nextra не глобит,
 * поэтому объект в `title` там безопасен и проверять их не нужно.
 */
function findPages(dir, rel = '') {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('[') || entry.name.startsWith('_')) continue
      out.push(...findPages(join(dir, entry.name), rel ? `${rel}/${entry.name}` : entry.name))
    } else if (entry.name === 'page.tsx') {
      out.push(rel ? `app/${rel}/page.tsx` : 'app/page.tsx')
    }
  }
  return out
}

const pages = findPages(join(ROOT, 'app'))

const problems = []

for (const rel of pages) {
  const src = readFileSync(join(ROOT, rel), 'utf8')
  // Ищем `title:` внутри export const metadata, за которым идёт `{`.
  const meta = src.match(/export const metadata[^=]*=\s*\{[\s\S]*?\n\}/)
  if (!meta) continue
  const m = meta[0].match(/(^|\n)\s*title:\s*\{/)
  if (m) {
    problems.push(
      `${relative('.', rel)}: title задан объектом. Nextra положит его в page map ` +
        `и рендер документации упадёт. Используйте строку; если нужно обойти ` +
        `шаблон «%s | Revroute» — впишите бренд прямо в строку либо уберите его.`,
    )
  }
}

if (problems.length) {
  console.error('[check-app-metadata] НАЙДЕНЫ ПРОБЛЕМЫ:')
  for (const p of problems) console.error('  ✗ ' + p)
  process.exit(1)
}

console.log(`[check-app-metadata] OK — проверено статических страниц: ${pages.length}`)

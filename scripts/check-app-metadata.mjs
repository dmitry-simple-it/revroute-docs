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
import { readFileSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'node:fs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Статические app/**\/page.tsx — ровно те, что попадают в page map Nextra. */
const pages = globSync('app/**/page.tsx', { cwd: ROOT }).filter((p) => {
  const segments = p.split(/[\\/]/)
  return !segments.some((s) => s.startsWith('[') || s.startsWith('_'))
})

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

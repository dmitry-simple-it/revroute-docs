/**
 * Smoke-проверка после сборки: страница, от которой в HTML осталось меньше
 * MIN_CHARS текста, считается пустой и роняет сборку.
 *
 * Зачем: с переезда на Nextra (март 2026) 30 страниц рендерились пустыми —
 * Mintlify-компоненты были подменены заглушкой, отдававшей null. Все они при
 * этом отвечали HTTP 200, поэтому ни мониторинг, ни линк-чекер поломку не
 * видели: её нашёл клиент, открывший ссылку глазами.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = '.next/server/app'
const MIN_CHARS = 400

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (entry.endsWith('.html')) out.push(p)
  }
  return out
}

function textLength(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/g, ' ') // сайдбар есть на каждой странице
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length
}

let files
try {
  files = walk(ROOT)
} catch {
  console.error(`check-empty-pages: нет каталога ${ROOT} — сборка не создала HTML`)
  process.exit(1)
}

// Страницы без собственного текста по замыслу: служебная 404 и маршруты,
// которые только редиректят (Next помечает их разметкой __next_error__).
const isByDesignEmpty = (file, html) =>
  file.endsWith('_not-found.html') || html.includes('id="__next_error__"')

const empty = files
  .map((f) => [f, readFileSync(f, 'utf8')])
  .filter(([f, html]) => !isByDesignEmpty(f, html))
  .map(([f, html]) => [f, textLength(html)])
  .filter(([, len]) => len < MIN_CHARS)

if (empty.length) {
  console.error(`\ncheck-empty-pages: страниц короче ${MIN_CHARS} символов — ${empty.length}:`)
  for (const [f, len] of empty) console.error(`  ${len.toString().padStart(5)}  ${f}`)
  console.error('\nСкорее всего компонент отрендерился в пустоту. Откройте страницу и посмотрите.\n')
  process.exit(1)
}

console.log(`check-empty-pages: ${files.length} страниц, пустых нет`)

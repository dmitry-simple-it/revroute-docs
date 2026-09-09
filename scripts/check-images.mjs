/**
 * Отчёт о картинках в контенте, которых нет в public/.
 *
 * Не входит в цепочку сборки намеренно: на 09.09.2026 в справке 80 таких
 * ссылок (вся папка /images/partners-overview/ приехала из dub-доков без
 * файлов), и блокирующая проверка просто уронила бы прод-сборку. Скрипт нужен,
 * чтобы число было измеримым и не росло: `npm run check:images`.
 */
import { existsSync } from 'node:fs'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.mdx') ? [p] : []
  })

const pattern = /(?:!\[[^\]]*\]\(|src=["'])(\/images\/[^)"']+)/g
const missing = new Map()

for (const file of walk('content')) {
  for (const [, src] of readFileSync(file, 'utf8').matchAll(pattern)) {
    const path = src.split('#')[0]
    if (!existsSync('public' + path)) {
      missing.set(path, [...(missing.get(path) ?? []), file])
    }
  }
}

const uses = [...missing.values()].reduce((n, files) => n + files.length, 0)
if (!missing.size) {
  console.log('check-images: битых ссылок на локальные картинки нет')
  process.exit(0)
}

console.log(`check-images: ${missing.size} файлов не найдено, ${uses} ссылок:\n`)
for (const [path, files] of [...missing].sort()) {
  console.log(`  ${path}  (${files.length})`)
}

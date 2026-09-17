/**
 * Консистентность redirects.json (легаси-URL → контентные пути).
 *
 * Инварианты:
 *  1. destination существует как страница content/ru (…/path.mdx или …/path/index.mdx);
 *  2. нет цепочек: destination сам не является ключом карты;
 *  3. ключ не совпадает с живой страницей (иначе редирект затенит её URL).
 *
 * Прогоняется в prebuild рядом с check:metadata. Падает с кодом 1 и списком
 * нарушений. Проверяем только content/ru: карта беспрефиксная, применяется к
 * обеим локалям, а ru — полное надмножество en (см. mirrorGaps в layout).
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const redirects = JSON.parse(readFileSync('./redirects.json', 'utf8'))
const CONTENT = join(process.cwd(), 'content', 'ru')

const pageExists = (route) => {
  const rel = route.replace(/^\//, '')
  return (
    existsSync(join(CONTENT, `${rel}.mdx`)) ||
    existsSync(join(CONTENT, rel, 'index.mdx'))
  )
}

const errors = []
for (const [source, destination] of Object.entries(redirects)) {
  if (!destination.startsWith('/')) {
    errors.push(`«${source}» → «${destination}»: destination не начинается с /`)
    continue
  }
  if (!pageExists(destination)) {
    errors.push(`«${source}» → «${destination}»: целевой страницы нет в content/ru`)
  }
  if (Object.prototype.hasOwnProperty.call(redirects, destination)) {
    errors.push(
      `«${source}» → «${destination}»: цепочка — destination сам является ключом (двойной хоп)`,
    )
  }
  if (pageExists(source)) {
    errors.push(`«${source}»: ключ совпадает с живой страницей — редирект затенит её URL`)
  }
}

if (errors.length) {
  console.error(`check:redirects — ${errors.length} нарушений:`)
  for (const e of errors) console.error('  •', e)
  process.exit(1)
}
console.log(`check:redirects — OK (${Object.keys(redirects).length} записей)`)

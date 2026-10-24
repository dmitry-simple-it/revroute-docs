/**
 * Индекс поиска Pagefind без внутренних инструкций (content/*\/internal).
 *
 * Pagefind индексирует каждую собранную HTML-страницу и не смотрит ни на
 * `<meta name="robots" content="noindex">`, ни на наш frontmatter — поэтому
 * 19.10.2026 страница /ru/internal/admin-mcp сразу нашлась через поиск по
 * сайту, хотя из меню, sitemap и машинных индексов была исключена. Надёжнее
 * всего не давать Pagefind эти файлы вовсе: собранный сайт копируется во
 * временный каталог без `<locale>/internal*`, индекс строится по копии.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = '.next/server/app'
const OUTPUT = 'public/_pagefind'
// npx is a .cmd shim on Windows; invoke the installed CLI through Node.
const PAGEFIND_CLI = fileURLToPath(new URL('./runner/bin.cjs', import.meta.resolve('pagefind')))

/** `ru/internal`, `ru/internal.html`, `ru/internal/…` — для любой локали. */
const isInternal = (path) => {
  const rel = relative(SITE, path).split(sep).join('/')
  return /^[a-z]{2}\/internal(?:$|\.|\/)/.test(rel)
}

const tmp = mkdtempSync(join(tmpdir(), 'pagefind-site-'))
try {
  cpSync(SITE, tmp, { recursive: true, filter: (src) => !isInternal(src) })
  execFileSync(process.execPath, [PAGEFIND_CLI, '--site', tmp, '--output-path', OUTPUT], {
    stdio: 'inherit',
  })
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

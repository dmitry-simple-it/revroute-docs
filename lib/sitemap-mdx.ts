import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import type { MetadataRoute } from 'next'

const LOCALES = ['ru', 'en'] as const
const LOCALE_SET = new Set<string>(LOCALES)

/**
 * BCP-47 коды локалей для hreflang. Значения обязаны совпадать с теми, что
 * отдаёт шаблон доков (`app/(docs)/[locale]/[[...mdxPath]]/page.tsx`): если
 * `<head>` и sitemap объявят разные коды, Google считает группу
 * противоречивой и отбрасывает её целиком.
 */
const HREFLANG: Record<string, string> = { ru: 'ru-RU', en: 'en' }

// Legal contract offers are served noindex — keep them out of the sitemap.
// Public-trust documents (privacy, terms) stay indexed and listed.
const LEGAL_NOINDEX = new Set([
  'saas-license',
  'tariffs',
  'recurring-payments',
  'agency-offer',
  'partner-program',
  'services-offer',
  'reseller',
])

/**
 * Манифест дат последнего коммита, который собирает
 * `scripts/build-lastmod-manifest.mjs` на prebuild. Ключ — путь от корня
 * репозитория со слэшами (`content/ru/docs/index.mdx`), значение — ISO-дата.
 *
 * Читаем лениво и через fs, а не import: если prebuild не отработал (dev без
 * генерации, сборка из архива), отсутствие файла не должно ронять сборку —
 * просто уходим на mtime.
 */
let manifestCache: Record<string, string> | null = null

function manifest(): Record<string, string> {
  if (manifestCache) return manifestCache
  try {
    const raw = readFileSync(join(process.cwd(), 'lib', 'generated', 'lastmod.json'), 'utf8')
    const parsed: unknown = JSON.parse(raw)
    manifestCache = parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {}
  } catch {
    manifestCache = {}
  }
  return manifestCache
}

/**
 * Дата последнего изменения файла для `lastmod`.
 *
 * Порядок деградации: дата коммита из манифеста → mtime файла (в Docker это
 * время COPY, поэтому только как запасной вариант) → текущая дата.
 *
 * @param repoRelPath путь от корня репозитория, слэшами: `app/(landing)/page.tsx`
 */
export function lastModOf(repoRelPath: string): Date {
  const iso = manifest()[repoRelPath]
  if (iso) {
    const d = new Date(iso)
    if (!Number.isNaN(d.getTime())) return d
  }
  try {
    return statSync(join(process.cwd(), repoRelPath)).mtime
  } catch {
    return new Date()
  }
}

/**
 * Дата первого из кандидатов, который известен манифесту или лежит на диске.
 *
 * Нужна статическим маршрутам: `/pricing` живёт в `app/(landing)/pricing`, а
 * `/api` — в `app/(marketing)/api`, и страницы между группами переезжают.
 * Перебор кандидатов избавляет от ручной таблицы «маршрут → файл».
 */
export function lastModOfFirst(candidates: readonly string[]): Date {
  const m = manifest()
  for (const rel of candidates) {
    if (m[rel]) return lastModOf(rel)
  }
  for (const rel of candidates) {
    if (existsSync(join(process.cwd(), rel))) return lastModOf(rel)
  }
  return new Date()
}

/** Максимальная из дат (для листингов вроде /blog и /changelog). */
export function newestDate(dates: readonly string[], fallback: Date): Date {
  let best: Date | null = null
  for (const raw of dates) {
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) continue
    if (!best || d > best) best = d
  }
  return best ?? fallback
}

/**
 * Существует ли страница в указанной локали.
 * Nextra отдаёт один и тот же URL и для `<rest>.mdx`, и для `<rest>/index.mdx`,
 * поэтому проверяем оба варианта — та же логика, что в шаблоне доков.
 */
function pageExists(contentRoot: string, locale: string, rest: string[]): boolean {
  const base = join(contentRoot, locale, ...rest)
  return existsSync(`${base}.mdx`) || existsSync(join(base, 'index.mdx'))
}

/**
 * hreflang-группа для пары RU/EN.
 * Отдаём только когда зеркало реально существует: Google отбрасывает всю
 * языковую группу, если хотя бы один URL в ней отвечает 404.
 */
function alternatesFor(
  contentRoot: string,
  site: string,
  rest: string[],
  suffix: string,
): Record<string, string> | undefined {
  if (!LOCALES.every((locale) => pageExists(contentRoot, locale, rest))) return undefined
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [HREFLANG[locale], `${site}/${locale}${suffix}`])),
    // Рынок РФ — по умолчанию русская версия.
    'x-default': `${site}/ru${suffix}`,
  }
}

/** Walks content en|ru trees for .mdx files; URLs match Nextra (index.mdx → directory). */
export function mdxFilesToSitemapEntries(contentRoot: string, site: string): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = []

  function push(rest: string[], locale: string, relPath: string, isLegal: boolean): void {
    const suffix = rest.length > 0 ? `/${rest.join('/')}` : ''
    const languages = alternatesFor(contentRoot, site, rest, suffix)
    const pathPart = rest.join('/')
    out.push({
      url: `${site}/${locale}${suffix}`,
      lastModified: lastModOf(relPath),
      // Правовые документы переиздаются раз в год-два, справка — по мере правок.
      changeFrequency: isLegal ? 'yearly' : 'monthly',
      priority: pathPart.startsWith('docs') || pathPart.startsWith('help') ? 0.55 : 0.45,
      ...(languages ? { alternates: { languages } } : {}),
    })
  }

  function walk(dir: string): void {
    let names: string[]
    try {
      names = readdirSync(dir)
    } catch {
      return
    }
    for (const name of names) {
      if (name.startsWith('_') || name.startsWith('.')) continue
      const p = join(dir, name)
      let st: ReturnType<typeof statSync>
      try {
        st = statSync(p)
      } catch {
        continue
      }
      if (st.isDirectory()) {
        walk(p)
        continue
      }
      if (!name.endsWith('.mdx')) continue

      const rel = relative(contentRoot, p).replace(/\\/g, '/')
      const segments = rel.split('/')
      const locale = segments[0]
      if (!LOCALE_SET.has(locale)) continue

      const relPath = `content/${rel}`
      const rest = segments.slice(1)
      const file = rest[rest.length - 1]
      const dirs = rest.slice(0, -1)
      const isLegal = dirs[dirs.length - 1] === 'legal'

      if (file === 'index.mdx') {
        push(dirs, locale, relPath, isLegal)
      } else {
        const slug = file.replace(/\.mdx$/, '')
        if (isLegal && LEGAL_NOINDEX.has(slug)) continue
        push([...dirs, slug], locale, relPath, isLegal)
      }
    }
  }

  walk(contentRoot)
  return out
}

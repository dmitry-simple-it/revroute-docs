/**
 * Разбор MDX-страниц документации в плоский текст — общий модуль скриптов.
 *
 * Вынесен из scripts/generate-llms-full.mjs без изменения логики: тем же
 * разбором пользуются выгрузка llms-full.txt и индекс документации.
 *
 * Совместимость: сборка идёт на node:20-slim (Dockerfile), поэтому только API
 * Node 20 и никаких зависимостей.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/**
 * Порог страницы-заглушки. Ниже него в теле остаётся одна фраза вокруг видео
 * или React-компонента (`<ReferralsEmbedGuide />`) — знания ноль, шум есть.
 */
export const STUB_MIN_CHARS = 200

/**
 * Список правовых оферт, которые отдаются с noindex.
 *
 * Источник правды — LEGAL_NOINDEX в lib/sitemap-mdx.ts: читаем его текстом,
 * чтобы список не разъезжался с картой сайта. Импортировать нельзя — файл на
 * TypeScript, а сборка идёт на node:20 без стрипа типов. Если разметка файла
 * изменится, падаем на встроенную копию и громко предупреждаем.
 */
export function readLegalNoindex(repoRoot) {
  const fallback = [
    'saas-license',
    'tariffs',
    'recurring-payments',
    'agency-offer',
    'partner-program',
    'services-offer',
    'reseller',
  ]
  try {
    const src = readFileSync(join(repoRoot, 'lib', 'sitemap-mdx.ts'), 'utf8')
    const block = src.match(/const LEGAL_NOINDEX = new Set\(\[([\s\S]*?)\]\)/)
    const slugs = block ? Array.from(block[1].matchAll(/'([^']+)'/g), (m) => m[1]) : []
    if (slugs.length > 0) return new Set(slugs)
  } catch {
    /* падаем на fallback ниже */
  }
  console.warn(
    '[llms-full] ВНИМАНИЕ: не удалось прочитать LEGAL_NOINDEX из lib/sitemap-mdx.ts — использую встроенную копию списка',
  )
  return new Set(fallback)
}


const unquote = (v) => v.replace(/^["'](.*)["']$/s, '$1').trim()

/** YAML-lite: плоские ключи и один уровень вложенности — этого хватает frontmatter'у Nextra. */
export function parseFrontmatter(raw) {
  const text = raw.replace(/\r\n/g, '\n')
  if (!text.startsWith('---\n')) return { data: {}, body: text }
  const end = text.indexOf('\n---', 3)
  if (end === -1) return { data: {}, body: text }

  const head = text.slice(4, end)
  const body = text.slice(end + 4).replace(/^[ \t]*\n/, '')

  const data = {}
  let currentKey = null
  for (const line of head.split('\n')) {
    const top = line.match(/^([A-Za-z_][\w-]*):[ \t]*(.*)$/)
    if (top) {
      currentKey = top[1]
      const value = top[2].trim()
      data[currentKey] = value === '' ? {} : unquote(value)
      continue
    }
    const nested = line.match(/^[ \t]+([A-Za-z_][\w-]*):[ \t]*(.*)$/)
    if (nested && currentKey && data[currentKey] && typeof data[currentKey] === 'object') {
      data[currentKey][nested[1]] = unquote(nested[2].trim())
    }
  }
  return { data, body }
}

/** Страница закрыта от индексации во frontmatter — в машинный канал не идёт. */
export function isNoindex(data) {
  const r = data.robots
  if (typeof r === 'string') return /noindex/i.test(r)
  if (r && typeof r === 'object') return String(r.index) === 'false'
  return String(data.noindex) === 'true'
}

/** Код-блоки схлопываем в маркер: примеры раздувают файл, а знание несут заголовки и проза. */
function stripCodeFences(text) {
  const out = []
  let fence = null
  for (const line of text.split('\n')) {
    // Отступ любой: внутри <CodeGroup> и <Step> ограждения сдвинуты на 4+ пробела,
    // а лимит markdown в 3 пробела оставлял такие блоки в тексте целиком.
    const m = line.match(/^[ \t]*(```+|~~~+)[ \t]*([A-Za-z0-9+#._-]*)/)
    if (fence) {
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null
      continue
    }
    if (m) {
      fence = m[1]
      out.push(m[2] ? `[пример кода: ${m[2]}]` : '[пример кода]')
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

/**
 * HTML-теги, которые встречаются в MDX наравне с JSX-компонентами.
 *
 * Список закрытый нарочно: неизвестное `<что-то>` остаётся в тексте как есть,
 * чтобы автоссылки вида `<https://…>` и математические `a < b` не пропадали.
 */
const HTML_TAGS = new Set([
  'a', 'abbr', 'article', 'aside', 'audio', 'b', 'blockquote', 'br', 'button',
  'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'details',
  'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2',
  'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'iframe', 'img', 'input', 'ins',
  'kbd', 'label', 'li', 'main', 'mark', 'nav', 'noscript', 'ol', 'option', 'p',
  'picture', 'pre', 'q', 's', 'script', 'section', 'select', 'small', 'source',
  'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody',
  'td', 'textarea', 'th', 'thead', 'time', 'tr', 'u', 'ul', 'video', 'wbr',
])

/** Компоненты-выноски Nextra/Mintlify: без подписи выноска в тексте неотличима от абзаца. */
const CALLOUTS = {
  Tip: 'Совет',
  Note: 'Примечание',
  Info: 'Справка',
  Warning: 'Внимание',
  Check: 'Готово',
  Danger: 'Осторожно',
}

/**
 * Конец тега, начатого в позиции `start`.
 *
 * Регуляркой это не берётся: в JSX закрывающий `>` бывает внутри значения
 * атрибута — `<Image alt={`Раздел «Account > API»`} src="…" />`. Наивный поиск
 * первого `>` рвёт тег пополам, и хвост с `src="…"` и `/>` уезжает в текст
 * (ровно это и утекало из migrating-from-rebrandly.mdx). Поэтому сканируем
 * посимвольно, пропуская кавычки (в том числе обратные) и фигурные скобки.
 *
 * @returns индекс закрывающего `>` или -1, если это не тег
 */
function findTagEnd(text, start) {
  let quote = null
  let depth = 0
  for (let i = start + 1; i < text.length; i++) {
    const ch = text[i]
    if (quote) {
      if (ch === quote) quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      continue
    }
    if (ch === '{') {
      depth += 1
      continue
    }
    if (ch === '}') {
      if (depth > 0) depth -= 1
      continue
    }
    if (depth > 0) continue
    // Наткнулись на следующий `<` раньше, чем на `>` — это проза, а не тег.
    if (ch === '<') return -1
    if (ch === '>') return i
  }
  return -1
}

const TAG_NAME = /^<\/?([A-Za-z][A-Za-z0-9._-]*)/

/** Решение по одному тегу: убрать, заменить подзаголовком или оставить как есть. */
function renderTag(tag, name) {
  const isComponent = /^[A-Z]/.test(name)
  if (!isComponent && !HTML_TAGS.has(name.toLowerCase())) return tag
  if (tag.startsWith('</')) return ''
  const title = tag.match(/\btitle=(?:"([^"]*)"|'([^']*)')/)
  const value = title ? (title[1] ?? title[2]).trim() : ''
  if (value) return `\n**${value}**\n`
  return CALLOUTS[name] ? `\n**${CALLOUTS[name]}.**\n` : ''
}

/**
 * Снимает JSX/HTML-теги, сохраняя текст внутри.
 *
 * Атрибут `title` у Step, Card, Accordion, Tab несёт заголовок шага или
 * карточки — без него текст разваливается в кашу, поэтому он превращается в
 * строку-подзаголовок.
 */
function stripTags(text) {
  let out = ''
  let i = 0
  while (i < text.length) {
    const lt = text.indexOf('<', i)
    if (lt === -1) {
      out += text.slice(i)
      break
    }
    out += text.slice(i, lt)
    const name = TAG_NAME.exec(text.slice(lt, lt + 64))
    const end = name ? findTagEnd(text, lt) : -1
    if (!name || end === -1) {
      out += '<'
      i = lt + 1
      continue
    }
    out += renderTag(text.slice(lt, end + 1), name[1])
    i = end + 1
  }
  return out
}

/** MDX → плоский текст: без импортов, JSX, картинок и кода. */
export function mdxToText(body) {
  let t = body.replace(/\r\n/g, '\n')
  t = t.replace(/^[ \t]*(?:import|export)[ \t]+[^\n]*\n?/gm, '')
  t = t.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
  t = t.replace(/<!--[\s\S]*?-->/g, '')
  t = stripCodeFences(t)
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  // Ссылки схлопываем в текст: URL страницы и так напечатан отдельной строкой.
  t = t.replace(/\[([^\]]+)\]\((?:[^()]|\([^()]*\))*\)/g, '$1')
  t = stripTags(t)
  t = t.replace(/[ \t]+$/gm, '')
  t = t.replace(/\n{3,}/g, '\n\n')
  return t.trim()
}

// ── Обход content/<locale> ─────────────────────────────────────────────────

/**
 * Собирает MDX-страницы локали `locale` из `contentRoot/<locale>`.
 *
 * Маппинг «файл → URL» повторяет lib/sitemap-mdx.ts (index.mdx → директория,
 * `_*` и `.*` пропускаются, оферты из LEGAL_NOINDEX выкидываются), чтобы адреса
 * в машинном канале совпадали с картой сайта. Код там на TypeScript и завязан
 * на MetadataRoute — импортировать из .mjs нельзя, поэтому логика повторена.
 *
 * `stats` необязателен: если передан, в `stats.legalNoindex` считаются
 * выкинутые оферты (генератор llms-full печатает это число в отчёте).
 */
export function collectPages({ contentRoot, locale, site, legalNoindex, stats }) {
  const localeRoot = join(contentRoot, locale)
  const pages = []

  function walk(dir) {
    let names
    try {
      names = readdirSync(dir)
    } catch {
      return
    }
    for (const name of names.sort()) {
      if (name.startsWith('_') || name.startsWith('.')) continue
      const p = join(dir, name)
      let st
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

      const rel = relative(localeRoot, p).replace(/\\/g, '/')
      const segments = rel.split('/')
      const file = segments[segments.length - 1]
      const dirs = segments.slice(0, -1)
      const isLegal = dirs[dirs.length - 1] === 'legal'

      let route
      if (file === 'index.mdx') {
        route = dirs
      } else {
        const slug = file.replace(/\.mdx$/, '')
        if (isLegal && legalNoindex.has(slug)) {
          if (stats) stats.legalNoindex += 1
          continue
        }
        route = [...dirs, slug]
      }

      pages.push({
        file: p,
        repoPath: `content/${locale}/${rel}`,
        route,
        url: `${site}/${locale}${route.length > 0 ? `/${route.join('/')}` : ''}`,
        section: route[0] ?? '',
        locale,
      })
    }
  }

  walk(localeRoot)
  return pages
}

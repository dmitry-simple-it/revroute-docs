#!/usr/bin/env node
/**
 * Генератор манифеста дат последнего изменения — для честного `lastmod` в sitemap.
 *
 * Зачем: до этого app/sitemap.ts подставлял `new Date()` всем URL, поэтому метка
 * менялась от запроса к запросу и поисковики переставали доверять сигналу.
 * Здесь мы один раз на этапе prebuild снимаем дату последнего коммита каждого
 * файла и кладём её в JSON, который читают app/sitemap.ts и lib/sitemap-mdx.ts.
 *
 * Как это переживает Docker: `.git` в образе может отсутствовать. Поэтому
 *   1) манифест коммитится в репозиторий и при недоступном git просто
 *      переиспользуется как есть;
 *   2) файлы, которых в манифесте нет, получают mtime;
 *   3) любая ошибка не роняет сборку — скрипт всегда завершается кодом 0.
 *
 * Запуск: node scripts/build-lastmod-manifest.mjs
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_FILE = join(ROOT, 'lib', 'generated', 'lastmod.json')

/** Каталоги, которые обходим, и предикат «этот файл нас интересует». */
const TARGETS = [
  { dir: 'content', match: (name) => name.endsWith('.mdx') || name.endsWith('.ts') },
  { dir: 'app/(landing)', match: (name) => name === 'page.tsx' },
  { dir: 'app/(marketing)', match: (name) => name === 'page.tsx' },
  { dir: 'lib', match: (name) => name === 'integrations.ts' },
]

/** Рекурсивный обход без внешних зависимостей: fast-glob есть только в dev. */
function collect(dirRel, match, acc) {
  const abs = join(ROOT, dirRel)
  let names
  try {
    names = readdirSync(abs, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const entry of names) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const childRel = `${dirRel}/${entry.name}`
    if (entry.isDirectory()) {
      collect(childRel, match, acc)
    } else if (match(entry.name)) {
      acc.push(childRel)
    }
  }
  return acc
}

/**
 * Даты последних коммитов одним вызовом git.
 *
 * Наивный `git log -1 -- <file>` на файл — это ~350 процессов; вместо этого
 * читаем историю один раз в формате «@<iso> / список файлов». git отдаёт
 * коммиты от новых к старым, поэтому первое вхождение файла и есть последнее
 * изменение.
 *
 * @returns {Map<string, string>|null} null — git недоступен (Docker, архив).
 */
function gitLastCommitDates(dirs) {
  try {
    const out = execFileSync(
      'git',
      [
        '-c',
        'core.quotepath=false',
        'log',
        '--no-merges',
        '--format=@%cI',
        '--name-only',
        '--',
        ...dirs,
      ],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
    )
    const map = new Map()
    let current = null
    for (const line of out.split('\n')) {
      const trimmed = line.trimEnd()
      if (!trimmed) continue
      if (trimmed.startsWith('@')) {
        current = trimmed.slice(1)
        continue
      }
      if (current && !map.has(trimmed)) map.set(trimmed, current)
    }
    return map
  } catch {
    return null
  }
}

function mtimeIso(rel) {
  try {
    return statSync(join(ROOT, rel)).mtime.toISOString()
  } catch {
    return null
  }
}

function readExisting() {
  try {
    const parsed = JSON.parse(readFileSync(OUT_FILE, 'utf8'))
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function main() {
  const files = []
  for (const { dir, match } of TARGETS) collect(dir, match, files)

  const dirs = [...new Set(TARGETS.map((t) => t.dir))]
  const gitDates = gitLastCommitDates(dirs)

  // Стартуем от уже закоммиченного манифеста: если git недоступен, даты из
  // репозитория остаются в силе, а не затираются временем распаковки образа.
  const manifest = readExisting()
  let fromGit = 0
  let fromMtime = 0

  for (const rel of files) {
    const git = gitDates?.get(rel)
    if (git) {
      manifest[rel] = git
      fromGit++
      continue
    }
    if (manifest[rel]) continue // файл не в этом срезе истории — держим прежнюю дату
    const mtime = mtimeIso(rel)
    if (mtime) {
      manifest[rel] = mtime
      fromMtime++
    }
  }

  // Удаляем записи об исчезнувших файлах, чтобы манифест не рос вечно.
  const alive = new Set(files)
  for (const key of Object.keys(manifest)) {
    if (!alive.has(key)) delete manifest[key]
  }

  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]))

  mkdirSync(dirname(OUT_FILE), { recursive: true })
  writeFileSync(OUT_FILE, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8')

  const uniqueDates = new Set(Object.values(sorted)).size
  console.log(
    `[lastmod] ${Object.keys(sorted).length} файлов, ${uniqueDates} уникальных дат ` +
      `(git: ${fromGit}, mtime: ${fromMtime}${gitDates ? '' : ', git недоступен'}) → ` +
      `${relative(ROOT, OUT_FILE).replace(/\\/g, '/')}`,
  )
}

try {
  main()
} catch (err) {
  // Манифест — вспомогательный сигнал для sitemap. Сломать из-за него сборку хуже,
  // чем отдать sitemap с фолбэком на mtime.
  console.warn('[lastmod] манифест не собран, sitemap уйдёт на фолбэк:', err?.message ?? err)
}

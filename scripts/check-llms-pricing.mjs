#!/usr/bin/env node
/**
 * Сверяет машинные файлы (public/llms.txt, public/llms-full.txt) с исходниками.
 * Падает с ненулевым кодом при расхождении в АВТОРСКОЙ части.
 *
 * ── Почему проверка двухуровневая ─────────────────────────────────────────
 * public/llms-full.txt с недавних пор состоит из двух разных по природе частей,
 * и мерить их одной линейкой нельзя:
 *
 *   1. АВТОРСКАЯ ЧАСТЬ — весь llms.txt плюс всё в llms-full.txt ДО границы
 *      CORPUS_MARKER. Это пересказ лендинга, написанный руками: на лендинге нет
 *      текстового исходника, там JSX, поэтому каждая цифра здесь — потенциально
 *      выдуманная. Ровно эту часть проверка держит железно: любой денежный
 *      токен обязан дословно встречаться в исходниках /pricing, /links, /prm,
 *      /partner-channel, иначе сборка падает.
 *
 *   2. ВЫГРУЗКА ДОКУМЕНТАЦИИ — всё ПОСЛЕ границы. Она собирается автоматически
 *      из content/ru/**\/*.mdx (scripts/generate-llms-full.mjs) и новых
 *      утверждений не вносит. Числа там — числа документации: «минимальная
 *      сумма выплаты 1 000 ₽», «микро-списание 1 ₽ при привязке карты». На
 *      лендинге их нет и быть не должно, так что сверка с PLANS валила бы
 *      сборку на каждой правке справки, причём чинить пришлось бы не машинный
 *      файл, а чужую страницу — то есть проверка начала бы врать.
 *      Поэтому у выгрузки другой инвариант: всё, что в ней есть, обязано
 *      прослеживаться до исходного MDX. Нарушение — дефект генератора, а не
 *      расхождение цены, поэтому печатается предупреждением и сборку не роняет.
 *
 * Что проверяется жёстко:
 *   1. Все цены из PLANS (app/(landing)/pricing/page.tsx) есть в авторской части.
 *   2. Каждый денежный токен вида «N ₽» авторской части есть в исходниках
 *      страниц /pricing, /links, /prm, /partner-channel — выдуманное число валит проверку.
 *   3. Обязательные формулировки: комиссия 5% из бюджета выплат, пример 100 000 → 95 000
 *      + 5 000, годовая скидка 17%, «НДС не облагается (УСН)».
 *   4. Запрещённые строки: несуществующие тарифы и снятая с продажи линейка.
 *   5. Целостность выгрузки: граница на месте и страниц в ней не меньше
 *      MIN_CORPUS_PAGES — иначе генератор молча вернулся к литералам.
 *
 * Что проверяется мягко (предупреждение, exit code 0):
 *   6. Денежные токены и запрещённые строки выгрузки — против content/ru/**\/*.mdx.
 *
 * Запуск: node scripts/check-llms-pricing.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n')

/**
 * Граница авторской части и выгрузки документации.
 * КОНТРАКТ с scripts/generate-llms-full.mjs → CORPUS_MARKER: строки обязаны
 * совпадать дословно. Если границы нет — проверка падает, а не молчит.
 */
const CORPUS_MARKER = '# Выгрузка страниц документации, справки и правовых документов'

/** Нижняя граница здравого смысла: в content/ru лежит около 170 MDX-страниц. */
const MIN_CORPUS_PAGES = 100

/** &nbsp;, U+00A0 и узкие пробелы → обычный пробел, чтобы JSX, MDX и .txt сравнивались одинаково. */
const norm = (s) => s.replace(/&nbsp;/g, ' ').replace(/[    ]/g, ' ')

/** Все денежные токены «1 500 000 ₽» → канонический вид с обычными пробелами. */
function moneyTokens(text) {
  const out = new Set()
  for (const m of norm(text).matchAll(/\d{1,3}(?: \d{3})* ₽/g)) out.add(m[0])
  return out
}

const errors = []
const warnings = []
const fail = (msg) => errors.push(msg)
const warn = (msg) => warnings.push(msg)

// ── 1. PLANS — источник правды по подписке ─────────────────────────────────
const pricingSrc = read('app/(landing)/pricing/page.tsx')
const plansBlock = pricingSrc.match(/const PLANS = \[([\s\S]*?)\n\]\n/)
if (!plansBlock) throw new Error('Не найден массив PLANS в app/(landing)/pricing/page.tsx')

const PLANS = []
for (const chunk of plansBlock[1].split(/\n  \{/)) {
  const name = chunk.match(/name: '([^']+)'/)?.[1]
  if (!name) continue
  PLANS.push({
    name,
    priceMonth: norm(chunk.match(/priceMonth: '([^']+)'/)?.[1] ?? ''),
    priceYear: norm(chunk.match(/priceYear: '([^']+)'/)?.[1] ?? ''),
  })
}
if (PLANS.length !== 3) fail(`PLANS: ожидалось 3 тарифа, распарсено ${PLANS.length}`)

const discount = pricingSrc.match(/discountLabel="[−-](\d+)%"/)?.[1]
if (!discount) fail('Не найден discountLabel на /pricing')

// ── 2. Машинные файлы и раскрой llms-full на две части ─────────────────────
const llmsTxt = read('public/llms.txt')
const llmsFull = read('public/llms-full.txt')

const markerAt = llmsFull.indexOf(CORPUS_MARKER)
if (markerAt === -1) {
  fail(
    `public/llms-full.txt: не найдена граница «${CORPUS_MARKER}» — ` +
      'генератор её не проставил или строка разошлась с scripts/generate-llms-full.mjs',
  )
}

const llmsFullIntro = markerAt === -1 ? llmsFull : llmsFull.slice(0, markerAt)
const corpus = markerAt === -1 ? '' : llmsFull.slice(markerAt)

/** Части, написанные руками, — здесь любое расхождение валит сборку. */
const authored = {
  'public/llms.txt': llmsTxt,
  'public/llms-full.txt (авторская часть)': llmsFullIntro,
}

// ── 3. Цены из PLANS обязаны присутствовать ────────────────────────────────
for (const [path, text] of Object.entries(authored)) {
  const t = norm(text)
  for (const p of PLANS) {
    for (const price of [p.priceMonth, p.priceYear]) {
      if (!price) continue
      if (!t.includes(price)) fail(`${path}: нет цены тарифа ${p.name} — «${price}» (из PLANS)`)
    }
    if (!t.includes(p.name)) fail(`${path}: не упомянут тариф «${p.name}» из PLANS`)
  }
  if (discount && !t.includes(`${discount}%`)) fail(`${path}: нет годовой скидки ${discount}%`)
}

// ── 4. Ни одного денежного токена мимо исходников ──────────────────────────
const sourcePaths = [
  'app/(landing)/pricing/page.tsx',
  'app/(landing)/links/page.tsx',
  'app/(landing)/prm/page.tsx',
  'app/(landing)/partner-channel/page.tsx',
]
const allowed = new Set()
for (const p of sourcePaths) for (const tok of moneyTokens(read(p))) allowed.add(tok)
// JSON-LD на /links хранит цены без символа рубля: price: '299'
for (const m of read('app/(landing)/links/page.tsx').matchAll(/price: '(\d+)'/g)) allowed.add(`${m[1]} ₽`)

for (const [path, text] of Object.entries(authored)) {
  for (const tok of moneyTokens(text)) {
    if (!allowed.has(tok)) fail(`${path}: денежная величина «${tok}» отсутствует в исходниках лендинга`)
  }
}

// ── 5. Обязательные формулировки ───────────────────────────────────────────
const required = [
  ['5%', 'ставка агентской комиссии'],
  ['из бюджета выплат', 'комиссия удерживается из бюджета, а не сверху'],
  ['100 000 ₽', 'пример: бюджет выплат'],
  ['95 000 ₽', 'пример: партнёрам'],
  ['5 000 ₽', 'пример: комиссия RevRoute'],
  ['НДС не облагается (УСН)', 'формулировка про НДС со страницы /pricing'],
  ['180 дней', 'окно атрибуции PRM'],
  ['90 дней', 'окно атрибуции коротких ссылок'],
  ['НПД', 'проверка статуса самозанятого перед выплатой'],
]
for (const [path, text] of Object.entries(authored)) {
  const t = norm(text)
  for (const [needle, why] of required) {
    if (!t.includes(needle)) fail(`${path}: нет обязательной строки «${needle}» (${why})`)
  }
}

// Формулировка про НДС должна совпадать с /pricing дословно.
if (!norm(pricingSrc).includes('НДС не облагается (УСН)')) {
  fail('app/(landing)/pricing/page.tsx: формулировка «НДС не облагается (УСН)» изменилась — обновите llms-файлы')
}

// ── 6. Запрещённые строки ──────────────────────────────────────────────────
const forbidden = [
  'Links Business',
  'Links Enterprise',
  '829 ₽',
  'Все цены без НДС',
  'Revroute Links',
  'Revroute Partners',
  'Revroute Analytics',
]
for (const [path, text] of Object.entries(authored)) {
  for (const needle of forbidden) {
    if (norm(text).includes(needle)) fail(`${path}: запрещённая строка «${needle}» (тариф или продукт не существует)`)
  }
}

// ── 7. Целостность выгрузки документации ───────────────────────────────────
// Регресс, от которого страхуемся: генератор снова начинает писать литералы, и
// 160+ страниц справки молча пропадают из машинного канала.
const corpusPages = (corpus.match(/^URL: /gm) ?? []).length
if (markerAt !== -1 && corpusPages < MIN_CORPUS_PAGES) {
  fail(
    `public/llms-full.txt: в выгрузке документации ${corpusPages} страниц, ожидалось не меньше ` +
      `${MIN_CORPUS_PAGES} — генератор перестал обходить content/ru`,
  )
}

/**
 * Обрывки JSX в выгрузке. Ловим ровно тот класс поломки, который уже случался:
 * закрывающий `>` внутри значения атрибута (`alt={`Account > API`}`) рвал тег
 * пополам, и хвост с `src="…"` и `/>` уезжал в текст машинного канала.
 * Строки нарочно узкие — прозой такое не пишут, ложных срабатываний нет.
 */
const JSX_RESIDUE = [
  [/^[ \t]*\/>[ \t]*$/m, 'висящий `/>` — тег не был снят целиком'],
  [/^[ \t]*(?:src|alt|href|className|width|height)=["'{]/m, 'атрибут JSX отдельной строкой'],
]
for (const [re, why] of JSX_RESIDUE) {
  const hit = corpus.match(re)
  if (!hit) continue
  fail(
    `public/llms-full.txt: в выгрузке остался обрывок JSX (${why}): «${hit[0].trim().slice(0, 80)}» — ` +
      'дефект stripTags в scripts/generate-llms-full.mjs',
  )
}

// ── 8. Выгрузка: прослеживаемость до MDX (мягко) ───────────────────────────
/** Тот же схлоп ссылок, что в генераторе: `[1 000](/x) ₽` → `1 000 ₽`. */
const flattenMarkdown = (s) => s.replace(/\[([^\]]+)\]\((?:[^()]|\([^()]*\))*\)/g, '$1').replace(/[*`]/g, '')

function contentFiles(dir, acc = []) {
  let names
  try {
    names = readdirSync(dir)
  } catch {
    return acc
  }
  for (const name of names) {
    if (name.startsWith('_') || name.startsWith('.')) continue
    const p = join(dir, name)
    let st
    try {
      st = statSync(p)
    } catch {
      continue
    }
    if (st.isDirectory()) contentFiles(p, acc)
    else if (name.endsWith('.mdx')) acc.push(p)
  }
  return acc
}

if (corpus) {
  const files = contentFiles(join(repoRoot, 'content', 'ru'))
  const fromContent = new Set()
  const forbiddenIn = new Map()

  for (const file of files) {
    const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
    for (const tok of moneyTokens(raw)) fromContent.add(tok)
    for (const tok of moneyTokens(flattenMarkdown(raw))) fromContent.add(tok)
    for (const needle of forbidden) {
      if (!norm(raw).includes(needle)) continue
      const rel = file.slice(repoRoot.length + 1).replace(/\\/g, '/')
      if (!forbiddenIn.has(needle)) forbiddenIn.set(needle, [])
      forbiddenIn.get(needle).push(rel)
    }
  }

  for (const tok of moneyTokens(corpus)) {
    if (allowed.has(tok) || fromContent.has(tok)) continue
    warn(
      `выгрузка документации: денежная величина «${tok}» не найдена ни на лендинге, ни в content/ru — ` +
        'проверьте, не склеил ли её генератор при снятии разметки',
    )
  }

  for (const needle of forbidden) {
    if (!norm(corpus).includes(needle)) continue
    const where = forbiddenIn.get(needle)
    if (!where) {
      fail(`public/llms-full.txt: запрещённая строка «${needle}» в выгрузке, но её нет в content/ru — это дефект генератора`)
      continue
    }
    warn(
      `выгрузка документации: «${needle}» — снятое с продажи название, ${where.length} MDX-файл(ов) ` +
        `в content/ru, например ${where[0]}. Чинить надо контент, не машинный файл.`,
    )
  }
}

// ── Итог ───────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error('[check-llms] РАСХОЖДЕНИЯ:')
  for (const e of errors) console.error('  ✗ ' + e)
  process.exit(1)
}

console.log('[check-llms] PLANS:')
for (const p of PLANS) console.log(`  · ${p.name}: ${p.priceMonth} / ${p.priceYear} (за год)`)
console.log(`[check-llms] годовая скидка: ${discount}%`)
console.log(`[check-llms] денежных токенов в исходниках: ${allowed.size}`)
for (const [path, text] of Object.entries(authored)) {
  console.log(`[check-llms] ${path}: ${moneyTokens(text).size} денежных токенов — все сверены`)
}
console.log(
  `[check-llms] выгрузка документации: ${corpusPages} страниц, ${moneyTokens(corpus).size} денежных токенов — ` +
    'сверены с content/ru (мягко)',
)
for (const w of warnings) console.warn('  ⚠ ' + w)
console.log('[check-llms] OK — расхождений нет')

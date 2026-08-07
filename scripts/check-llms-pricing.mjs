#!/usr/bin/env node
/**
 * Сверяет машинные файлы (public/llms.txt, public/llms-full.txt) с исходниками
 * лендинга. Падает с ненулевым кодом при любом расхождении.
 *
 * Что проверяется:
 *   1. Все цены из PLANS (app/(landing)/pricing/page.tsx) присутствуют в обоих файлах.
 *   2. Каждый денежный токен вида «N ₽» в машинных файлах встречается в исходниках
 *      страниц /pricing, /links, /prm, /partner-channel — выдуманное число валит проверку.
 *   3. Обязательные формулировки: комиссия 5% из бюджета выплат, пример 100 000 → 95 000
 *      + 5 000, годовая скидка 17%, «НДС не облагается (УСН)».
 *   4. Запрещённые строки: несуществующие тарифы и снятая с продажи линейка.
 *
 * Запуск: node scripts/check-llms-pricing.mjs
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n')

/** &nbsp; и U+00A0 → обычный пробел, чтобы JSX и .txt сравнивались одинаково. */
const norm = (s) => s.replace(/&nbsp;/g, ' ').replace(/ /g, ' ')

/** Все денежные токены «1 500 000 ₽» → канонический вид с обычными пробелами. */
function moneyTokens(text) {
  const out = new Set()
  for (const m of norm(text).matchAll(/\d{1,3}(?: \d{3})* ₽/g)) out.add(m[0])
  return out
}

const errors = []
const fail = (msg) => errors.push(msg)

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

// ── 2. Машинные файлы ──────────────────────────────────────────────────────
const files = {
  'public/llms.txt': read('public/llms.txt'),
  'public/llms-full.txt': read('public/llms-full.txt'),
}

// ── 3. Цены из PLANS обязаны присутствовать ────────────────────────────────
for (const [path, text] of Object.entries(files)) {
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

for (const [path, text] of Object.entries(files)) {
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
for (const [path, text] of Object.entries(files)) {
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
for (const [path, text] of Object.entries(files)) {
  for (const needle of forbidden) {
    if (norm(text).includes(needle)) fail(`${path}: запрещённая строка «${needle}» (тариф или продукт не существует)`)
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
for (const path of Object.keys(files)) {
  console.log(`[check-llms] ${path}: ${moneyTokens(files[path]).size} денежных токенов — все сверены`)
}
console.log('[check-llms] OK — расхождений нет')

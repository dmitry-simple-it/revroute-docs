// Запуск: node --test scripts/lib/mdx-text.test.mjs (npm run test:mdx-text)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { parseFrontmatter, mdxToText, collectPages, STUB_MIN_CHARS } from './mdx-text.mjs'

test('parseFrontmatter читает title и description', () => {
  const raw = '---\ntitle: "Домены"\ndescription: Как подключить домен\n---\n\n# Домены\n\nТекст.\n'
  const { data, body } = parseFrontmatter(raw)
  assert.equal(data.title, 'Домены')
  assert.equal(data.description, 'Как подключить домен')
  // Пустая строка после шапки остаётся в начале тела — так было в генераторе llms-full до выноса.
  assert.equal(body.trim(), '# Домены\n\nТекст.')
  assert.ok(!body.includes('title:'), body)
})

test('mdxToText убирает JSX, import и code fences, оставляет текст заголовков', () => {
  const input = 'import X from "y"\n\n## Домен [#domain]\n\n<Card title="A">текст</Card>\n```js\ncode\n```'
  const text = mdxToText(input)
  assert.ok(text.includes('Домен'), text)
  assert.ok(text.includes('текст'), text)
  assert.ok(!text.includes('import'), text)
  assert.ok(!text.includes('code'), text)
  assert.ok(!text.includes('<Card'), text)
})

test('collectPages: index.mdx → url директории, _meta пропускается, legal noindex выкидывается', () => {
  const root = mkdtempSync(join(tmpdir(), 'mdx-text-'))
  try {
    const contentRoot = join(root, 'content')
    const ru = join(contentRoot, 'ru')
    mkdirSync(join(ru, 'docs'), { recursive: true })
    mkdirSync(join(ru, 'legal'), { recursive: true })
    writeFileSync(join(ru, 'index.mdx'), '# Главная\n')
    writeFileSync(join(ru, '_meta.js'), 'export default {}\n')
    writeFileSync(join(ru, 'docs', 'index.mdx'), '# Документация\n')
    writeFileSync(join(ru, 'docs', 'a.mdx'), '# A\n')
    writeFileSync(join(ru, 'legal', 'tariffs.mdx'), '# Тарифы\n')

    const site = 'https://example.test'
    const pages = collectPages({ contentRoot, locale: 'ru', site, legalNoindex: new Set(['tariffs']) })

    assert.equal(pages.length, 3)
    assert.deepEqual(pages.map((p) => p.url).sort(), [`${site}/ru`, `${site}/ru/docs`, `${site}/ru/docs/a`])
    const a = pages.find((p) => p.url === `${site}/ru/docs/a`)
    assert.equal(a.section, 'docs')
    assert.equal(a.locale, 'ru')
    assert.equal(a.repoPath, 'content/ru/docs/a.mdx')
    assert.deepEqual(a.route, ['docs', 'a'])
    assert.equal(pages.find((p) => p.url === `${site}/ru`).section, '')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('STUB_MIN_CHARS = 200', () => {
  assert.equal(STUB_MIN_CHARS, 200)
})

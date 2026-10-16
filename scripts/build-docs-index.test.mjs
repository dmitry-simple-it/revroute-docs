import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { buildIndex, headingsOf } from './build-docs-index.mjs'

test('headingsOf: явный [#id] побеждает, иначе слаг как у github-slugger', () => {
  assert.deepEqual(headingsOf('## Метка перехода [#click-id]\n### Second Heading, Ltd.'), [
    { id: 'click-id', level: 2, text: 'Метка перехода' },
    { id: 'second-heading-ltd', level: 3, text: 'Second Heading, Ltd.' },
  ])
})

test('headingsOf: кириллица в слаге, разметка снята, код и H1 пропущены, повторы нумеруются', () => {
  const body = [
    '# Заголовок страницы',
    '## Ключевые `возможности`',
    '```md',
    '## не заголовок',
    '```',
    '## 401 `unauthorized`',
    '## Ключевые возможности',
  ].join('\n')
  assert.deepEqual(headingsOf(body), [
    { id: 'ключевые-возможности', level: 2, text: 'Ключевые возможности' },
    { id: '401-unauthorized', level: 2, text: '401 unauthorized' },
    { id: 'ключевые-возможности-1', level: 2, text: 'Ключевые возможности' },
  ])
})

function page(title, body, extra = '') {
  return `---\ntitle: ${title}\ndescription: Описание ${title}\n${extra}---\n\n${body}\n`
}

const prose = 'Достаточно длинный абзац о настройке партнёрской программы и подключении домена. '.repeat(5)

test('buildIndex: обе локали, заглушки короче 200 символов пропущены, тело обрезано до 40000', () => {
  const root = mkdtempSync(join(tmpdir(), 'docs-index-'))
  try {
    const ru = join(root, 'content', 'ru')
    const en = join(root, 'content', 'en')
    mkdirSync(join(ru, 'docs'), { recursive: true })
    mkdirSync(join(en, 'docs'), { recursive: true })
    writeFileSync(join(ru, 'index.mdx'), page('Главная', prose))
    writeFileSync(
      join(ru, 'docs', 'a.mdx'),
      page('Страница А', `## Метка перехода [#click-id]\n\n${prose}`, 'sidebarTitle: Коротко\n'),
    )
    writeFileSync(join(ru, 'docs', 'stub.mdx'), page('Заглушка', 'Смотрите видео.'))
    writeFileSync(join(en, 'index.mdx'), page('Home', prose))
    const para = `${'word '.repeat(199)}word\n\n`
    writeFileSync(join(en, 'docs', 'a.mdx'), page('Page A', para.repeat(Math.ceil(50000 / para.length))))

    const index = buildIndex({ repoRoot: root, site: 'https://example.test' })
    assert.equal(index.version, 1)
    assert.ok(!Number.isNaN(Date.parse(index.generatedAt)))
    assert.equal(index.pages.length, 4)
    for (const p of index.pages) {
      assert.ok(p.locale && typeof p.section === 'string' && p.url.startsWith('https://example.test/'))
    }

    const enA = index.pages.find((p) => p.url === 'https://example.test/en/docs/a')
    assert.ok(enA.body.length <= 40000 && enA.body.length > 30000)
    assert.ok(enA.body.endsWith('word'), 'режем по границе абзаца, без приписок')

    const ruA = index.pages.find((p) => p.url === 'https://example.test/ru/docs/a')
    assert.equal(ruA.section, 'docs')
    assert.equal(ruA.title, 'Страница А')
    assert.equal(ruA.sidebarTitle, 'Коротко')
    assert.equal(ruA.description, 'Описание Страница А')
    assert.deepEqual(ruA.headings, [{ id: 'click-id', level: 2, text: 'Метка перехода' }])
    assert.ok(!ruA.body.includes('[#click-id]'), 'явный якорь убран из тела')
    assert.ok(ruA.body.includes('## Метка перехода'))

    const ruHome = index.pages.find((p) => p.url === 'https://example.test/ru')
    assert.equal(ruHome.section, '')
    assert.equal(ruHome.sidebarTitle, '')
    assert.ok(!index.pages.some((p) => p.url.endsWith('/stub')))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

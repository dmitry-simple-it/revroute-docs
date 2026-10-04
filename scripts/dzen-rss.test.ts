import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { BlogPost } from '../content/blog'
import { absoluteUrl, renderArticle, renderDzenFeed, escapeXml } from '../lib/dzen/rss'
import { posts } from '../content/blog'

const now = new Date('2026-10-04T12:00:00Z')
function article(): BlogPost {
  return {
    slug: 'test-article', title: 'Тестовая статья', excerpt: 'Описание & смысл',
    date: '2026-10-03', category: 'Гайды',
    author: { name: 'Команда RevRoute', role: 'Автор', initials: 'RR' },
    cover: { gradient: 'black' },
    content: [{ type: 'p', text: 'Текст <script>alert(1)</script> & >' }],
    dzen: {
      enabled: true, mode: 'draft',
      cover: { url: '/cover.jpg', type: 'image/jpeg', length: 12000, width: 1200, height: 630 },
    },
  }
}

test('only explicitly enabled posts enter the feed; future dates are excluded', () => {
  const disabled = article(); disabled.dzen!.enabled = false
  const future = article(); future.date = '2026-10-05'
  assert.equal((renderDzenFeed([disabled, future], { now }).match(/<item>/g) ?? []).length, 0)
})
test('production feed includes exactly explicitly enabled and released posts', () => {
  const eligible = posts.filter(post => post.dzen?.enabled && new Date(post.dzen.publishedAt ?? post.date).getTime() <= now.getTime())
  assert.equal((renderDzenFeed(posts, { now }).match(/<item>/g) ?? []).length, eligible.length)
})
test('approved pilot is published on the website and exported to Dzen as a draft', () => {
  const matches = posts.filter(post => post.slug === 'shorten-link-no-signup')
  assert.equal(matches.length, 1)
  const pilot = matches[0]
  assert.equal(pilot.dzen?.enabled, true)
  assert.equal(pilot.dzen?.mode, 'draft')
  const xml = renderDzenFeed(posts, { now })
  assert.equal((xml.match(/<item>/g) ?? []).length, 1)
  assert.match(xml, /<link>https:\/\/revroute\.ru\/blog\/shorten-link-no-signup<\/link>/)
  assert.match(xml, /<guid isPermaLink="false">revroute:blog:shorten-link-no-signup<\/guid>/)
  assert.match(xml, /<category>native-draft<\/category>/)
  assert.equal((xml.match(/<figcaption>/g) ?? []).length, 3)
})
test('RSS declares its namespaces, content type metadata and full article body', () => {
  const xml = renderDzenFeed([article()], { now })
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  assert.match(xml, /xmlns:content="http:\/\/purl.org\/rss\/1.0\/modules\/content\/"/)
  assert.match(xml, /<content:encoded><!\[CDATA\[/)
  assert.match(xml, /type="image\/jpeg" length="12000"/)
  assert.match(xml, /<pubDate>Sat, 03 Oct 2026 00:00:00 GMT<\/pubDate>/)
  assert.match(xml, /<category>native-draft<\/category>/)
  assert.match(xml, /<category>format-article<\/category>/)
})
test('draft is the default and publish must be explicit', () => {
  const p = article(); delete p.dzen!.mode
  assert.match(renderDzenFeed([p], { now }), /native-draft/)
  p.dzen!.mode = 'publish'
  assert.doesNotMatch(renderDzenFeed([p], { now }), /native-draft/)
})
test('GUID persists across edits, and duplicate identifiers or URLs fail validation', () => {
  const p = article(); p.dzen!.guid = 'revroute:stable:1'
  const before = renderDzenFeed([p], { now })
  p.title = 'Изменённый заголовок'
  p.slug = 'changed-slug'
  assert.match(before, /revroute:stable:1/)
  assert.match(renderDzenFeed([p], { now }), /revroute:stable:1/)
  assert.throws(() => renderDzenFeed([p, p], { now }), /Duplicate/)
})
test('CDATA terminators and XML metacharacters cannot break the document', () => {
  const p = article(); p.content = [{ type: 'p', text: ']]> & <script> "текст"' }]
  const xml = renderDzenFeed([p], { now })
  assert.match(xml, /&amp;/)
  assert.doesNotMatch(xml, /<script>/)
  assert.equal(escapeXml("a&<>'\""), 'a&amp;&lt;&gt;&apos;&quot;')
  assert.throws(() => escapeXml('bad\u0001'), /Invalid XML/)
  assert.throws(() => escapeXml('bad\ud800'), /surrogate/)
})
test('unsafe URL schemes and credentials fail instead of being exported', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'file:///etc/passwd', 'https://user:pass@example.com']) {
    assert.throws(() => absoluteUrl(url), /HTTP/)
  }
  assert.equal(absoluteUrl('/tools/utm'), 'https://revroute.ru/tools/utm')
  assert.equal(absoluteUrl('https://example.com/?a=1&b=2'), 'https://example.com/?a=1&b=2')
})
test('inline links, bold and italic preserve nesting and use supported tags', () => {
  const p = article()
  p.content = [{ type: 'rich-p', children: [
    { type: 'bold', children: [{ type: 'text', text: 'Шаг 1.' }] },
    { type: 'italic', children: [{ type: 'text', text: ' Подпись' }] },
    { type: 'link', href: '/tools/link-shortener', children: [{ type: 'text', text: 'Открыть & проверить' }] },
  ] }]
  const html = renderArticle(p)
  assert.match(html, /<b>Шаг 1\.<\/b>/)
  assert.match(html, /<i> Подпись<\/i>/)
  assert.match(html, /href="https:\/\/revroute.ru\/tools\/link-shortener"/)
  assert.doesNotMatch(html, /strong|<em>|style=|class=/)
})
test('images remain in order, with captions and absolute URLs', () => {
  const p = article()
  p.content = [1, 2, 3].map(n => ({
    type: 'image', image: { ...p.dzen!.cover, url: '/step-' + n + '.jpg' }, alt: 'Шаг ' + n, caption: 'Подпись ' + n,
  }))
  const html = renderArticle(p)
  assert.equal((html.match(/<figure>/g) ?? []).length, 3)
  assert.equal((html.match(/<figcaption>/g) ?? []).length, 3)
  assert.ok(html.indexOf('step-1') < html.indexOf('step-2') && html.indexOf('step-2') < html.indexOf('step-3'))
})
test('small images and invalid byte lengths are rejected', () => {
  const p = article(); p.dzen!.cover.width = 388
  assert.throws(() => renderDzenFeed([p], { now }), /dimensions/)
  p.dzen!.cover.width = 700; p.dzen!.cover.length = 0
  assert.throws(() => renderDzenFeed([p], { now }), /dimensions/)
})
test('unrepresentable React mocks fail instead of silently disappearing', () => {
  const p = article(); p.content = [{ type: 'mock', variant: 'social-bounty' }]
  assert.throws(() => renderDzenFeed([p], { now }), /Replace mock/)
})
test('table fallback retains each labelled value; FAQ and sources retain text and links', () => {
  const p = article()
  p.content = [{ type: 'table', headers: ['Параметр', 'Значение'], rows: [['Лимит', '10']], caption: 'Условия' }]
  p.faq = [{ q: 'Как?', a: 'Вот так.' }]
  p.sources = [{ label: 'Источник', url: '/links', note: 'Описание' }]
  const html = renderArticle(p)
  assert.match(html, /<b>Параметр:<\/b> Лимит; <b>Значение:<\/b> 10/)
  assert.match(html, /Вот так\./)
  assert.match(html, /href="https:\/\/revroute.ru\/links"/)
  assert.doesNotMatch(html, /<table/)
})
test('invalid dates, empty body and excessive title length are rejected', () => {
  const p = article(); p.date = '2026-02-30'
  assert.throws(() => renderDzenFeed([p], { now }), /Invalid publication/)
  p.date = '2026-02-30T12:00:00Z'
  assert.throws(() => renderDzenFeed([p], { now }), /Invalid publication/)
  p.date = '2026-10-03'; p.title = 'я'.repeat(141)
  assert.throws(() => renderDzenFeed([p], { now }), /title/)
  p.title = 'Тест'; p.content = []
  assert.throws(() => renderDzenFeed([p], { now }), /empty/)
})
test('articles are ordered newest first with stable build timestamps', () => {
  const a = article(); a.slug = 'older'; a.date = '2026-10-01'
  const b = article(); b.slug = 'newer'; b.date = '2026-10-03'
  const xml = renderDzenFeed([a, b], { now })
  assert.ok(xml.indexOf('revroute:blog:newer') < xml.indexOf('revroute:blog:older'))
  assert.match(xml, /<lastBuildDate>Sat, 03 Oct 2026 00:00:00 GMT<\/lastBuildDate>/)
})
test('imported pilot has three real original images, captions, links and stays disabled', () => {
  const path = join(process.cwd(), 'content/dzen/drafts/shorten-link-no-signup.json')
  const data = JSON.parse(readFileSync(path, 'utf8')) as { post: BlogPost }
  assert.equal(data.post.dzen!.enabled, false)
  const images = data.post.content.filter(block => block.type === 'image')
  assert.equal(images.length, 3)
  for (const image of images) {
    if (image.type !== 'image') throw new Error('Wrong image type')
    const file = join(process.cwd(), 'public', new URL(image.image.url, 'https://revroute.ru').pathname)
    assert.equal(statSync(file).size, image.image.length)
    assert.ok(image.image.width >= 700)
    assert.ok(image.caption)
    assert.equal(readFileSync(file).subarray(0, 2).toString('hex'), 'ffd8')
  }
  const html = renderArticle(data.post)
  assert.equal((html.match(/<figcaption>/g) ?? []).length, 3)
  assert.match(html, /<b>Шаг 1\./)
  for (const path of ['/tools/link-shortener', '/tools/utm', '/tools/qr', '/links']) {
    assert.ok(html.includes('https://revroute.ru' + path))
  }
})

test('formatted lists, quotes and numeric stats preserve readable content', () => {
  const p = article()
  p.content = [
    { type: 'rich-list', ordered: true, items: [[
      { type: 'bold', children: [{ type: 'text', text: 'Проверьте' }] },
      { type: 'link', href: '/links', children: [{ type: 'text', text: ' ссылку' }] },
    ]] },
    { type: 'quote', text: 'Цитата <без HTML>' },
    { type: 'stats', stats: [{ value: '10', label: 'ссылок' }], caption: 'Лимит' },
  ]
  const html = renderArticle(p)
  assert.match(html, /<ol><li><b>Проверьте<\/b>/)
  assert.match(html, /<blockquote><p>Цитата &lt;без HTML&gt;<\/p><\/blockquote>/)
  assert.match(html, /<b>10<\/b> — ссылок/)
})
test('HTTP handler serves RSS and returns 503 for invalid enabled content', async (context) => {
  const { GET } = await import('../app/feed/zen.xml/route')
  const count = posts.length
  const logger = context.mock.method(console, 'error', () => {})
  try {
    const p = article()
    posts.push(p)
    const ok = await GET()
    assert.equal(ok.status, 200)
    assert.equal(ok.headers.get('Content-Type'), 'application/rss+xml; charset=utf-8')
    assert.match(await ok.text(), /revroute:blog:test-article/)
    p.content = [{ type: 'mock', variant: 'social-bounty' }]
    const bad = await GET()
    assert.equal(bad.status, 503)
    assert.equal(bad.headers.get('Cache-Control'), 'no-store')
    assert.equal(logger.mock.calls.length, 1)
  } finally {
    posts.splice(count)
    logger.mock.restore()
  }
})

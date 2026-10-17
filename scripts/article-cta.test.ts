import assert from 'node:assert/strict'
import test from 'node:test'
import { ARTICLE_CTA_SLOTS, articleCtaParams, normalizeArticleContext } from '../lib/analytics/article-cta'

test('article CTA retains only slug, slot and destination, without URL, IDs or user data', () => {
  const params = articleCtaParams({ href: 'https://app.revroute.ru/register?landing_session_id=private&utm_source=blog&email=private@example.com', slug: 'qr-with-analytics', slot: 'bottom' })
  assert.deepEqual(params, { slug: 'qr-with-analytics', slot: 'bottom', destination: 'register' })
  assert.deepEqual(articleCtaParams({ href: 'https://app.revroute.ru/login/', slug: 'qr-with-analytics', slot: 'inline' }), { slug: 'qr-with-analytics', slot: 'inline', destination: 'login' })
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/workspace/links', slug: 'qr-with-analytics', slot: 'inline' })?.destination, 'app')
})

test('all article CTA slots are supported without treating a navigation as a registration event', () => {
  for (const slot of ARTICLE_CTA_SLOTS) {
    assert.deepEqual(articleCtaParams({ href: 'https://app.revroute.ru/login', slug: 'utm-vk-ads', slot }), { slug: 'utm-vk-ads', slot, destination: 'login' })
  }
})

test('previews, related posts, images, external sites and spoofed app hosts are not product CTAs', () => {
  for (const href of ['/blog/other', 'https://revroute.ru/blog/social/test.png', 'https://example.com', 'https://app.revroute.ru.example.com/register', 'https://app.revroute.ru@evil.example/register', 'https://app.revroute.ru:444/register', 'http://app.revroute.ru/register', 'javascript:alert(1)', 'https://user:secret@app.revroute.ru/register']) {
    assert.equal(articleCtaParams({ href, slug: 'qr-with-analytics', slot: 'inline' }), null, href)
  }
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/register', slot: 'bottom' }), null)
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/register', slug: '../preview', slot: 'bottom' }), null)
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/register', slug: 'qr-with-analytics', slot: 'unknown' }), null)
})

test('normalization validates both context fields, picks only known fields and never mutates its input', () => {
  const input = { article_slug: 'link-analytics-csv', article_cta_slot: 'header', email: 'private@example.com' }
  const before = JSON.stringify(input)
  assert.deepEqual(normalizeArticleContext(input), { article_slug: 'link-analytics-csv', article_cta_slot: 'header' })
  assert.equal(JSON.stringify(input), before)
  for (const invalid of [undefined, null, 'slug', [], {}, { article_slug: 'good-slug' }, { article_cta_slot: 'bottom' }, { article_slug: 'Good-Slug', article_cta_slot: 'inline' }, { article_slug: '../preview', article_cta_slot: 'inline' }, { article_slug: 'good-slug', article_cta_slot: 'unknown' }, { article_slug: 'good-slug ', article_cta_slot: 'footer' }]) {
    assert.equal(normalizeArticleContext(invalid), null, JSON.stringify(invalid))
  }
})

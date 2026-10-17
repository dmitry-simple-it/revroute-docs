import assert from 'node:assert/strict'
import test from 'node:test'
import { articleCtaParams } from '../lib/analytics/article-cta'

test('article CTA retains slug and slot without URL, attribution IDs, or user data', () => {
  const params = articleCtaParams({ href: 'https://app.revroute.ru/register?landing_session_id=private&utm_source=blog', slug: 'qr-with-analytics', slot: 'bottom' })
  assert.deepEqual(params, { slug: 'qr-with-analytics', slot: 'bottom', destination: 'register' })
  assert.deepEqual(articleCtaParams({ href: 'https://app.revroute.ru/login/', slug: 'qr-with-analytics', slot: 'inline' }), { slug: 'qr-with-analytics', slot: 'inline', destination: 'login' })
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/workspace/links', slug: 'qr-with-analytics', slot: 'inline' })?.destination, 'app')
})
test('previews, related posts, images, external sites, and spoofed app hosts are not product CTAs', () => {
  for (const href of ['/blog/other', 'https://revroute.ru/blog/social/test.png', 'https://example.com', 'https://app.revroute.ru.example.com/register', 'http://app.revroute.ru/register', 'javascript:alert(1)', 'https://user:secret@app.revroute.ru/register']) {
    assert.equal(articleCtaParams({ href, slug: 'qr-with-analytics', slot: 'inline' }), null, href)
  }
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/register', slot: 'bottom' }), null)
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/register', slug: '../preview', slot: 'bottom' }), null)
  assert.equal(articleCtaParams({ href: 'https://app.revroute.ru/register', slug: 'qr-with-analytics', slot: 'unknown' }), null)
})

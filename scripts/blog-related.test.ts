import { test } from 'node:test'
import assert from 'node:assert/strict'
import { posts } from '../content/blog'
import { approvedDzenPosts } from '../content/dzen/approved'
import { BLOG_RELATED_LINKS, getRelatedBlogPosts } from '../lib/seo/blog-related'

const seriesSlugs = approvedDzenPosts.map(post => post.slug)

test('editorial navigation covers the published Links series', () => {
  assert.equal(seriesSlugs.length, 16)
  assert.deepEqual(Object.keys(BLOG_RELATED_LINKS).sort(), [...seriesSlugs].sort())
})

test('every article has two or three distinct published next steps with individual reasons', () => {
  const reasons = new Set<string>()
  for (const slug of seriesSlugs) {
    const links = BLOG_RELATED_LINKS[slug]
    const resolved = getRelatedBlogPosts(slug, posts)
    assert.ok(links.length >= 2 && links.length <= 3, slug)
    assert.equal(resolved.length, links.length, `Missing published target for ${slug}`)
    assert.equal(new Set(links.map(link => link.slug)).size, links.length, `Duplicate target for ${slug}`)
    for (const link of links) {
      assert.notEqual(link.slug, slug, `Self-link for ${slug}`)
      assert.ok(seriesSlugs.includes(link.slug), `Target outside the published series: ${link.slug}`)
      assert.ok(link.reason.trim(), `Missing explanation for ${slug} → ${link.slug}`)
      assert.ok(!reasons.has(link.reason), `Repeated generic explanation: ${link.reason}`)
      reasons.add(link.reason)
      const result = resolved.find(item => item.post.slug === link.slug)!
      assert.equal(result.post, posts.find(post => post.slug === link.slug))
      assert.equal(result.reason, link.reason)
    }
  }
})

test('all approved articles are reachable from each entry point', () => {
  for (const start of seriesSlugs) {
    const visited = new Set<string>()
    const pending = [start]
    while (pending.length) {
      const slug = pending.pop()!
      if (visited.has(slug)) continue
      visited.add(slug)
      pending.push(...getRelatedBlogPosts(slug, posts).map(item => item.post.slug))
    }
    assert.deepEqual([...visited].sort(), [...seriesSlugs].sort(), `Disconnected cluster from ${start}`)
  }
})

test('removed destinations are omitted instead of creating broken links', () => {
  const source = 'shorten-link-no-signup'
  const removed = BLOG_RELATED_LINKS[source][0].slug
  const available = posts.filter(post => post.slug !== removed)
  const links = getRelatedBlogPosts(source, available)
  assert.equal(links.length, BLOG_RELATED_LINKS[source].length - 1)
  assert.ok(links.every(link => link.post.slug !== removed))
})

test('unmapped and empty catalogs have no unrelated fallback', () => {
  for (const slug of ['unmapped-article', 'constructor', '__proto__']) {
    assert.deepEqual(getRelatedBlogPosts(slug, posts), [])
  }
  assert.deepEqual(getRelatedBlogPosts('shorten-link-no-signup', []), [])
})

test('resolving website navigation preserves publication content and RSS settings', () => {
  const before = JSON.stringify(posts)
  for (const slug of seriesSlugs) getRelatedBlogPosts(slug, posts)
  assert.equal(JSON.stringify(posts), before)
})

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { posts } from '../content/blog'
import { blogArticleImage, blogMetaDescription, blogSocialImagePath } from '../lib/seo/blog'
import { getRelatedBlogPosts } from '../lib/seo/blog-related'
import { renderDzenFeed } from '../lib/dzen/rss'

const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')
const decode = (value: string) => value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
function attr(tag: string, key: string): string | undefined {
  const match = tag.match(new RegExp(`(?:^|\\s)${key}="([^"]*)"`))
  return match ? decode(match[1]) : undefined
}
function meta(html: string, name: string): string | undefined {
  for (const tag of html.match(/<meta\b[^>]*>/g) ?? []) {
    if (attr(tag, 'property') === name || attr(tag, 'name') === name) return attr(tag, 'content')
  }
}
async function main() {
  const base = (process.argv[2] ?? 'http://127.0.0.1:3102').replace(/\/$/, '')
  const output = process.argv[3]
  const before = process.argv[4]
  const records: Record<string, unknown>[] = []
  for (let offset = 0; offset < posts.length; offset += 4) {
    await Promise.all(posts.slice(offset, offset + 4).map(async post => {
      const response = await fetch(`${base}/blog/${post.slug}`)
      assert.equal(response.status, 200, post.slug)
      const html = await response.text()
      assert.equal(meta(html, 'description'), blogMetaDescription(post), `${post.slug}: description`)
      assert.equal(meta(html, 'og:type'), 'article', `${post.slug}: OG type`)
      assert.equal(meta(html, 'og:image'), `https://revroute.ru${blogSocialImagePath(post.slug)}`)
      assert.equal(meta(html, 'twitter:image'), meta(html, 'og:image'))
      const canonical = (html.match(/<link\b[^>]*>/g) ?? []).find(tag => attr(tag, 'rel') === 'canonical')
      assert.equal(canonical && attr(canonical, 'href'), `https://revroute.ru/blog/${post.slug}`)
      assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
      const robots = meta(html, 'robots') ?? ''
      assert.ok(!robots.includes('noindex'), `${post.slug}: indexable`)
      const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => {
        const value = JSON.parse(match[1]); return Array.isArray(value) ? value : value['@graph'] ?? [value]
      })
      const article = schemas.find(schema => schema['@type'] === 'Article')
      assert.ok(article, `${post.slug}: Article schema`)
      assert.ok(article.image.includes(new URL(blogArticleImage(post), 'https://revroute.ru').href))
      assert.equal(article.author['@type'], post.author.name === 'Команда RevRoute' ? 'Organization' : 'Person')
      const related = getRelatedBlogPosts(post.slug, posts)
      for (const item of related) assert.ok(html.includes(`href="/blog/${item.post.slug}"`), `${post.slug}: missing related ${item.post.slug}`)
      assert.ok(html.includes(`data-article-slug="${post.slug}"`))
      assert.ok(html.includes('data-article-cta-slot="inline"') && html.includes('data-article-cta-slot="bottom"'))
      const cardResponse = await fetch(`${base}${blogSocialImagePath(post.slug)}`)
      assert.equal(cardResponse.status, 200)
      const bytes = Buffer.from(await cardResponse.arrayBuffer())
      assert.equal(sha(bytes), sha(await readFile(path.join('public', blogSocialImagePath(post.slug)))))
      records.push({ slug: post.slug, http: response.status, description: blogMetaDescription(post), ogType: 'article', socialImage: blogSocialImagePath(post.slug), cardSha256: sha(bytes), authorType: article.author['@type'], related: related.map(item => item.post.slug) })
    }))
  }
  const feedResponse = await fetch(`${base}/feed/zen.xml`)
  assert.equal(feedResponse.status, 200)
  const feed = await feedResponse.text()
  assert.equal(sha(feed), sha(renderDzenFeed(posts)), 'RSS must match approved publication bodies, GUIDs and dates')
  if (before) assert.equal(sha(feed), JSON.parse(await readFile(before, 'utf8')).rssSha256, 'RSS changed against pre-release baseline')
  for (const invalid of ['/blog/seo-release-missing-article', '/blog/preview/geo-targeting-links']) {
    assert.equal((await fetch(`${base}${invalid}`)).status, 404, `${invalid}: production previews and unknown articles must not be public`)
  }
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
  const listing = await (await fetch(`${base}/blog`)).text()
  for (const post of posts) {
    assert.ok(sitemap.includes(`https://revroute.ru/blog/${post.slug}`))
    assert.ok(listing.includes(`/blog/${post.slug}`))
  }
  const report = { checkedAt: new Date().toISOString(), base, status: 'PASS', articleCount: records.length, relatedArticleCount: records.filter(row => (row.related as string[]).length).length, relatedLinks: records.reduce((sum, row) => sum + (row.related as string[]).length, 0), rssItems: (feed.match(/<item>/g) ?? []).length, rssDraftItems: (feed.match(/<category>native-draft<\/category>/g) ?? []).length, rssSha256: sha(feed), articles: records.sort((a, b) => String(a.slug).localeCompare(String(b.slug))) }
  if (output) { await mkdir(path.dirname(output), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n') }
  console.log(JSON.stringify({ ...report, articles: undefined }, null, 2))
}
main().catch(error => { console.error(error); process.exitCode = 1 })

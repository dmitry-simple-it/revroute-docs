import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { posts, type BlogPost } from '../content/blog'
import { approvedDzenPosts } from '../content/dzen/approved'
import { BLOG_META_DESCRIPTIONS, blogArticleAuthor, blogArticleImage, blogMetaDescription, blogPublishedAt, blogSocialImagePath } from '../lib/seo/blog'
import { article, ORG_ID, SITE } from '../lib/seo/schemas'

test('every approved Links guide has a distinct editorial search summary within 160 characters', () => {
  assert.equal(approvedDzenPosts.length, 14)
  assert.deepEqual(Object.keys(BLOG_META_DESCRIPTIONS).sort(), approvedDzenPosts.map((post) => post.slug).sort())
  const summaries = approvedDzenPosts.map(blogMetaDescription)
  assert.equal(new Set(summaries).size, summaries.length)
  for (const summary of summaries) {
    assert.ok(summary.length >= 90 && Array.from(summary).length <= 160, summary)
    assert.doesNotMatch(summary, /\{[^}]+\}|<[^>]+>/)
  }
})

test('unmapped articles retain their excerpt and no source content is mutated', () => {
  const input = { slug: 'future-article', excerpt: 'Авторское описание новой статьи.' }
  assert.equal(blogMetaDescription(input), input.excerpt)
  const before = JSON.stringify(posts)
  posts.forEach((post) => {
    blogMetaDescription(post)
    blogArticleImage(post)
    blogPublishedAt(post)
    blogArticleAuthor(post.author)
  })
  assert.equal(JSON.stringify(posts), before)
})

test('every article has its own social path and schema image falls back to that cover', () => {
  const paths = posts.map((post) => blogSocialImagePath(post.slug))
  assert.equal(new Set(paths).size, posts.length)
  for (const post of posts) {
    assert.equal(blogSocialImagePath(post.slug), `/blog/social/${post.slug}.png`)
    assert.equal(blogArticleImage({ slug: post.slug, content: [] }), blogSocialImagePath(post.slug))
  }
})

test('schema image selects the first real screenshot, without using a mock or changing its URL', () => {
  const input: Pick<BlogPost, 'slug' | 'content'> = {
    slug: 'image-example',
    content: [
      { type: 'p', text: 'Статья' },
      { type: 'image', image: { url: '/blog/example/first.jpg', type: 'image/jpeg', width: 1200, height: 800, length: 1000 }, alt: 'Первый кадр' },
      { type: 'image', image: { url: 'https://cdn.example/second.png', type: 'image/png', width: 1200, height: 800, length: 1000 }, alt: 'Второй кадр' },
    ],
  }
  assert.equal(blogArticleImage(input), '/blog/example/first.jpg')
})

test('publication timestamps use the existing explicit time, with the legacy date as fallback', () => {
  for (const post of posts) assert.equal(blogPublishedAt(post), post.dzen?.publishedAt ?? post.date)
  const post = approvedDzenPosts.find((entry) => entry.slug === 'ab-test-landing-pages')!
  assert.equal(blogPublishedAt(post), '2026-10-17T12:37:20Z')
})

test('RevRoute team is an Organization and people retain their actual identity without an invented profile', () => {
  assert.deepEqual(blogArticleAuthor({ name: 'Команда RevRoute', role: 'RevRoute Links', initials: 'RR' }), {
    name: 'Команда RevRoute', type: 'Organization', url: ORG_ID,
  })
  const person = blogArticleAuthor({ name: 'Илья Миронов', role: 'Редактор', initials: 'ИМ' })
  assert.deepEqual(person, { name: 'Илья Миронов', type: 'Person', role: 'Редактор' })
  assert.equal(person.url, undefined)
})

const baseArticle = {
  url: '/blog/schema-test', headline: 'Проверка статьи', description: 'Описание статьи',
  datePublished: '2026-10-17T12:37:20Z',
}

test('article schema keeps legacy callers working and identifies the existing team entity', () => {
  const schema = article({ ...baseArticle, author: { name: 'Команда RevRoute', role: 'RevRoute Links' } })
  assert.deepEqual(schema.author, { '@type': 'Organization', name: 'Команда RevRoute', url: ORG_ID })
  assert.deepEqual(schema.publisher, { '@id': ORG_ID })
  assert.equal(schema.dateModified, baseArticle.datePublished)
  assert.equal(schema['@id'], SITE + '/blog/schema-test#article')
  assert.ok(!Object.hasOwn(schema, 'image'))
})

test('article schema supports explicit Person and Organization authors without an organization job title', () => {
  const person = article({ ...baseArticle, author: { name: 'Редактор', role: 'Автор' } })
  assert.deepEqual(person.author, { '@type': 'Person', name: 'Редактор', jobTitle: 'Автор' })
  const organization = article({ ...baseArticle, author: { name: 'Редакция', type: 'Organization', url: '/about', role: 'Редактор' } })
  assert.deepEqual(organization.author, { '@type': 'Organization', name: 'Редакция', url: SITE + '/about' })
})

test('schema images are absolute while existing external URLs and source timestamps are preserved', () => {
  const schema = article({
    ...baseArticle, author: { name: 'Автор' },
    dateModified: '2026-10-18T09:00:00+03:00',
    image: ['/blog/example/first.jpg', 'https://cdn.example/second.png?size=large'],
  })
  assert.deepEqual(schema.image, [SITE + '/blog/example/first.jpg', 'https://cdn.example/second.png?size=large'])
  assert.equal(schema.datePublished, baseArticle.datePublished)
  assert.equal(schema.dateModified, '2026-10-18T09:00:00+03:00')
  assert.deepEqual(article({ ...baseArticle, author: { name: 'Автор' }, image: '/blog/social/schema-test.png' }).image, [
    SITE + '/blog/social/schema-test.png',
  ])
})

test('every published article has a real 1200 by 630 PNG social cover', () => {
  for (const post of posts) {
    const file = join(process.cwd(), 'public', blogSocialImagePath(post.slug))
    const bytes = readFileSync(file)
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', post.slug)
    assert.equal(bytes.subarray(12, 16).toString('ascii'), 'IHDR', post.slug)
    assert.equal(bytes.readUInt32BE(16), 1200, post.slug)
    assert.equal(bytes.readUInt32BE(20), 630, post.slug)
  }
})

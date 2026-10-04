import type { BlogContentBlock, BlogPost } from '../../content/blog'
import type { BlogInline, DzenImage } from './types'

export const SITE_URL = 'https://revroute.ru'
export const FEED_PATH = '/feed/zen.xml'
export const MAX_FEED_BYTES = 10 * 1024 * 1024 // local operational limit, not a verified platform limit

export function escapeXml(value: string): string {
  // Reject characters illegal in XML 1.0 instead of silently changing source text.
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/u.test(value)) {
    throw new Error('Invalid XML character')
  }
  for (const character of value) {
    const point = character.codePointAt(0)!
    if (point >= 0xd800 && point <= 0xdfff) throw new Error('Unpaired XML surrogate')
  }
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export function absoluteUrl(value: string, siteUrl = SITE_URL): string {
  if (!value.trim()) throw new Error('URL must not be empty')
  const url = new URL(value, siteUrl)
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Only public HTTP(S) URLs without credentials are allowed')
  }
  return url.href
}

function cdata(value: string): string {
  escapeXml(value)
  return '<![CDATA[' + value.replace(/\]\]>/g, ']]]]><![CDATA[>') + ']]>'
}

export function renderInline(nodes: BlogInline[], siteUrl = SITE_URL): string {
  return nodes.map(node => {
    switch (node.type) {
      case 'text': return escapeXml(node.text)
      case 'bold': return '<b>' + renderInline(node.children, siteUrl) + '</b>'
      case 'italic': return '<i>' + renderInline(node.children, siteUrl) + '</i>'
      case 'link': return '<a href="' + escapeXml(absoluteUrl(node.href, siteUrl)) + '">' +
        renderInline(node.children, siteUrl) + '</a>'
      default: throw new Error('Unsupported inline node')
    }
  }).join('')
}

export function validateImage(image: DzenImage, siteUrl = SITE_URL): void {
  absoluteUrl(image.url, siteUrl)
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(image.type)) {
    throw new Error('Unsupported image MIME type')
  }
  // Conservative project policy until account-specific Dzen requirements are verified.
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height) ||
      image.width < 700 || image.height < 320 ||
      !Number.isInteger(image.length) || image.length <= 0) {
    throw new Error('Image needs real dimensions (at least 700x320) and byte length')
  }
}

function renderBlock(block: BlogContentBlock, siteUrl: string): string {
  switch (block.type) {
    case 'p': return '<p>' + escapeXml(block.text) + '</p>'
    case 'rich-p': return '<p>' + renderInline(block.children, siteUrl) + '</p>'
    case 'h2': case 'h3':
      return '<' + block.type + '>' + escapeXml(block.text) + '</' + block.type + '>'
    case 'ul': case 'ol':
      return '<' + block.type + '>' +
        block.items.map(item => '<li>' + escapeXml(item) + '</li>').join('') +
        '</' + block.type + '>'
    case 'rich-list':
      return '<' + (block.ordered ? 'ol' : 'ul') + '>' +
        block.items.map(item => '<li>' + renderInline(item, siteUrl) + '</li>').join('') +
        '</' + (block.ordered ? 'ol' : 'ul') + '>'
    case 'image':
      validateImage(block.image, siteUrl)
      return '<figure><img src="' + escapeXml(absoluteUrl(block.image.url, siteUrl)) +
        '" alt="' + escapeXml(block.alt) + '"/>' +
        (block.caption ? '<figcaption>' + escapeXml(block.caption) + '</figcaption>' : '') +
        '</figure>'
    case 'quote': return '<blockquote><p>' + escapeXml(block.text) + '</p></blockquote>'
    case 'cta':
      return '<p>' + escapeXml(block.body) + '</p><p><a href="' +
        escapeXml(absoluteUrl(block.href, siteUrl)) + '">' + escapeXml(block.label) + '</a></p>'
    case 'stats':
      return '<ul>' + block.stats.map(stat =>
        '<li><b>' + escapeXml(stat.value) + '</b> — ' + escapeXml(stat.label) + '</li>'
      ).join('') + '</ul>' + (block.caption ? '<p>' + escapeXml(block.caption) + '</p>' : '')
    case 'table':
      if (block.rows.some(row => row.length !== block.headers.length)) {
        throw new Error('Table headers and rows must have matching lengths')
      }
      // Tables are not in the conservative Dzen whitelist; retain every labelled cell.
      return (block.caption ? '<p><b>' + escapeXml(block.caption) + '</b></p>' : '') +
        '<ul>' + block.rows.map(row => '<li>' + row.map((cell, index) =>
          '<b>' + escapeXml(block.headers[index]) + ':</b> ' + escapeXml(cell)
        ).join('; ') + '</li>').join('') + '</ul>'
    case 'mock':
      // React/CSS mocks need an explicit screenshot; never drop article content silently.
      throw new Error('Replace mock "' + block.variant + '" with an image before RSS export')
    default: throw new Error('Unsupported article block')
  }
}

export function renderArticle(post: BlogPost, siteUrl = SITE_URL): string {
  if (!post.content.length) throw new Error('Article body is empty')
  let html = post.content.map(block => renderBlock(block, siteUrl)).join('\n')
  if (post.faq?.length) {
    html += '\n<h2>Часто задаваемые вопросы</h2>\n' + post.faq.map(item =>
      '<h3>' + escapeXml(item.q) + '</h3><p>' + escapeXml(item.a) + '</p>'
    ).join('\n')
  }
  if (post.sources?.length) {
    html += '\n<h2>Источники</h2><ul>' + post.sources.map(source =>
      '<li><a href="' + escapeXml(absoluteUrl(source.url, siteUrl)) + '">' +
      escapeXml(source.label) + '</a>' +
      (source.note ? ' — ' + escapeXml(source.note) : '') + '</li>'
    ).join('') + '</ul>'
  }
  return html
}

export function publicationDate(post: BlogPost): Date {
  const input = post.dzen?.publishedAt ?? post.date
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(input)) {
    throw new Error('Publication date needs ISO date or timestamp with timezone')
  }
  const date = new Date(input)
  const calendarDate = new Date(input.slice(0, 10))
  if (!Number.isFinite(date.getTime()) || !Number.isFinite(calendarDate.getTime()) ||
      calendarDate.toISOString().slice(0, 10) !== input.slice(0, 10)) {
    throw new Error('Invalid publication date')
  }
  return date
}

export function renderDzenFeed(
  posts: BlogPost[],
  options: { siteUrl?: string; now?: Date } = {},
): string {
  const siteUrl = absoluteUrl(options.siteUrl ?? SITE_URL)
  const now = options.now ?? new Date()
  const selected = posts.filter(post => post.dzen?.enabled === true)
    .map(post => ({ post, date: publicationDate(post) }))
    .filter(item => item.date.getTime() <= now.getTime())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  if (selected.length > 500) throw new Error('Feed exceeds the project limit of 500 articles')
  const guids = new Set<string>()
  const urls = new Set<string>()
  const items = selected.map(({ post, date }) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) throw new Error('Invalid article slug')
    if (!post.title.trim() || Array.from(post.title).length > 140) {
      throw new Error('Article title must contain 1–140 characters')
    }
    if (!post.excerpt.trim()) throw new Error('Article excerpt is empty')
    const config = post.dzen!
    if (config.mode !== undefined && !['draft', 'publish'].includes(config.mode)) {
      throw new Error('Unknown Dzen publication mode')
    }
    validateImage(config.cover, siteUrl)
    const link = absoluteUrl('/blog/' + post.slug, siteUrl)
    const guid = config.guid ?? 'revroute:blog:' + post.slug
    if (!guid.trim() || guids.has(guid) || urls.has(link)) throw new Error('Duplicate or empty article identifier')
    guids.add(guid)
    urls.add(link)
    const draft = config.mode !== 'publish' ? '<category>native-draft</category>\n' : ''
    return '<item>\n<title>' + escapeXml(post.title) + '</title>\n' +
      '<link>' + escapeXml(link) + '</link>\n' +
      '<guid isPermaLink="false">' + escapeXml(guid) + '</guid>\n' +
      '<pubDate>' + date.toUTCString() + '</pubDate>\n' +
      '<description>' + escapeXml(post.excerpt) + '</description>\n' +
      draft + '<category>format-article</category>\n' +
      '<enclosure url="' + escapeXml(absoluteUrl(config.cover.url, siteUrl)) +
      '" type="' + escapeXml(config.cover.type) + '" length="' + config.cover.length + '"/>\n' +
      '<media:rating scheme="urn:simple">nonadult</media:rating>\n' +
      '<content:encoded>' + cdata(renderArticle(post, siteUrl)) + '</content:encoded>\n</item>'
  })
  const lastBuild = selected[0]?.date
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" ' +
    'xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '<channel>\n<title>RevRoute — статьи</title>\n<link>' + escapeXml(siteUrl) + '</link>\n' +
    '<description>Гайды по ссылкам и партнёрским программам RevRoute</description>\n' +
    '<language>ru</language>\n<atom:link href="' +
    escapeXml(absoluteUrl(FEED_PATH, siteUrl)) + '" rel="self" type="application/rss+xml"/>\n' +
    (lastBuild ? '<lastBuildDate>' + lastBuild.toUTCString() + '</lastBuildDate>\n' : '') +
    items.join('\n') + '\n</channel>\n</rss>\n'
  if (Buffer.byteLength(xml, 'utf8') > MAX_FEED_BYTES) throw new Error('Feed exceeds 10 MiB operational limit')
  return xml
}

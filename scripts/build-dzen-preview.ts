import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { BlogPost } from '../content/blog'
import { escapeXml, renderArticle, renderDzenFeed, SITE_URL } from '../lib/dzen/rss'

const input = process.argv.find(arg => arg.startsWith('--draft='))?.slice('--draft='.length)
if (!input) throw new Error('Usage: tsx scripts/build-dzen-preview.ts --draft=content/dzen/drafts/slug.json')
const draft = JSON.parse(readFileSync(resolve(input), 'utf8')) as { post: BlogPost }
const post = draft.post
if (!post.dzen) throw new Error('Draft RSS metadata missing')
const dir = join(process.cwd(), 'tmp', 'dzen-rss', post.slug)
mkdirSync(dir, { recursive: true })
const html = renderArticle(post).replace(/src="(https:\/\/revroute\.ru\/[^"]+)"/g, (_, value: string) => {
  const file = join(process.cwd(), 'public', new URL(value).pathname)
  return 'src="' + escapeXml(pathToFileURL(file).href) + '"'
})
const page = '<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>' + escapeXml(post.title) + '</title><style>' +
  'body{margin:0;background:#f4f4f4;color:#202124;font:18px/1.65 Arial,sans-serif}' +
  'main{max-width:780px;padding:32px 24px;margin:24px auto;background:white}' +
  'h1{font-size:32px;line-height:1.2}h2{font-size:25px;line-height:1.35;margin-top:36px}' +
  'figure{margin:24px 0}img{width:100%;height:auto}figcaption{font-size:15px;line-height:1.5;color:#666}' +
  'a{color:#6336c6}p{overflow-wrap:anywhere}.note{font-size:14px;color:#666}' +
  '@media(max-width:600px){main{margin:0;padding:24px 18px}h1{font-size:27px}}' +
  '</style><main><p class="note">Локальная проверка RSS-разметки. Отображение в Дзене ещё не проверено.</p>' +
  '<h1>' + escapeXml(post.title) + '</h1>' + html + '</main></html>'
writeFileSync(join(dir, 'preview.html'), page)
const previewPost = { ...post, dzen: { ...post.dzen, enabled: true, mode: 'draft' as const } }
const now = new Date(Math.max(Date.now(), new Date(post.date).getTime()))
writeFileSync(join(dir, 'preview.xml'), renderDzenFeed([previewPost], { siteUrl: SITE_URL, now }))
console.log(JSON.stringify({ html: join(dir, 'preview.html'), xml: join(dir, 'preview.xml'), productionFeedChanged: false }))

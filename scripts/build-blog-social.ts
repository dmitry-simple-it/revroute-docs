/** Generate article-specific social cards. Run: npx tsx scripts/build-blog-social.ts
 * Existing screenshots and article/RSS text are never modified.
 * PNGs are committed, so production builds do not depend on host fonts.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { posts } from '../content/blog'

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
async function main() {
const root = process.cwd()
const destination = path.join(root, 'public/blog/social')
await mkdir(destination, { recursive: true })
const wordmark = await readFile(path.join(root, 'public/brand/wordmark-light.svg'))
const brand = await sharp(wordmark).resize({ width: 300 }).png().toBuffer()
const report: { slug: string; title: string; titleHeight: number; fontSize: number }[] = []
for (const post of posts) {
  let fontSize = 60
  let rendered: { data: Buffer; info: sharp.OutputInfo }
  do {
    rendered = await sharp({ text: { text: escape(post.title), font: `Arial Bold ${fontSize}`, width: 1056, spacing: 6, rgba: true } }).png().toBuffer({ resolveWithObject: true })
    if (rendered.info.height <= 330) break
    fontSize -= 2
  } while (fontSize >= 38)
  if (rendered!.info.height > 330) throw new Error(`Title does not fit: ${post.slug}`)
  const category = await sharp({ text: { text: escape(`${post.category.toUpperCase()}  /  БЛОГ`), font: 'Arial 24', rgba: true } }).png().toBuffer()
  const footer = await sharp({ text: { text: 'revroute.ru', font: 'Arial 25', rgba: true } }).png().toBuffer()
  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#fafaf9"/><path d="M72 130H1128M72 550H1128" stroke="#d6d3d1" stroke-width="2"/></svg>`)
  const card = await sharp(background).composite([
    { input: brand, left: 55, top: 24 },
    { input: category, left: 72, top: 163 },
    { input: rendered!.data, left: 72, top: 216 },
    { input: footer, left: 72, top: 575 },
  ]).png().toBuffer()
  await writeFile(path.join(destination, `${post.slug}.png`), card)
  report.push({ slug: post.slug, title: post.title, titleHeight: rendered!.info.height, fontSize })
}
console.log(JSON.stringify({ generated: report.length, dimensions: '1200x630', maxTitleHeight: Math.max(...report.map(x => x.titleHeight)), cards: report }, null, 2))

}
main().catch((error) => { console.error(error); process.exitCode = 1 })

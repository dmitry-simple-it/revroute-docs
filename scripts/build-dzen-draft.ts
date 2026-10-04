import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { BlogContentBlock, BlogPost } from '../content/blog'
import type { BlogInline, DzenImage } from '../lib/dzen/types'

type Node = { type: string; value?: string; depth?: number; ordered?: boolean; url?: string; alt?: string; children?: Node[] }
const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const split = arg.indexOf('=')
  return [arg.slice(2, split), arg.slice(split + 1)]
}))
if (!args.source || !args.slug || !args.date || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug)) {
  throw new Error('Usage: tsx scripts/build-dzen-draft.ts --source=absolute.md --slug=kebab-case --date=YYYY-MM-DD [--image-map=map.json]')
}
const root = process.cwd()
const source = resolve(args.source)
const text = readFileSync(source, 'utf8').replace(/^\uFEFF/, '')
const marker = '# Черновик статьи (под публикацию в Дзене)'
if (!text.includes(marker)) throw new Error('Publication body marker is missing; refusing to import the brief')
const body = text.slice(text.indexOf(marker) + marker.length).trim()
const tree = unified().use(remarkParse).parse(body) as unknown as Node
const imageMap: Record<string, string> = args['image-map'] ? JSON.parse(readFileSync(args['image-map'], 'utf8')) : {}
const nodes = tree.children ?? []
const titleNode = nodes.shift()
if (titleNode?.type !== 'heading') throw new Error('First publication block must be the title')

function plain(node: Node): string {
  return node.value ?? (node.children ?? []).map(plain).join('')
}
function inline(node: Node): BlogInline {
  if (node.type === 'text' || node.type === 'inlineCode') return { type: 'text', text: node.value ?? '' }
  if (node.type === 'strong' || node.type === 'emphasis') {
    return { type: node.type === 'strong' ? 'bold' : 'italic', children: (node.children ?? []).map(inline) }
  }
  if (node.type === 'link') return { type: 'link', href: node.url!, children: (node.children ?? []).map(inline) }
  throw new Error('Unsupported inline Markdown: ' + node.type)
}

function imageInfo(file: string): Pick<DzenImage, 'width' | 'height' | 'type' | 'length'> {
  const bytes = readFileSync(file)
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { type: 'image/png', width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), length: bytes.length }
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) throw new Error('Malformed JPEG')
      const marker = bytes[offset + 1]
      const size = bytes.readUInt16BE(offset + 2)
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { type: 'image/jpeg', width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5), length: bytes.length }
      }
      if (size < 2) throw new Error('Malformed JPEG segment')
      offset += 2 + size
    }
  }
  throw new Error('Draft importer currently accepts original JPEG or PNG images')
}

const content: BlogContentBlock[] = []
const replacements: { from: string; to: string }[] = []
for (let index = 0; index < nodes.length; index++) {
  const node = nodes[index]
  if (node.type === 'thematicBreak') continue // separator has no publication text
  if (node.type === 'heading') {
    content.push({ type: (node.depth ?? 3) <= 3 ? 'h2' : 'h3', text: plain(node) })
  } else if (node.type === 'paragraph' && node.children?.length === 1 && node.children[0].type === 'image') {
    const img = node.children[0]
    if (!img.url || /^(?:[a-z]+:|\/)/i.test(img.url)) throw new Error('Importer requires relative local images')
    const replacement = imageMap[img.url] ?? img.url
    const input = resolve(dirname(source), replacement)
    const info = imageInfo(input)
    if (info.width < 700 || info.height < 320) {
      throw new Error('Image is too small for our RSS policy: ' + basename(input) + '; supply an original via --image-map')
    }
    const filename = basename(input)
    const outputDir = join(root, 'public', 'blog', args.slug)
    mkdirSync(outputDir, { recursive: true })
    copyFileSync(input, join(outputDir, filename))
    if (statSync(join(outputDir, filename)).size !== info.length) throw new Error('Image copy failed')
    let caption: string | undefined
    const next = nodes[index + 1]
    if (next?.type === 'paragraph' && next.children?.length === 1 && next.children[0].type === 'emphasis') {
      caption = plain(next)
      index++
    }
    content.push({ type: 'image', image: { url: '/blog/' + args.slug + '/' + filename, ...info }, alt: img.alt ?? '', caption })
    if (replacement !== img.url) replacements.push({ from: img.url, to: replacement })
  } else if (node.type === 'paragraph') {
    content.push({ type: 'rich-p', children: (node.children ?? []).map(inline) })
  } else if (node.type === 'list') {
    const items = (node.children ?? []).map(item => {
      if (item.children?.length !== 1 || item.children[0].type !== 'paragraph') {
        throw new Error('Nested or multi-paragraph lists require editorial conversion')
      }
      return (item.children[0].children ?? []).map(inline)
    })
    content.push({ type: 'rich-list', ordered: node.ordered === true, items })
  } else if (node.type === 'blockquote') {
    if (node.children?.length !== 1 || node.children[0].type !== 'paragraph') {
      throw new Error('Complex blockquote requires editorial conversion')
    }
    content.push({ type: 'quote', text: plain(node) })
  } else {
    throw new Error('Unsupported Markdown block: ' + node.type)
  }
}
const firstImage = content.find(block => block.type === 'image')
if (!firstImage || firstImage.type !== 'image') throw new Error('Draft requires an image for the cover')
const lead = content.find(block => block.type === 'rich-p')
const post: BlogPost = {
  slug: args.slug,
  title: plain(titleNode),
  excerpt: lead?.type === 'rich-p' ? plain(nodes.find(node => node.type === 'paragraph')!) : '',
  date: args.date,
  category: 'Гайды',
  author: { name: 'Команда RevRoute', role: 'RevRoute Links', initials: 'RR' },
  cover: { gradient: 'linear-gradient(135deg, #7c3aed, #18181b)' },
  content,
  dzen: { enabled: false, mode: 'draft', guid: 'revroute:blog:' + args.slug, cover: firstImage.image },
}
const output = join(root, 'content', 'dzen', 'drafts', args.slug + '.json')
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, JSON.stringify({
  source: { markdown: basename(source), section: marker, importedAt: new Date().toISOString(), imageReplacements: replacements },
  note: 'Local review material. Not included in posts or production RSS. Set the actual publication date when approving for the website.',
  post,
}, null, 2) + '\n')
console.log(JSON.stringify({ output, blocks: content.length, images: content.filter(block => block.type === 'image').length, rssEnabled: false }))

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { visit } from 'unist-util-visit'
import {
  Project,
  SyntaxKind,
  Node,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'ts-morph'
import type { PageTarget, Segment, SourceRef } from './types'
import { REPO_ROOT } from './paths'
import { getEnReferenceSnippet } from './en-ref'

const CYR = /[\u0400-\u04FF]/

function pushSeg(
  segments: Segment[],
  id: string,
  pagePath: string,
  filePath: string,
  text: string,
  start: number,
  end: number,
  kind: SourceRef['kind'],
  refEn: string | null,
) {
  if (!text || !CYR.test(text)) return
  segments.push({
    id,
    pagePath,
    filePath,
    text,
    start,
    end,
    kind,
    refEn,
  })
}

async function extractMdx(
  relPath: string,
  pagePath: string,
  refEn: string | null,
): Promise<Segment[]> {
  const abs = join(REPO_ROOT, relPath)
  const raw = await readFile(abs, 'utf8')
  const segments: Segment[] = []
  const processor = unified().use(remarkParse).use(remarkMdx)
  const tree = processor.parse(raw) as import('mdast').Root
  let idx = 0
  visit(tree, 'text', (node: import('mdast').Text) => {
    const pos = node.position
    if (!pos?.start?.offset || pos?.end?.offset == null) return
    const start = pos.start.offset
    const end = pos.end.offset
    const value = node.value
    if (!value || !CYR.test(value)) return
    idx += 1
    pushSeg(
      segments,
      `mdx:${relPath}:t${idx}`,
      pagePath,
      relPath,
      value,
      start,
      end,
      'mdx',
      refEn,
    )
  })
  return segments
}

function findObjectBySlug(
  arrInit: import('ts-morph').ArrayLiteralExpression,
  slug: string,
): ObjectLiteralExpression | undefined {
  for (const el of arrInit.getElements()) {
    if (!Node.isObjectLiteralExpression(el)) continue
    const slugProp = el.getProperty('slug')
    if (!slugProp || !Node.isPropertyAssignment(slugProp)) continue
    const init = slugProp.getInitializer()
    if (Node.isStringLiteral(init) && init.getLiteralValue() === slug) {
      return el
    }
  }
  return undefined
}

function extractStringsFromObject(
  obj: ObjectLiteralExpression,
  idPrefix: string,
  pagePath: string,
  filePath: string,
  kind: SourceRef['kind'],
  refEn: string | null,
  segments: Segment[],
  depth = 0,
) {
  if (depth > 8) return
  for (const prop of obj.getProperties()) {
    if (!Node.isPropertyAssignment(prop)) continue
    const name = prop.getName()
    const init = prop.getInitializer()
    if (!init) continue
    const pathId = `${idPrefix}.${name}`
    if (Node.isStringLiteral(init)) {
      const text = init.getLiteralValue()
      const start = init.getStart() + 1
      const end = init.getEnd() - 1
      pushSeg(segments, pathId, pagePath, filePath, text, start, end, kind, refEn)
    } else if (Node.isArrayLiteralExpression(init)) {
      init.getElements().forEach((el, i) => {
        if (Node.isStringLiteral(el)) {
          const text = el.getLiteralValue()
          const start = el.getStart() + 1
          const end = el.getEnd() - 1
          pushSeg(segments, `${pathId}[${i}]`, pagePath, filePath, text, start, end, kind, refEn)
        } else if (Node.isObjectLiteralExpression(el)) {
          extractStringsFromObject(el, `${pathId}[${i}]`, pagePath, filePath, kind, refEn, segments, depth + 1)
        }
      })
    } else if (Node.isObjectLiteralExpression(init)) {
      extractStringsFromObject(init, pathId, pagePath, filePath, kind, refEn, segments, depth + 1)
    }
  }
}

function extractFromDataFile(
  sourceFile: SourceFile,
  varName: 'posts' | 'customers' | 'compares',
  slug: string,
  pagePath: string,
  relPath: string,
  kind: SourceRef['kind'],
  refEn: string | null,
): Segment[] {
  const segments: Segment[] = []
  const decl = sourceFile.getVariableDeclaration(varName)
  if (!decl) return segments
  const init = decl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression)
  if (!init) return segments
  const obj = findObjectBySlug(init, slug)
  if (!obj) return segments
  extractStringsFromObject(obj, `${varName}:${slug}`, pagePath, relPath, kind, refEn, segments)
  return segments
}

async function extractTsxPage(relPath: string, pagePath: string, refEn: string | null): Promise<Segment[]> {
  const abs = join(REPO_ROOT, relPath)
  const project = new Project({
    tsConfigFilePath: join(REPO_ROOT, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  })
  const sf = project.addSourceFileAtPath(abs)
  const segments: Segment[] = []
  let idx = 0
  sf.forEachDescendant((node) => {
    if (Node.isJsxText(node)) {
      const fullText = node.getText()
      const trimmed = fullText.trim()
      if (!trimmed || !CYR.test(trimmed)) return
      const leading = fullText.length - fullText.trimStart().length
      const trailing = fullText.length - fullText.trimEnd().length
      const start = node.getStart() + leading
      const end = node.getEnd() - trailing
      idx += 1
      pushSeg(segments, `tsx:${relPath}:jsx${idx}`, pagePath, relPath, trimmed, start, end, 'tsx-page', refEn)
    }
    if (Node.isStringLiteral(node)) {
      if (node.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) return
      if (node.getFirstAncestorByKind(SyntaxKind.ExportDeclaration)) return
      const text = node.getLiteralValue()
      if (!CYR.test(text)) return
      idx += 1
      const start = node.getStart() + 1
      const end = node.getEnd() - 1
      pushSeg(segments, `tsx:${relPath}:s${idx}`, pagePath, relPath, text, start, end, 'tsx-page', refEn)
    }
  })
  return segments
}

function extractFromDataTs(
  relPath: string,
  varName: 'posts' | 'customers' | 'compares',
  slug: string,
  pagePath: string,
  kind: SourceRef['kind'],
  refEn: string | null,
): Segment[] {
  const abs = join(REPO_ROOT, relPath)
  const project = new Project({
    tsConfigFilePath: join(REPO_ROOT, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  })
  const sf = project.addSourceFileAtPath(abs)
  return extractFromDataFile(sf, varName, slug, pagePath, relPath, kind, refEn)
}

export async function extractPageSegments(target: PageTarget): Promise<Segment[]> {
  const pagePath = target.path
  const ruMdx = target.sources.find((s) => s.kind === 'mdx')?.file ?? null
  const refSnippet = await getEnReferenceSnippet(pagePath, ruMdx)
  const refEn = refSnippet ? refSnippet.slice(0, 8000) : null

  const all: Segment[] = []
  const seen = new Set<string>()

  for (const src of target.sources) {
    const key = `${src.kind}:${src.file}:${src.slug ?? ''}`
    if (seen.has(key)) continue
    seen.add(key)

    if (src.kind === 'mdx') {
      all.push(...(await extractMdx(src.file, pagePath, refEn)))
    } else if (src.kind === 'tsx-page') {
      all.push(...(await extractTsxPage(src.file, pagePath, refEn)))
    } else if (src.kind === 'blog-data' && src.slug) {
      all.push(...extractFromDataTs('content/blog.ts', 'posts', src.slug, pagePath, src.kind, refEn))
    } else if (src.kind === 'customers-data' && src.slug) {
      all.push(
        ...extractFromDataTs('content/customers.ts', 'customers', src.slug, pagePath, src.kind, refEn),
      )
    } else if (src.kind === 'compare-data' && src.slug) {
      all.push(...extractFromDataTs('content/compare.ts', 'compares', src.slug, pagePath, src.kind, refEn))
    }
  }

  return dedupeSegments(all)
}

function dedupeSegments(segments: Segment[]): Segment[] {
  const byKey = new Map<string, Segment>()
  for (const s of segments) {
    const k = `${s.filePath}:${s.start}:${s.end}`
    if (!byKey.has(k)) byKey.set(k, s)
  }
  return [...byKey.values()]
}

export async function extractAllPages(pages: PageTarget[], filterPaths?: Set<string>): Promise<Segment[]> {
  const out: Segment[] = []
  for (const p of pages) {
    if (filterPaths && !filterPaths.has(p.path)) continue
    out.push(...(await extractPageSegments(p)))
  }
  return out
}

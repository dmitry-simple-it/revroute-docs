import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import sharp from 'sharp'
import { escapeXml } from './rss'

type Node = { type: string; lang?: string | null; value?: string; depth?: number; ordered?: boolean; url?: string; alt?: string; children?: Node[] }
type Issue = { id: string; severity: 'P1'; location: string; evidence: string }
type Snapshot = { bodySha256: string; images: Record<string, string>; previewSha256: string; rssSha256: string | null }
type Role = { status: 'PASS' | 'FAIL' | 'NOT_RUN'; reviewedBodySha256?: string; reviewedImages?: Record<string, string>; reviewedPreviewSha256?: string }
export type Review = {
  roles?: Record<string, Role>
  findings?: { id: string; severity: string; status: string }[]
  finalProofread?: { status: string; reviewedBodySha256?: string; reviewedImages?: Record<string, string>; reviewedPreviewSha256?: string; reviewedRssSha256?: string }
  export?: { status: string; path: string; reviewedBodySha256?: string; reviewedImages?: Record<string, string>; reviewedRssSha256?: string }
  textCheck?: {
    status: string
    path?: string
    reviewedBodySha256?: string
    reviewedReportSha256?: string
    waiver?: { authority: 'user'; scope: 'text.ru'; source: string; reason: string }
  }
  productInteractive?: { status: string; reviewedBodySha256?: string }
  linkHttp?: { status: string; reviewedBodySha256?: string }
}
export function sha256(input: string | Buffer): string { return createHash('sha256').update(input).digest('hex') }
function sameImages(left: Record<string, string> = {}, right: Record<string, string> = {}): boolean {
  return Object.keys(left).length === Object.keys(right).length && Object.entries(left).every(([key, value]) => right[key] === value)
}
function validateReview(review: Review): void {
  const object = (value: unknown) => value != null && typeof value === 'object' && !Array.isArray(value)
  const invalid = (name: string): never => { throw new Error('Invalid review schema: ' + name) }
  if (!object(review)) invalid('review')
  if (review.roles !== undefined) {
    if (!object(review.roles)) invalid('roles')
    for (const [name, role] of Object.entries(review.roles)) {
      if (!object(role) || !['PASS', 'FAIL', 'NOT_RUN'].includes(role.status)) invalid('role ' + name)
    }
  }
  if (review.findings !== undefined) {
    if (!Array.isArray(review.findings)) invalid('findings')
    for (const item of review.findings) {
      if (!object(item) || !item.id || !['P0', 'P1', 'P2'].includes(item.severity) || !['open', 'closed'].includes(item.status)) invalid('finding')
    }
  }
  for (const entry of [review.finalProofread, review.export, review.productInteractive, review.linkHttp]) {
    if (entry !== undefined && (!object(entry) || !['PASS', 'FAIL', 'NOT_RUN'].includes(entry.status))) invalid('proofread/export')
  }
  if (review.export && typeof review.export.path !== 'string') invalid('export path')
  if (review.textCheck !== undefined) {
    const check = review.textCheck
    if (!object(check) || !['PASS', 'FAIL', 'NOT_RUN', 'SKIPPED_BY_USER'].includes(check.status)) invalid('textCheck')
    if (check.status === 'SKIPPED_BY_USER') {
      const waiver = check.waiver
      if (!object(waiver) || waiver?.authority !== 'user' || waiver.scope !== 'text.ru' ||
        typeof waiver.source !== 'string' || !isAbsolute(waiver.source) ||
        typeof waiver.reason !== 'string' || !waiver.reason.trim() ||
        typeof check.reviewedBodySha256 !== 'string' || !/^[a-f0-9]{64}$/.test(check.reviewedBodySha256)) invalid('textCheck waiver')
    } else {
      if (typeof check.path !== 'string') invalid('textCheck path')
      if (check.waiver !== undefined) invalid('textCheck waiver requires SKIPPED_BY_USER')
    }
  }
}

export function publicationBody(markdown: string): string {
  const normalized = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const markers = [...normalized.matchAll(/^# Черновик статьи(?: \(под публикацию в Дзене\))?[ \t]*$/gm)]
  if (markers.length !== 1) throw new Error('Expected exactly one publication section; refusing to import the brief')
  const body = normalized.slice(markers[0].index! + markers[0][0].length).trim()
  if (/^#[ \t]+/m.test(body)) throw new Error('Ambiguous H1 after publication marker; use H2 title and keep internal notes outside the publication section')
  return body
}

function plain(node: Node): string { return node.value ?? (node.children ?? []).map(plain).join('') }
function safeUrl(href: string): string {
  const url = new URL(href, 'https://revroute.ru')
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Unsafe publication URL')
  return url.href
}

function previewImageUrl(file: string, previewDirectory?: string): string {
  if (!previewDirectory) return pathToFileURL(file).href
  const imagePath = relative(resolve(previewDirectory), file)
  if (isAbsolute(imagePath)) throw new Error('Preview directory and article images must be on the same filesystem volume')
  return imagePath.split(sep).map(part => encodeURIComponent(part)).join('/')
}

export async function prepareArticleReview(sourcePath: string, review: Review = {}, options: { previewDirectory?: string } = {}) {
  validateReview(review)
  const source = resolve(sourcePath)
  const body = publicationBody(readFileSync(source, 'utf8'))
  const nodes = (unified().use(remarkParse).use(remarkGfm).parse(body) as unknown as Node).children ?? []
  if (nodes[0]?.type !== 'heading') throw new Error('Publication body must start with a title')
  const title = plain(nodes[0])
  const issues: Issue[] = []
  const issue = (id: string, location: string, evidence: string) => issues.push({ id, severity: 'P1', location, evidence })
  if ([...title].length > 70) issue('TITLE_LENGTH', 'title', 'Title exceeds our 70-character Dzen editorial policy')
  if (/\[(?:SCREENSHOT[^\]]*|FACT-CHECK[^\]]*)\]/i.test(body)) issue('UNRESOLVED_MARKER', 'body', 'An unresolved editorial marker remains')
  const images: { path: string; exists: boolean; sha256?: string; width?: number; height?: number; alt: string; caption: string }[] = []
  const links: { href: string; text: string; httpStatus: 'NOT_RUN' }[] = []
  function inline(node: Node): string {
    if (node.type === 'text' || node.type === 'inlineCode') return escapeXml(node.value ?? '')
    if (node.type === 'strong' || node.type === 'emphasis') {
      const tag = node.type === 'strong' ? 'b' : 'i'
      return '<' + tag + '>' + (node.children ?? []).map(inline).join('') + '</' + tag + '>'
    }
    if (node.type === 'link') {
      const href = safeUrl(node.url ?? '')
      links.push({ href, text: plain(node), httpStatus: 'NOT_RUN' })
      return '<a href="' + escapeXml(href) + '">' + (node.children ?? []).map(inline).join('') + '</a>'
    }
    if (node.type === 'break') return '<br/>'
    throw new Error('Unsupported review inline: ' + node.type)
  }
  let hasTable = false
  function block(node: Node): string {
    const content = () => (node.children ?? []).map(inline).join('')
    if (node.type === 'heading') {
      const level = Math.max(1, Math.min(6, (node.depth ?? 2) - 1))
      return `<h${level}>${content()}</h${level}>`
    }
    if (node.type === 'table') {
      hasTable = true
      const [header, ...rows] = node.children ?? []
      const row = (cells: Node[], tag: 'th' | 'td') => '<tr>' + cells.map(cell =>
        '<' + tag + (tag === 'th' ? ' scope="col"' : '') + '>' +
        (cell.children ?? []).map(inline).join('') + '</' + tag + '>'
      ).join('') + '</tr>'
      return '<div class="table-scroll" tabindex="0" role="region" aria-label="Таблица"><table><thead>' +
        row(header?.children ?? [], 'th') + '</thead><tbody>' +
        rows.map(item => row(item.children ?? [], 'td')).join('') + '</tbody></table></div>'
    }
    if (node.type === 'paragraph') return '<p>' + content() + '</p>'
    if (node.type === 'code') return '<pre class="code" tabindex="0" aria-label="Пример кода"><code>' + escapeXml(node.value ?? '') + '</code></pre>'
    if (node.type === 'thematicBreak') return '<hr/>'
    if (node.type === 'blockquote') return '<blockquote>' + (node.children ?? []).map(block).join('') + '</blockquote>'
    if (node.type === 'list') {
      const tag = node.ordered ? 'ol' : 'ul'
      return '<' + tag + '>' + (node.children ?? []).map(item => '<li>' + (item.children ?? []).map(block).join('') + '</li>').join('') + '</' + tag + '>'
    }
    throw new Error('Unsupported review block: ' + node.type)
  }
  const rendered: string[] = []
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index]
    if (node.type === 'paragraph' && node.children?.length === 1 && node.children[0].type === 'image') {
      const image = node.children[0]
      if (!image.url || /^(?:[a-z]+:|\/)/i.test(image.url)) throw new Error('Review requires relative local image paths')
      const file = resolve(dirname(source), image.url)
      const next = nodes[index + 1]
      const caption = next?.type === 'paragraph' && next.children?.length === 1 && next.children[0].type === 'emphasis' ? plain(next) : ''
      if (caption) index++
      const entry: (typeof images)[number] = { path: image.url, exists: existsSync(file), alt: image.alt ?? '', caption }
      if (!entry.alt.trim()) issue('IMAGE_ALT', image.url, 'Image alt is missing')
      if (!caption.trim()) issue('IMAGE_CAPTION', image.url, 'Image caption is missing')
      if (entry.exists) {
        const bytes = readFileSync(file)
        entry.sha256 = sha256(bytes)
        const metadata = await sharp(bytes).metadata()
        entry.width = metadata.width; entry.height = metadata.height
        if ((entry.width ?? 0) < 700 || (entry.height ?? 0) < 320) issue('IMAGE_SIZE', image.url, 'Below our local RSS image policy, 700x320; not a verified Dzen platform limit')
      } else issue('IMAGE_MISSING', image.url, 'A real screenshot has not been prepared')
      images.push(entry)
      const visual = entry.exists ? '<img src="' + escapeXml(previewImageUrl(file, options.previewDirectory)) + '" alt="' + escapeXml(entry.alt) + '"/>' :
        '<aside class="pending">Скриншот ещё не снят: ' + escapeXml(image.url) + '</aside>'
      rendered.push('<figure>' + visual + '<figcaption>' + escapeXml(caption) + '</figcaption></figure>')
    } else rendered.push(block(node))
  }
  if (images.length < 2 || images.length > 4) issue('IMAGE_COUNT', 'body', 'How-to articles require 2–4 real images under our editorial policy')
  const tableStyles = hasTable ? '.table-scroll{max-width:100%;overflow-x:auto;margin:24px 0}.table-scroll table{width:100%;min-width:600px;border-collapse:collapse;font-size:16px}.table-scroll th,.table-scroll td{padding:10px 12px;border:1px solid #ddd;text-align:left;vertical-align:top;overflow-wrap:anywhere}.table-scroll th{background:#f5f5f7}' : ''
  const preview = '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' + escapeXml(title) + '</title><style>' +
    'body{margin:0;background:#f5f5f7;color:#202124;font:18px/1.65 Arial,sans-serif}main{max-width:780px;margin:24px auto;padding:32px 24px;background:white}h1{font-size:32px;line-height:1.25}h2{font-size:25px;line-height:1.35;margin-top:32px}p,li,blockquote{overflow-wrap:anywhere}.code{box-sizing:border-box;width:100%;min-width:0;max-width:100%;padding:16px;overflow-x:auto;white-space:pre;overflow-wrap:normal;word-break:normal;background:#f5f5f7;font:14px/1.6 monospace}.code code{font:inherit}' + tableStyles + 'figure{margin:24px 0}img{width:100%;height:auto}figcaption,.note{font-size:15px;color:#666}.pending{padding:24px;background:#fff6df;border:1px dashed #a97718;font-size:15px;overflow-wrap:anywhere}@media(max-width:600px){main{margin:0;padding:24px 18px}h1{font-size:27px}}</style></head><body><main><p class="note">Черновик для вычитки. Это превью не подтверждает отображение в Дзене.</p>' + rendered.join('\n') + '</main></body></html>'
  const rssPath = review.export?.path ? resolve(review.export.path) : null
  const snapshot: Snapshot = { bodySha256: sha256(body), images: Object.fromEntries(images.filter(image => image.sha256).map(image => [image.path, image.sha256!])), previewSha256: sha256(preview), rssSha256: rssPath && existsSync(rssPath) ? sha256(readFileSync(rssPath)) : null }
  const roleChecks: Record<string, string> = {}
  for (const name of ['language', 'fact_links', 'visual']) {
    const role = review.roles?.[name]
    let verdict: string = role?.status ?? 'NOT_RUN'
    if (verdict === 'PASS' && role?.reviewedBodySha256 !== snapshot.bodySha256) verdict = 'STALE'
    if (name === 'visual' && verdict === 'PASS' && (
      role?.reviewedPreviewSha256 !== snapshot.previewSha256 || !sameImages(role?.reviewedImages, snapshot.images)
    )) verdict = 'STALE'
    roleChecks[name] = verdict
    if (verdict !== 'PASS') issue('ROLE_' + name.toUpperCase(), name, 'Mandatory review status: ' + verdict)
  }
  for (const finding of review.findings ?? []) {
    if (['P0', 'P1'].includes(finding.severity) && finding.status !== 'closed') issue('OPEN_' + finding.id, finding.id, 'Unresolved blocking finding')
  }
  const proof = review.finalProofread
  const proofread = proof?.status === 'PASS' && proof.reviewedBodySha256 === snapshot.bodySha256
  if (!proofread) issue('FINAL_PROOFREAD', 'coordinator', 'Final proofread missing or stale')
  let textCheckVerified = false
  if (review.textCheck?.status === 'PASS' && review.textCheck.reviewedBodySha256 === snapshot.bodySha256 && typeof review.textCheck.path === 'string' && existsSync(review.textCheck.path)) {
    const bytes = readFileSync(review.textCheck.path)
    const result = JSON.parse(bytes.toString('utf8')) as { decision?: string; sourceBodySha256?: string }
    textCheckVerified = result.decision === 'PUBLISH' && result.sourceBodySha256 === snapshot.bodySha256 && sha256(bytes) === review.textCheck.reviewedReportSha256
  }
  const textCheckWaived = review.textCheck?.status === 'SKIPPED_BY_USER' &&
    review.textCheck.reviewedBodySha256 === snapshot.bodySha256 &&
    resolve(review.textCheck.waiver!.source) === source
  const textCheckSatisfied = textCheckVerified || textCheckWaived
  if (!textCheckSatisfied) issue('TEXT_CHECK', 'text.ru', 'Text check missing, failed, stale, or user waiver does not match this article version')
  const productInteractive = review.productInteractive?.status === 'PASS' && review.productInteractive.reviewedBodySha256 === snapshot.bodySha256
  const linkHttp = review.linkHttp?.status === 'PASS' && review.linkHttp.reviewedBodySha256 === snapshot.bodySha256
  if (!productInteractive) issue('PRODUCT_INTERACTIVE', 'product', 'Live instruction check missing, failed or stale')
  if (!linkHttp) issue('LINK_HTTP', 'links', 'Live destination check missing, failed or stale')
  const mediaFactsVerified = roleChecks.fact_links === 'PASS' && Boolean(review.roles?.fact_links?.reviewedImages) && sameImages(review.roles?.fact_links?.reviewedImages, snapshot.images)
  if (!mediaFactsVerified) issue('MEDIA_FACT_REVIEW', 'fact_links', 'Image correspondence not checked on the current snapshot')
  const exportVerified = review.export?.status === 'PASS' && review.export.reviewedBodySha256 === snapshot.bodySha256 &&
    Boolean(snapshot.rssSha256) && review.export.reviewedRssSha256 === snapshot.rssSha256 && sameImages(review.export.reviewedImages, snapshot.images)
  if (!exportVerified) issue('EXPORT_NOT_RUN_OR_STALE', 'RSS', 'RSS structure and text-preservation review missing or stale')
  const fullProofread = proofread && sameImages(proof?.reviewedImages, snapshot.images) && proof?.reviewedPreviewSha256 === snapshot.previewSha256 &&
    Boolean(snapshot.rssSha256) && proof?.reviewedRssSha256 === snapshot.rssSha256
  if (!fullProofread) issue('FINAL_MEDIA_PROOFREAD', 'coordinator', 'Final proofread of rendered media and RSS missing or stale')
  const textReady = roleChecks.language === 'PASS' && roleChecks.fact_links === 'PASS' && proofread && textCheckSatisfied
  const mediaExists = images.length >= 2 && images.every(image => image.exists)
  const contentIssues = issues.filter(item => item.id === 'ROLE_VISUAL' && roleChecks.visual === 'FAIL' ||
    item.id === 'PRODUCT_INTERACTIVE' && review.productInteractive?.status === 'FAIL' ||
    item.id === 'LINK_HTTP' && review.linkHttp?.status === 'FAIL' ||
    !['IMAGE_MISSING', 'ROLE_VISUAL', 'MEDIA_FACT_REVIEW', 'EXPORT_NOT_RUN_OR_STALE', 'FINAL_MEDIA_PROOFREAD', 'PRODUCT_INTERACTIVE', 'LINK_HTTP'].includes(item.id))
  const readiness = issues.length === 0 ? 'ready' : textReady && contentIssues.length === 0 ? mediaExists ? 'media_pending' : 'text_ready' : 'needs_changes'
  return { preview, report: { source, title, titleLength: [...title].length, snapshot, images, links, roleChecks, textCheck: textCheckVerified ? 'PASS' : textCheckWaived ? 'SKIPPED_BY_USER' : 'NOT_RUN_OR_STALE', textCheckWaiver: textCheckWaived ? review.textCheck!.waiver : null, productInteractive: productInteractive ? 'PASS' : 'NOT_RUN_OR_STALE', linkHttp: linkHttp ? 'PASS' : 'NOT_RUN_OR_STALE', mediaFacts: mediaFactsVerified ? 'PASS' : 'NOT_RUN_OR_STALE', export: exportVerified ? 'PASS' : 'NOT_RUN_OR_STALE', finalProofreadText: proofread ? 'PASS' : 'NOT_RUN_OR_STALE', finalProofread: fullProofread ? 'PASS' : 'NOT_RUN_OR_STALE', readiness, ready: issues.length === 0, issues } }
}

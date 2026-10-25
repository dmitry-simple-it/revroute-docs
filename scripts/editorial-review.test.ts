import { strict as assert } from 'node:assert'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { test } from 'node:test'
import sharp from 'sharp'
import { prepareArticleReview, publicationBody, sha256, type Review } from '../lib/dzen/editorial-review'

test('publication selection excludes stale brief and rejects ambiguous sections', () => {
  assert.equal(publicationBody('---\ntitle: OLD\n---\n# Бриф\nFALSE CLAIM\n# Черновик статьи\n\n## Actual title\nBody\n'), '## Actual title\nBody')
  assert.equal(publicationBody('# Черновик статьи (под публикацию в Дзене)\r\nText\r\n'), 'Text')
  assert.throws(() => publicationBody('# Бриф\nNo publication section'))
  assert.throws(() => publicationBody('# Черновик статьи\nFirst\n# Черновик статьи\nSecond'))
  assert.throws(() => publicationBody('# Черновик статьи\n## Article\nBody\n# Внутренние заметки\nPrivate notes'), /Ambiguous H1/)
})

test('missing screenshots block readiness while preserving text reviews', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'revroute-review-'))
  const source = join(dir, 'article.md')
  writeFileSync(source, '# Черновик статьи\n## Test\n![UI](one.png)\n\n*Caption one*\n\n![UI](two.png)\n\n*Caption two*\n')
  const initial = await prepareArticleReview(source)
  const hash = initial.report.snapshot.bodySha256
  const checkPath = join(dir, 'text-check.json')
  const check = JSON.stringify({ decision: 'PUBLISH', sourceBodySha256: hash })
  writeFileSync(checkPath, check)
  const textCheck = { status: 'PASS', path: checkPath, reviewedBodySha256: hash, reviewedReportSha256: sha256(check) }
  const result = await prepareArticleReview(source, { roles: { language: { status: 'PASS', reviewedBodySha256: hash }, fact_links: { status: 'PASS', reviewedBodySha256: hash }, visual: { status: 'NOT_RUN' } }, finalProofread: { status: 'PASS', reviewedBodySha256: hash }, textCheck })
  assert.equal(result.report.readiness, 'text_ready')
  assert.equal(result.report.ready, false)
  assert.equal(result.report.issues.filter(issue => issue.id === 'IMAGE_MISSING').length, 2)
  assert.match(result.preview, /Скриншот ещё не снят/)
  assert.match(result.preview, /Caption two/)
  const failedVisual = await prepareArticleReview(source, { roles: { language: { status: 'PASS', reviewedBodySha256: hash }, fact_links: { status: 'PASS', reviewedBodySha256: hash }, visual: { status: 'FAIL' } }, finalProofread: { status: 'PASS', reviewedBodySha256: hash }, textCheck })
  assert.equal(failedVisual.report.readiness, 'needs_changes')
})

test('body, image and preview edits invalidate a previous approval', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'revroute-review-'))
  const source = join(dir, 'article.md')
  const image = await sharp({ create: { width: 780, height: 400, channels: 3, background: '#ffffff' } }).png().toBuffer()
  writeFileSync(join(dir, 'one.png'), image); writeFileSync(join(dir, 'two.png'), image)
  writeFileSync(source, '# Черновик статьи\n## Test\nA **bold** [link](https://example.com/?a=1&b=2).\n\n![UI](one.png)\n\n*Caption one*\n\n![UI](two.png)\n\n*Caption two*\n')
  const initial = await prepareArticleReview(source)
  const snapshot = initial.report.snapshot
  const xmlPath = join(dir, 'preview.xml')
  const xml = '<rss version="2.0"><channel><title>Test</title></channel></rss>'
  writeFileSync(xmlPath, xml)
  const rssHash = sha256(xml)
  const checkPath = join(dir, 'text-check.json')
  const check = JSON.stringify({ decision: 'PUBLISH', sourceBodySha256: snapshot.bodySha256 })
  writeFileSync(checkPath, check)
  const review: Review = { roles: { language: { status: 'PASS', reviewedBodySha256: snapshot.bodySha256 }, fact_links: { status: 'PASS', reviewedBodySha256: snapshot.bodySha256, reviewedImages: snapshot.images }, visual: { status: 'PASS', reviewedBodySha256: snapshot.bodySha256, reviewedImages: snapshot.images, reviewedPreviewSha256: snapshot.previewSha256 } }, finalProofread: { status: 'PASS', reviewedBodySha256: snapshot.bodySha256, reviewedImages: snapshot.images, reviewedPreviewSha256: snapshot.previewSha256, reviewedRssSha256: rssHash }, export: { status: 'PASS', path: xmlPath, reviewedBodySha256: snapshot.bodySha256, reviewedImages: snapshot.images, reviewedRssSha256: rssHash }, textCheck: { status: 'PASS', path: checkPath, reviewedBodySha256: snapshot.bodySha256, reviewedReportSha256: sha256(check) } }
  review.productInteractive = { status: 'PASS', reviewedBodySha256: snapshot.bodySha256 }
  review.linkHttp = { status: 'PASS', reviewedBodySha256: snapshot.bodySha256 }
  assert.equal((await prepareArticleReview(source, review)).report.ready, true)
  review.roles!.visual.reviewedImages = Object.fromEntries(Object.entries(snapshot.images).reverse())
  assert.equal((await prepareArticleReview(source, review)).report.ready, true)
  review.findings = [{ id: 'unresolved', severity: 'P1', status: 'open' }]
  assert.equal((await prepareArticleReview(source, review)).report.ready, false)
  review.findings = []
  review.productInteractive.status = 'FAIL'
  assert.equal((await prepareArticleReview(source, review)).report.readiness, 'needs_changes')
  review.productInteractive.status = 'PASS'
  writeFileSync(checkPath, JSON.stringify({ decision: 'REWRITE', sourceBodySha256: snapshot.bodySha256 }))
  assert.equal((await prepareArticleReview(source, review)).report.textCheck, 'NOT_RUN_OR_STALE')
  assert.equal((await prepareArticleReview(source, review)).report.ready, false)
  writeFileSync(checkPath, check)
  assert.match(initial.preview, /A <b>bold<\/b>/)
  assert.match(initial.preview, /a=1&amp;b=2/)
  writeFileSync(xmlPath, xml.replace('Test', 'Changed'))
  assert.equal((await prepareArticleReview(source, review)).report.export, 'NOT_RUN_OR_STALE')
  assert.equal((await prepareArticleReview(source, review)).report.ready, false)
  writeFileSync(xmlPath, xml)
  writeFileSync(join(dir, 'one.png'), await sharp(image).modulate({ brightness: 0.5 }).png().toBuffer())
  assert.equal((await prepareArticleReview(source, review)).report.roleChecks.visual, 'STALE')
  assert.equal((await prepareArticleReview(source, review)).report.mediaFacts, 'NOT_RUN_OR_STALE')
  review.roles!.visual.reviewedPreviewSha256 = 'old-preview'
  assert.equal((await prepareArticleReview(source, review)).report.ready, false)
  writeFileSync(source, readFileSync(source, 'utf8').replace('A **bold**', 'Edited **bold**'))
  const changed = await prepareArticleReview(source, review)
  assert.equal(changed.report.roleChecks.language, 'STALE')
  assert.equal(changed.report.roleChecks.fact_links, 'STALE')
  assert.equal(changed.report.finalProofreadText, 'NOT_RUN_OR_STALE')
})

test('unsafe links and publication with unresolved markers cannot pass', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'revroute-review-'))
  const source = join(dir, 'article.md')
  writeFileSync(source, '# Черновик статьи\n## Test\n[Unsafe](javascript:alert)\n')
  await assert.rejects(() => prepareArticleReview(source), /Unsafe publication URL/)
  writeFileSync(source, '# Черновик статьи\n## ' + 'a'.repeat(71) + '\n[FACT-CHECK: unknown]\n')
  const result = await prepareArticleReview(source)
  assert.ok(result.report.issues.some(issue => issue.id === 'TITLE_LENGTH'))
  assert.ok(result.report.issues.some(issue => issue.id === 'UNRESOLVED_MARKER'))
  assert.equal(result.report.ready, false)
  await assert.rejects(() => prepareArticleReview(source, { findings: [{ id: 'misspelled', severity: 'p1', status: 'open' }] }), /Invalid review schema/)
})

test('code preview and draft import preserve exact executable text', async () => {
  const { execFileSync } = await import('node:child_process')
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)
  const dir = mkdtempSync(join(tmpdir(), 'revroute-code-import-'))
  const source = join(dir, 'article.md')
  const command = 'curl "https://example.com/?a=1&b=2" -H "Authorization: Bearer $TOKEN"'
  const code = command + '\n' + '{"input":"<tag>"}'
  const image = await sharp({ create: { width: 800, height: 400, channels: 3, background: '#ffffff' } }).png().toBuffer()
  writeFileSync(join(dir, 'one.png'), image)
  writeFileSync(source, '# Черновик статьи\n## Code example\nLead.\n\n```bash\n' + code + '\n```\n\n![Test fixture](one.png)\n\n*Fixture caption*\n')
  const review = await prepareArticleReview(source)
  assert.match(review.preview, /<pre class="code" tabindex="0" aria-label="Пример кода"><code>curl &quot;https:\/\/example.com\/\?a=1&amp;b=2/)
  assert.match(review.preview, /\{&quot;input&quot;:&quot;&lt;tag&gt;&quot;\}<\/code><\/pre>/)
  assert.equal(review.report.ready, false)
  execFileSync(process.execPath, [require.resolve('tsx/cli'), join(process.cwd(), 'scripts/build-dzen-draft.ts'), '--source=' + source, '--slug=code-import-test', '--date=2026-10-24'], { cwd: dir, stdio: 'pipe' })
  const draft = JSON.parse(readFileSync(join(dir, 'content/dzen/drafts/code-import-test.json'), 'utf8'))
  assert.deepEqual(draft.post.content.find((block: { type: string }) => block.type === 'code'), { type: 'code', code, language: 'bash' })
  assert.equal(draft.post.dzen.enabled, false)
  assert.equal(draft.post.content.find((block: { type: string }) => block.type === 'image').caption, 'Fixture caption')
})
async function waivedReviewFixture() {
  const dir = mkdtempSync(join(tmpdir(), 'revroute-waiver-'))
  const source = join(dir, 'article.md')
  const image = await sharp({ create: { width: 780, height: 400, channels: 3, background: '#ffffff' } }).png().toBuffer()
  writeFileSync(join(dir, 'one.png'), image)
  writeFileSync(join(dir, 'two.png'), image)
  writeFileSync(source, '# Черновик статьи\n## Test\nOriginal publication paragraph.\n\n![UI one](one.png)\n\n*Caption one*\n\n![UI two](two.png)\n\n*Caption two*\n')
  const { snapshot } = (await prepareArticleReview(source)).report
  const xmlPath = join(dir, 'preview.xml')
  const xml = '<rss version="2.0"><channel><title>Test</title></channel></rss>'
  writeFileSync(xmlPath, xml)
  const rssHash = sha256(xml)
  const body = { reviewedBodySha256: snapshot.bodySha256 }
  const media = { ...body, reviewedImages: snapshot.images }
  const visual = { ...media, reviewedPreviewSha256: snapshot.previewSha256 }
  const review: Review = {
    roles: {
      language: { status: 'PASS', ...body },
      fact_links: { status: 'PASS', ...media },
      visual: { status: 'PASS', ...visual },
    },
    finalProofread: { status: 'PASS', ...visual, reviewedRssSha256: rssHash },
    export: { status: 'PASS', path: xmlPath, ...media, reviewedRssSha256: rssHash },
    productInteractive: { status: 'PASS', ...body },
    linkHttp: { status: 'PASS', ...body },
    textCheck: {
      status: 'SKIPPED_BY_USER', ...body,
      waiver: { authority: 'user', scope: 'text.ru', source, reason: 'User explicitly declined sending this article to text.ru.' },
    },
  }
  return { dir, source, review }
}

test('explicit user waiver is distinct from service PASS and preserves every other gate', async () => {
  const { source, review } = await waivedReviewFixture()
  const result = await prepareArticleReview(source, review)
  assert.equal(result.report.ready, true)
  assert.equal(result.report.textCheck, 'SKIPPED_BY_USER')
  assert.deepEqual(result.report.textCheckWaiver, review.textCheck!.waiver)
  const gates: [string, (changed: Review) => void][] = [
    ['ROLE_LANGUAGE', changed => { delete changed.roles!.language }],
    ['ROLE_FACT_LINKS', changed => { delete changed.roles!.fact_links }],
    ['ROLE_VISUAL', changed => { delete changed.roles!.visual }],
    ['EXPORT_NOT_RUN_OR_STALE', changed => { delete changed.export }],
    ['PRODUCT_INTERACTIVE', changed => { delete changed.productInteractive }],
    ['LINK_HTTP', changed => { delete changed.linkHttp }],
    ['FINAL_PROOFREAD', changed => { delete changed.finalProofread }],
    ['MEDIA_FACT_REVIEW', changed => { delete changed.roles!.fact_links.reviewedImages }],
    ['FINAL_MEDIA_PROOFREAD', changed => { delete changed.finalProofread!.reviewedImages }],
    ['OPEN_unresolved', changed => { changed.findings = [{ id: 'unresolved', severity: 'P1', status: 'open' }] }],
  ]
  for (const [issueId, removeApproval] of gates) {
    const changed = structuredClone(review)
    removeApproval(changed)
    const report = (await prepareArticleReview(source, changed)).report
    assert.equal(report.ready, false, issueId)
    assert.ok(report.issues.some(issue => issue.id === issueId), issueId)
    assert.equal(report.textCheck, 'SKIPPED_BY_USER', issueId)
  }
})

test('user waiver cannot be reused for another article or an edited publication body', async () => {
  const { dir, source, review } = await waivedReviewFixture()
  const anotherSource = join(dir, 'another-article.md')
  writeFileSync(anotherSource, readFileSync(source))
  const other = (await prepareArticleReview(anotherSource, review)).report
  assert.equal(other.textCheck, 'NOT_RUN_OR_STALE')
  assert.equal(other.textCheckWaiver, null)
  assert.equal(other.ready, false)
  assert.deepEqual(other.issues.map(issue => issue.id), ['TEXT_CHECK'])
  writeFileSync(source, readFileSync(source, 'utf8').replace('Original publication paragraph.', 'Edited publication paragraph.'))
  const edited = (await prepareArticleReview(source, review)).report
  assert.equal(edited.textCheck, 'NOT_RUN_OR_STALE')
  assert.equal(edited.textCheckWaiver, null)
  assert.equal(edited.ready, false)
  assert.ok(edited.issues.some(issue => issue.id === 'TEXT_CHECK'))
})

test('absent or malformed user decision never bypasses the text check', async () => {
  const { source, review } = await waivedReviewFixture()
  for (const textCheck of [undefined, { status: 'NOT_RUN', path: '' }]) {
    const report = (await prepareArticleReview(source, { ...review, textCheck })).report
    assert.equal(report.ready, false)
    assert.equal(report.textCheck, 'NOT_RUN_OR_STALE')
    assert.ok(report.issues.some(issue => issue.id === 'TEXT_CHECK'))
  }
  const valid = review.textCheck!
  const malformed = [
    { ...valid, waiver: undefined },
    { ...valid, waiver: { ...valid.waiver, authority: 'agent' } },
    { ...valid, waiver: { ...valid.waiver, scope: '*' } },
    { ...valid, waiver: { ...valid.waiver, source: '' } },
    { ...valid, waiver: { ...valid.waiver, source: 'article.md' } },
    { ...valid, waiver: { ...valid.waiver, reason: ' ' } },
    { ...valid, reviewedBodySha256: undefined },
    { ...valid, reviewedBodySha256: 'invalid' },
    { ...valid, status: 'NOT_RUN', path: '' },
    { ...valid, status: 'PASS', path: '' },
  ]
  for (const textCheck of malformed) {
    await assert.rejects(() => prepareArticleReview(source, { ...review, textCheck } as Review), /Invalid review schema/)
  }
})

test('GFM preview preserves a four-column campaign table, inline markup and escaped cell content', async function(){
  const dir = mkdtempSync(join(tmpdir(), 'revroute-table-'))
  const source = join(dir, 'article.md')
  const markdown = [
    '# Черновик статьи', '## UTM для одной кампании', '',
    '| Размещение | utm_source | utm_medium | utm_content |',
    '| --- | --- | --- | --- |',
    '| **Пост в Telegram** | `telegram` | social | post_a |',
    '| Кнопка [в рассылке](https://example.com/?a=1&b=2) | newsletter | email | `button\\|a` |',
    '| Объявление в Яндекс Директе | yandex | cpc | `<img src=x onerror="alert(1)"> & ad_a` |',
  ].join('\n')
  writeFileSync(source, markdown)
  const result = await prepareArticleReview(source)
  const table = result.preview.match(/<table>[\s\S]*?<\/table>/)?.[0]
  assert.ok(table)
  assert.equal((table.match(/<th scope="col">/g) ?? []).length, 4)
  assert.equal((table.match(/<td>/g) ?? []).length, 12)
  assert.match(table, /<thead><tr><th scope="col">Размещение<\/th><th scope="col">utm_source<\/th><th scope="col">utm_medium<\/th><th scope="col">utm_content<\/th><\/tr><\/thead>/)
  assert.match(table, /<tr><td><b>Пост в Telegram<\/b><\/td><td>telegram<\/td><td>social<\/td><td>post_a<\/td><\/tr>/)
  assert.match(table, /<td>newsletter<\/td><td>email<\/td><td>button\|a<\/td>/)
  assert.match(table, /<td>yandex<\/td><td>cpc<\/td><td>&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt; &amp; ad_a<\/td>/)
  assert.doesNotMatch(table, /<img|<script|\| ---/)
  assert.match(table, /href="https:\/\/example.com\/\?a=1&amp;b=2"/)
  assert.deepEqual(result.report.links, [{ href: 'https://example.com/?a=1&b=2', text: 'в рассылке', httpStatus: 'NOT_RUN' }])
  assert.equal(result.report.snapshot.bodySha256, sha256(publicationBody(markdown)))
  assert.equal(result.report.ready, false)
  assert.ok(result.report.issues.some(issue => issue.id === 'TEXT_CHECK'))
  writeFileSync(source, markdown.replace('https://example.com/?a=1&b=2', 'javascript:alert'))
  await assert.rejects(() => prepareArticleReview(source), /Unsafe publication URL/)
})

test('HTTP preview paths preserve local filenames and the CLI uses its output directory', async function(){
  const { spawnSync } = await import('node:child_process')
  const { createRequire } = await import('node:module')
  const require = createRequire(join(process.cwd(), 'package.json'))
  const dir = mkdtempSync(join(tmpdir(), 'revroute-http-preview-'))
  const source = join(dir, 'article.md')
  const out = join(dir, 'previews')
  mkdirSync(join(dir, 'assets'))
  const filename = 'кадр #1 & 100%.png'
  const image = await sharp({ create: { width: 800, height: 400, channels: 3, background: '#ffffff' } }).png().toBuffer()
  writeFileSync(join(dir, 'assets', filename), image)
  writeFileSync(source, '# Черновик статьи\n## Preview\n![Настоящий файл](<assets/' + filename + '>)\n\n*Подпись кадра*\n')
  const portable = await prepareArticleReview(source, {}, { previewDirectory: out })
  const local = await prepareArticleReview(source)
  const src = portable.preview.match(/<img src="([^"]+)"/)?.[1]
  assert.ok(src)
  assert.ok(src.startsWith('../assets/'))
  assert.ok(src.includes('%20%231%20%26%20100%25.png'))
  assert.doesNotMatch(src, /file:|\\|[А-Яа-я]/)
  const httpUrl = new URL(src, 'http://127.0.0.1:8080/previews/preview.html')
  assert.equal(decodeURIComponent(httpUrl.pathname), '/assets/' + filename)
  assert.equal(httpUrl.hash, '')
  assert.equal(httpUrl.search, '')
  assert.equal(portable.report.snapshot.bodySha256, local.report.snapshot.bodySha256)
  assert.deepEqual(portable.report.snapshot.images, local.report.snapshot.images)
  assert.notEqual(portable.report.snapshot.previewSha256, local.report.snapshot.previewSha256)
  assert.equal(portable.report.ready, false)
  const command = spawnSync(process.execPath, [require.resolve('tsx/cli'), join(process.cwd(), 'scripts/prepare-article-review.ts'), '--source=' + source, '--out=' + out], { encoding: 'utf8' })
  assert.equal(command.status, 1, command.stderr)
  assert.equal(readFileSync(join(out, 'preview.html'), 'utf8'), portable.preview)
  const report = JSON.parse(readFileSync(join(out, 'preflight.json'), 'utf8'))
  assert.equal(report.snapshot.previewSha256, portable.report.snapshot.previewSha256)
  assert.equal(report.ready, false)
 })

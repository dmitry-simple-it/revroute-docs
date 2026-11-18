import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { prepareArticleReview, type Review } from '../lib/dzen/editorial-review'

async function main() {
const args = Object.fromEntries(process.argv.slice(2).map(arg => { const index = arg.indexOf('='); return [arg.slice(2, index), arg.slice(index + 1)] }))
if (!args.source || !args.out) throw new Error('Usage: tsx scripts/prepare-article-review.ts --source=article.md --out=assets-folder')
const out = resolve(args.out)
const reviewPath = join(out, 'review.json')
const review = existsSync(reviewPath) ? JSON.parse(readFileSync(reviewPath, 'utf8')) as Review : {}
const result = await prepareArticleReview(args.source, review, { previewDirectory: out })
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'preview.html'), result.preview)
writeFileSync(join(out, 'preflight.json'), JSON.stringify(result.report, null, 2) + '\n')
console.log(JSON.stringify({ readiness: result.report.readiness, ready: result.report.ready, issues: result.report.issues.map(issue => issue.id), output: out }))
if (!result.report.ready) process.exitCode = 1
}
main().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1 })

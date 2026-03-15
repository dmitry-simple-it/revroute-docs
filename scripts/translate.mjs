/**
 * Auto-translate content/en -> content/ru using Claude API.
 * Translates MDX files and _meta.js files preserving structure.
 *
 * Usage: ANTHROPIC_API_KEY=sk-... node scripts/translate.mjs
 * Force re-translate: FORCE_TRANSLATE=1 node scripts/translate.mjs
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const SOURCE_DIR = './content/en'
const TARGET_DIR = './content/ru'
const HASH_FILE = './content/.translate-hashes.json'
const CONCURRENCY = 5
const FORCE = process.env.FORCE_TRANSLATE === '1'

const anthropic = new Anthropic()

const MDX_PROMPT = `Translate the following MDX documentation from English to Russian.

Rules:
- Preserve ALL MDX/JSX component tags exactly as-is (<Info>, <Steps>, <Card>, <Tip>, <Warning>, <Note>, <CardGroup>, <Step>, <Accordion>, <Tabs>, <Tab>, <CodeGroup>, <ParamField>, <ResponseField>, <Expandable>, <CheckList>, <CheckListItem>, etc.)
- Do NOT translate content inside code blocks (between \`\`\` fences)
- Do NOT translate inline code (between single backticks)
- In frontmatter (between ---), only translate the values of "title", "description", and "sidebarTitle" keys. Keep all other keys and values unchanged.
- Do NOT translate URLs, file paths, or href values
- Keep all Markdown formatting (headings, lists, bold, italic, links)
- Use professional technical Russian
- Keep the same structure and line breaks
- Return ONLY the translated content, no explanations

Content to translate:`

const META_PROMPT = `Translate the navigation titles in this JavaScript _meta.js file from English to Russian.

Rules:
- Keep all object keys exactly the same (they are directory/file names)
- Only translate string title values
- Keep all "type", "separator", and other structural properties unchanged
- Use professional technical Russian
- Return ONLY the translated JavaScript code, no explanations

File to translate:`

// Load or create hash cache
let hashCache = {}
if (fs.existsSync(HASH_FILE) && !FORCE) {
  hashCache = JSON.parse(fs.readFileSync(HASH_FILE, 'utf-8'))
}

function fileHash(content) {
  return crypto.createHash('md5').update(content).digest('hex')
}

function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath, results)
    } else if (entry.name.endsWith('.mdx') || entry.name === '_meta.js') {
      results.push(fullPath)
    }
  }
  return results
}

async function translateFile(sourcePath, targetPath) {
  const content = fs.readFileSync(sourcePath, 'utf-8')
  const hash = fileHash(content)
  const relPath = path.relative(SOURCE_DIR, sourcePath)

  // Skip if already translated and source unchanged
  if (!FORCE && hashCache[relPath] === hash && fs.existsSync(targetPath)) {
    return { path: relPath, status: 'skipped' }
  }

  const isMeta = sourcePath.endsWith('_meta.js')
  const prompt = isMeta ? META_PROMPT : MDX_PROMPT

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: `${prompt}\n\n${content}` }],
    })

    let translated = response.content[0].text

    // Clean up: remove markdown code fences if AI wrapped the output
    if (isMeta) {
      translated = translated.replace(/^```(?:js|javascript)?\n/m, '').replace(/\n```\s*$/m, '')
    } else {
      // For MDX, only strip if the ENTIRE output is wrapped
      if (translated.startsWith('```mdx\n') || translated.startsWith('```markdown\n')) {
        translated = translated.replace(/^```(?:mdx|markdown)?\n/m, '').replace(/\n```\s*$/m, '')
      }
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true })
    fs.writeFileSync(targetPath, translated)

    hashCache[relPath] = hash

    return { path: relPath, status: 'translated' }
  } catch (err) {
    console.error(`  ERROR translating ${relPath}: ${err.message}`)
    return { path: relPath, status: 'error', error: err.message }
  }
}

async function processInBatches(items, batchSize, fn) {
  const results = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(fn))
    results.push(...batchResults)

    const done = Math.min(i + batchSize, items.length)
    const translated = results.filter(r => r.status === 'translated').length
    const skipped = results.filter(r => r.status === 'skipped').length
    console.log(`  Progress: ${done}/${items.length} (translated: ${translated}, skipped: ${skipped})`)
  }
  return results
}

async function main() {
  console.log('Scanning content/en/...')
  const sourceFiles = walkDir(SOURCE_DIR)
  console.log(`Found ${sourceFiles.length} files to process`)

  const tasks = sourceFiles.map(sourcePath => {
    const relPath = path.relative(SOURCE_DIR, sourcePath)
    const targetPath = path.join(TARGET_DIR, relPath)
    return { sourcePath, targetPath }
  })

  console.log(`\nTranslating (concurrency: ${CONCURRENCY})...`)
  const results = await processInBatches(
    tasks,
    CONCURRENCY,
    ({ sourcePath, targetPath }) => translateFile(sourcePath, targetPath)
  )

  // Save hash cache
  fs.writeFileSync(HASH_FILE, JSON.stringify(hashCache, null, 2))

  const translated = results.filter(r => r.status === 'translated').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const errors = results.filter(r => r.status === 'error').length

  console.log(`\nDone! Translated: ${translated}, Skipped: ${skipped}, Errors: ${errors}`)
}

main().catch(console.error)

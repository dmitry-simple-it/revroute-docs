import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { PageReviewSchema, type PageReview, type Segment } from './types'
import { AUDIT_ROOT, REPO_ROOT, REVIEWS_CACHE } from './paths'

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5-20250929'

function cacheFileForPage(pagePath: string, segmentHash: string): string {
  const safe = createHash('sha256').update(pagePath).digest('hex').slice(0, 12)
  return join(REVIEWS_CACHE, `${safe}-${segmentHash.slice(0, 16)}.json`)
}

function segmentsHash(segments: Segment[]): string {
  return createHash('sha256')
    .update(JSON.stringify(segments.map((s) => [s.id, s.text, s.filePath, s.start, s.end])))
    .digest('hex')
}

export function parseJsonFromAssistant(raw: string): unknown {
  const t = raw.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t)
  const body = fence ? fence[1].trim() : t
  return JSON.parse(body)
}

async function loadFewShot(): Promise<string> {
  const candidates = [
    join(AUDIT_ROOT, 'phase-1-homepage-fixes.md'),
    join(REPO_ROOT, '..', 'revroute-audit', 'phase-1-homepage-fixes.md'),
  ]
  for (const p of candidates) {
    if (existsSync(p)) {
      const text = await readFile(p, 'utf8')
      return text.slice(0, 4500)
    }
  }
  return ''
}

async function loadSystemPrompt(): Promise<string> {
  const p = join(REPO_ROOT, 'scripts/translation-agent/prompts/review-system.md')
  return readFile(p, 'utf8')
}

export async function reviewPageSegments(segments: Segment[]): Promise<PageReview> {
  if (segments.length === 0) {
    return { page_score: 100, issues: [], polished_segments: {} }
  }
  if (process.env.TRANSLATION_AGENT_OFFLINE === '1') {
    return {
      page_score: 100,
      issues: [],
      polished_segments: Object.fromEntries(segments.map((s) => [s.id, s.text])),
    }
  }
  const pagePath = segments[0].pagePath
  const sh = segmentsHash(segments)
  await mkdir(REVIEWS_CACHE, { recursive: true })
  const cf = cacheFileForPage(pagePath, sh)
  if (existsSync(cf)) {
    const cached = JSON.parse(await readFile(cf, 'utf8'))
    const parsed = PageReviewSchema.safeParse(cached)
    if (parsed.success) return parsed.data
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required for agent:review')
  }

  const client = new Anthropic({ apiKey })
  const [system, fewShot, glossaryRaw, styleRaw] = await Promise.all([
    loadSystemPrompt(),
    loadFewShot(),
    readFile(join(REPO_ROOT, 'scripts/translation-agent/glossary.json'), 'utf8'),
    readFile(join(REPO_ROOT, 'scripts/translation-agent/style-guide.md'), 'utf8'),
  ])

  const glossary = JSON.parse(glossaryRaw) as Record<string, string>
  const payload = {
    page_path: pagePath,
    glossary,
    style_guide: styleRaw,
    reference_note:
      'Each segment may include English reference excerpt in ref_en_excerpt when available; use it only to check accuracy, not to copy wording.',
    segments: segments.map((s) => ({
      segment_id: s.id,
      text: s.text,
      file: s.filePath,
      ref_en_excerpt: s.refEn ? s.refEn.slice(0, 2000) : null,
    })),
  }

  const userText = `${fewShot ? `## Human audit examples (tone of fixes)\n\n${fewShot}\n\n---\n\n` : ''}## Task\n\nReview and polish Russian copy. Respond with a single JSON object:\n\n\`\`\`json\n{\n  "page_score": <0-100 number>,\n  "issues": [\n    {\n      "segment_id": "<id>",\n      "category": "Accuracy" | "Fluency" | "Terminology" | "Style" | "Locale conventions" | "Design/Markup",\n      "severity": "minor" | "major" | "critical",\n      "quote": "<exact Russian substring from segment>",\n      "suggestion": "<polished Russian>",\n      "reason": "<short>",\n      "reference_en": "<optional excerpt>"\n    }\n  ],\n  "polished_segments": { "<segment_id>": "<full polished segment text>" }\n}\n\`\`\`\n\nRules:\n- Include every segment_id from the input in polished_segments.\n- polished_segments values must be safe to paste back into source (preserve inline markdown/MDX/JSX fragments if present).\n\n## Input JSON\n\n${JSON.stringify(payload, null, 2)}`

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system,
    messages: [{ role: 'user', content: userText }],
  })

  const block = msg.content.find((b) => b.type === 'text')
  if (!block || block.type !== 'text') {
    throw new Error('No text response from Claude')
  }

  let parsedJson: unknown
  try {
    parsedJson = parseJsonFromAssistant(block.text)
  } catch (e) {
    throw new Error(`Failed to parse JSON from model: ${(e as Error).message}\n${block.text.slice(0, 500)}`)
  }

  const parsed = PageReviewSchema.safeParse(parsedJson)
  if (!parsed.success) {
    throw new Error(`Schema validation failed: ${parsed.error.message}`)
  }

  for (const s of segments) {
    if (parsed.data.polished_segments[s.id] === undefined) {
      parsed.data.polished_segments[s.id] = s.text
    }
  }

  await writeFile(cf, JSON.stringify(parsed.data, null, 2), 'utf8')
  return parsed.data
}

export async function reviewAll(
  byPage: Map<string, Segment[]>,
  concurrency = 3,
): Promise<Map<string, PageReview>> {
  const entries = [...byPage.entries()]
  const out = new Map<string, PageReview>()
  for (const [path, segs] of entries) {
    if (segs.length === 0) {
      out.set(path, { page_score: 100, issues: [], polished_segments: {} })
    }
  }
  const nonEmpty = entries.filter(([, segs]) => segs.length > 0)
  for (let i = 0; i < nonEmpty.length; i += concurrency) {
    const batch = nonEmpty.slice(i, i + concurrency)
    const partial = await Promise.all(
      batch.map(async ([path, segs]) => [path, await reviewPageSegments(segs)] as const),
    )
    for (const [path, rev] of partial) out.set(path, rev)
  }
  return out
}

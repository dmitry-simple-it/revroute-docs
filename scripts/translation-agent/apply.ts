import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PageReview, Segment } from './types'
import { REPO_ROOT } from './paths'

const execFileAsync = promisify(execFile)

type FileEdit = { start: number; end: number; oldText: string; newText: string }

function collectEditsForFile(
  filePath: string,
  segmentsInFile: Segment[],
  polishedBySegmentId: Record<string, string>,
): FileEdit[] {
  const edits: FileEdit[] = []
  for (const seg of segmentsInFile) {
    const polished = polishedBySegmentId[seg.id]
    if (polished === undefined || polished === seg.text) continue
    edits.push({
      start: seg.start,
      end: seg.end,
      oldText: seg.text,
      newText: polished,
    })
  }
  return edits.sort((a, b) => b.start - a.start)
}

function applyEditsToSource(source: string, edits: FileEdit[]): string {
  let out = source
  for (const e of edits) {
    const slice = out.slice(e.start, e.end)
    if (slice !== e.oldText) {
      throw new Error(
        `Text mismatch at ${e.start}-${e.end} in file: expected ${JSON.stringify(e.oldText.slice(0, 120))} got ${JSON.stringify(slice.slice(0, 120))}`,
      )
    }
    out = out.slice(0, e.start) + e.newText + out.slice(e.end)
  }
  return out
}

/** Merge polished strings from page-level reviews into per-segment map. */
function polishedBySegmentId(
  segmentsByPath: Map<string, Segment[]>,
  reviews: Map<string, PageReview>,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [pagePath, segs] of segmentsByPath) {
    const rev = reviews.get(pagePath)
    if (!rev) continue
    for (const s of segs) {
      if (rev.polished_segments[s.id] !== undefined) {
        out[s.id] = rev.polished_segments[s.id]
      }
    }
  }
  return out
}

export async function applyReviews(
  reviews: Map<string, PageReview>,
  segmentsByPath: Map<string, Segment[]>,
  dryRun: boolean,
): Promise<{ files: string[]; diff: string }> {
  const polished = polishedBySegmentId(segmentsByPath, reviews)
  const allSegments = [...segmentsByPath.values()].flat()
  const byFile = new Map<string, Segment[]>()
  for (const s of allSegments) {
    const list = byFile.get(s.filePath) ?? []
    list.push(s)
    byFile.set(s.filePath, list)
  }

  const touched: string[] = []
  for (const [filePath, segs] of byFile) {
    const edits = collectEditsForFile(filePath, segs, polished)
    if (edits.length === 0) continue
    touched.push(filePath)
    if (dryRun) continue
    const abs = join(REPO_ROOT, filePath)
    const raw = await readFile(abs, 'utf8')
    const next = applyEditsToSource(raw, edits)
    await writeFile(abs, next, 'utf8')
  }

  let diff = ''
  if (touched.length > 0 && !dryRun) {
    try {
      const { stdout } = await execFileAsync('git', ['diff', '--', ...touched], {
        cwd: REPO_ROOT,
        maxBuffer: 10 * 1024 * 1024,
      })
      diff = stdout
    } catch {
      diff = '(git diff unavailable)'
    }
  }

  await mkdir(join(REPO_ROOT, '.cache/translation-agent'), { recursive: true })
  await writeFile(join(REPO_ROOT, '.cache/translation-agent/patches.diff'), diff || '(no diff)', 'utf8')

  return { files: touched, diff }
}

export async function createBranchAndPr(reportReadmeAbs: string, branch: string): Promise<void> {
  await execFileAsync('git', ['checkout', '-B', branch], { cwd: REPO_ROOT })
  await execFileAsync('git', ['add', '-A'], { cwd: REPO_ROOT }).catch(() => {})
  await execFileAsync('git', ['commit', '-m', 'chore: copy polish from translation agent'], {
    cwd: REPO_ROOT,
  }).catch(() => {})
  try {
    await execFileAsync(
      'gh',
      [
        'pr',
        'create',
        '--title',
        'Copy polish (translation agent)',
        '--body-file',
        reportReadmeAbs,
      ],
      { cwd: REPO_ROOT },
    )
  } catch {
    console.warn('gh pr create failed — open PR manually. Branch:', branch)
  }
}

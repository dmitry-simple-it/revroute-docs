import { z } from 'zod'

export type PageTarget = {
  path: string
  sources: SourceRef[]
}

export type SourceRef = {
  file: string
  /** How to extract copy from this file */
  kind: 'mdx' | 'tsx-page' | 'blog-data' | 'customers-data' | 'compare-data'
  /** For data files: slug filter */
  slug?: string
}

export type Segment = {
  id: string
  pagePath: string
  filePath: string
  text: string
  start: number
  end: number
  refEn: string | null
  kind: SourceRef['kind']
}

export const IssueSchema = z.object({
  segment_id: z.string(),
  category: z.enum([
    'Accuracy',
    'Fluency',
    'Terminology',
    'Style',
    'Locale conventions',
    'Design/Markup',
  ]),
  severity: z.enum(['minor', 'major', 'critical']),
  quote: z.string(),
  suggestion: z.string(),
  reason: z.string(),
  reference_en: z.string().optional().nullable(),
})

export const PageReviewSchema = z.object({
  page_score: z.number().min(0).max(100),
  issues: z.array(IssueSchema),
  polished_segments: z.record(z.string(), z.string()),
})

export type PageReview = z.infer<typeof PageReviewSchema>

export type CrawlPageResult = {
  path: string
  url: string
  status: number
  ok: boolean
  title: string
  textSample: string
  screenshotRelative: string | null
  fetchedAt: string
  error?: string
}

export type UrlsManifest = {
  generatedAt: string
  baseUrl: string
  pages: PageTarget[]
}

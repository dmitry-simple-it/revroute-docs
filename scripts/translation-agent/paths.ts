import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** revroute-docs package root */
export const REPO_ROOT = join(__dirname, '..', '..')

/** Sibling audit docs (human-written) for few-shot context */
export const AUDIT_ROOT = join(REPO_ROOT, '..', 'revroute-audit')

export const CACHE_ROOT = join(REPO_ROOT, '.cache', 'translation-agent')

export const PAGES_CACHE = join(CACHE_ROOT, 'pages')

export const REVIEWS_CACHE = join(CACHE_ROOT, 'reviews')

export const EN_REFERENCE_CACHE = join(CACHE_ROOT, 'en-reference')

export const URLS_JSON = join(CACHE_ROOT, 'urls.json')

export const SEGMENTS_JSON = join(CACHE_ROOT, 'segments.json')

export const REVIEW_AGGREGATE_JSON = join(CACHE_ROOT, 'review-aggregate.json')

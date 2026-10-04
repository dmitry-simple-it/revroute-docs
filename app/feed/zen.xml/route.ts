import { posts } from '@/content/blog'
import { renderDzenFeed } from '@/lib/dzen/rss'

// Evaluate release dates at request time; disabled posts and local drafts never enter the feed.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    return new Response(renderDzenFeed(posts), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Dzen feed validation failed:', error)
    return new Response('Feed validation failed', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }
}

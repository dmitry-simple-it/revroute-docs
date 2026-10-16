import type { BlogPost } from '../blog'
import draft from './drafts/shorten-link-no-signup.json'
import changeUrlDraft from './drafts/change-url-after-publish.json'
import qrDraft from './drafts/qr-with-analytics.json'

// Website publication is explicit. Imported drafts are never loaded automatically.
// Website and RSS publication of the two new articles authorized on 2026-10-16.
const post = draft.post as BlogPost

export const approvedDzenPosts: BlogPost[] = [{
  ...post,
  date: '2026-10-04',
  dzen: { ...post.dzen!, enabled: true, mode: 'draft' },
}, ...[changeUrlDraft.post, qrDraft.post].map((draftPost) => {
  const websitePost = draftPost as BlogPost
  return {
    ...websitePost,
    date: '2026-10-16',
    // Offer approved articles to Dzen as drafts while the feed application is reviewed.
    dzen: { ...websitePost.dzen!, enabled: true, mode: 'draft' as const },
  }
})]

import type { BlogPost } from '../blog'
import draft from './drafts/shorten-link-no-signup.json'

// Only editorially approved website articles belong here.
// Imported files in ./drafts are review material and are never loaded automatically.
const post = draft.post as BlogPost

export const approvedDzenPosts: BlogPost[] = [{
  ...post,
  date: '2026-10-04',
  dzen: { ...post.dzen!, enabled: true, mode: 'draft' },
}]

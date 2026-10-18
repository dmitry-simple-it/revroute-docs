import customDomainDraft from './drafts/custom-domains-for-short-links.json'
import bitlyDraft from './drafts/bitly-not-working.json'
import directUtmDraft from './drafts/utm-in-yandex-direct-2026.json'
import type { BlogPost } from '../blog'
import draft from './drafts/shorten-link-no-signup.json'
import changeUrlDraft from './drafts/change-url-after-publish.json'
import qrDraft from './drafts/qr-with-analytics.json'
import linkPreviewDraft from './drafts/link-preview-telegram-vk.json'
import vkUtmDraft from './drafts/utm-vk-ads.json'
import formsUtmDraft from './drafts/utm-tilda-wordpress.json'
import bulkLinksDraft from './drafts/bulk-links-csv.json'
import clicksVisitsDraft from './drafts/clicks-vs-metrika-visits.json'
import abTestDraft from './drafts/ab-test-landing-pages.json'
import expirationDraft from './drafts/link-expiration-redirect.json'
import analyticsCsvDraft from './drafts/link-analytics-csv.json'
import libraryDraft from './drafts/link-library-folders-tags.json'
import geoDraft from './drafts/geo-targeting-links.json'

// Website publication is explicit. Imported drafts are never loaded automatically.
// The five-guide batch was approved for website and RSS publication on 2026-10-16.
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
    dzen: { ...websitePost.dzen!, enabled: true, mode: 'draft' as const },
  }
}), ...[
  linkPreviewDraft.post,
  vkUtmDraft.post,
  formsUtmDraft.post,
  bulkLinksDraft.post,
  clicksVisitsDraft.post,
].map((draftPost) => {
  const websitePost = draftPost as BlogPost
  return {
    ...websitePost,
    date: '2026-10-17',
    // Keep the existing GUID and offer the approved article to Dzen as a draft.
    dzen: {
      ...websitePost.dzen!, enabled: true, mode: 'draft' as const,
      publishedAt: '2026-10-17T00:00:00+03:00',
    },
  }
}), ...[
  abTestDraft.post,
  expirationDraft.post,
  analyticsCsvDraft.post,
  libraryDraft.post,
  geoDraft.post,
].map((draftPost) => {
  const websitePost = draftPost as BlogPost
  return {
    ...websitePost,
    date: '2026-10-17',
    // Approved for the website; Dzen receives the article as a draft.
    dzen: {
      ...websitePost.dzen!, enabled: true, mode: 'draft' as const,
      publishedAt: '2026-10-17T12:37:20Z',
    },
  }
}), directUtmDraft.post as BlogPost, bitlyDraft.post as BlogPost, customDomainDraft.post as BlogPost]

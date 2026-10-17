import assert from 'node:assert/strict'
import test from 'node:test'
import { decorateAppUrl, readLandingAttributionFromUrl } from '../lib/analytics/attribution'
import type { ArticleContext } from '../lib/analytics/article-cta'

const storageKey = 'rr_landing_attribution'
const article: ArticleContext = { article_slug: 'qr-with-analytics', article_cta_slot: 'bottom' }

function inBrowser(stored: Record<string, unknown>, run: (storage: Map<string, string>) => void) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const values = new Map<string, string>([[storageKey, JSON.stringify(stored)]])
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    } },
  })
  try { run(values) } finally {
    if (original) Object.defineProperty(globalThis, 'window', original)
    else Reflect.deleteProperty(globalThis, 'window')
  }
}

test('explicit article context preserves the existing campaign, IDs, app query and fragment', () => {
  inBrowser({ landing_session_id: 'session-current', ym_client_id: 'ym-stored', utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: 'launch', utm_content: 'ad-1', utm_term: 'key word' }, () => {
    const url = new URL(decorateAppUrl('https://app.revroute.ru/register?utm_source=partner&ym_client_id=ym-href&invite=keep#step', article))
    assert.equal(url.pathname, '/register')
    assert.equal(url.hash, '#step')
    assert.equal(url.searchParams.get('invite'), 'keep')
    assert.equal(url.searchParams.get('utm_source'), 'partner')
    assert.equal(url.searchParams.get('utm_medium'), 'cpc')
    assert.equal(url.searchParams.get('utm_campaign'), 'launch')
    assert.equal(url.searchParams.get('utm_content'), 'ad-1')
    assert.equal(url.searchParams.get('utm_term'), 'key word')
    assert.equal(url.searchParams.get('landing_session_id'), 'session-current')
    assert.equal(url.searchParams.get('ym_client_id'), 'ym-href')
    assert.equal(url.searchParams.get('article_slug'), article.article_slug)
    assert.equal(url.searchParams.get('article_cta_slot'), 'bottom')
  })
})

test('article context never manufactures a UTM source or campaign', () => {
  inBrowser({ landing_session_id: 'session-current' }, () => {
    const url = new URL(decorateAppUrl('https://app.revroute.ru/login', article))
    assert.equal(url.searchParams.has('utm_source'), false)
    assert.equal(url.searchParams.has('utm_medium'), false)
    assert.equal(url.searchParams.has('utm_campaign'), false)
    assert.equal(url.searchParams.get('article_slug'), article.article_slug)
  })
})

test('current explicit context replaces duplicate stale article parameters and is idempotent', () => {
  inBrowser({ landing_session_id: 'session-current' }, () => {
    const first = decorateAppUrl('https://app.revroute.ru/register?article_slug=old&article_slug=older&article_cta_slot=inline', article)
    const url = new URL(first)
    assert.deepEqual(url.searchParams.getAll('article_slug'), [article.article_slug])
    assert.deepEqual(url.searchParams.getAll('article_cta_slot'), ['bottom'])
    assert.equal(decorateAppUrl(first, article), first)
  })
})

test('missing or invalid explicit context clears stale href context and ignores stored article/user fields', () => {
  const stored = { landing_session_id: 'session-current', utm_source: 'newsletter', article_slug: 'old-article', article_cta_slot: 'inline', email: 'private@example.com', arbitrary: 'private' }
  inBrowser(stored, (storage) => {
    const href = 'https://app.revroute.ru/register?article_slug=href-old&article_cta_slot=bottom&next=keep'
    for (const context of [undefined, null, { article_slug: '../preview', article_cta_slot: 'inline' } as ArticleContext, { article_slug: 'good-slug', article_cta_slot: 'other' } as unknown as ArticleContext]) {
      const url = new URL(decorateAppUrl(href, context))
      assert.equal(url.searchParams.has('article_slug'), false)
      assert.equal(url.searchParams.has('article_cta_slot'), false)
      assert.equal(url.searchParams.has('email'), false)
      assert.equal(url.searchParams.has('arbitrary'), false)
      assert.equal(url.searchParams.get('utm_source'), 'newsletter')
      assert.equal(url.searchParams.get('next'), 'keep')
    }
    assert.deepEqual(JSON.parse(storage.get(storageKey)!), stored)
  })
})

test('context is not written to localStorage and is excluded from ordinary URL attribution', () => {
  inBrowser({ landing_session_id: 'session-current', utm_source: 'yandex' }, (storage) => {
    const before = storage.get(storageKey)
    decorateAppUrl('https://app.revroute.ru/register', article)
    assert.equal(storage.get(storageKey), before)
  })
  const attribution = readLandingAttributionFromUrl('https://revroute.ru/blog/test?utm_source=yandex&article_slug=old&article_cta_slot=header')
  assert.equal(attribution.utm_source, 'yandex')
  assert.equal('article_slug' in attribution, false)
  assert.equal('article_cta_slot' in attribution, false)
})

test('non-app, spoofed, unsafe and credential URLs remain untouched without accessing storage', () => {
  inBrowser({}, () => {
    const fakeWindow = (globalThis as unknown as { window: { localStorage: unknown } }).window
    fakeWindow.localStorage = new Proxy({}, { get() { throw new Error('Storage should not be read') } })
    for (const href of [
      'https://example.com/register?article_slug=external',
      'https://app.revroute.ru.example.com/register',
      'https://app.revroute.ru@evil.example/register',
      'https://user:secret@app.revroute.ru/register',
      'https://app.revroute.ru:444/register',
      'http://app.revroute.ru/register',
      'javascript:alert(1)', 'data:text/html,test', '/register', 'not a URL',
    ]) assert.equal(decorateAppUrl(href, article), href, href)
  })
})

test('legacy calls retain established attribution precedence and SSR remains a no-op', () => {
  const href = 'https://app.revroute.ru/login?landing_session_id=old-href&ym_client_id=href-ym&utm_source=href-source'
  inBrowser({ landing_session_id: 'session-current', ym_client_id: 'stored-ym', utm_source: 'stored-source', utm_medium: 'cpc' }, () => {
    const url = new URL(decorateAppUrl(href))
    assert.equal(url.searchParams.get('landing_session_id'), 'session-current')
    assert.equal(url.searchParams.get('ym_client_id'), 'href-ym')
    assert.equal(url.searchParams.get('utm_source'), 'href-source')
    assert.equal(url.searchParams.get('utm_medium'), 'cpc')
    assert.equal(url.searchParams.has('article_slug'), false)
  })
  assert.equal(typeof window, 'undefined')
  assert.equal(decorateAppUrl(href), href)
})

function blockedStorage(mode: 'read-and-write' | 'write-only') {
  const fakeWindow = (globalThis as unknown as { window: { localStorage: unknown } }).window
  fakeWindow.localStorage = {
    getItem() {
      if (mode === 'read-and-write') throw new DOMException('Storage blocked', 'SecurityError')
      return null
    },
    setItem() { throw new DOMException('Storage full', 'QuotaExceededError') },
  }
}

for (const mode of ['read-and-write', 'write-only'] as const) {
  test(`repeated decoration stays identical when storage fails: ${mode}`, () => {
    inBrowser({}, () => {
      blockedStorage(mode)
      const href = 'https://app.revroute.ru/register?utm_source=newsletter&utm_medium=email&ym_client_id=ym-href#start'
      const first = decorateAppUrl(href, article)
      const firstUrl = new URL(first)
      const sessionId = firstUrl.searchParams.get('landing_session_id')
      assert.ok(sessionId)
      assert.equal(firstUrl.searchParams.get('utm_source'), 'newsletter')
      assert.equal(firstUrl.searchParams.get('utm_medium'), 'email')
      assert.equal(firstUrl.searchParams.get('ym_client_id'), 'ym-href')
      assert.equal(firstUrl.searchParams.get('article_slug'), article.article_slug)
      assert.equal(firstUrl.searchParams.get('article_cta_slot'), 'bottom')
      assert.equal(firstUrl.hash, '#start')
      for (let attempt = 0; attempt < 5; attempt++) {
        assert.equal(decorateAppUrl(href, article), first)
        assert.equal(decorateAppUrl(first, article), first)
      }
      assert.equal(new URL(decorateAppUrl('https://app.revroute.ru/login', article)).searchParams.get('landing_session_id'), sessionId)
    })
  })
}

test('a persisted ID takes precedence over fallback and remains stable if reading later fails', () => {
  inBrowser({}, () => {
    let stored: string | null = null
    let readFails = false
    const fakeWindow = (globalThis as unknown as { window: { localStorage: unknown } }).window
    fakeWindow.localStorage = {
      getItem() {
        if (readFails) throw new DOMException('Storage blocked', 'SecurityError')
        return stored
      },
      setItem() { throw new DOMException('Storage full', 'QuotaExceededError') },
    }
    const first = new URL(decorateAppUrl('https://app.revroute.ru/register', article))
    assert.ok(first.searchParams.get('landing_session_id'))
    stored = JSON.stringify({ landing_session_id: 'persisted-session', utm_source: 'yandex' })
    const persisted = decorateAppUrl(first.href, article)
    assert.equal(new URL(persisted).searchParams.get('landing_session_id'), 'persisted-session')
    assert.equal(new URL(persisted).searchParams.get('utm_source'), 'yandex')
    readFails = true
    assert.equal(decorateAppUrl(persisted, article), persisted)
  })
})

test('separate browser windows do not share a storage-unavailable fallback ID', () => {
  const ids: string[] = []
  for (let browser = 0; browser < 2; browser++) {
    inBrowser({}, () => {
      blockedStorage('write-only')
      const first = decorateAppUrl('https://app.revroute.ru/register', article)
      const id = new URL(first).searchParams.get('landing_session_id')
      assert.ok(id)
      ids.push(id)
      assert.equal(decorateAppUrl(first, article), first)
    })
  }
  assert.notEqual(ids[0], ids[1])
})

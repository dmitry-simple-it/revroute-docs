import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildUtmUrl, EMPTY_UTM, missingUtmFields, parseDestination, readUtmParams, type UtmParams } from '../lib/tools/utm'

const campaign: UtmParams = { ...EMPTY_UTM, utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: 'autumn-2026' }

test('a bare domain gets HTTPS; explicit HTTP and fragment remain intact', () => {
  assert.equal(parseDestination('example.ru/catalog').addedHttps, true)
  assert.equal(buildUtmUrl(' example.ru/catalog#offers ', campaign), 'https://example.ru/catalog?utm_source=yandex&utm_medium=cpc&utm_campaign=autumn-2026#offers')
  assert.equal(new URL(buildUtmUrl('http://example.ru/', campaign)).protocol, 'http:')
  assert.equal(new URL(buildUtmUrl('example.ru:8443/page', campaign)).port, '8443')
  assert.equal(new URL(buildUtmUrl('localhost:3000/page', campaign)).hostname, 'localhost')
})

test('invalid and non-web addresses produce no output', () => {
  for (const input of ['', 'not-a-url', 'javascript:alert(1)', 'mailto:a@example.ru', 'ftp://example.ru/file', 'https://', 'https://exa mple.ru']) {
    assert.equal(buildUtmUrl(input, campaign), '', input)
  }
})

test('other query pairs, their escaping, order and the fragment are preserved', () => {
  const result = buildUtmUrl('https://example.ru/page?filter=a%2fb&filter=c+d&gclid=abc&utm_id=12&signature=x%2By#buy', campaign)
  assert.ok(result.startsWith('https://example.ru/page?filter=a%2fb&filter=c+d&gclid=abc&utm_id=12&signature=x%2By&'))
  assert.ok(result.endsWith('#buy'))
  assert.equal(new URL(result).searchParams.getAll('filter').length, 2)
})

test('all duplicates and differently cased UTM keys are replaced once', () => {
  const result = new URL(buildUtmUrl('https://example.ru/?utm_source=old&UTM_Source=stale&utm_medium=social&utm_campaign=old', campaign))
  assert.deepEqual(result.searchParams.getAll('utm_source'), ['yandex'])
  assert.equal(result.searchParams.has('UTM_Source'), false)
  assert.equal(result.searchParams.get('utm_campaign'), 'autumn-2026')
})

test('empty fields remove old UTM values, including optional fields', () => {
  const result = new URL(buildUtmUrl('https://example.ru/?utm_term=old&utm_content=old&utm_campaign=old', { ...campaign, utm_campaign: '' }))
  for (const key of ['utm_content', 'utm_term', 'utm_campaign']) assert.equal(result.searchParams.has(key), false)
})

test('existing encoded tags import to fields and duplicates are reported', () => {
  const existing = readUtmParams('https://example.ru/?UTM_Source=VK&utm_source=other&utm_medium=cpc&utm_campaign=осень%202026&utm_term=red+shoes')
  assert.equal(existing.found, true)
  assert.equal(existing.duplicates, true)
  assert.deepEqual(existing.params, { ...EMPTY_UTM, utm_source: 'VK', utm_medium: 'cpc', utm_campaign: 'осень 2026', utm_term: 'red shoes' })
  assert.equal(readUtmParams('https://example.ru/?filter=1').found, false)
})

test('encoded key names are managed too; extra UTM fields stay unchanged', () => {
  const result = new URL(buildUtmUrl('https://example.ru/?utm%5fsource=old&utm_source_platform=ads', campaign))
  assert.deepEqual(result.searchParams.getAll('utm_source'), ['yandex'])
  assert.equal(result.searchParams.get('utm_source_platform'), 'ads')
})

test('Cyrillic, spaces, plus, ampersand and equals round trip without creating parameters', () => {
  const value = 'Осень_2026 + скидка & подарки=да'
  const result = new URL(buildUtmUrl('https://example.ru/', { ...campaign, utm_campaign: value }))
  assert.equal(result.searchParams.get('utm_campaign'), value)
  assert.equal([...result.searchParams].length, 3)
})

test('supported macro syntax stays readable instead of becoming percent escapes', () => {
  const result = buildUtmUrl('https://example.ru/?placement={source}', { ...campaign, utm_content: '{ad_id}', utm_term: '{keyword}' })
  assert.ok(result.includes('placement={source}'))
  assert.ok(result.includes('utm_content={ad_id}'))
  assert.ok(result.includes('utm_term={keyword}'))
  assert.ok(buildUtmUrl('https://example.ru/', { ...campaign, utm_content: '{{ad.name}}' }).includes('utm_content={{ad.name}}'))
})

test('whitespace is trimmed, while case and underscores remain the user’s choice', () => {
  const result = new URL(buildUtmUrl('https://example.ru/', { ...campaign, utm_source: ' VK ', utm_campaign: ' autumn_sale ' }))
  assert.equal(result.searchParams.get('utm_source'), 'VK')
  assert.equal(result.searchParams.get('utm_campaign'), 'autumn_sale')
})

test('copy readiness requires three real values, not optional tags', () => {
  assert.deepEqual(missingUtmFields(EMPTY_UTM), ['utm_source', 'utm_medium', 'utm_campaign'])
  assert.deepEqual(missingUtmFields({ ...campaign, utm_medium: '  ' }), ['utm_medium'])
  assert.deepEqual(missingUtmFields(campaign), [])
})

test('editing and rebuilding a tagged URL is idempotent', () => {
  const original = buildUtmUrl('https://example.ru/page?filter=1#offer', campaign)
  const imported = readUtmParams(original)
  assert.equal(buildUtmUrl(original, imported.params), original)
})

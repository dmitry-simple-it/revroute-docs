/** Run: npx tsx --test scripts/startups-lead.test.ts. All HTTPS is intercepted. */
import assert from 'node:assert/strict'
import { after, before, test, mock } from 'node:test'
import https from 'node:https'
import { EventEmitter } from 'node:events'
import { syncBuiltinESMExports } from 'node:module'

let POST: typeof import('../app/api/lead/route')['POST']
let transportStatus = 200
let transportBody = '{"ok":true}'
let delivered: { text: string; parse_mode?: string }[] = []
let ip = 0
const envNames = ['TELEGRAM_LEAD_BOT_TOKEN', 'TELEGRAM_LEAD_CHAT_ID', 'TELEGRAM_PROXY_URL', 'TELEGRAM_PROXY_SECRET'] as const
const previousEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]))

before(async () => {
  process.env.TELEGRAM_LEAD_BOT_TOKEN = 'test-only'
  process.env.TELEGRAM_LEAD_CHAT_ID = 'test-only'
  process.env.TELEGRAM_PROXY_URL = 'https://telegram.invalid'
  process.env.TELEGRAM_PROXY_SECRET = 'test-only'
  mock.method(https, 'request', (_url: unknown, _options: unknown, callback: (response: EventEmitter) => void) => {
    const request = new EventEmitter() as EventEmitter & { write: (body: string) => void; end: () => void }
    let payload = ''
    request.write = (body) => { payload += body }
    request.end = () => {
      delivered.push(JSON.parse(payload))
      const response = Object.assign(new EventEmitter(), { statusCode: transportStatus })
      callback(response)
      response.emit('data', transportBody)
      response.emit('end')
    }
    return request
  })
  syncBuiltinESMExports()
  mock.method(console, 'log', () => {})
  mock.method(console, 'error', () => {})
  ;({ POST } = await import('../app/api/lead/route'))
})

after(() => {
  mock.restoreAll()
  syncBuiltinESMExports()
  for (const name of envNames) {
    if (previousEnv[name] === undefined) delete process.env[name]
    else process.env[name] = previousEnv[name]
  }
})

const qualification = {
  product: 'Тестовый продукт для B2B-команд', age: '1to2', team: '2to9',
  readiness: 'month', eligibility: 'yes', launchPlan: 'Интеграторы; оплата за сделку; учёт в CRM.',
}
const base = {
  page: 'startups', name: 'Тест', contact: 'qa@example.com', company: 'Тестовый продукт', site: 'https://example.com',
  consentPdn: true, consentMarketing: false, website: '',
}
const routes = [
  { route: 'direct', ...qualification },
  { route: 'partner', ...qualification, organization: 'Тестовый набор', evidence: 'Публичная карточка участника' },
  { route: 'invitation', organization: 'Тестовый организатор', evidence: 'Персональная номинация' },
  { route: 'organization', audience: 'B2B-компании из тестового набора', format: 'both' },
]

function send(body: unknown, address = `test-${++ip}`) {
  return POST(new Request('http://localhost/api/lead', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': address }, body: JSON.stringify(body),
  }))
}

for (const startup of routes) {
  test(`${startup.route}: delivery includes complete context and no activation claim`, async () => {
    delivered = []
    const response = await send({ ...base, startup })
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { ok: true })
    assert.equal(delivered.length, 1)
    assert.match(delivered[0].text, /Специальные условия не подключены/)
    assert.match(delivered[0].text, /рассылки — нет/)
    assert.match(delivered[0].text, /https:\/\/example.com/)
    assert.equal(delivered[0].parse_mode, undefined)
    for (const key of ['product', 'launchPlan', 'organization', 'evidence', 'audience'] as const) {
      if (key in startup) assert.ok(delivered[0].text.includes(String(Reflect.get(startup, key))))
    }
  })
}

test('server rejects missing qualification, invalid contact/site, route and oversized fields', async () => {
  const beforeCount = delivered.length
  const invalid = [
    { ...base },
    { ...base, startup: { route: 'direct' } },
    { ...base, startup: { ...routes[0], route: 'approved' } },
    { ...base, contact: 'invalid', startup: routes[0] },
    { ...base, site: 'javascript:alert(1)', startup: routes[0] },
    { ...base, site: 'https://user:secret@example.com', startup: routes[0] },
    { ...base, company: ' ', startup: routes[0] },
    { ...base, startup: { ...routes[0], product: 'x'.repeat(301) } },
    { ...base, startup: { ...routes[1], organization: '' } },
    { ...base, startup: { ...routes[2], evidence: '' } },
    { ...base, startup: { ...routes[3], format: 'unknown' } },
  ]
  for (const body of invalid) assert.equal((await send(body)).status, 400)
  assert.equal(delivered.length, beforeCount)
})

test('required consent is enforced on server; marketing consent is optional', async () => {
  const beforeCount = delivered.length
  const response = await send({ ...base, consentPdn: false, startup: routes[0] })
  assert.equal(response.status, 400)
  assert.equal((await response.json()).error, 'consent_required')
  assert.equal(delivered.length, beforeCount)
})

test('broken transport and Telegram rejection never return success', async () => {
  for (const [status, body] of [[502, '{"ok":false}'], [200, '{"ok":false}'], [200, 'not-json']] as const) {
    transportStatus = status
    transportBody = body
    const response = await send({ ...base, startup: routes[2] })
    assert.equal(response.status, 502)
    assert.deepEqual(await response.json(), { ok: false, fallback: true })
  }
  transportStatus = 200
  transportBody = '{"ok":true}'
})

test('unconfigured transport returns an honest fallback', async () => {
  const beforeCount = delivered.length
  delete process.env.TELEGRAM_LEAD_BOT_TOKEN
  const response = await send({ ...base, startup: routes[3] })
  process.env.TELEGRAM_LEAD_BOT_TOKEN = 'test-only'
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { ok: false, fallback: true })
  assert.equal(delivered.length, beforeCount)
})

test('maximum partner application fits Telegram without truncation or Markdown parsing', async () => {
  delivered = []
  const response = await send({
    ...base, name: '*'.repeat(120), company: '_'.repeat(200), site: `https://example.com/${'x'.repeat(180)}`,
    startup: { ...routes[1], product: '*'.repeat(300), launchPlan: '_'.repeat(450), organization: '*'.repeat(150), evidence: '_'.repeat(250) },
  })
  assert.equal(response.status, 200)
  assert.ok(delivered[0].text.length < 4096)
  assert.ok(delivered[0].text.includes('_'.repeat(450)))
})

test('request cannot grant entitlements by adding client fields', async () => {
  delivered = []
  await send({ ...base, startup: { ...routes[2], approved: true, discount: 100, activate: true }, about: 'APPROVED' })
  assert.doesNotMatch(delivered[0].text, /APPROVED|discount|activate/)
  assert.match(delivered[0].text, /Требуется ручное рассмотрение/)
})

test('honeypot is not delivered and rate limit stops the sixth request', async () => {
  const beforeCount = delivered.length
  assert.equal((await send({ ...base, website: 'spam', startup: routes[0] })).status, 200)
  assert.equal(delivered.length, beforeCount)
  for (let n = 0; n < 5; n++) assert.equal((await send({ ...base, startup: routes[0] }, 'rate-test')).status, 200)
  assert.equal((await send({ ...base, startup: routes[0] }, 'rate-test')).status, 429)
})

test('malformed JSON and non-object bodies are rejected', async () => {
  for (const body of [null, [], 'text']) assert.equal((await send(body)).status, 400)
  const response = await POST(new Request('http://localhost/api/lead', { method: 'POST', body: '{broken' }))
  assert.equal(response.status, 400)
})

test('existing service lead remains compatible', async () => {
  delivered = []
  const response = await send({ name: 'Тест', contact: '@test', page: 'packaging', about: 'Упаковка', consentPdn: true })
  assert.equal(response.status, 200)
  assert.equal(delivered[0].parse_mode, 'MarkdownV2')
  assert.match(delivered[0].text, /packaging/)
})

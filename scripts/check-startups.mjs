/** Local browser acceptance. No lead request leaves the browser.
 * STARTUPS_BASE=http://127.0.0.1:3100 node scripts/check-startups.mjs
 */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const base = process.env.STARTUPS_BASE || 'http://127.0.0.1:3100'
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Only a local preview may be tested')
const out = path.resolve('output/startups-review')
await mkdir(out, { recursive: true })
const report = { base, checks: [], screenshots: [], consoleErrors: [], pageErrors: [], submissions: [] }
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const page = await context.newPage()
let responseStatus = 200
let responseBody = { ok: true }
let networkFailure = false
let delay = 0

page.on('pageerror', (error) => report.pageErrors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error' && !message.location().url.endsWith('/api/lead')) report.consoleErrors.push(message.text())
})
await context.route('**/api/lead', async (route) => {
  report.submissions.push(route.request().postDataJSON())
  if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
  if (networkFailure) await route.abort('failed')
  else await route.fulfill({ status: responseStatus, contentType: 'application/json', body: JSON.stringify(responseBody) })
})

async function check(name, action) {
  try { await action(); report.checks.push({ name, ok: true }) }
  catch (error) { report.checks.push({ name, ok: false, error: String(error) }); throw error }
  finally { await writeFile(path.join(out, 'browser-checks.json'), JSON.stringify(report, null, 2)) }
}
async function shot(name, locator) {
  const filename = `${name}.png`
  await (locator || page).screenshot({ path: path.join(out, filename), animations: 'disabled', ...(locator ? { style: 'header { visibility: hidden !important; }' } : {}) })
  report.screenshots.push(filename)
}
async function fit() {
  const bounds = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }))
  assert.ok(bounds.content <= bounds.viewport + 1, JSON.stringify(bounds))
}
async function fillCommon() {
  await page.locator('#startup-name').fill('Тестовый основатель')
  await page.locator('#startup-contact').fill('qa@example.com')
  await page.locator('#startup-company').fill('Тестовый продукт')
  await page.locator('#startup-site').fill('https://example.com')
}
async function fillRoute(route) {
  await page.locator('#startup-route').selectOption(route)
  await fillCommon()
  if (['direct', 'partner'].includes(route)) {
    await page.locator('#startup-product').fill('Сервис для B2B-команд; есть первые пилоты.')
    for (const [name, value] of Object.entries({ age: '1to2', team: '2to9', eligibility: 'yes', readiness: 'month' })) {
      await page.locator(`#startup-${name}`).selectOption(value)
    }
    await page.locator('#startup-launchPlan').fill('Партнёры-интеграторы; вознаграждение за сделку; учёт в CRM.')
  }
  if (['partner', 'invitation'].includes(route)) {
    await page.locator('#startup-organization').fill('Тестовая организация')
    await page.locator('#startup-evidence').fill('Рекомендация по итогам тестового набора')
  }
  if (route === 'organization') {
    await page.locator('#startup-format').selectOption('both')
    await page.locator('#startup-audience').fill('Набор B2B-компаний, подтверждаем участие координатором.')
  }
  await page.locator('#startup-consent-pdn').check()
}
const submit = () => page.getByRole('button', { name: 'Отправить заявку', exact: true }).click()

try {
  await check('Direct URL, Russian content and metadata', async () => {
    const response = await page.goto(`${base}/startups`, { waitUntil: 'networkidle' })
    assert.equal(response.status(), 200)
    assert.equal(new URL(page.url()).pathname, '/startups')
    assert.equal(await page.locator('html').getAttribute('lang'), 'ru')
    assert.equal(await page.locator('h1').count(), 1)
    assert.match(await page.title(), /стартапов.+RevRoute/)
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://revroute.ru/startups')
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://revroute.ru/startups')
    assert.equal(await page.locator('meta[property="og:locale"]').getAttribute('content'), 'ru_RU')
    assert.equal(await page.locator('meta[property="og:site_name"]').getAttribute('content'), 'RevRoute')
    assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).includes('пилотной программы'))
    const og = await page.locator('meta[property="og:image"]').getAttribute('content')
    assert.equal((await context.request.get(`${base}${new URL(og).pathname}`)).status(), 200)
    const jsonld = await page.locator('script[type="application/ld+json"]').allTextContents()
    assert.ok(jsonld.map((text) => JSON.parse(text)).length > 0)
    assert.ok(jsonld.join('').includes('FAQPage'))
    await shot('desktop-initial')
    const cookie = page.getByRole('button', { name: 'Только необходимые', exact: true })
    if (await cookie.isVisible()) await cookie.click()
  })

  await check('Sitemap, locale bypass, internal links and anchors', async () => {
    const alternate = await context.request.get(`${base}/startups`, { headers: { 'Accept-Language': 'en-US', Cookie: 'NEXT_LOCALE=en' }, maxRedirects: 0 })
    assert.equal(alternate.status(), 200)
    const sitemap = await context.request.get(`${base}/sitemap.xml`)
    assert.equal(sitemap.status(), 200)
    assert.ok((await sitemap.text()).includes('<loc>https://revroute.ru/startups</loc>'))
    const hrefs = await page.locator('a[href]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href')))])
    for (const href of hrefs) {
      if (href.startsWith('#')) assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(), 1, href)
      else if (href.startsWith('/')) assert.equal((await context.request.get(`${base}${href}`)).status(), 200, href)
    }
  })

  await check('All CTAs choose the right form, including repeated anchors', async () => {
    for (const [hash, route] of [['#apply', 'direct'], ['#partner-application', 'partner'], ['#invitation', 'invitation'], ['#organization-application', 'organization'], ['#apply', 'direct']]) {
      await page.locator(`a[href="${hash}"]`).first().click()
      await page.waitForFunction((expected) => document.querySelector('#startup-route')?.value === expected && document.activeElement?.textContent === 'Расскажите о себе', route)
      assert.equal(await page.locator('#startup-route').inputValue(), route)
    }
    await page.locator('#startup-route').selectOption('organization')
    await page.locator('a[href="#apply"]').first().click()
    await page.waitForFunction(() => document.querySelector('#startup-route')?.value === 'direct')
  })

  await check('Required fields and consent block invalid submission', async () => {
    const count = report.submissions.length
    await submit()
    assert.equal(report.submissions.length, count)
    await fillRoute('direct')
    await page.locator('#startup-contact').fill('invalid-email')
    await submit()
    assert.equal(report.submissions.length, count)
    await page.locator('#startup-contact').fill('qa@example.com')
    await page.locator('#startup-site').fill('javascript:alert(1)')
    await submit()
    assert.equal(report.submissions.length, count)
    await page.locator('#startup-site').fill('https://example.com')
    await page.locator('#startup-consent-pdn').uncheck()
    await submit()
    assert.equal(report.submissions.length, count)
    assert.equal(await page.locator('#startup-consent-marketing').isChecked(), false)
    await page.locator('#startup-consent-pdn').check()
    await page.locator('#startup-name').fill('   ')
    await submit()
    assert.equal(report.submissions.length, count)
    await page.locator('#startup-name').fill('Тестовый основатель')
  })

  await check('Four valid routes send their context and show manual-review success', async () => {
    for (const route of ['direct', 'partner', 'invitation', 'organization']) {
      if (await page.getByRole('button', { name: 'Подать ещё одну заявку', exact: true }).isVisible()) await page.getByRole('button', { name: 'Подать ещё одну заявку', exact: true }).click()
      await fillRoute(route)
      await submit()
      await page.getByRole('status').filter({ hasText: 'Заявка отправлена' }).waitFor()
      assert.equal(report.submissions.at(-1).startup.route, route)
      assert.equal(report.submissions.at(-1).consentMarketing, false)
      assert.equal(report.submissions.at(-1).consentPdn, true)
      assert.match(await page.locator('.startup-result').innerText(), /не подключены|ещё не подтверждено/)
      await shot(`success-${route}`, page.locator('.startup-application'))
    }
  })

  await check('Transport errors preserve data, expose fallback and support retry', async () => {
    await page.getByRole('button', { name: 'Подать ещё одну заявку', exact: true }).click()
    await fillRoute('invitation')
    for (const status of [400, 429, 503]) {
      responseStatus = status
      responseBody = { ok: false, fallback: true }
      await submit()
      await page.locator('.startup-error[role="alert"]').waitFor()
      assert.equal(await page.locator('#startup-contact').inputValue(), 'qa@example.com')
      assert.equal(await page.locator('.startup-result').count(), 0)
      assert.equal(await page.locator('.startup-error[role="alert"] a').count(), 2)
    }
    networkFailure = true
    await submit()
    await page.locator('.startup-error[role="alert"]').waitFor()
    await shot('form-error', page.locator('.startup-application'))
    networkFailure = false
    responseStatus = 200
    responseBody = { ok: true }
    delay = 350
    const count = report.submissions.length
    await submit()
    assert.equal(await page.locator('.startup-fields').first().evaluate((el) => el.disabled), true)
    assert.equal(await page.getByRole('button', { name: 'Отправляем…', exact: true }).isDisabled(), true)
    await page.getByRole('status').filter({ hasText: 'Заявка отправлена' }).waitFor()
    assert.equal(report.submissions.length, count + 1)
    delay = 0
  })

  await check('Keyboard form navigation, labels and FAQ', async () => {
    await page.getByRole('button', { name: 'Подать ещё одну заявку', exact: true }).click()
    await page.locator('a[href="#invitation"]').first().focus()
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => document.activeElement?.textContent === 'Расскажите о себе')
    await page.keyboard.press('Tab')
    assert.equal(await page.locator('#startup-route').evaluate((el) => el === document.activeElement), true)
    for (const id of ['startup-name', 'startup-contact', 'startup-company', 'startup-site', 'startup-organization', 'startup-evidence', 'startup-consent-pdn']) {
      await page.keyboard.press('Tab')
      assert.equal(await page.locator(`#${id}`).evaluate((el) => el === document.activeElement), true, id)
    }
    await page.keyboard.press('Space')
    assert.equal(await page.locator('#startup-consent-pdn').isChecked(), true)
    const issues = await page.locator('.startup-application input:not([type="hidden"]), .startup-application select, .startup-application textarea').evaluateAll((elements) => elements.filter((el) => el.getClientRects().length && !el.labels?.length).map((el) => el.id))
    assert.deepEqual(issues, [])
    const summary = page.locator('#faq summary').first()
    await summary.focus()
    await page.keyboard.press('Enter')
    assert.equal(await page.locator('#faq details').first().getAttribute('open'), '')
    await page.keyboard.press('Space')
    assert.equal(await page.locator('#faq details').first().getAttribute('open'), null)
    await page.locator('#faq summary').nth(4).click()
    await shot('faq-expanded', page.locator('#faq'))
  })

  await check('Responsive layouts and every section at desktop/mobile sizes', async () => {
    await page.locator('a[href="#apply"]').first().click()
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 })
      await page.evaluate(() => window.scrollTo(0, 0))
      await fit()
      await shot(`hero-${width}`)
      for (const route of ['direct', 'partner', 'invitation', 'organization']) {
        await page.locator('#startup-route').selectOption(route)
        await fit()
      }
      if (width === 390 || width === 1440) {
        await page.locator('#startup-route').selectOption('direct')
        for (const selector of ['#offers', '.startup-help-grid', '#eligibility', '#launch', '#organizations', '.startup-application-section', '#faq', 'footer']) {
          await page.locator(selector).scrollIntoViewIfNeeded()
          await fit()
          await shot(`${width}-${selector.replace(/^[.#]/, '')}`, page.locator(selector))
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.screenshot({ path: path.join(out, `full-${width}.png`), fullPage: true, animations: 'disabled' })
        report.screenshots.push(`full-${width}.png`)
      }
    }
  })

  await check('Navigation discovery and pricing entry', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.getByRole('button', { name: 'Ресурсы', exact: true }).hover()
    assert.equal(await page.locator('header a[href="/startups"]').isVisible(), true)
    await page.setViewportSize({ width: 320, height: 568 })
    await page.waitForFunction(() => document.querySelectorAll('header a[href="/startups"]').length === 0)
    await page.getByRole('button', { name: 'Меню', exact: true }).click()
    const link = page.locator('header a[href="/startups"]')
    await link.scrollIntoViewIfNeeded()
    assert.equal(await link.isVisible(), true)
    await shot('mobile-menu')
    await link.focus()
    await page.keyboard.press('Escape')
    assert.equal(await page.getByRole('button', { name: 'Меню', exact: true }).getAttribute('aria-expanded'), 'false')
    await page.getByRole('button', { name: 'Меню', exact: true }).click()
    await link.click()
    assert.equal(new URL(page.url()).pathname, '/startups')
    const response = await page.goto(`${base}/pricing`, { waitUntil: 'networkidle' })
    assert.equal(response.status(), 200)
    assert.equal(await page.getByRole('link', { name: 'Условия для стартапов' }).getAttribute('href'), '/startups')
    await fit()
    await page.getByRole('link', { name: 'Условия для стартапов' }).scrollIntoViewIfNeeded()
    await shot('mobile-pricing-entry')
    await page.getByRole('link', { name: 'Условия для стартапов' }).click()
    await page.waitForURL('**/startups')
  })

  await check('No unexpected console or rendering errors', async () => {
    assert.deepEqual(report.consoleErrors, [])
    assert.deepEqual(report.pageErrors, [])
  })
} finally {
  await writeFile(path.join(out, 'browser-checks.json'), JSON.stringify(report, null, 2))
  await browser.close()
}
console.log(`${report.checks.length} browser checks passed; ${report.submissions.length} intercepted requests; ${report.screenshots.length} screenshots`)

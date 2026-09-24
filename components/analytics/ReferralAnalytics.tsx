import Script from 'next/script'

/**
 * Клиентский скрипт RevRoute для реферальных переходов по ссылкам go.revroute.ru:
 * фиксирует клик и сохраняет его идентификатор в first-party cookie на .revroute.ru,
 * чтобы заявка с сайта связалась с партнёром.
 *
 * Скрипт и API — собственная инфраструктура (app.revroute.ru, api.revroute.ru);
 * вариант `conversion-tracking` и атрибуты data-* описаны в
 * /docs/sdks/client-side/variants.
 */
export function ReferralAnalytics() {
  return (
    <Script
      id="revroute-referral-analytics"
      src="https://app.revroute.ru/analytics/script.conversion-tracking.js"
      strategy="afterInteractive"
      data-api-host="https://api.revroute.ru"
      data-publishable-key="dub_pk_5V0LqJ8m97GmSh4HynMlY7th"
      data-domains={JSON.stringify({ refer: 'go.revroute.ru' })}
      data-cookie-options={JSON.stringify({ domain: '.revroute.ru' })}
    />
  )
}

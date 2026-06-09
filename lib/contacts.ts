/**
 * Канонические контакты Revroute.
 *
 * Единый источник правды для футера, страницы `/contact/support`
 * и SEO-схем (`lib/seo/schemas.ts`). Не дублируйте адреса/ссылки по компонентам —
 * импортируйте отсюда.
 */

export const CONTACT_EMAILS = {
  /** Поддержка: продукт, биллинг, интеграции */
  support: 'support@revroute.ru',
  /** Сотрудничество и партнёрства */
  partners: 'partners@revroute.ru',
  /** Вопросы по работе и вакансии */
  jobs: 'jobs@revroute.ru',
} as const

/**
 * Мессенджеры — внешние ссылки. Открывать в новой вкладке
 * (`target="_blank" rel="noopener noreferrer"`).
 */
export const CONTACT_MESSENGERS = {
  telegram: 'https://t.me/revroute_bot',
  max: 'https://max.ru/id7606127150_bot',
} as const

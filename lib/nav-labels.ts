/**
 * Единые подписи для «Решения» и «Ресурсы».
 * При изменении — синхронизировать metadata и hero на соответствующих страницах.
 */

export const solutionsNavItems = [
  {
    label: 'Для бизнеса: запуск партнёрской программы',
    href: '/solutions/affiliate-marketing',
    desc: 'Комиссии, выплаты и маркетплейс партнёров для компаний',
  },
  {
    label: 'Для авторов: монетизация трафика',
    href: '/solutions/content-creators',
    desc: 'Ссылки, аналитика и партнёрки для создателей контента',
  },
  {
    label: 'Для SaaS: атрибуция и referral-рост',
    href: '/solutions/saas',
    desc: 'От клика до MRR, встроенные рефералки и API',
  },
  {
    label: 'Для e-commerce: UTM, QR и партнёрки',
    href: '/solutions/ecommerce',
    desc: 'Кампании в масштабе, оффлайн→онлайн и программы для брендов',
  },
] as const

export const resourcesLearningItems = [
  { label: 'Клиенты и кейсы', href: '/customers' },
  { label: 'Статьи и публикации', href: '/blog' },
  { label: 'Что нового в продукте', href: '/changelog' },
] as const

export const resourcesReferenceItems = [
  { label: 'Документация', href: '/ru/docs' },
  { label: 'Revroute vs конкурентов', href: '/compare' },
] as const

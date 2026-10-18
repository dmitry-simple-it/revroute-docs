import type { BlogPost } from '../../content/blog'

type EditorialRelatedLink = { slug: string; reason: string }
export type RelatedBlogPost = { post: BlogPost; reason: string }

// Website navigation only. Keep publication bodies and syndicated RSS unchanged.
export const BLOG_RELATED_LINKS: Readonly<Record<string, readonly EditorialRelatedLink[]>> = {
  'utm-in-yandex-direct-2026': [
    { slug: 'utm-vk-ads', reason: 'Подготовить разметку для другой рекламной системы, сохранив единые названия кампаний.' },
    { slug: 'clicks-vs-metrika-visits', reason: 'Сверить клики и визиты, если отчёты после запуска расходятся.' },
    { slug: 'utm-tilda-wordpress', reason: 'Проверить передачу UTM с посадочной страницы через форму в CRM.' },
  ],
  'shorten-link-no-signup': [
    { slug: 'change-url-after-publish', reason: 'Изменить посадочную страницу после публикации, сохранив короткий адрес в материалах.' },
    { slug: 'qr-with-analytics', reason: 'Перенести ссылку на печатный материал и разобраться, как учитывать переходы с QR.' },
    { slug: 'utm-vk-ads', reason: 'Подготовить разметку, если короткая ссылка пойдёт в рекламу VK.' },
  ],
  'change-url-after-publish': [
    { slug: 'link-expiration-redirect', reason: 'Переключить назначение по заранее заданному сроку, если предложение ограничено во времени.' },
    { slug: 'ab-test-landing-pages', reason: 'Сравнить две посадочные на общем потоке, если новый адрес ещё предстоит выбрать.' },
    { slug: 'link-library-folders-tags', reason: 'Найти нужную рабочую ссылку и сверить её назначение перед изменением.' },
  ],
  'qr-with-analytics': [
    { slug: 'link-expiration-redirect', reason: 'Подготовить переход после окончания акции, когда печатный материал останется у аудитории.' },
    { slug: 'clicks-vs-metrika-visits', reason: 'Разобраться, почему переходы по ссылке отличаются от визитов на посадочной странице.' },
    { slug: 'geo-targeting-links', reason: 'Подготовить разные назначения для стран, если один QR используют в нескольких регионах.' },
  ],
  'link-preview-telegram-vk': [
    { slug: 'shorten-link-no-signup', reason: 'Получить короткий адрес для поста, если ссылка для публикации ещё не создана.' },
    { slug: 'utm-vk-ads', reason: 'Разметить рекламный переход из VK отдельно от оформления карточки ссылки.' },
    { slug: 'clicks-vs-metrika-visits', reason: 'Проверить расхождения в отчётах после публикации и учесть служебные открытия ссылки.' },
  ],
  'utm-vk-ads': [
    { slug: 'utm-in-yandex-direct-2026', reason: 'Перенести общую схему UTM в Яндекс Директ и проверить его динамические параметры.' },
    { slug: 'bulk-links-csv', reason: 'Подготовить и импортировать пачку ссылок, когда у кампании несколько объявлений.' },
    { slug: 'clicks-vs-metrika-visits', reason: 'Сверить смысл кликов и визитов, прежде чем оценивать запущенную рекламу.' },
  ],
  'utm-tilda-wordpress': [
    { slug: 'utm-vk-ads', reason: 'Проверить шаблон меток на входе, если заявки приходят из рекламы VK.' },
    { slug: 'link-analytics-csv', reason: 'Передать клиенту отчёт с периодом, выборкой и проверяемым итогом после настройки источников.' },
  ],
  'bulk-links-csv': [
    { slug: 'link-library-folders-tags', reason: 'Разложить импортированные ссылки по понятным папкам и тегам и быстро находить нужную.' },
    { slug: 'utm-vk-ads', reason: 'Проверить правила разметки VK до заполнения таблицы для массового импорта.' },
    { slug: 'link-expiration-redirect', reason: 'Настроить срок для акционных ссылок и проверить, куда они поведут после дедлайна.' },
  ],
  'clicks-vs-metrika-visits': [
    { slug: 'link-analytics-csv', reason: 'Выгрузить данные одной выборки и проверить итог по исходным строкам.' },
    { slug: 'utm-tilda-wordpress', reason: 'Проверить передачу источника в форму, если расхождение обнаружилось на уровне заявок.' },
  ],
  'ab-test-landing-pages': [
    { slug: 'clicks-vs-metrika-visits', reason: 'Развести клики и визиты перед расчётом конверсии двух вариантов.' },
    { slug: 'link-analytics-csv', reason: 'Сохранить выгрузку и условия расчёта, чтобы результаты сравнения можно было перепроверить.' },
  ],
  'link-expiration-redirect': [
    { slug: 'change-url-after-publish', reason: 'Поменять назначение вручную, когда исправить ссылку нужно сейчас, без ожидания срока.' },
    { slug: 'link-library-folders-tags', reason: 'Найти ссылки старой кампании и проверить, какое предложение за ними закреплено.' },
    { slug: 'qr-with-analytics', reason: 'Выбрать QR для печатной акции и учесть разницу между статическим и изменяемым кодом.' },
  ],
  'link-analytics-csv': [
    { slug: 'clicks-vs-metrika-visits', reason: 'Разобраться в показателях, если итог выгрузки сравнивают с другим отчётом аналитики.' },
    { slug: 'link-library-folders-tags', reason: 'Проверить папки, поиск и фильтры, чтобы в отчёт попали ссылки нужной кампании.' },
  ],
  'link-library-folders-tags': [
    { slug: 'bulk-links-csv', reason: 'Подготовить таблицу для следующей пачки ссылок и проверить её импорт.' },
    { slug: 'change-url-after-publish', reason: 'Изменить назначение найденной ссылки, сохранив её адрес в опубликованных материалах.' },
    { slug: 'link-preview-telegram-vk', reason: 'Проверить картинку и заголовок выбранной ссылки перед отправкой в Telegram или VK.' },
  ],
  'geo-targeting-links': [
    { slug: 'ab-test-landing-pages', reason: 'Настроить отдельное сравнение двух посадочных, если выбираете вариант для одной аудитории.' },
    { slug: 'utm-tilda-wordpress', reason: 'Передать метки в форму Tilda или WordPress на посадочной странице для нужной страны.' },
  ],
}

export function getRelatedBlogPosts(slug: string, publishedPosts: readonly BlogPost[]): RelatedBlogPost[] {
  const bySlug = new Map(publishedPosts.map(post => [post.slug, post]))
  const seen = new Set([slug])
  const links = Object.hasOwn(BLOG_RELATED_LINKS, slug) ? BLOG_RELATED_LINKS[slug] : []
  return links.flatMap(link => {
    const post = bySlug.get(link.slug)
    if (!post || seen.has(post.slug)) return []
    seen.add(post.slug)
    return [{ post, reason: link.reason }]
  })
}

import type { BlogPost } from '@/content/blog'
import { ORG_ID, type ArticleAuthor } from './schemas'

/** Editorial search summaries; article excerpts remain unchanged in visible content. */
export const BLOG_META_DESCRIPTIONS: Readonly<Record<string, string>> = {
  'custom-domains-for-short-links': 'Подключите свой домен к коротким ссылкам: DNS, статус подключения, HTTPS и диагностика ошибок. Что проверить перед запуском.',
  'bitly-not-working': 'Почему ссылка Bitly не открывается: диагностика сети и назначения. Что можно перенести, как сохранить UTM и проверить замену перед рассылкой.',
  'utm-in-yandex-direct-2026': 'UTM для Яндекс Директа: шаблон с динамическими параметрами, правила настройки ЕПК и проверка меток, перенаправлений и отчётов Метрики.',
  'shorten-link-no-signup': 'Как сократить длинную ссылку без регистрации, сохранить UTM-метки и проверить конечный адрес. Пошаговая инструкция со скриншотами RevRoute.',
  'change-url-after-publish': 'Как изменить целевой URL уже опубликованной короткой ссылки: сохранить прежний адрес, проверить UTM и убедиться, что новый переход работает.',
  'qr-with-analytics': 'Как создать QR-код с аналитикой в RevRoute: настроить цвет и логотип, разметить печатные материалы и проверить статистику переходов.',
  'link-preview-telegram-vk': 'Как проверить превью ссылки в Telegram и VK: заголовок, изображение, метаданные страницы и кэш карточки перед публикацией.',
  'utm-vk-ads': 'UTM для VK Рекламы: шаблон разметки, параметры кампании и объявления, проверка конечного URL и источника перед запуском.',
  'utm-tilda-wordpress': 'Как проверить UTM в Tilda и WordPress по всей цепочке: адрес страницы, данные формы, уведомление и источник заявки в CRM.',
  'bulk-links-csv': 'Как массово создать короткие ссылки с UTM: подготовить таблицу и CSV, сопоставить столбцы, проверить назначения и результат импорта.',
  'clicks-vs-metrika-visits': 'Почему клики по ссылке и визиты в Яндекс Метрике различаются: как сверить период, UTM, счётчик и условия учёта переходов.',
  'ab-test-landing-pages': 'A/B-тест лендингов через одну ссылку: как задать два URL, проверить переходы и сравнивать конверсии без поспешного выбора победителя.',
  'link-expiration-redirect': 'Срок действия ссылки: как задать дедлайн, настроить URL после истечения и проверить автоматический переход на актуальное предложение.',
  'link-analytics-csv': 'Экспорт аналитики ссылок в CSV: как выбрать период и метрику, скачать архив, проверить сумму кликов и подготовить отчёт клиенту.',
  'link-library-folders-tags': 'Папки, теги и поиск ссылок в RevRoute: учебный пример организации кампании, фильтры и проверка нужного адреса перед изменением.',
  'geo-targeting-links': 'Геотаргетинг ссылок в RevRoute: как добавить адреса для стран, задать запасное назначение и проверить фактический переход.',
}

export function blogMetaDescription(post: Pick<BlogPost, 'slug' | 'excerpt'>): string {
  return BLOG_META_DESCRIPTIONS[post.slug] ?? post.excerpt
}

export function blogSocialImagePath(slug: string): string {
  return `/blog/social/${slug}.png`
}

/** Structured data uses an article screenshot where one exists, then its social cover. */
export function blogArticleImage(post: Pick<BlogPost, 'slug' | 'content'>): string {
  const image = post.content.find((block) => block.type === 'image' && block.image.url.trim())
  return image?.type === 'image' ? image.image.url : blogSocialImagePath(post.slug)
}

/** Keep the original publication timestamp; never invent a modification date. */
export function blogPublishedAt(post: Pick<BlogPost, 'date' | 'dzen'>): string {
  return post.dzen?.publishedAt ?? post.date
}

export function blogArticleAuthor(author: BlogPost['author']): ArticleAuthor {
  return author.name === 'Команда RevRoute'
    ? { name: author.name, type: 'Organization', url: ORG_ID }
    : { name: author.name, type: 'Person', role: author.role }
}

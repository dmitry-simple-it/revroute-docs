import type { Metadata } from 'next'

/**
 * Дефолты метаданных всего сайта.
 *
 * Раньше жили в `app/layout.tsx` и наследовались всеми маршрутами. После
 * разведения корневого layout по группам ((landing), (marketing), (docs) —
 * каждая со своим `<html lang>`) единого родителя больше нет, и Next.js
 * наследовать метаданные между ветками не может. Поэтому дефолты вынесены
 * сюда и подмешиваются в каждую группу явно.
 *
 * Отсюда же их берёт `app/(docs)/[locale]/[[...mdxPath]]/page.tsx`: Next
 * заменяет `openGraph` страницы целиком, а не сливает с родительским, так что
 * `og:type` / `og:site_name` / `og:image` приходится повторять руками.
 */
export const siteMetadata: Metadata = {
  metadataBase: new URL('https://revroute.ru'),
  title: {
    default: 'Revroute — короткие ссылки, аналитика и партнёрские программы',
    template: '%s | Revroute',
  },
  description:
    'Revroute — платформа партнёрского маркетинга. Сокращение ссылок, аналитика конверсий и партнёрские программы.',
  openGraph: {
    type: 'website',
    siteName: 'Revroute',
    locale: 'ru_RU',
    url: 'https://revroute.ru',
    images: [
      {
        url: '/brand/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Revroute — платформа атрибуции маркетинговых ссылок и партнёрского маркетинга',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/brand/og-default.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
}

/**
 * Метаданные страницы без `<html lang="ru">` вокруг неё.
 * Отличие одно: `og:locale`. Всё остальное общее.
 */
export function siteMetadataForLocale(locale: string): Metadata {
  return {
    ...siteMetadata,
    openGraph: {
      ...siteMetadata.openGraph,
      locale: locale === 'en' ? 'en_US' : 'ru_RU',
    },
  }
}

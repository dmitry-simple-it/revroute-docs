import type { Metadata } from 'next'

/**
 * Open Graph для страницы.
 *
 * Next.js не сливает `openGraph` страницы с родительским layout, а заменяет
 * его целиком: стоит объявить на странице `openGraph: { url, images }`, и из
 * тега пропадают `og:site_name`, `og:locale`, `og:type` и размеры картинки,
 * заданные в app/layout.tsx. Поэтому все страницы задают OG через этот хелпер
 * — он повторяет дефолты корневого layout и меняет только адрес и картинку.
 *
 * @param path  путь страницы («/pricing»); становится og:url
 * @param image путь к своей OG-картинке; по умолчанию — общая
 */
export function og(path: string, image = '/brand/og-default.png'): NonNullable<Metadata['openGraph']> {
  return {
    type: 'website',
    siteName: 'RevRoute',
    locale: 'ru_RU',
    url: path,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: 'RevRoute — PRM-платформа партнёрского маркетинга',
      },
    ],
  }
}

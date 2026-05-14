import type { MetadataRoute } from 'next'

/**
 * Web App Manifest для revroute.ru.
 *
 * Next.js конвенция: этот файл автоматически отдаётся как `/manifest.webmanifest`
 * и `<link rel="manifest">` инжектится в `<head>` без правок в layout.
 *
 * TODO (дизайн):
 *   - Создать `app/icon.svg` (квадратный лого, монохром, 24×24 viewBox).
 *   - Создать иконки 192×192 и 512×512 PNG: положить в `public/icons/icon-192.png` и `public/icons/icon-512.png`.
 *     Сейчас единственный raster-лого `public/logos/favicon.png` имеет размер 32×32 — этого мало для PWA.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Revroute — короткие ссылки, аналитика и партнёрские программы',
    short_name: 'Revroute',
    description:
      'Российская платформа атрибуции маркетинговых ссылок и партнёрского маркетинга: короткие ссылки, аналитика конверсий и автоматические выплаты партнёрам.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#0c0a09',
    lang: 'ru',
    dir: 'ltr',
    categories: ['business', 'marketing', 'productivity'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/logos/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      // TODO: добавить, когда будут готовы иконки большего размера
      // {
      //   src: '/icons/icon-192.png',
      //   sizes: '192x192',
      //   type: 'image/png',
      //   purpose: 'any maskable',
      // },
      // {
      //   src: '/icons/icon-512.png',
      //   sizes: '512x512',
      //   type: 'image/png',
      //   purpose: 'any maskable',
      // },
    ],
  }
}

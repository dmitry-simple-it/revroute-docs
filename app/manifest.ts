import type { MetadataRoute } from 'next'

/**
 * Web App Manifest для revroute.ru.
 *
 * Next.js конвенция: этот файл автоматически отдаётся как `/manifest.webmanifest`
 * и `<link rel="manifest">` инжектится в `<head>` без правок в layout.
 *
 * Все brand-ассеты — из единого источника `public/brand/` (см. `public/brand/README.md`).
 * Master Figma-файл: см. `public/brand/source/figma.md`.
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
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/brand/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/brand/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

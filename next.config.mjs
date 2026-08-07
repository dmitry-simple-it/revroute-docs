import { readFileSync } from 'node:fs'
import nextra from 'nextra'

const withNextra = nextra({
  staticImage: false,
})

/**
 * Легаси-URL (93 записи, миграция со старой справки).
 * Читаем тем же файлом, что и middleware.ts, — источник правды один.
 */
const legacyRedirects = JSON.parse(
  readFileSync(new URL('./redirects.json', import.meta.url), 'utf8'),
)

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Ключ читает Nextra (nextra/dist/server/index.js) и прокидывает как
  // NEXTRA_LOCALES / NEXTRA_DEFAULT_LOCALE; в сам Next он не попадает — удалять нельзя.
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      // Легаси-URL без префикса локали разворачиваем в плоские правила и ставим
      // ВЫШЕ общих /help/:path*, иначе получается два хопа:
      // /help/article/X → (308) /ru/help/article/X → (301, middleware) /ru/help/<новый путь>.
      // Здесь — один хоп сразу на конечный русский путь.
      // Префиксованные варианты (/ru/…, /en/…) сюда не попадают: Nextra затирает
      // ключ i18n перед передачей в Next, поэтому source матчится буквально.
      // Их обрабатывает middleware.ts, сохраняя префикс локали.
      ...Object.entries(legacyRedirects).map(([source, destination]) => ({
        source,
        destination: `/ru${destination}`,
        permanent: true,
      })),
      { source: '/docs', destination: '/ru/docs', permanent: true },
      { source: '/docs/:path*', destination: '/ru/docs/:path*', permanent: true },
      { source: '/help', destination: '/ru/help', permanent: true },
      { source: '/help/:path*', destination: '/ru/help/:path*', permanent: true },
    ]
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { hostname: 'assets.dub.co' },
      { hostname: 'dubassets.com' },
      // { hostname: 's3.revroute.ru' },
    ],
  },
}

export default withNextra(nextConfig)

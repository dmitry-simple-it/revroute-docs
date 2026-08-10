import { readFileSync } from 'node:fs'
import nextra from 'nextra'

const withNextra = nextra({
  staticImage: false,
})

/**
 * Легаси-URL (109 записей: миграция со старой справки плюс снятые разделы docs).
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
      // Страница /analytics удалена: «Аналитика» — не отдельный продукт, а
      // сквозной инструмент внутри коротких ссылок и PRM-платформы. Аналитика
      // переходов и конверсий описана на /links, поэтому 301 ведёт туда.
      // Правило стоит ПОСЛЕ /docs и /help: пересечений по source нет, а
      // редиректы next.config отрабатывают раньше middleware.ts —
      // поэтому запись '/analytics' в MARKETING_PATHS больше не нужна.
      { source: '/analytics', destination: '/links', permanent: true },
      // Хаб /solutions удалён (решение владельца 09.08.2026): после чистки
      // футера на него не вело ни одной ссылки, а под ним живёт единственное
      // актуальное решение. Правило только для точного пути — дочерние
      // /solutions/:slug продолжают работать (Next матчит source буквально).
      // Запись '/solutions' в MARKETING_PATHS нужна и дальше: там префиксное
      // сравнение, и без неё дети уехали бы в локали-роутинг.
      { source: '/solutions', destination: '/solutions/saas', permanent: true },
      // Посадочные Директа переехали под /tools (решение владельца 10.08.2026:
      // все инструменты живут под одним префиксом; заодно '/tools' в
      // WEBVISOR_PATHS покрывает их Вебвизором без правок). Адреса /qr и
      // /links/krasivaya-ssylka на прод не выкладывались, но успели уехать в
      // PR-комментарии и обсуждение кампании — держим 301, чтобы ни одна
      // сохранённая ссылка не упёрлась в 404.
      { source: '/qr', destination: '/tools/qr', permanent: true },
      { source: '/links/krasivaya-ssylka', destination: '/tools/krasivaya-ssylka', permanent: true },
    ]
  },
  images: {
    qualities: [75, 90],
    // AVIF первым, WebP запасным: браузер получает то, что понимает, остальные —
    // исходный формат. Кодирование делает sharp (он трассируется в
    // .next/standalone/node_modules/sharp), результат кладётся в кэш оптимизатора.
    formats: ['image/avif', 'image/webp'],
    // Было по умолчанию 60 секунд: оптимизированная картинка выпадала из кэша
    // через минуту и пересобиралась заново. 31 день — и на диске сервера,
    // и в Cache-Control, который Next отдаёт на /_next/image.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    remotePatterns: [
      { hostname: 'assets.dub.co' },
      { hostname: 'dubassets.com' },
      // { hostname: 's3.revroute.ru' },
    ],
  },
  /**
   * Кэш статики из public/.
   *
   * ОГРАНИЧЕНИЕ: перед контейнером на проде стоит реверс-прокси (Caddy/nginx,
   * `proxy_pass http://127.0.0.1:3335` — см. docker-compose.yml), его конфиг
   * лежит ВНЕ этого репозитория. Файлы из public/ отдаёт сам Next
   * (output: 'standalone', `node server.js`), поэтому заголовки ниже доезжают
   * до браузера как есть — при условии, что прокси их не переписывает.
   * Если на прокси когда-нибудь появится `header Cache-Control ...` для этих
   * путей, правила придётся дублировать там.
   *
   * Правила ниже намеренно покрывают только пять префиксов. Под них не
   * попадают и не должны попадать:
   *   - llms.txt, llms-full.txt, favicon.ico — лежат в корне public/;
   *   - robots.txt и sitemap.xml — это НЕ файлы в public/, их отдают
   *     роут-хендлеры app/robots.ts и app/sitemap.ts (Next сам ставит им
   *     `public, max-age=0, must-revalidate`).
   * Все пятеро перегенерируются на каждой сборке и должны перечитываться.
   */
  async headers() {
    // Контент по этим путям меняется только вместе с именем файла.
    const immutable = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ]
    // Скриншоты продукта иногда перезаписываются по тому же пути (см. историю
    // public/images/screenshots/ru/), поэтому без immutable и с горизонтом
    // в 30 дней, а не в год.
    const longLived = [
      { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
    ]
    return [
      { source: '/fonts/:path*', headers: immutable },
      { source: '/brand/:path*', headers: immutable },
      { source: '/ds/:path*', headers: immutable },
      { source: '/videos/:path*', headers: immutable },
      { source: '/images/:path*', headers: longLived },
    ]
  },
}

export default withNextra(nextConfig)

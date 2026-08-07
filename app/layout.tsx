import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics as DubAnalytics } from '@dub/analytics/react'
import { Onest, Playfair_Display } from 'next/font/google'
import { Head } from 'nextra/components'
import { Suspense } from 'react'
import { LandingAnalytics } from '@/components/analytics/LandingAnalytics'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { organization, website } from '@/lib/seo/schemas'
import { YandexMetrika } from '@/components/marketing/YandexMetrika'
import { YandexMetrikaPageView } from '@/components/marketing/YandexMetrikaPageView'
import { CookieConsent } from '@/components/marketing/CookieConsent'
import './globals.css'

/**
 * Гарнитуры сайта. Требование №1 — кириллица: контент лендинга и доков русский.
 *
 * До этого здесь стояли DM Sans и Instrument Serif. В каталоге Google Fonts у обеих
 * есть только latin и latin-ext (проверяется по
 * node_modules/next/dist/compiled/@next/font/dist/google/font-data.json), поэтому весь
 * русский текст доставался метрическим фолбэкам, которые генерит next/font, — в собранном
 * CSS это @font-face "DM Sans Fallback": local("Arial") + size-adjust 104.53% и
 * "Instrument Serif Fallback": local("Times New Roman") + size-adjust 83.94%.
 * Латинские woff2 (37,0 + 18,2 КБ DM Sans и 15,0 + 15,7 КБ Instrument Serif — размеры
 * сняты с собранных файлов) грузились ради горстки глифов вроде «Revroute» и «PRM».
 *
 * Замена подобрана по метрикам из next/dist/server/capsize-font-metrics.json,
 * чтобы вёрстка, рассчитанная на прежние гарнитуры, не поехала:
 *   DM Sans          cap .700  xH .504  xWidthAvg .466  desc −.310
 *   Onest            cap .707  xH .527  xWidthAvg .469  desc −.305   ← ближайший гротеск с кириллицей
 *   Instrument Serif cap .720  xH .510
 *   Playfair Display cap .708  xH .514                               ← ближайший display-серив с кириллицей и настоящим италиком
 */
const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
})

// Все потребители --font-display задают fontWeight: 400 / font-normal, поэтому берём
// статическое начертание 400 (не variable) — это два файла на сабсет вместо переменного.
// Италик нужен: им набраны акценты <em> в заголовках секций.
//
// preload: false — сознательно. Гарнитуры объявлены в корневом layout, значит preload
// уходил бы на каждом маршруте, а --font-display читают только легаси-страницы
// (blog, glossary, compare, customers, integrations, analytics, …). На /, /prm, /pricing
// и в 322 страницах доков он не используется вообще: там DS-скоуп со своим Geist.
// Замеряно на /prm: с preload все 6 woff2 (111,7 КБ) качались вхолостую.
// Текст не пропадёт — display: swap плюс метрический фолбэк от next/font
// (@font-face "Playfair Display Fallback": local("Times New Roman") + size-adjust).
const playfairDisplay = Playfair_Display({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" dir="ltr" suppressHydrationWarning className={`${onest.variable} ${playfairDisplay.variable}`}>
      {/* Nextra's <Head /> must be a sibling of <body>, NOT inside it.
          It renders the <head> element with theme-aware meta tags, color scheme,
          and Nextra's runtime styles. Previously this was inside the docs locale
          layout (nested inside <body>) — caused "<head> cannot be a child of
          <body>" hydration error on 404 pages and other edge cases. */}
      <Head />
      <body>
        {/* Глобальные @id-узлы schema.org: на них ссылаются provider/publisher/brand
            в JSON-LD страниц (lib/seo/schemas.ts). */}
        <JsonLd data={[organization(), website()]} />
        {children}
        <LandingAnalytics />
        <CookieConsent />
        <DubAnalytics
          publishableKey="dub_pk_5V0LqJ8m97GmSh4HynMlY7th"
          domainsConfig={{
            refer: "go.revroute.ru",
          }}
          cookieOptions={{
            domain: ".revroute.ru",
          }}
        />
        <YandexMetrika />
        <Suspense fallback={null}>
          <YandexMetrikaPageView />
        </Suspense>
      </body>
    </html>
  )
}

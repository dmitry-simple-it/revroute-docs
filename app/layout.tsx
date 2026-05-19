import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics as DubAnalytics } from '@dub/analytics/react'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import { Head } from 'nextra/components'
import { Suspense } from 'react'
import { LandingAnalytics } from '@/components/analytics/LandingAnalytics'
import { YandexMetrika } from '@/components/marketing/YandexMetrika'
import { YandexMetrikaPageView } from '@/components/marketing/YandexMetrikaPageView'
import { CookieConsent } from '@/components/marketing/CookieConsent'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
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
        url: '/images/screenshots/analytics-conversions.png',
        width: 1731,
        height: 909,
        alt: 'Аналитика и конверсии в Revroute',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/screenshots/analytics-conversions.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" dir="ltr" suppressHydrationWarning className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      {/* Nextra's <Head /> must be a sibling of <body>, NOT inside it.
          It renders the <head> element with theme-aware meta tags, color scheme,
          and Nextra's runtime styles. Previously this was inside the docs locale
          layout (nested inside <body>) — caused "<head> cannot be a child of
          <body>" hydration error on 404 pages and other edge cases. */}
      <Head />
      <body>
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

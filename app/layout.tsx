import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics as DubAnalytics } from '@dub/analytics/react'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
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
    <html lang="ru" dir="ltr" suppressHydrationWarning className={`${dmSans.variable} ${instrumentSerif.variable}`}>
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

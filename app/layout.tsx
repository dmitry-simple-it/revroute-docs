import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics as DubAnalytics } from '@dub/analytics/react'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
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
    'Платформа для управления ссылками нового поколения. Короткие ссылки, аналитика конверсий и партнёрские программы — в одном сервисе.',
  openGraph: {
    type: 'website',
    siteName: 'Revroute',
    locale: 'ru_RU',
    url: 'https://revroute.ru',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" dir="ltr" suppressHydrationWarning className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body>
        {children}
      </body>
      <DubAnalytics
        publishableKey="dub_pk_5V0LqJ8m97GmSh4HynMlY7th"
        domainsConfig={{
          refer: "go.revroute.ru",
        }}
        cookieOptions={{
          domain: ".revroute.ru",
        }}
      />
    </html>
  )
}

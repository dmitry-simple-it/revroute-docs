import type { ReactNode } from 'react'
import type { Metadata } from 'next'
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
  title: {
    default: 'Revroute',
    template: '%s | Revroute',
  },
  description: 'Платформа для управления ссылками нового поколения. Короткие ссылки, аналитика конверсий и партнёрские программы.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" dir="ltr" suppressHydrationWarning className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}

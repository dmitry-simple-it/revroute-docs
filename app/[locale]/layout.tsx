import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { LocaleSwitcher } from '../../components/LocaleSwitcher'
import 'nextra-theme-docs/style.css'

export const metadata: Metadata = {
  title: {
    default: 'RevRoute Docs',
    template: '%s | RevRoute Docs',
  },
  description: 'RevRoute documentation and help center',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={
            <Navbar logo={<b>RevRoute</b>}>
              <a href={`/${locale}/docs`} style={{ fontSize: '0.875rem' }}>
                {locale === 'ru' ? 'Документация' : 'Developer Docs'}
              </a>
              <a href={`/${locale}/help`} style={{ fontSize: '0.875rem' }}>
                {locale === 'ru' ? 'Центр помощи' : 'Help Center'}
              </a>
              <LocaleSwitcher />
            </Navbar>
          }
          pageMap={await getPageMap(`/${locale}`)}
          docsRepositoryBase="https://github.com/your-org/revroute-docs/tree/main"
          footer={<Footer>&copy; {new Date().getFullYear()} RevRoute</Footer>}
          search={<Search />}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

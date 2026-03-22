import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { LocaleSwitcher } from '../../../components/LocaleSwitcher'
import 'nextra-theme-docs/style.css'

export const metadata: Metadata = {
  title: {
    default: 'Revroute Docs',
    template: '%s | Revroute Docs',
  },
  description: 'Revroute documentation and help center',
}

export default async function DocsLocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <>
      <Head />
      <Layout
        navbar={
          <Navbar logo={<b>Revroute</b>}>
            <a href="/" style={{ fontSize: '0.875rem' }}>
              {locale === 'ru' ? 'Главная' : 'Home'}
            </a>
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
        footer={<Footer>&copy; {new Date().getFullYear()} Revroute</Footer>}
        search={<Search />}
      >
        {children}
      </Layout>
    </>
  )
}

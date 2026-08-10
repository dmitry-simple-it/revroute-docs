import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { RootDocument } from '@/components/RootDocument'
import { siteMetadata } from '@/lib/seo/defaults'

/**
 * Корневой layout легаси-маркетинга: рендерит <html>/<body> через RootDocument.
 * Группа русскоязычная целиком (см. CLAUDE.md → «Маркетинг-лендинг»), поэтому
 * lang зафиксирован.
 */
export const metadata: Metadata = siteMetadata

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument locale="ru">
      <MarketingHeader />
      <main className="min-w-0 overflow-x-hidden">{children}</main>
      <MarketingFooter />
    </RootDocument>
  )
}

import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Nav } from '@/components/ds/Nav'
import { Footer } from '@/components/ds/Footer'
import { RootDocument } from '@/components/RootDocument'
import { siteMetadata } from '@/lib/seo/defaults'
import '@/components/ds/ds.css'

/**
 * Design System v2 surface. New marketing pages live here and get the DS-v2
 * shell (Nav + Footer) inside a `.ds-scope` wrapper that carries all v2 tokens
 * and the Geist font — fully isolated from the legacy (marketing) pages, which
 * keep their own styling. Add new v2 pages under app/(landing)/… and register
 * their path in middleware MARKETING_PATHS.
 *
 * Это КОРНЕВОЙ layout группы: он рендерит <html>/<body> (см. RootDocument).
 * Общего `app/layout.tsx` больше нет — локаль документа у групп разная, а
 * узнать её в общем корне нечем (см. комментарий в RootDocument). Лендинг
 * русскоязычный целиком, поэтому locale здесь не параметризован.
 *
 * ОСТОРОЖНО с `title.template` из siteMetadata («%s | Revroute»). Next не
 * применяет шаблон к тому сегменту маршрута, в котором он объявлен, — только к
 * дочерним. Раньше шаблон жил в `app/layout.tsx`, а страницы лежали внутри
 * группы `(landing)`, то есть сегментом ниже, и он к ним доклеивался. Теперь
 * layout и `page.tsx` главной лежат в одном каталоге = в одном сегменте «/»,
 * поэтому на главной бренд шаблоном НЕ добавляется и вписан прямо в строку
 * заголовка (см. `app/(landing)/page.tsx`). На /prm, /pricing и остальных
 * дочерних маршрутах шаблон работает как прежде.
 */
export const metadata: Metadata = siteMetadata

export default function LandingV2Layout({ children }: { children: ReactNode }) {
  return (
    <RootDocument locale="ru">
      <div className="ds-scope">
        <div className="ds-topwash" aria-hidden />
        <Nav />
        <main className="min-w-0">{children}</main>
        <Footer />
      </div>
    </RootDocument>
  )
}

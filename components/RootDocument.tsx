import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Analytics as DubAnalytics } from '@dub/analytics/react'
import { Head } from 'nextra/components'
import { LandingAnalytics } from '@/components/analytics/LandingAnalytics'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { organization, website } from '@/lib/seo/schemas'
import { YandexMetrika } from '@/components/marketing/YandexMetrika'
import { YandexMetrikaPageView } from '@/components/marketing/YandexMetrikaPageView'
import { CookieConsent } from '@/components/marketing/CookieConsent'
import { fontVariables } from '@/lib/fonts'
import '@/app/globals.css'

/** BCP-47 для <html lang> и для inLanguage в JSON-LD. */
const HTML_LANG: Record<string, string> = { ru: 'ru', en: 'en' }
const IN_LANGUAGE: Record<string, string> = { ru: 'ru-RU', en: 'en' }

/**
 * Единственная реализация корневого документа: <html>, <head> Nextra, <body>,
 * глобальный JSON-LD и все счётчики.
 *
 * Зачем вообще отдельный компонент. Корневых layout в приложении три —
 * `app/(landing)/layout.tsx`, `app/(marketing)/layout.tsx` и
 * `app/(docs)/[locale]/layout.tsx`. Так сделано ровно ради одного атрибута:
 * до этого `app/layout.tsx` хардкодил `lang="ru"`, и 148 английских страниц
 * докс объявляли себя русскими (заодно Pagefind индексировал их русским
 * стеммером). Прочитать локаль в общем корневом layout нечем: `params` там
 * недоступны, а `headers()` снял бы статическую генерацию со всего дерева,
 * включая ~40 статических лендингов. Отдельный корень на группу — это
 * штатный способ App Router; чтобы содержимое не разъехалось по трём копиям,
 * оно лежит здесь.
 *
 * Порядок узлов в <body> и состав скриптов повторяют прежний
 * `app/layout.tsx` один в один.
 */
export function RootDocument({
  locale = 'ru',
  children,
}: {
  /** Локаль документа: 'ru' | 'en'. Лендинг и маркетинг — всегда 'ru'. */
  locale?: string
  children: ReactNode
}) {
  const lang = HTML_LANG[locale] ?? 'ru'
  return (
    <html
      lang={lang}
      dir="ltr"
      suppressHydrationWarning
      className={fontVariables}
    >
      {/* Nextra's <Head /> must be a sibling of <body>, NOT inside it.
          It renders the <head> element with theme-aware meta tags, color scheme,
          and Nextra's runtime styles. Previously this was inside the docs locale
          layout (nested inside <body>) — caused "<head> cannot be a child of
          <body>" hydration error on 404 pages and other edge cases. */}
      <Head />
      <body>
        {/* Глобальные @id-узлы schema.org: на них ссылаются provider/publisher/brand
            в JSON-LD страниц (lib/seo/schemas.ts). Рендерится ровно один раз на
            документ — каждая страница проходит через один корневой layout. */}
        <JsonLd data={[organization(), website(IN_LANGUAGE[lang] ?? 'ru-RU')]} />
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

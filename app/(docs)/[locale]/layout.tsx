import { readdirSync, type Dirent } from 'node:fs'
import { join } from 'node:path'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { LocaleSwitcher } from '../../../components/LocaleSwitcher'
import { RootDocument } from '@/components/RootDocument'
import { siteMetadataForLocale } from '@/lib/seo/defaults'
import 'nextra-theme-docs/style.css'

/** Локали докс-раздела. Сегмент [locale] ловит любой неизвестный путь верхнего
 *  уровня (например /tools), поэтому значение обязательно проверяется. */
const LOCALES = ['ru', 'en']

const CONTENT_ROOT = join(process.cwd(), 'content')

/**
 * Маршруты локали без префикса: content/ru/docs/guides/index.mdx → /docs/guides.
 *
 * Обход рукописный, БЕЗ `fs.globSync`: глоб появился в Node 22, а рантайм-образ
 * прод-сборки — `node:20-slim` (Dockerfile.serve). Там `globSync` === undefined,
 * и вызов ронял бы layout: любой несуществующий /ru/*, /en/* отдавал бы 500
 * вместо 404 (ровно та регрессия, которую закрыл коммит 29d53af).
 *
 * Каталога content/ в standalone-образе тоже нет — он нужен только на сборке.
 * Поэтому ошибка чтения не пробрасывается: пустой список означает «зеркала не
 * проверяем», и переключатель просто показывает обе локали, как до правки.
 */
function routesOf(locale: string): Set<string> {
  const routes = new Set<string>()

  const walk = (dir: string, prefix: string) => {
    let entries: Dirent[]
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(join(dir, entry.name), `${prefix}/${entry.name}`)
      } else if (entry.name.endsWith('.mdx')) {
        routes.add(
          entry.name === 'index.mdx' ? prefix || '/' : `${prefix}/${entry.name.slice(0, -4)}`,
        )
      }
    }
  }

  walk(join(CONTENT_ROOT, locale), '')
  return routes
}

let mirrorGapsCache: Record<string, string[]> | null = null

/**
 * Для каждой локали — список маршрутов, которых в ней НЕТ, хотя они есть в
 * другой. LocaleSwitcher по этому списку не рисует ссылку-переключатель:
 * иначе на 26 русских страницах без английского зеркала (вся справка по API,
 * клиентский SDK и раздел /legal) в HTML появилась бы crawlable-ссылка в 404.
 */
function mirrorGaps(): Record<string, string[]> {
  if (mirrorGapsCache) return mirrorGapsCache
  const byLocale = new Map(LOCALES.map(locale => [locale, routesOf(locale)]))
  mirrorGapsCache = Object.fromEntries(
    LOCALES.map(target => [
      target,
      LOCALES.filter(source => source !== target).flatMap(source =>
        [...(byLocale.get(source) ?? [])].filter(route => !byLocale.get(target)?.has(route)),
      ),
    ]),
  )
  return mirrorGapsCache
}

/**
 * Дефолты метаданных докс-раздела — по локали.
 *
 * Раньше здесь стоял один статический объект с английским описанием
 * «Revroute documentation and help center». Оно уезжало на КАЖДУЮ страницу без
 * своего `description` во frontmatter, включая русские: в русской выдаче под
 * русским заголовком стоял английский текст.
 *
 * Шаблон заголовка тоже разведён по локалям. Дубль бренда («Центр помощи
 * Revroute | Revroute Docs») снимается не здесь, а в
 * `[[...mdxPath]]/page.tsx`: если заголовок страницы уже содержит «Revroute»,
 * он отдаётся как `title.absolute` и шаблон не применяется.
 */
const DOCS_METADATA: Record<string, { title: string; template: string; description: string }> = {
  ru: {
    title: 'Документация и справка Revroute',
    template: '%s | Документация Revroute',
    description:
      'Документация и центр помощи Revroute: короткие ссылки, аналитика переходов и конверсий, партнёрские программы, API и SDK.',
  },
  en: {
    title: 'Revroute Docs',
    template: '%s | Revroute Docs',
    description:
      'Revroute documentation and help center: short links, click and conversion analytics, partner programs, API and SDKs.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const defaults = DOCS_METADATA[locale] ?? DOCS_METADATA.en
  // Этот layout — КОРНЕВОЙ для ветки докс, наследовать metadataBase, icons,
  // twitter и дефолтный openGraph больше не у кого: общий app/layout.tsx
  // упразднён. Поэтому дефолты сайта подмешиваются явно, а og:locale берётся
  // из локали маршрута — так же, как <html lang>.
  return {
    ...siteMetadataForLocale(locale),
    title: {
      default: defaults.title,
      template: defaults.template,
    },
    description: defaults.description,
  }
}

export default async function DocsLocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Сегмент [locale] ловит ЛЮБОЙ неизвестный путь верхнего уровня (/tools,
  // /solutions). Для них отдаём голый документ, без оболочки Nextra:
  // getPageMap('/tools') валится с TypeError и отдал бы 500 вместо 404.
  //
  // Звать здесь notFound() НЕЛЬЗЯ: граница not-found сегмента [locale] лежит
  // ВНУТРИ этого layout и его собственное исключение не ловит — 404 выродилась
  // бы в голую страницу Next без вёрстки и заголовка. Статус 404 ставит сам
  // page.tsx: он для неизвестной локали зовёт notFound(), а это исключение
  // граница уже перехватывает.
  if (!LOCALES.includes(locale)) {
    return <RootDocument locale="ru">{children}</RootDocument>
  }
  return (
    /* Корневой layout ветки докс: <html lang> здесь — единственная причина,
       по которой корневых layout стало три. 148 английских страниц раньше
       отдавали lang="ru" и og:locale=ru_RU, потому что общий app/layout.tsx
       хардкодил локаль; заодно Pagefind собирал один русский индекс на все 322
       страницы. Локаль читаем из params — статическая генерация сохраняется
       (headers() её бы снял со всего дерева). */
    <RootDocument locale={locale}>
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
            <LocaleSwitcher missingIn={mirrorGaps()} />
          </Navbar>
        }
        pageMap={await getPageMap(`/${locale}`)}
        editLink={null}
        feedback={{ content: null }}
        footer={<Footer>&copy; {new Date().getFullYear()} Revroute</Footer>}
        search={<Search />}
      >
        {children}
      </Layout>
    </RootDocument>
  )
}

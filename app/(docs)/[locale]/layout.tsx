import { readdirSync, type Dirent } from 'node:fs'
import { join } from 'node:path'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import type { PageMapItem } from 'nextra'
import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs'
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
 * иначе на русских страницах без английского зеркала (вся справка по API,
 * Гайды, клиентский SDK и раздел /legal) в HTML появилась бы crawlable-ссылка
 * в 404.
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
/**
 * В оболочку Nextra отдаём только контентные ветки. Nextra сканирует app/**
 * для КАЖДОЙ локали (nextra/dist/server/loader.js), поэтому в pageMap попадают
 * все маркетинговые app-роуты (/pricing, /blog, /tools/*…) с их metadata.title —
 * они засоряли сайдбар, мобильное меню и цепочку next/prev. Ветки заданы
 * allowlist'ом: новый маркетинговый роут в меню доков не просочится сам.
 * Элемент { data } (распарсенный content/<locale>/_meta.js) обязан остаться —
 * из него normalizePages берёт заголовки веток и type:'page' для «Главной».
 */
const CONTENT_BRANCHES = new Set(['index', 'docs', 'help', 'legal'])

function contentOnly(items: PageMapItem[]): PageMapItem[] {
  return items.filter(
    item => 'data' in item || ('name' in item && CONTENT_BRANCHES.has(item.name)),
  )
}

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
          /* Текстовые ссылки скрыты на мобиле (max-md:hidden): на 375px они
             не влезали — лого обрезалось, «Центр помощи» шёл в две строки.
             В мобильном меню все четыре пункта и так есть (pageMap). */
          <Navbar logo={<b className="whitespace-nowrap">Revroute</b>}>
            <a href="/" className="text-sm whitespace-nowrap max-md:hidden">
              {locale === 'ru' ? 'Главная' : 'Home'}
            </a>
            <a href={`/${locale}/docs`} className="text-sm whitespace-nowrap max-md:hidden">
              {locale === 'ru' ? 'Документация' : 'Developer Docs'}
            </a>
            <a href={`/${locale}/help`} className="text-sm whitespace-nowrap max-md:hidden">
              {locale === 'ru' ? 'Центр помощи' : 'Help Center'}
            </a>
            <LocaleSwitcher missingIn={mirrorGaps()} />
          </Navbar>
        }
        pageMap={contentOnly(await getPageMap(`/${locale}`))}
        /* Аккордеон: раскрыта только активная ветка. Без пропа действовали
           дефолты темы (level=2, autoCollapse=false) — всё дерево стояло
           развёрнутым. */
        sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
        /* Строки «Copy page»/«Open in ChatGPT…» захардкожены в теме
           по-английски без пропов локализации — для RU кнопку выключаем. */
        copyPageButton={locale === 'en'}
        themeSwitch={
          locale === 'ru'
            ? { light: 'Светлая', dark: 'Тёмная', system: 'Системная' }
            : undefined
        }
        editLink={null}
        feedback={{ content: null }}
        footer={
          <Footer>
            &copy; {new Date().getFullYear()} Revroute.{' '}
            {locale === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
          </Footer>
        }
        lastUpdated={
          <LastUpdated locale={locale}>
            {locale === 'ru' ? 'Обновлено' : 'Last updated on'}
          </LastUpdated>
        }
        search={
          <Search
            placeholder={
              locale === 'ru' ? 'Поиск по документации…' : 'Search documentation…'
            }
            emptyResult={locale === 'ru' ? 'Ничего не найдено.' : 'No results found.'}
            errorText={
              locale === 'ru'
                ? 'Не удалось загрузить поисковый индекс.'
                : 'Failed to load search index.'
            }
            loading={locale === 'ru' ? 'Загрузка…' : 'Loading…'}
          />
        }
        /* Строки боковой навигации по заголовкам зашиты в теме по-английски —
           пропсами переводим их под локаль маршрута. */
        toc={{
          title: locale === 'ru' ? 'Содержание' : 'On This Page',
          backToTop: locale === 'ru' ? 'Наверх' : 'Scroll to top',
        }}
      >
        {children}
      </Layout>
    </RootDocument>
  )
}

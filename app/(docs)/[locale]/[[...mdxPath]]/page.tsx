import { existsSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { getPageMap } from 'nextra/page-map'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { siteMetadata } from '@/lib/seo/defaults'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs } from '@/lib/seo/schemas'

export const generateStaticParams = generateStaticParamsFor('mdxPath', 'locale')

const CONTENT_ROOT = join(process.cwd(), 'content')

/**
 * Локали докс-раздела и их BCP-47 коды для hreflang.
 * RU намеренно с регионом (`ru-RU`) — целевой рынок РФ; EN без региона, чтобы
 * английская версия матчилась на всех англоязычных, а не только на США.
 */
const HREFLANG: Record<string, string> = { ru: 'ru-RU', en: 'en' }

/**
 * Есть ли страница в указанной локали.
 * Nextra отдаёт один и тот же URL и для `<rest>.mdx`, и для `<rest>/index.mdx`,
 * поэтому проверяем оба варианта.
 */
function pageExists(locale: string, rest: string[]): boolean {
  if (!(locale in HREFLANG)) return false
  // Сегменты приходят из URL — не выпускаем проверку за пределы content/.
  if (rest.some(s => !s || s === '.' || s === '..' || s.includes('/') || s.includes('\\'))) {
    return false
  }
  const base = join(CONTENT_ROOT, locale, ...rest)
  return existsSync(`${base}.mdx`) || existsSync(join(base, 'index.mdx'))
}

/** Название корневой крошки — сайт, а не докс-раздел. */
const HOME_CRUMB: Record<string, string> = { ru: 'Главная', en: 'Home' }

/**
 * Узел page map Nextra. Три вида: `{ data }` — разобранный `_meta.js` уровня,
 * `{ name, route, title }` — страница, `{ name, children }` — папка.
 */
type PageMapNode = {
  name?: string
  title?: string
  children?: PageMapNode[]
  data?: Record<string, unknown>
}

/**
 * Заголовки крошек по сегментам URL.
 *
 * Источник правды — тот же page map, по которому строится сайдбар, поэтому
 * названия в микроразметке совпадают с видимой навигацией (требование Google
 * к BreadcrumbList). Приоритет: `_meta.js` уровня → `title` самого узла →
 * сегмент как есть.
 */
function crumbTitles(pageMap: PageMapNode[], segments: string[]): string[] {
  const titles: string[] = []
  let level: PageMapNode[] = pageMap

  for (const segment of segments) {
    const meta = level.find(node => node.data)?.data
    const node = level.find(n => n.name === segment)
    const entry = meta?.[segment]
    const fromMeta =
      typeof entry === 'string'
        ? entry
        : typeof (entry as { title?: unknown })?.title === 'string'
          ? ((entry as { title: string }).title)
          : undefined

    titles.push(fromMeta ?? node?.title ?? segment)
    level = node?.children ?? []
  }

  return titles
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; mdxPath?: string[] }>
}) {
  const params = await props.params
  // Сегмент [locale] ловит ЛЮБОЙ неизвестный путь верхнего уровня: /tools,
  // /solutions и прочие маркетинговые пути без своей страницы приходят сюда
  // с locale='tools'. Без этой проверки Nextra падает с TypeError и отдаёт
  // 500 вместо 404.
  if (!(params.locale in HREFLANG)) notFound()
  const { metadata } = await importPage(params.mdxPath, params.locale)

  const rest = params.mdxPath ?? []
  const suffix = rest.length > 0 ? `/${rest.join('/')}` : ''
  const selfPath = `/${params.locale}${suffix}`

  // hreflang отдаём только если зеркало реально существует: Google отбрасывает
  // всю языковую группу целиком, если хотя бы один URL в ней отвечает 404.
  const hasMirror = Object.keys(HREFLANG).every(locale => pageExists(locale, rest))

  const languages = hasMirror
    ? {
        ...Object.fromEntries(
          Object.entries(HREFLANG).map(([locale, tag]) => [tag, `/${locale}${suffix}`]),
        ),
        // Рынок РФ — по умолчанию русская версия.
        'x-default': `/ru${suffix}`,
      }
    : undefined

  // Шаблон заголовка из layout («%s | Документация Revroute») на страницах,
  // чей собственный title уже содержит бренд, давал дубль: «Центр помощи
  // Revroute | Revroute Docs». Такие заголовки отдаём как absolute — шаблон к
  // ним не применяется. Правка одна на все 322 страницы, frontmatter не трогаем.
  const ownTitle = typeof metadata?.title === 'string' ? metadata.title : undefined
  const title =
    ownTitle && /revroute/i.test(ownTitle) ? { absolute: ownTitle } : metadata?.title

  return {
    ...metadata,
    ...(title !== undefined ? { title } : {}),
    alternates: {
      ...metadata?.alternates,
      canonical: selfPath,
      languages,
    },
    // Next.js не сливает openGraph с родительским layout, а заменяет его целиком.
    // Поэтому подмешиваем дефолты сайта (og:type, og:site_name, og:image),
    // иначе они пропали бы со всех страниц докс. Источник — lib/seo/defaults:
    // общего app/layout.tsx больше нет, у каждой группы маршрутов свой корень.
    openGraph: {
      ...siteMetadata.openGraph,
      ...metadata?.openGraph,
      locale: params.locale === 'en' ? 'en_US' : 'ru_RU',
      url: selfPath,
    },
  }
}

export default async function Page(props: {
  params: Promise<{ locale: string; mdxPath?: string[] }>
}) {
  const params = await props.params
  if (!(params.locale in HREFLANG)) notFound()
  const result = await importPage(params.mdxPath, params.locale)
  const { default: MDXContent, toc, metadata, ...rest } = result
  const components = getDocsMDXComponents()
  const Wrapper = components.wrapper

  // BreadcrumbList: путь до страницы собирается из сегментов URL, названия —
  // из page map (того же, что рисует сайдбар). URL у крошки ставим только если
  // страница реально существует: у промежуточных папок без index.mdx (например
  // /ru/docs/concepts) ссылка вела бы в 404.
  const segments = params.mdxPath ?? []
  const pageMap = (await getPageMap(`/${params.locale}`)) as PageMapNode[]
  const titles = crumbTitles(pageMap, segments)
  const ownTitle = typeof metadata?.title === 'string' ? metadata.title : undefined

  const crumbs: { name: string; url?: string }[] = [
    { name: HOME_CRUMB[params.locale] ?? HOME_CRUMB.en, url: '/' },
    ...segments.map((_, i) => {
      const rest = segments.slice(0, i + 1)
      const isLast = i === segments.length - 1
      return {
        // Последняя крошка — сама страница: её заголовок точнее, чем ярлык из
        // _meta.js («Обзор встраиваемых компонентов» вместо «Встраиваемые
        // компоненты»).
        name: (isLast ? ownTitle : undefined) ?? titles[i],
        url: pageExists(params.locale, rest) ? `/${params.locale}/${rest.join('/')}` : undefined,
      }
    }),
  ]

  return (
    <Wrapper toc={toc} metadata={metadata} {...rest}>
      <MDXContent {...props} params={params} />
      {/* Одна крошка — это сам сайт, разметку в таком виде Google отбрасывает. */}
      {crumbs.length > 1 ? <JsonLd data={[breadcrumbs(crumbs)]} /> : null}
    </Wrapper>
  )
}

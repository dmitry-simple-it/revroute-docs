import { existsSync } from 'fs'
import { join } from 'path'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { metadata as rootMetadata } from '@/app/layout'

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

export async function generateMetadata(props: {
  params: Promise<{ locale: string; mdxPath?: string[] }>
}) {
  const params = await props.params
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

  return {
    ...metadata,
    alternates: {
      ...metadata?.alternates,
      canonical: selfPath,
      languages,
    },
    // Next.js не сливает openGraph с родительским layout, а заменяет его целиком.
    // Поэтому подмешиваем дефолты корневого layout (og:type, og:site_name,
    // og:image), иначе они пропали бы со всех страниц докс.
    openGraph: {
      ...rootMetadata.openGraph,
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
  const result = await importPage(params.mdxPath, params.locale)
  const { default: MDXContent, toc, metadata, ...rest } = result
  const components = getDocsMDXComponents()
  const Wrapper = components.wrapper

  return (
    <Wrapper toc={toc} metadata={metadata} {...rest}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}

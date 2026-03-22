import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

export const generateStaticParams = generateStaticParamsFor('mdxPath', 'locale')

export async function generateMetadata(props: {
  params: Promise<{ locale: string; mdxPath?: string[] }>
}) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath, params.locale)
  return metadata
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

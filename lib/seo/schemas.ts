export const SITE = 'https://revroute.ru'
export const ORG_ID = `${SITE}/#organization`
export const WEBSITE_ID = `${SITE}/#website`

export type JsonLdGraph = Record<string, unknown>

const BASE = { '@context': 'https://schema.org' as const }

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE}${path.startsWith('/') ? '' : '/'}${path}`)

export function organization(): JsonLdGraph {
  return {
    ...BASE,
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Revroute',
    alternateName: ['RevRoute', 'Revroute Links', 'Revroute Partners'],
    url: SITE,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE}/icon.svg`,
    },
    description:
      'Российская платформа атрибуции маркетинговых ссылок и партнёрского маркетинга: короткие ссылки, аналитика конверсий и автоматические выплаты партнёрам.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@revroute.ru',
      availableLanguage: ['Russian', 'English'],
    },
  }
}

export function website(): JsonLdGraph {
  return {
    ...BASE,
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE,
    name: 'Revroute',
    inLanguage: 'ru-RU',
    publisher: { '@id': ORG_ID },
  }
}

type OfferInput = {
  name: string
  price: string | number
  priceCurrency?: string
  description?: string
  url?: string
}

function offer(o: OfferInput): JsonLdGraph {
  return {
    '@type': 'Offer',
    name: o.name,
    price: String(o.price),
    priceCurrency: o.priceCurrency ?? 'RUB',
    ...(o.description ? { description: o.description } : {}),
    ...(o.url ? { url: abs(o.url) } : {}),
    availability: 'https://schema.org/InStock',
  }
}

export function softwareApp(input: {
  name: string
  url: string
  description: string
  applicationCategory?: string
  applicationSubCategory?: string
  operatingSystem?: string
  featureList?: string[]
  offers?: OfferInput[]
}): JsonLdGraph {
  return {
    ...BASE,
    '@type': 'SoftwareApplication',
    name: input.name,
    url: abs(input.url),
    description: input.description,
    applicationCategory: input.applicationCategory ?? 'BusinessApplication',
    ...(input.applicationSubCategory ? { applicationSubCategory: input.applicationSubCategory } : {}),
    operatingSystem: input.operatingSystem ?? 'Web',
    ...(input.featureList ? { featureList: input.featureList } : {}),
    ...(input.offers && input.offers.length
      ? { offers: input.offers.map(offer) }
      : {}),
    publisher: { '@id': ORG_ID },
  }
}

export function webApplication(input: {
  name: string
  url: string
  description: string
  isAccessibleForFree?: boolean
  permissions?: string
  browserRequirements?: string
}): JsonLdGraph {
  return {
    ...BASE,
    '@type': 'WebApplication',
    name: input.name,
    url: abs(input.url),
    description: input.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    browserRequirements: input.browserRequirements ?? 'Requires JavaScript',
    ...(input.permissions ? { permissions: input.permissions } : {}),
    isAccessibleForFree: input.isAccessibleForFree ?? true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
    publisher: { '@id': ORG_ID },
  }
}

export function product(input: {
  name: string
  description: string
  url?: string
  offers: OfferInput[]
}): JsonLdGraph {
  const prices = input.offers
    .map((o) => Number(o.price))
    .filter((n) => !Number.isNaN(n))
  const lowPrice = prices.length ? Math.min(...prices) : 0
  const highPrice = prices.length ? Math.max(...prices) : 0
  return {
    ...BASE,
    '@type': 'Product',
    name: input.name,
    description: input.description,
    ...(input.url ? { url: abs(input.url) } : {}),
    brand: { '@id': ORG_ID },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: String(lowPrice),
      highPrice: String(highPrice),
      priceCurrency: 'RUB',
      offerCount: String(input.offers.length),
      offers: input.offers.map(offer),
    },
  }
}

export function article(input: {
  url: string
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  author: { name: string; role?: string }
  image?: string | string[]
  articleSection?: string
  wordCount?: number
}): JsonLdGraph {
  const url = abs(input.url)
  return {
    ...BASE,
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: input.headline,
    description: input.description,
    ...(input.image ? { image: Array.isArray(input.image) ? input.image : [input.image] } : {}),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      '@type': 'Person',
      name: input.author.name,
      ...(input.author.role ? { jobTitle: input.author.role } : {}),
    },
    publisher: { '@id': ORG_ID },
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    ...(typeof input.wordCount === 'number' ? { wordCount: input.wordCount } : {}),
    inLanguage: 'ru-RU',
  }
}

export function faqPage(items: { q: string; a: string }[]): JsonLdGraph {
  return {
    ...BASE,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function breadcrumbs(items: { name: string; url?: string }[]): JsonLdGraph {
  return {
    ...BASE,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: abs(item.url) } : {}),
    })),
  }
}

export function howTo(input: {
  name: string
  description: string
  totalTime?: string
  steps: { name: string; text: string; url?: string }[]
}): JsonLdGraph {
  return {
    ...BASE,
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: abs(s.url) } : {}),
    })),
  }
}

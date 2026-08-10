import { NextResponse, type NextRequest } from 'next/server'
import redirectsMap from './redirects.json'

const LOCALES = ['en', 'ru']
const DEFAULT_LOCALE = 'en'
const COOKIE_NAME = 'NEXT_LOCALE'

const HAS_LOCALE_RE = new RegExp(`^\\/(${LOCALES.join('|')})(\\/|$)`)
const REDIRECTS = redirectsMap as Record<string, string>

// Ответ зависит от cookie NEXT_LOCALE и Accept-Language — без Vary
// любой промежуточный кеш (CDN, edge) отдаст чужую локаль.
const VARY_LANGUAGE = 'Accept-Language, Cookie'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Русский алиас оффера «Канал под ключ»
  if (pathname === '/kanal' || pathname.startsWith('/kanal/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/partner-channel'
    return NextResponse.redirect(url, 301)
  }

  // Marketing pages — no locale routing
  const MARKETING_PATHS = [
    '/home',
    '/packaging',
    '/audit',
    '/prm',
    '/pricing',
    '/integrations',
    '/contact',
    '/links',
    '/partners',
    '/partner-channel',
    '/for-partners',
    '/enterprise',
    '/api',
    '/solutions',
    '/customers',
    '/blog',
    '/changelog',
    '/compare',
    '/tools',
    '/glossary',
    '/anti-fraud',
    // '/qr' убран: страница переехала на /tools/qr (покрыт префиксом '/tools'),
    // а старый путь обслуживает redirect в next.config — он отрабатывает
    // РАНЬШЕ middleware, поэтому запись здесь не нужна (прецедент '/analytics').
  ]
  if (pathname === '/' || MARKETING_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }

  // Legal section is RU-only. Normalize /legal/* and /en/legal/* to /ru/legal/*.
  if (pathname === '/legal' || pathname.startsWith('/legal/') ||
      pathname === '/en/legal' || pathname.startsWith('/en/legal/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/ru/legal' + pathname.replace(/^(?:\/en)?\/legal/, '')
    return NextResponse.redirect(url, 301)
  }

  // Handle old /help/article/{slug} redirects (strip locale prefix first if present)
  const pathWithoutLocale = HAS_LOCALE_RE.test(pathname)
    ? '/' + pathname.split('/').slice(2).join('/')
    : pathname

  if (REDIRECTS[pathWithoutLocale]) {
    // Префикс локали сохраняем ВСЕГДА. Раньше для DEFAULT_LOCALE отдавался путь
    // без префикса — обе локали префиксованы, поэтому /en/help/article/X уезжал
    // на /help/… и дальше на русскую страницу.
    // Беспрефиксные легаси-URL сюда не доходят: их одним хопом ловит
    // next.config.mjs → redirects().
    const locale = HAS_LOCALE_RE.test(pathname) ? pathname.split('/')[1] : DEFAULT_LOCALE
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${REDIRECTS[pathWithoutLocale]}`
    return NextResponse.redirect(url, 301)
  }

  // If URL has a locale prefix (e.g. /ru/help)
  if (HAS_LOCALE_RE.test(pathname)) {
    const [, locale] = pathname.split('/')
    const cookieLocale = request.cookies.get(COOKIE_NAME)?.value
    if (locale !== cookieLocale) {
      const response = NextResponse.next()
      response.cookies.set(COOKIE_NAME, locale)
      return response
    }
    return NextResponse.next()
  }

  // No locale prefix — determine locale
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value
  const acceptLang = request.headers.get('accept-language') || ''
  const browserLocale = acceptLang.includes('ru') ? 'ru' : DEFAULT_LOCALE
  const locale = cookieLocale || browserLocale

  if (locale === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`
    const response = NextResponse.rewrite(url)
    // Оговорка: на rewrite Next перезаписывает Vary своим RSC-набором,
    // так что до клиента заголовок доходит не всегда. На редиректе ниже —
    // доходит, а это и есть кэшируемый ответ, который важно не расшарить.
    response.headers.append('Vary', VARY_LANGUAGE)
    return response
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  // Осознанно 307, а не 308: цель редиректа вычисляется из cookie и
  // Accept-Language конкретного пользователя, то есть непостоянна.
  // 308 браузер закэшировал бы навсегда и запер человека в одной локали.
  // Постоянные (308/301) — только структурные редиректы: next.config.mjs
  // и легаси-URL выше.
  const response = NextResponse.redirect(url, 307)
  response.headers.append('Vary', VARY_LANGUAGE)
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind).*)',
  ],
}

import { NextResponse, type NextRequest } from 'next/server'
import redirectsMap from './redirects.json'

const LOCALES = ['en', 'ru']
const DEFAULT_LOCALE = 'en'
const COOKIE_NAME = 'NEXT_LOCALE'

const HAS_LOCALE_RE = new RegExp(`^\\/(${LOCALES.join('|')})(\\/|$)`)
const REDIRECTS = redirectsMap as Record<string, string>

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Serve landing page at root
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/landing.html'
    return NextResponse.rewrite(url)
  }

  // Skip static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Handle old /help/article/{slug} redirects (strip locale prefix first if present)
  const pathWithoutLocale = HAS_LOCALE_RE.test(pathname)
    ? '/' + pathname.split('/').slice(2).join('/')
    : pathname

  if (REDIRECTS[pathWithoutLocale]) {
    const locale = HAS_LOCALE_RE.test(pathname) ? pathname.split('/')[1] : DEFAULT_LOCALE
    const url = request.nextUrl.clone()
    url.pathname = locale === DEFAULT_LOCALE
      ? REDIRECTS[pathWithoutLocale]
      : `/${locale}${REDIRECTS[pathWithoutLocale]}`
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
    return NextResponse.rewrite(url)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind).*)',
  ],
}

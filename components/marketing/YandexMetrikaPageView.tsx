'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCookieConsent } from '@/lib/hooks/use-cookie-consent'

const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

export function YandexMetrikaPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { consent, hydrated } = useCookieConsent()
  const lastUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!METRIKA_ID) return
    if (!hydrated || consent !== 'accepted') return
    if (typeof window === 'undefined') return

    const qs = searchParams?.toString()
    const url = window.location.origin + pathname + (qs ? `?${qs}` : '')

    if (lastUrlRef.current === url) return

    const ym = (window as any).ym
    if (typeof ym !== 'function') return

    ym(Number(METRIKA_ID), 'hit', url, {
      referer: lastUrlRef.current ?? document.referrer ?? '',
    })
    lastUrlRef.current = url
  }, [pathname, searchParams, consent, hydrated])

  return null
}

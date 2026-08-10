'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCookieConsent } from '@/lib/hooks/use-cookie-consent'

const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

/**
 * Досылает просмотры при клиентской навигации: Метрика сама считает только тот URL,
 * на котором произошёл `ym(id, "init", …)`, а дальше в SPA переходы для неё невидимы.
 */
export function YandexMetrikaPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { consent, hydrated } = useCookieConsent()
  const lastUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!METRIKA_ID) return
    // if (!hydrated || consent !== 'accepted') return // FIXME: раскоментить, каогда будем готвоы делать всё правильно.
    if (!hydrated) return
    if (typeof window === 'undefined') return

    const qs = searchParams?.toString()
    const url = window.location.origin + pathname + (qs ? `?${qs}` : '')

    // Первый проход — это тот же URL, на котором отработал `init` в YandexMetrika.tsx,
    // а init уже засчитал просмотр. Раньше здесь уходил ещё и ручной hit, то есть первый
    // просмотр каждого визита учитывался дважды. Запоминаем URL и молчим; хиты уходят
    // только с реальных клиентских переходов.
    if (lastUrlRef.current === null) {
      lastUrlRef.current = url
      return
    }

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

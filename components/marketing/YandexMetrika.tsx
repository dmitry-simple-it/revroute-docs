'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useCookieConsent } from '@/lib/hooks/use-cookie-consent'

const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
const IS_PROD = process.env.NODE_ENV === 'production'

/**
 * Страницы, где Вебвизор действительно нужен: формы заявок и интерактивные инструменты —
 * там запись сессии показывает, на каком поле человек отваливается.
 * На остальных (главная, /prm, /pricing, блог, глоссарий, доки) он грузил
 * tag_webvisor2.js и писал события мыши без прикладного смысла.
 *
 * Пути сверяются с MARKETING_PATHS в middleware.ts — они всегда без локального префикса.
 *
 * Важно: флаг фиксируется на том пути, где отработал `ym(id, "init", …)`, то есть на
 * URL входа. `next/script` дедуплицирует инлайн-скрипт по `id` и не перезапускает его,
 * поэтому клиентские переходы флаг не переключают. Для аналитики это нормально: сессии
 * пишутся у тех, кто пришёл на страницу с формой, а не у тех, кто дошёл до неё кликами.
 */
const WEBVISOR_PATHS = [
  '/audit',
  '/packaging',
  '/partner-channel',
  '/contact/support',
  '/tools',
]

function needsWebvisor(pathname: string | null): boolean {
  if (!pathname) return false
  return WEBVISOR_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function YandexMetrika() {
  const { consent, hydrated } = useCookieConsent()
  const pathname = usePathname()

  if (!IS_PROD) return null
  if (!METRIKA_ID) return null
  if (!hydrated) return null
  // FIXME: ну это пиздец конечно
  // if (consent !== 'accepted') return null

  // Счётчик подставляется в инлайн-скрипт, поэтому пропускаем только число.
  const counterId = Number(METRIKA_ID)
  if (!Number.isFinite(counterId) || counterId <= 0) return null

  const webvisor = needsWebvisor(pathname)

  return (
    <>
      {/*
        Снипет Метрики разбит на две части намеренно.

        1. Очередь `ym` (несколько десятков байт, afterInteractive). Она обязана появиться
           сразу: `trackGoal()` из lib/analytics/yandex-metrika.ts и хит из
           YandexMetrikaPageView зовут `window.ym(...)`, и если функции ещё нет — вызов
           молча теряется. Стаб складывает всё в `ym.a`, а tag.js при загрузке разбирает
           очередь. Так цели, нажатые до загрузки библиотеки, не пропадают.

        2. Сам tag.js — lazyOnload, то есть после window.load и в простое. Раньше он висел
           на afterInteractive и конкурировал за сеть и главный поток с гидрацией.
      */}
      <Script id="yandex-metrika-init" strategy="afterInteractive">
        {`
          (function(m,i){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date()})(window,"ym");

          ym(${counterId}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            trackHash: true,
            webvisor: ${webvisor}
          });
        `}
      </Script>
      <Script
        id="yandex-metrika-tag"
        src="https://mc.yandex.ru/metrika/tag.js"
        strategy="lazyOnload"
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}

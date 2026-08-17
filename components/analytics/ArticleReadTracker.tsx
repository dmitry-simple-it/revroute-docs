'use client'

/**
 * Цель article_read — «статью действительно прочитали», а не открыли и ушли.
 *
 * Условие владельца (15.08.2026): прокрутка ≥60% тела статьи И ≥45 секунд на
 * странице. Оба условия обязательны, цель уходит в момент выполнения позднего
 * из двух — иначе быстрый скролл до конца за пять секунд считался бы чтением,
 * а открытая в фоне вкладка накапливала бы время без единого взгляда.
 *
 * Тело статьи ищем по селектору: и `/blog/[slug]`, и `/glossary/[slug]` —
 * серверные компоненты, и в обоих ровно один <article>. Оборачивать их разметку
 * в клиентский компонент ради ref означало бы утащить на клиент всё дерево
 * статьи; querySelector дешевле и ничего не меняет в рендере.
 */
import { useEffect, useRef } from 'react'
import { trackGoal } from '@/lib/analytics/yandex-metrika'

const DWELL_MS = 45_000
const READ_FRACTION = 0.6

export function ArticleReadTracker({
  slug,
  type,
  selector = 'article',
}: {
  slug: string
  type: 'blog' | 'glossary'
  /** Тело статьи. По умолчанию единственный <article> страницы. */
  selector?: string
}) {
  // Флаги в ref: в StrictMode эффект прогоняется дважды на одном инстансе —
  // ref переживает повторный запуск и не даёт послать цель второй раз.
  const firedRef = useRef(false)
  const scrolledRef = useRef(false)
  const dwelledRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    const el = document.querySelector(selector)
    if (!el) return

    // Троттлинг по времени, а не через requestAnimationFrame: rAF не
    // выполняется в фоновой вкладке, и замер откладывался бы до возврата к
    // вкладке. Для цели это лишняя зависимость от планировщика отрисовки —
    // getBoundingClientRect раз в 200 мс дешевле любого кадра.
    const THROTTLE_MS = 200
    let lastMeasuredAt = 0
    let pending: ReturnType<typeof setTimeout> | null = null

    const fireIfReady = () => {
      if (firedRef.current) return
      if (!scrolledRef.current || !dwelledRef.current) return
      firedRef.current = true
      trackGoal('article_read', { slug, type })
      cleanup()
    }

    const measure = () => {
      pending = null
      lastMeasuredAt = Date.now()
      if (scrolledRef.current) return
      const rect = el.getBoundingClientRect()
      const height = rect.height
      // Статья короче экрана: прокручивать нечего, условие выполнено сразу,
      // как только она целиком попала в окно.
      if (height <= 0) return
      const seen = window.innerHeight - rect.top
      if (seen / height >= READ_FRACTION) {
        scrolledRef.current = true
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        fireIfReady()
      }
    }

    // Скролл летит десятками событий в секунду — геометрию считаем не чаще
    // раза в THROTTLE_MS, хвост добираем отложенным замером.
    const onScroll = () => {
      if (pending !== null) return
      const since = Date.now() - lastMeasuredAt
      if (since >= THROTTLE_MS) measure()
      else pending = setTimeout(measure, THROTTLE_MS - since)
    }

    const dwellTimer = setTimeout(() => {
      dwelledRef.current = true
      fireIfReady()
    }, DWELL_MS)

    function cleanup() {
      clearTimeout(dwellTimer)
      if (pending !== null) clearTimeout(pending)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Первый замер без скролла: короткая статья может влезть в экран целиком.
    measure()

    return cleanup
  }, [slug, type, selector])

  return null
}

'use client'

import { useEffect, useRef } from 'react'
import { trackGoal } from '@/lib/analytics/yandex-metrika'

/**
 * Цель Метрики по РЕАЛЬНОЙ видимости элемента, а не по факту рендера.
 *
 * Зачем так строго: оффер аккаунта в QrStudio рендерился каждому создавшему
 * код с 10.08.2026, но замер геометрии показал, что в момент создания он на
 * 497px ниже мобильного фолда — «отрисован» и «показан» разошлись настолько,
 * что диагноз в ТЗ моста (lp-tools-conversion-brief) был поставлен мимо.
 * Цель tool_upgrade_view обязана считать только то, что человек мог видеть:
 * ≥60% площади элемента непрерывно ≥1 секунды.
 *
 * Срабатывает один раз за просмотр страницы (первый видимый вариант оффера),
 * параметры уходят в reachGoal как params цели.
 */
export function useGoalOnVisible(
  goal: string,
  params: Record<string, string>,
  enabled: boolean,
) {
  const ref = useRef<HTMLDivElement | null>(null)
  const fired = useRef(false)
  // Пробрасываем свежие params в колбэк IO без пересоздания наблюдателя.
  const paramsRef = useRef(params)
  paramsRef.current = params

  useEffect(() => {
    if (!enabled || fired.current) return
    const el = ref.current
    if (!el) return
    // Старые браузеры без IntersectionObserver: цель честнее не послать,
    // чем посчитать показ вслепую.
    if (typeof IntersectionObserver === 'undefined') return

    let timer: ReturnType<typeof setTimeout> | null = null
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            timer = setTimeout(() => {
              if (fired.current) return
              fired.current = true
              trackGoal(goal, paramsRef.current)
              io.disconnect()
            }, 1000)
          } else if (timer) {
            clearTimeout(timer)
            timer = null
          }
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      if (timer) clearTimeout(timer)
      io.disconnect()
    }
  }, [goal, enabled])

  return ref
}

'use client'

/**
 * Подмена текста H1 по метке utm_content рекламной кампании Директа.
 * Сам <h1> рендерится сервером в page.tsx c дефолтным текстом (fallback
 * Suspense попадает в статический HTML), а этот компонент заменяет текст
 * после гидрации — только если метка совпала со словарём.
 * useSearchParams обязан жить внутри <Suspense>, иначе Next выбивает
 * страницу из статической генерации.
 */
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export const DEFAULT_HEADLINE = 'Генератор QR-кодов'

const HEADLINES: Record<string, string> = {
  'qr-generator': 'Генератор QR-кодов',
  'qr-kartinka': 'QR-код с картинкой и логотипом',
  'qr-pechat': 'QR-код для печати и визиток',
  'qr-dinamicheskiy': 'Динамический QR-код',
  'qr-bez-registracii': 'QR-код без регистрации',
}

function SwappedHeadline() {
  const params = useSearchParams()
  const variant = params.get('utm_content')
  return <>{(variant && HEADLINES[variant]) || DEFAULT_HEADLINE}</>
}

export function HeadlineSwap() {
  return (
    <Suspense fallback={<>{DEFAULT_HEADLINE}</>}>
      <SwappedHeadline />
    </Suspense>
  )
}

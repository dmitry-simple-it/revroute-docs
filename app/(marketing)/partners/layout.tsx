import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Партнёры — платформа аффилиатного маркетинга Revroute',
  description:
    'Запускайте партнёрские программы, работайте с блогерами и подключайте пользователей как партнёров. Гибкие вознаграждения, автоматические выплаты и маркетплейс партнёров.',
  alternates: { canonical: '/partners' },
}

export default function PartnersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

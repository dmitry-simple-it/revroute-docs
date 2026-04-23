import type { CompareRow } from '@/components/marketing/shared/ComparisonTable'

export type CompareCase = {
  slug: string
  competitor: string
  tagline: string
  summary: string
  description: string
  rows: CompareRow[]
  why: { title: string; desc: string }[]
  migrationSteps: string[]
}

export const compares: CompareCase[] = [
  {
    slug: 'bitly',
    competitor: 'Bitly',
    tagline: 'Короткие ссылки и реальная атрибуция — в одной платформе',
    summary:
      'Bitly отлично сокращает ссылки, но для серьёзной маркетинговой атрибуции и партнёрских программ возможностей явно не хватает. Revroute закрывает всё в одном сервисе.',
    description:
      'Bitly — классика коротких ссылок с сильным брендом, но подходом 2015 года: базовая аналитика, отсутствие конверсий и партнёрок, дорогие корпоративные тарифы. Revroute — современная платформа атрибуции с короткими ссылками, аналитикой конверсий и партнёрскими программами.',
    rows: [
      { label: 'Короткие ссылки с кастомным доменом', us: true, them: true },
      { label: 'Брендированные QR-коды', us: true, them: true },
      { label: 'Кастомные превью (OG)', us: true, them: false },
      { label: 'UTM-шаблоны', us: true, them: 'Ограничено' },
      { label: 'A/B-тесты ссылок', us: true, them: false },
      { label: 'Диплинки (iOS/Android)', us: true, them: false },
      { label: 'Гео-таргетинг', us: true, them: 'Ограничено' },
      { label: 'Отслеживание конверсий', us: true, them: false },
      { label: 'Атрибуция от клика до оплаты', us: true, them: false },
      { label: 'Партнёрские программы', us: true, them: false },
      { label: 'Server-side трекинг (ITP-safe)', us: true, them: false },
      { label: 'Российские платёжные интеграции (YooKassa)', us: true, them: false },
      { label: 'Нативные SDK для 5 языков', us: true, them: 'Ограничено' },
      { label: 'Rate-limit API', us: '3 000 / мин', them: '100 / мин' },
      { label: 'Стартовая цена', us: '0 ₽', them: '8$ / мес' },
    ],
    why: [
      {
        title: 'Полная атрибуция',
        desc: 'Не просто клики, а события: лиды, подписки, оплаты. Видите, какой канал реально зарабатывает.',
      },
      {
        title: 'Партнёрки и рефералки',
        desc: 'То, чего в Bitly нет в принципе. Запускайте программы с автовыплатами прямо в платформе.',
      },
      {
        title: 'Российские реалии',
        desc: 'Интеграции со YooKassa и amoCRM, выплаты самозанятым и закрывающие документы.',
      },
    ],
    migrationSteps: [
      'Экспортируйте ссылки из Bitly (CSV с колонками Short URL и Long URL).',
      'Загрузите CSV в Revroute: импорт сохранит оригинальные алиасы.',
      'Подключите ваш домен — Revroute сгенерирует SSL автоматически.',
      'Настройте редиректы bit.ly → go.revroute.ru на стороне DNS.',
    ],
  },
  {
    slug: 'short-io',
    competitor: 'Short.io',
    tagline: 'Современная аналитика и партнёрки там, где у Short.io только ссылки',
    summary:
      'Short.io — хороший self-service для сокращения ссылок с гибкими доменами. Но в атрибуции и партнёрских программах у них не хватает базовых вещей.',
    description:
      'Short.io выигрывает на простоте настройки доменов и цене. Revroute даёт больше: сквозную атрибуцию, готовую инфраструктуру партнёрских программ, нативные SDK и server-side трекинг.',
    rows: [
      { label: 'Короткие ссылки с кастомным доменом', us: true, them: true },
      { label: 'QR-коды с брендингом', us: true, them: 'Базовые' },
      { label: 'Кастомные превью (OG)', us: true, them: true },
      { label: 'UTM-шаблоны', us: true, them: 'Ограничено' },
      { label: 'A/B-тесты ссылок', us: true, them: true },
      { label: 'Диплинки (iOS/Android)', us: true, them: 'Ограничено' },
      { label: 'Атрибуция до платежа', us: true, them: false },
      { label: 'Customer Insights', us: true, them: false },
      { label: 'Партнёрские программы', us: true, them: false },
      { label: 'Server-side трекинг', us: true, them: false },
      { label: 'Маркетплейс партнёров', us: true, them: false },
      { label: 'SDK для Python / Go / PHP / Ruby', us: true, them: false },
      { label: 'Стартовая цена', us: '0 ₽', them: '20$ / мес' },
    ],
    why: [
      {
        title: 'Конверсии, а не только клики',
        desc: 'Revroute считает лиды и оплаты, а не просто клики.',
      },
      {
        title: 'Готовая партнёрская платформа',
        desc: 'В Short.io придётся искать отдельное решение — у нас оно уже внутри.',
      },
      {
        title: 'Server-side события',
        desc: 'Адблокеры, ITP и приватные режимы не теряют атрибуцию.',
      },
    ],
    migrationSteps: [
      'Выгрузите ссылки из Short.io через их API или CSV.',
      'Импортируйте CSV в Revroute, сохранив оригинальные пути.',
      'Подключите ваш домен в Revroute и оставьте short.io как fallback на время миграции.',
      'Перенаправьте DNS на Revroute после проверки — без downtime.',
    ],
  },
  {
    slug: 'rewardful',
    competitor: 'Rewardful',
    tagline: 'Партнёрки, аналитика и короткие ссылки в одной платформе',
    summary:
      'Rewardful — специализированная платформа для партнёрок Stripe-SaaS. Revroute объединяет партнёрки, короткие ссылки и аналитику, плюс работает с российскими платежами.',
    description:
      'Rewardful отлично решает задачу реферальной программы для Stripe-SaaS, но не покрывает короткие ссылки, аналитику каналов и российский биллинг. Revroute — more than referrals: полноценная платформа маркетинговой атрибуции.',
    rows: [
      { label: 'Реферальная программа', us: true, them: true },
      { label: 'Аффилиатная программа', us: true, them: true },
      { label: 'Маркетплейс партнёров', us: true, them: false },
      { label: 'Короткие ссылки и кастомные домены', us: true, them: false },
      { label: 'Аналитика каналов (не только партнёров)', us: true, them: false },
      { label: 'Customer Insights + LTV', us: true, them: 'Ограничено' },
      { label: 'Двусторонние стимулы', us: true, them: true },
      { label: 'AI-генератор лендингов партнёрки', us: true, them: false },
      { label: 'Anti-fraud', us: true, them: 'Базовый' },
      { label: 'Интеграция со Stripe', us: true, them: true },
      { label: 'Интеграция со YooKassa', us: true, them: false },
      { label: 'Выплаты самозанятым в РФ', us: true, them: false },
      { label: 'SDK для 5 языков', us: true, them: 'Ограничено' },
      { label: 'Стартовая цена', us: '2 450 ₽ / мес', them: '49$ / мес' },
    ],
    why: [
      {
        title: 'Больше, чем рефералки',
        desc: 'Короткие ссылки + аналитика каналов + партнёрки — без зоопарка из 3 сервисов.',
      },
      {
        title: 'Российский биллинг',
        desc: 'YooKassa, amoCRM, выплаты самозанятым — нативно, без обходных путей.',
      },
      {
        title: 'AI-лендинги и маркетплейс',
        desc: 'Запускайте партнёрки быстрее: готовые лендинги и доступ к базе партнёров.',
      },
    ],
    migrationSteps: [
      'Экспорт партнёров и кампаний из Rewardful (CSV).',
      'Импорт в Revroute с сохранением ID и исторических комиссий.',
      'Перенастройка вебхуков Stripe на Revroute endpoint.',
      'Кабинеты партнёров остаются доступны по их старым ссылкам через редиректы.',
    ],
  },
]

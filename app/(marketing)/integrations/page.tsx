import type { Metadata } from 'next'
import Link from 'next/link'
import { og } from '@/lib/seo/og'
import { categories, featuredSlugs, integrations } from '@/lib/integrations'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { IntegrationsList } from './IntegrationsList'

// ВНИМАНИЕ: title должен оставаться СТРОКОЙ. Nextra глобит статические
// app/**/page.tsx и рендерит metadata.title React-ребёнком — объект здесь
// роняет весь раздел документации (см. scripts/check-app-metadata.mjs).
export const metadata: Metadata = {
  title: 'Интеграции — платежи, CRM и автоматизация',
  description:
    'RevRoute подключается к YooKassa, amoCRM, Bitrix24, n8n, Make, Zapier, Slack, Segment и Google Sheets — нативные интеграции плюс открытое API и вебхуки.',
  alternates: { canonical: '/integrations' },
  openGraph: og('/integrations'),
}

/**
 * Каталог интеграций собирается ровно из одного источника — `lib/integrations.ts`.
 *
 * До этого страница держала собственный захардкоженный список из 11 карточек,
 * который ни одной ссылкой не пересекался с каталогом: `IntegrationsList` не
 * рендерился нигде, а все 11 страниц `/integrations/<slug>` оставались без
 * входящих внутренних ссылок с сайта (проверяется `npm run audit:integrations`).
 */

/**
 * Сервисы, у которых карточки в каталоге нет: связка настраивается под контур
 * клиента или собирается на вебхуках и API, отдельной страницы под неё не
 * существует. Раньше они лежали в том же списке, что и каталог, и выглядели
 * как полноценные интеграции с несуществующими страницами.
 *
 * `href` у каждой ведёт на живую страницу — карточка не может упереться в 404.
 */
type StackItem = {
  name: string
  category: string
  color: string
  initial: string
  desc: string
  href: string
}

const onRequest: StackItem[] = [
  {
    name: 'amoCRM',
    category: 'CRM',
    color: '#3a94ef',
    initial: 'A',
    desc: 'Лиды и сделки из ссылок.',
    href: '/contact/support',
  },
  {
    name: 'Bitrix24',
    category: 'CRM',
    color: '#2fc6f6',
    initial: 'B',
    desc: 'Автосоздание лидов и сделок.',
    href: '/contact/support',
  },
  {
    name: 'n8n',
    category: 'Автоматизация',
    color: '#ea4b71',
    initial: 'N',
    desc: 'Ваши воркфлоу на событиях.',
    href: '/api',
  },
  {
    name: 'Telegram',
    category: 'Коммуникации',
    color: '#26a5e4',
    initial: 'T',
    desc: 'Уведомления команд и партнёров.',
    href: '/contact/support',
  },
  {
    name: 'Google Sheets',
    category: 'Данные',
    color: '#0f9d58',
    initial: 'G',
    desc: 'Выгрузка событий в таблицу.',
    href: '/contact/support',
  },
  {
    name: 'Webhook',
    category: 'Разработка',
    color: '#0c0a09',
    initial: 'W',
    desc: 'Свой endpoint на любые события.',
    href: '/api',
  },
]

export default function IntegrationsPage() {
  // `isDemo` (Acme) — витринная заглушка с несуществующим брендом: страницы у неё
  // нет и в sitemap она не попадает, поэтому карточка вела бы во внутренний 404.
  const catalog = integrations.filter((i) => !i.isDemo)

  // Фильтр показываем только по тем категориям, в которых что-то есть: с уходом
  // Acme вкладка «OAuth» осталась бы пустой заглушкой.
  const present = new Set(catalog.map((i) => i.category))
  const shownCategories = categories.filter((c) => c.key === 'all' || present.has(c.key))

  const featured = featuredSlugs
    .map((slug) => catalog.find((i) => i.slug === slug))
    .filter((i): i is (typeof integrations)[number] => Boolean(i))

  return (
    <>
      <PageHero
        eyebrow="Интеграции"
        eyebrowColor="blue"
        title={
          <>
            Подключите <em style={{ fontStyle: 'italic' }}>ваш стек</em>
          </>
        }
        desc="RevRoute нативно интегрируется с платёжными сервисами, CRM, аналитикой и инструментами автоматизации. Остальное покрывают API и вебхуки."
        actions={
          <>
            <PrimaryButton href="/api">Смотреть API</PrimaryButton>
            <SecondaryButton href="/contact/support">Нужна интеграция?</SecondaryButton>
          </>
        }
      />

      <IntegrationsList
        integrations={catalog}
        featured={featured}
        categories={shownCategories}
      />

      <section style={{ padding: '0 0 100px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-5">
            <Eyebrow>Подключаем под ваш контур</Eyebrow>
          </div>
          <SectionDesc className="mb-6" maxWidth={640}>
            У этих сервисов отдельной карточки в каталоге нет: связку настраиваем под ваш
            процесс либо собираем на вебхуках и открытом API.
          </SectionDesc>
          <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
            {onRequest.map((i) => (
              <Link
                key={i.name}
                href={i.href}
                className="card-border-hover block border transition-all duration-200 hover:shadow-sm"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-base font-bold text-white"
                    style={{ background: i.color }}
                  >
                    {i.initial}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{i.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                      {i.category}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {i.desc}
                </p>
              </Link>
            ))}
          </div>

          <div
            className="mt-12 rounded-2xl border p-8 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }}
          >
            <SectionHeading align="center" size="md">
              Не нашли нужную интеграцию?
            </SectionHeading>
            <SectionDesc align="center" className="mt-4" maxWidth={560}>
              Подключайте что угодно через REST API и подписку на вебхуки. Пошаговые инструкции
              по подключению — в{' '}
              <Link href="/ru/docs/integrations" style={{ color: 'var(--accent)' }}>
                документации
              </Link>
              .
            </SectionDesc>
            <div className="mt-6 flex items-center justify-center gap-3 max-md:flex-col">
              <a
                href="/api"
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: 'var(--accent)' }}
              >
                Смотреть API
              </a>
              <a
                href="/contact/support"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold"
                style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Запросить интеграцию
              </a>
            </div>
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Подключите <em style={{ fontStyle: 'italic' }}>RevRoute</em>{' '}
            <br />к вашему стеку
          </>
        }
        desc="Нативные интеграции плюс открытое API — всё готово к вашему воркфлоу."
      />
    </>
  )
}

import type { Metadata } from 'next'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'

export const metadata: Metadata = {
  title: 'Интеграции — Revroute',
  description:
    'Revroute подключается к Stripe, YooKassa, amoCRM, Bitrix24, n8n, Make, Zapier, Slack и другим сервисам через нативные интеграции, API и вебхуки.',
  alternates: { canonical: '/integrations' },
}

type Integration = { name: string; category: string; color: string; initial: string; desc: string }

const integrations: Integration[] = [
  { name: 'Stripe', category: 'Платежи', color: '#635bff', initial: 'S', desc: 'Сквозная атрибуция подписок.' },
  { name: 'YooKassa', category: 'Платежи', color: '#0088ff', initial: 'Y', desc: 'Приём оплат и учёт в РФ.' },
  { name: 'amoCRM', category: 'CRM', color: '#3a94ef', initial: 'A', desc: 'Лиды и сделки из ссылок.' },
  { name: 'Bitrix24', category: 'CRM', color: '#2fc6f6', initial: 'B', desc: 'Автосоздание лидов и сделок.' },
  { name: 'n8n', category: 'Автоматизация', color: '#ea4b71', initial: 'N', desc: 'Ваши воркфлоу на событиях.' },
  { name: 'Make', category: 'Автоматизация', color: '#6d00cc', initial: 'M', desc: 'Low-code сценарии.' },
  { name: 'Zapier', category: 'Автоматизация', color: '#ff4f00', initial: 'Z', desc: 'Сотни интеграций через Zapier.' },
  { name: 'Slack', category: 'Коммуникации', color: '#4a154b', initial: 'S', desc: 'Алерты о продажах в канал.' },
  { name: 'Telegram', category: 'Коммуникации', color: '#26a5e4', initial: 'T', desc: 'Уведомления команд и партнёров.' },
  { name: 'Google Sheets', category: 'Данные', color: '#0f9d58', initial: 'G', desc: 'Выгрузка событий в таблицу.' },
  { name: 'Segment', category: 'Данные', color: '#52bd94', initial: 'Sg', desc: 'События в ваш data-stack.' },
  { name: 'Webhook', category: 'Разработка', color: '#0c0a09', initial: 'W', desc: 'Свой endpoint на любые события.' },
]

export default function IntegrationsPage() {
  const byCategory = integrations.reduce<Record<string, Integration[]>>((acc, it) => {
    if (!acc[it.category]) acc[it.category] = []
    acc[it.category].push(it)
    return acc
  }, {})

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
        desc="Revroute нативно интегрируется с платёжными сервисами, CRM, аналитикой и инструментами автоматизации. Остальное покрывают API и вебхуки."
        actions={
          <>
            <PrimaryButton href="/api">Смотреть API</PrimaryButton>
            <SecondaryButton href="/contact/support">Нужна интеграция?</SecondaryButton>
          </>
        }
      />

      <section style={{ padding: '20px 0 100px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat} className="mb-12">
              <div className="mb-5">
                <Eyebrow>{cat}</Eyebrow>
              </div>
              <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                {items.map((i) => (
                  <div
                    key={i.name}
                    className="border"
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
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }}>
            <SectionHeading align="center" size="md">
              Не нашли нужную интеграцию?
            </SectionHeading>
            <SectionDesc align="center" className="mt-4" maxWidth={560}>
              Подключайте что угодно через REST API и подписку на вебхуки. SDK покрывают 5 популярных языков.
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
            Подключите <em style={{ fontStyle: 'italic' }}>Revroute</em>
            <br />к вашему стеку
          </>
        }
        desc="Нативные интеграции плюс открытое API — всё готово к вашему воркфлоу."
      />
    </>
  )
}

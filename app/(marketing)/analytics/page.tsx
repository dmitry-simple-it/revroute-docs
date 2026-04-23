import type { Metadata } from 'next'
import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import {
  EventsStream,
  FilterChips,
  StatsCard,
} from '@/components/marketing/shared/DashboardMocks'
import { InlineQuote } from '@/components/marketing/shared/TestimonialCard'
import { CodeBlock, Comment, Ident, Keyword, StringLit } from '@/components/marketing/shared/CodeBlock'
import { ConversionFunnel } from '@/components/marketing/shared/ConversionFunnel'
import { WorldMap } from '@/components/marketing/shared/WorldMap'
import { Sparkline } from '@/components/marketing/shared/Sparkline'

export const metadata: Metadata = {
  title: 'Аналитика — атрибуция от клика до выручки',
  description:
    'Revroute Analytics — полная атрибуция маркетинга: клики, лиды и продажи в реальном времени, карты клиентов, фильтры, экспорт, API и вебхуки.',
  alternates: { canonical: '/analytics' },
}

const realtimeFeatures = [
  { title: 'Общий доступ к дашборду', desc: 'Поделитесь дашбордом с командой, партнёрами или инвесторами одним кликом.' },
  { title: 'Гео- и устройство-детализация', desc: 'Клики по странам, городам, ОС, браузерам и устройствам.' },
  { title: 'Выбор периода', desc: 'Гибкие диапазоны дат с шагом до минуты.' },
  { title: 'Экспорт CSV', desc: 'Выгрузка любых срезов для BI и команды роста.' },
  { title: 'Фильтры', desc: 'Комбинируйте UTM, гео, устройство, тег, папку и домен.' },
  { title: 'AI-запросы', desc: 'Запрашивайте метрики на естественном языке.' },
]

const journeyFeatures = [
  { title: 'LTV и удержание', desc: 'Смотрите стоимость клиента в разрезе каналов и кампаний.' },
  { title: 'Интеграции из коробки', desc: 'Подключите Stripe, YooKassa, amoCRM, Bitrix24 — конверсии считаются сами.' },
]

const events = [
  { type: 'Продажа', link: 'go.revroute.ru/fb', customer: 'Екатерина Н.', country: 'Россия', amount: '4 900 ₽', time: '18:33' },
  { type: 'Лид', link: 'go.revroute.ru/x', customer: 'Isabella G.', country: 'Испания', amount: '—', time: '18:30' },
  { type: 'Продажа', link: 'go.revroute.ru/in', customer: 'Дмитрий В.', country: 'Россия', amount: '2 400 ₽', time: '18:26' },
  { type: 'Клик', link: 'go.revroute.ru/ig', customer: 'James C.', country: 'Швейцария', amount: '—', time: '18:22' },
  { type: 'Продажа', link: 'go.revroute.ru/fb', customer: 'Ольга В.', country: 'Россия', amount: '9 900 ₽', time: '18:18' },
  { type: 'Лид', link: 'go.revroute.ru/li', customer: 'Michael O.', country: 'Ирландия', amount: '—', time: '18:15' },
  { type: 'Продажа', link: 'go.revroute.ru/x', customer: 'Юки Т.', country: 'Япония', amount: '4 900 ₽', time: '18:11' },
  { type: 'Клик', link: 'go.revroute.ru/in', customer: 'Sofia R.', country: 'Тайвань', amount: '—', time: '18:07' },
]

export default function AnalyticsPage() {
  return (
    <>
      <PageHero
        eyebrow="Revroute Analytics"
        eyebrowColor="green"
        title={
          <>
            Усильте вашу
            <br />
            <em style={{ fontStyle: 'italic' }}>атрибуцию ссылок</em>
          </>
        }
        desc="От первого клика до покупки — понимайте, как ваш маркетинг приносит выручку. Мощный движок атрибуции в реальном времени."
        actions={
          <>
            <PrimaryButton href="https://app.revroute.ru/">Попробовать бесплатно</PrimaryButton>
            <SecondaryButton href="/contact/support">Смотреть демо</SecondaryButton>
          </>
        }
      />

      {/* Real-time analytics */}
      <section style={{ padding: '80px 0' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Аналитика в реальном времени</Eyebrow>
            <SectionHeading className="mt-5">
              Успех <em style={{ fontStyle: 'italic' }}>с первого взгляда</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Клики, лиды и продажи по каждой ссылке — мгновенно, с детализацией до города, устройства и UTM.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <StatsCard />
          </AnimateOnScroll>

          <FeatureGrid cards={realtimeFeatures} cols={3} className="mt-12" />
        </div>
      </section>

      {/* Journey */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Отслеживание конверсий</Eyebrow>
            <SectionHeading className="mt-5">
              Визуализируйте
              <br />
              <em style={{ fontStyle: 'italic' }}>путь клиента</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              От первого клика до подписки и оплаты. Поймите, как маркетинг превращается в выручку — без догадок.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <ConversionFunnel
              steps={[
                { label: 'Клик', value: '7 200', share: 100, color: 'var(--text-muted)' },
                { label: 'Просмотр', value: '4 800', share: 67, color: 'var(--blue)' },
                { label: 'Лид', value: '612', share: 28, color: 'var(--purple)' },
                { label: 'Клиент', value: '248', share: 12, color: 'var(--orange)' },
                { label: 'Продажа', value: '89', share: 5, color: 'var(--green)' },
              ]}
            />
          </AnimateOnScroll>

          <FeatureGrid cards={journeyFeatures} cols={2} className="mt-10" />
        </div>
      </section>

      {/* Events stream */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="orange">События в режиме реального времени</Eyebrow>
            <SectionHeading className="mt-5">
              Всё происходит
              <br />
              <em style={{ fontStyle: 'italic' }}>на ваших глазах</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Поток событий уровня отдельного клика или продажи — видите выручку в момент её появления.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <EventsStream events={events} />
          </AnimateOnScroll>

          <div className="mt-8">
            <div className="mb-3 text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
              Детальные фильтры
            </div>
            <FilterChips />
          </div>
        </div>
      </section>

      {/* Geo */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">География трафика</Eyebrow>
            <SectionHeading className="mt-5">
              Смотрите откуда
              <br />
              <em style={{ fontStyle: 'italic' }}>приходят клиенты</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Каждый клик — это точка на карте. Следите за живым потоком по странам, городам и часовым поясам.
            </SectionDesc>
          </div>
          <AnimateOnScroll>
            <div className="grid grid-cols-[1.4fr_1fr] gap-6 max-lg:grid-cols-1">
              <WorldMap height={340} />
              <div
                className="flex flex-col gap-4 border p-6"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                  Топ стран · 24ч
                </div>
                {[
                  { flag: '🇷🇺', name: 'Россия', value: 48_214, share: 62, trend: [18, 22, 20, 26, 28, 32, 36, 40, 44, 48] },
                  { flag: '🇰🇿', name: 'Казахстан', value: 12_478, share: 22, trend: [6, 8, 7, 10, 12, 14, 16, 15, 18, 20] },
                  { flag: '🇧🇾', name: 'Беларусь', value: 6_102, share: 12, trend: [3, 4, 5, 4, 6, 7, 8, 9, 10, 11] },
                  { flag: '🇦🇪', name: 'ОАЭ', value: 2_104, share: 8, trend: [1, 2, 2, 3, 3, 4, 5, 4, 5, 6] },
                  { flag: '🇩🇪', name: 'Германия', value: 1_482, share: 6, trend: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5] },
                ].map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3 text-sm">
                    <span className="text-lg">{c.flag}</span>
                    <span className="w-28 font-medium">{c.name}</span>
                    <Sparkline data={c.trend} width={56} height={22} stroke="var(--blue)" fill="rgba(37, 99, 235, 0.10)" />
                    <div className="relative flex-1 overflow-hidden rounded-md" style={{ background: 'var(--bg-muted)', height: 6 }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-md"
                        style={{
                          width: `${c.share}%`,
                          background: 'var(--blue)',
                          transformOrigin: 'left center',
                          animation: `growX 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${0.1 + i * 0.1}s both`,
                        }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {c.value.toLocaleString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <InlineQuote
        text="Revroute стал прорывом в наших кампаниях. Десятки миллионов кликов в месяц, и мы впервые видим, что реально приносит деньги, а что съедает бюджет."
        name="Дмитрий Волков"
        role="Head of Marketing, Smart English Academy"
      />

      {/* Customer journey */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="purple">Customer Insights</Eyebrow>
              <SectionHeading className="mt-5">
                Знайте
                <br />
                <em style={{ fontStyle: 'italic' }}>своего клиента</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Полный путь от первого клика до оплаты: источник, UTM, устройство, LTV и история платежей —
                в карточке каждого клиента.
              </SectionDesc>
            </div>

            <div
              className="border"
              style={{
                background: 'var(--bg-white)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: '#6366f1' }}
                >
                  ЕК
                </div>
                <div>
                  <div className="text-sm font-bold">Екатерина Карпова</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    e.karpova@acme.ru · Москва
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { k: 'LTV', v: '142 000 ₽' },
                  { k: 'План', v: 'Business' },
                  { k: 'Подписка', v: '2 г. 3 мес.' },
                ].map((m) => (
                  <div
                    key={m.k}
                    className="rounded-lg border p-3"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                      {m.k}
                    </div>
                    <div className="mt-1 text-sm font-bold">{m.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                {[
                  { t: 'Клик', d: 'go.revroute.ru/blog', extra: 'google · cpc' },
                  { t: 'Лид', d: 'Зарегистрировалась', extra: '—' },
                  { t: 'Продажа', d: 'Business Yearly', extra: '29 400 ₽' },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background:
                          e.t === 'Продажа'
                            ? 'var(--green)'
                            : e.t === 'Лид'
                            ? 'var(--blue)'
                            : 'var(--text-dim)',
                      }}
                    />
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>
                      {e.t}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{e.d}</span>
                    <span className="ml-auto" style={{ color: 'var(--text-dim)' }}>
                      {e.extra}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API + Webhooks */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="blue">API и вебхуки</Eyebrow>
              <SectionHeading className="mt-5">
                Превращайте события
                <br />
                <em style={{ fontStyle: 'italic' }}>в возможности</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Получайте события в ваш стек, триггерьте автоматизации в amoCRM, Bitrix24, n8n или Make —
                Revroute шлёт вебхуки с задержкой менее 200 мс.
              </SectionDesc>
              <div className="mt-8">
                <a
                  href="/api"
                  className="inline-flex items-center justify-center rounded-[10px] border px-5 py-2.5 text-sm font-semibold"
                  style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  Подробнее про API
                </a>
              </div>
            </div>
            <CodeBlock label="Webhook">
              POST https://your-app.ru/webhooks/revroute{'\n'}
              Content-Type: application/json{'\n\n'}
              {'{'}
              {'\n  '}
              <Ident>event</Ident>: <StringLit>&quot;lead.created&quot;</StringLit>,
              {'\n  '}
              <Ident>link</Ident>: <StringLit>&quot;go.revroute.ru/promo&quot;</StringLit>,
              {'\n  '}
              <Ident>customer</Ident>: {'{ '}<Ident>email</Ident>: <StringLit>&quot;u@acme.ru&quot;</StringLit>{' }'},
              {'\n  '}
              <Ident>utm</Ident>: {'{ '}<Ident>source</Ident>: <StringLit>&quot;google&quot;</StringLit>, <Ident>campaign</Ident>: <StringLit>&quot;summer&quot;</StringLit>{' }'},
              {'\n  '}
              <Ident>country</Ident>: <StringLit>&quot;RU&quot;</StringLit>,
              {'\n  '}
              <Ident>timestamp</Ident>: <StringLit>&quot;2026-04-22T18:33:12Z&quot;</StringLit>
              {'\n}'}
              {'\n\n'}
              <Comment>{'// HMAC-подпись в X-Revroute-Signature'}</Comment>
            </CodeBlock>
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Усильте <em style={{ fontStyle: 'italic' }}>атрибуцию</em>
            <br />
            вашего маркетинга
          </>
        }
        desc="Начните отслеживать клики и конверсии за пару минут — увидите, как маркетинг превращается в выручку."
      />
    </>
  )
}

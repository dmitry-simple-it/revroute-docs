import type { Metadata } from 'next'
import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'
import { BrowserMockup } from '@/components/marketing/shared/BrowserMockup'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { InlineQuote } from '@/components/marketing/shared/TestimonialCard'
import { CodeBlock, Comment, Ident, Keyword, StringLit } from '@/components/marketing/shared/CodeBlock'
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
  { title: 'Шаги воронки', desc: 'Клик → просмотр → лид → клиент → продажа. Любой путь конверсии — и с любым числом шагов.' },
  { title: 'Сегменты и фильтры', desc: 'Сравнивайте воронку по UTM, гео, устройствам, кампаниям и тегам в один клик.' },
  { title: 'Интеграции из коробки', desc: 'Подключите Stripe, YooKassa, amoCRM, Bitrix24 — конверсии считаются сами.' },
]

const eventsFeatures = [
  { title: 'Любые события', desc: 'Клик, лид, оплата, продление, отказ — фиксируйте через UI или API.' },
  { title: 'Задержка < 1 секунды', desc: 'Поток обновляется в реальном времени без перезагрузки страницы.' },
  { title: 'Богатый контекст', desc: 'Источник, UTM, гео, устройство и сумма прикрепляются к каждому событию автоматически.' },
  { title: 'Фильтры и поиск', desc: 'Комбинируйте поля: ссылка, страна, тип события, период, партнёр.' },
  { title: 'Экспорт и BI', desc: 'Выгрузка CSV и стрим вебхуков в ваш склад данных.' },
  { title: 'Триггеры', desc: 'Запускайте сценарии в amoCRM, Bitrix24, n8n или Make сразу после события.' },
]

const customerFeatures = [
  { title: 'Lifetime value', desc: 'Считайте LTV клиентов в разрезе каналов и кампаний — оптимизируйте бюджет туда, где окупается.' },
  { title: 'Полный таймлайн', desc: 'Каждый клик, регистрация, оплата и продление — в одной хронологической ленте.' },
  { title: 'Атрибуция до канала', desc: 'Видите, какой UTM-источник привёл клиента, и сколько он принёс за всё время.' },
]

export default function AnalyticsPage() {
  return (
    <>
      <PageHero
        eyebrow="Revroute Analytics"
        eyebrowColor="green"
        title={
          <>
            Полная
            <br />
            <em style={{ fontStyle: 'italic' }}>атрибуция маркетинга</em>
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

      {/* Hero product-shot — без хрома, плавно растекается в страницу */}
      <section style={{ padding: '0 0 60px' }}>
        <AnimateOnScroll>
          <BrowserMockup
            src="/images/screenshots/analytics.png"
            alt="Дашборд аналитики Revroute: клики, лиды, продажи и таблица топ-партнёров"
            width={2048}
            height={1180}
            glow="green"
            priority
            chrome="none"
            maxWidth={1240}
          />
        </AnimateOnScroll>
      </section>

      {/* Real-time analytics */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
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

          <FeatureGrid cards={realtimeFeatures} cols={3} />
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
            <BrowserMockup
              src="/images/screenshots/analytics-conversions.png"
              alt="Аналитика конверсий в Revroute: клики → лиды → продажи по сегментам"
              url="app.revroute.ru/analytics/conversions"
              width={2048}
              height={1180}
              glow="blue"
            />
          </AnimateOnScroll>

          <FeatureGrid cards={journeyFeatures} cols={3} className="mt-12" />
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
            <BrowserMockup
              src="/images/screenshots/events.png"
              alt="Поток событий в Revroute: клики, лиды и продажи в реальном времени"
              url="app.revroute.ru/analytics/events"
              width={2048}
              height={1180}
              glow="orange"
            />
          </AnimateOnScroll>

          <FeatureGrid cards={eventsFeatures} cols={3} className="mt-12" />
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
          <div className="mb-10">
            <Eyebrow color="purple">Карточка клиента</Eyebrow>
            <SectionHeading className="mt-5">
              Знайте
              <br />
              <em style={{ fontStyle: 'italic' }}>своего клиента</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Полный путь от первого клика до оплаты — источник, UTM, устройство, LTV и история платежей в одной карточке. Всё, что нужно отделу роста и поддержке.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <BrowserMockup
              src="/images/screenshots/ltv-customer.png"
              alt="Карточка клиента в Revroute: LTV, источник, UTM и таймлайн событий"
              width={2048}
              height={1180}
              glow="purple"
              chrome="none"
              maxWidth={1240}
            />
          </AnimateOnScroll>

          <FeatureGrid cards={customerFeatures} cols={3} className="mt-12" />
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

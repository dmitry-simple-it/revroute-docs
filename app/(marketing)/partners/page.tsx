import type { Metadata } from 'next'
import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { PartnerList, type PartnerMock } from '@/components/marketing/shared/DashboardMocks'
import { InlineQuote, TestimonialCard } from '@/components/marketing/shared/TestimonialCard'
import { WorldMap } from '@/components/marketing/shared/WorldMap'
import { Sparkline } from '@/components/marketing/shared/Sparkline'
import { SpotlightCard } from '@/components/marketing/shared/SpotlightCard'
import { brandStats } from '@/content/brand-stats'

export const metadata: Metadata = {
  title: 'Партнёрские программы — современная платформа аффилиатного маркетинга',
  description:
    'Revroute Partners — запускайте реферальные и аффилиатные программы с автоматическими выплатами, гибкими комиссиями и встроенным дашбордом партнёра.',
  alternates: { canonical: '/partners' },
}

const partners: PartnerMock[] = [
  { initials: 'ЛА', name: 'Лариса Агеева', country: 'Россия · Топ-партнёр', revenue: '184K ₽', payout: '55K ₽', color: '#6366f1' },
  { initials: 'МТ', name: 'Мария Ту', country: 'Казахстан', revenue: '226K ₽', payout: '68K ₽', color: '#ec4899' },
  { initials: 'СЛ', name: 'Sophie Laurent', country: 'Франция', revenue: '110K ₽', payout: '33K ₽', color: '#f97316' },
  { initials: 'ДФ', name: 'Дмитрий Фомин', country: 'Беларусь · Рост', revenue: '15K ₽', payout: '4.5K ₽', color: '#14b8a6' },
  { initials: 'ЭВ', name: 'Elias Weber', country: 'Германия', revenue: '7.8K ₽', payout: '2.3K ₽', color: '#84cc16' },
  { initials: 'ЛК', name: 'Liam Carter', country: 'UK · Топ', revenue: '300K ₽', payout: '92K ₽', color: '#0ea5e9' },
]

const revenueFeatures = [
  {
    title: 'Гибкие вознаграждения',
    desc: 'CPC, CPA и rev-share — настраивайте комиссии под продукт, страну клиента и сегмент партнёра.',
  },
  {
    title: 'Двусторонние стимулы',
    desc: 'Давайте бонус партнёру и скидку его клиенту — лучший способ разогнать регистрации.',
  },
  {
    title: 'Атрибуция в реальном времени',
    desc: 'Партнёр и ваша команда видят, что работает, сразу — без ежемесячных ручных отчётов.',
  },
]

const payoutFeatures = [
  {
    title: 'Выплаты в 1 клик',
    desc: 'Экономьте до 40 часов в месяц на ручных таблицах и инвойсах — платите партнёрам массово.',
  },
  {
    title: 'Налоговый комплаенс',
    desc: 'Автоматическая работа с формами, самозанятыми и ИП — мы берём это на себя.',
  },
  {
    title: 'Инвойсы и закрывающие',
    desc: 'Счета и акты по каждой выплате — бухгалтерия довольна, партнёры тоже.',
  },
]

const integrationFeatures = [
  {
    title: 'AI-генератор лендингов',
    desc: 'Сгенерируйте брендированный лендинг для партнёрской программы за минуту.',
  },
  {
    title: 'Встроенный дашборд',
    desc: 'Подключите своих пользователей как партнёров прямо из вашего продукта, без отдельной регистрации.',
  },
  {
    title: 'Запуск за часы',
    desc: 'Нативные интеграции со Stripe, YooKassa, amoCRM, Bitrix24 — большинство команд запускаются за день.',
  },
]

const APP_URL = 'https://app.revroute.ru/'
const PARTNERS_URL = 'https://partners.revroute.ru/'

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Revroute Partners"
        eyebrowColor="purple"
        title={
          <>
            Растите выручку
            <br />
            через <em style={{ fontStyle: 'italic' }}>партнёрства</em>
          </>
        }
        desc="Современная платформа аффилиатного маркетинга: запускайте программы, работайте с блогерами и инфлюенсерами, подключайте своих же пользователей как партнёров."
        actions={
          <>
            <PrimaryButton href={APP_URL}>Запустить программу</PrimaryButton>
            <SecondaryButton href={PARTNERS_URL}>Стать партнёром</SecondaryButton>
          </>
        }
      />

      {/* Partner list visual */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <AnimateOnScroll>
            <PartnerList partners={partners} />
          </AnimateOnScroll>
          <div className="mt-6 flex flex-wrap gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>Переехали с Rewardful</span>
            <span>·</span>
            <span>Переехали с PartnerStack</span>
            <span>·</span>
            <span>Переехали с FirstPromoter</span>
            <span>·</span>
            <span>Переехали с Admitad</span>
          </div>
        </div>
      </section>

      {/* Revenue on autopilot */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Выручка на автопилоте</Eyebrow>
            <SectionHeading className="mt-5">
              Масштабируйте
              <br />
              <em style={{ fontStyle: 'italic' }}>партнёрскую выручку</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Продвинутые структуры вознаграждений, двусторонние стимулы и атрибуция в реальном времени —
              всё, что нужно, чтобы разогнать выручку через партнёров.
            </SectionDesc>
          </div>
          <FeatureGrid cards={revenueFeatures} cols={3} />
        </div>
      </section>

      <InlineQuote
        text="Revroute — это готовая партнёрская инфраструктура. Если хотите 10× рост через сообщество и партнёров — рекомендую запускать программу именно здесь."
        name="Артём Соколов"
        role="CEO, TapFlow"
      />

      {/* Effortless payouts */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Простые выплаты</Eyebrow>
            <SectionHeading className="mt-5">
              Выплаты —<br />
              <em style={{ fontStyle: 'italic' }}>без боли</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Массовые выплаты партнёрам, налоговый комплаенс и закрывающие документы — мы берём рутину на себя.
            </SectionDesc>
          </div>
          <FeatureGrid cards={payoutFeatures} cols={3} />
        </div>
      </section>

      {/* Stats / social proof */}
      <section className="border-t text-center" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading align="center">
            Проверенная
            <br />
            <em style={{ fontStyle: 'italic' }}>инфраструктура</em>
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[600px] text-base" style={{ color: 'var(--text-muted)' }}>
            Сотни программ, миллионы конверсий и миллиарды рублей выручки проходят через атрибуцию Revroute.
          </p>
          <div className="mx-auto mt-12 grid max-w-[960px] grid-cols-3 gap-6 stagger-children max-md:grid-cols-1">
            {[
              { value: brandStats.commissionsPaid, label: 'Комиссий выплачено партнёрам', trend: [3, 4, 5, 6, 7, 9, 11, 14] },
              { value: brandStats.partnerRevenue, label: 'Выручки через партнёрские программы', trend: [20, 24, 30, 38, 44, 50, 58, 68] },
              { value: brandStats.partnersCount, label: 'Активных партнёров в сети', trend: [2, 4, 5, 6, 8, 9, 11, 12] },
            ].map((s) => (
              <div
                key={s.label}
                className="border p-8 text-left"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div className="text-3xl font-extrabold" style={{ letterSpacing: '-1px' }}>
                  {s.value}
                </div>
                <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {s.label}
                </div>
                <Sparkline
                  data={s.trend}
                  width={220}
                  height={32}
                  stroke="var(--purple)"
                  fill="rgba(124, 58, 237, 0.14)"
                  strokeWidth={2}
                  className="mt-3 w-full"
                />
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-[1100px] text-left">
            <AnimateOnScroll>
              <WorldMap height={300} />
            </AnimateOnScroll>
            <div className="mt-4 text-center text-xs" style={{ color: 'var(--text-dim)' }}>
              Партнёры работают из {brandStats.countriesCovered} стран — выплаты в рублях, USD и EUR.
            </div>
          </div>
        </div>
      </section>

      {/* Social bounties */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="orange">Social bounties</Eyebrow>
              <SectionHeading className="mt-5">
                Поощряйте
                <br />
                <em style={{ fontStyle: 'italic' }}>вирусный контент</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Платите партнёрам за просмотры YouTube, охваты в Telegram, упоминания в подкастах. Идеально для
                UGC- и инфлюенсер-кампаний.
              </SectionDesc>
            </div>
            <AnimateOnScroll>
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
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  Вознаграждение · баунти
                </div>
                <div className="mt-4 text-lg font-bold">
                  1 ₽ за просмотр видео про Revroute
                </div>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>48 320 просмотров</span>
                    <span>до 100 000</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--bg-muted)' }}>
                    <div
                      className="h-full rounded-full shimmer-sheen"
                      style={{
                        width: '48%',
                        background: 'linear-gradient(90deg, var(--purple) 0%, #a855f7 100%)',
                        transformOrigin: 'left',
                        animation: 'growX 1.4s cubic-bezier(0.22, 1, 0.36, 1) both',
                      }}
                    />
                  </div>
                  <Sparkline
                    data={[10, 14, 18, 22, 28, 33, 38, 42, 45, 48]}
                    width={320}
                    height={32}
                    stroke="var(--purple)"
                    fill="rgba(124, 58, 237, 0.14)"
                    strokeWidth={2}
                    className="mt-3 w-full"
                  />
                </div>
                <div
                  className="mt-5 rounded-lg border p-3 text-sm"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                >
                  <div className="text-xs uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                    Заработано
                  </div>
                  <div className="mt-1 text-2xl font-extrabold" style={{ color: 'var(--green)' }}>
                    48 320 ₽
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Seamless integration */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Бесшовная интеграция</Eyebrow>
            <SectionHeading className="mt-5">
              Регистрация партнёров —
              <br />
              <em style={{ fontStyle: 'italic' }}>без трения</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Брендированные лендинги партнёрских программ и встроенный реферальный дашборд прямо в вашем продукте.
            </SectionDesc>
          </div>
          <FeatureGrid cards={integrationFeatures} cols={3} />
          <div className="mt-10">
            <a
              href={PARTNERS_URL}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              Открыть кабинет партнёра →
            </a>
            <span className="ml-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              партнёры регистрируются и получают доступ к программам на partners.revroute.ru
            </span>
          </div>
        </div>
      </section>

      {/* Partner discovery */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <AnimateOnScroll>
              <div className="flex flex-col gap-3 stagger-children">
                {[
                  { n: 'Дмитрий Фомин', c: 'Беларусь', tag: 'На взлёте', s: '180 продаж', trend: [1, 2, 2, 3, 4, 6, 8, 11] },
                  { n: 'Мария Ту', c: 'Казахстан', tag: 'Топ-партнёр', s: '300 продаж', trend: [6, 7, 9, 8, 11, 12, 14, 16] },
                  { n: 'Marvin Ta', c: 'Канада', tag: 'Совпадение аудитории', s: '239 продаж', trend: [3, 4, 5, 6, 6, 8, 9, 10] },
                ].map((p) => (
                  <SpotlightCard
                    key={p.n}
                    className="flex items-center gap-4 border p-4"
                    style={{
                      background: 'var(--bg-white)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: 'var(--accent)' }}
                    >
                      {p.n[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{p.n}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {p.c}
                      </div>
                    </div>
                    <Sparkline
                      data={p.trend}
                      width={80}
                      height={28}
                      stroke="var(--green)"
                      fill="rgba(16, 185, 129, 0.14)"
                    />
                    <div className="text-right">
                      <div
                        className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                      >
                        {p.tag}
                      </div>
                      <div className="mt-1 text-xs" style={{ color: 'var(--text-dim)' }}>
                        {p.s}
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </AnimateOnScroll>
            <div>
              <Eyebrow color="purple">Поиск партнёров</Eyebrow>
              <SectionHeading className="mt-5">
                Правильные партнёры,
                <br />
                <em style={{ fontStyle: 'italic' }}>а не любые</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Находите партнёров, у которых уже есть результаты в вашей нише или аудитория, совпадающая с вашей
                ICP. Marketplace программ Revroute помогает избегать случайных кандидатов.
              </SectionDesc>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS customer stories */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading className="mb-3 text-center" align="center">
            Любимы <em style={{ fontStyle: 'italic' }}>современными SaaS</em>
          </SectionHeading>
          <p className="mx-auto mb-12 max-w-[600px] text-center text-base" style={{ color: 'var(--text-muted)' }}>
            Команды используют Revroute Partners, чтобы запускать и масштабировать партнёрские программы, которые
            приносят миллионы в месяц.
          </p>
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            <TestimonialCard
              t={{
                featured: true,
                company: 'TapFlow',
                text: 'Мы запустили партнёрскую программу за один день. Автоматические выплаты, прозрачный кабинет для партнёров, выплаты в рублях без плясок с бухгалтерией.',
                name: 'Артём Соколов',
                role: 'CEO, TapFlow',
                initials: 'АС',
              }}
            />
            <TestimonialCard
              t={{
                stars: true,
                text: 'За первый месяц подключили 40 новых партнёров через маркетплейс. На холодные рассылки раньше уходили месяцы — теперь партнёры находят нас сами.',
                name: 'Ольга Ветрова',
                role: 'CMO, Мой Маркет',
                initials: 'ОВ',
              }}
            />
            <TestimonialCard
              t={{
                stars: true,
                text: 'Revroute Partners — гибкая и мощная платформа без лишней сложности. Партнёры получают прозрачность, а мы — инструменты для роста.',
                name: 'Илья Миронов',
                role: 'CTO, Paycore',
                initials: 'ИМ',
              }}
            />
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Растите выручку
            <br />
            через <em style={{ fontStyle: 'italic' }}>партнёрства</em>
          </>
        }
        desc="Запустите партнёрскую программу или присоединяйтесь как партнёр — кабинет партнёра уже готов к работе."
        primary={{ href: APP_URL, label: 'Запустить программу' }}
        secondary={{ href: PARTNERS_URL, label: 'Стать партнёром' }}
      />
    </>
  )
}

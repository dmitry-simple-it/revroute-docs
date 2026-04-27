'use client'

import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'
import { BrowserMockup } from '@/components/marketing/shared/BrowserMockup'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { InlineQuote, TestimonialCard } from '@/components/marketing/shared/TestimonialCard'
import { WorldMap } from '@/components/marketing/shared/WorldMap'
import { Sparkline } from '@/components/marketing/shared/Sparkline'
import { brandStats } from '@/content/brand-stats'
import { partnersLeaderboard } from '@/content/partners-leaderboard'

const APP_URL = 'https://app.revroute.ru/'
const PARTNERS_URL = 'https://partners.revroute.ru/'

const REWARDS = [
  { amount: '500 ₽', event: 'за регистрацию',  type: 'Фиксированная',  dur: '',          color: 'var(--blue)',   bg: 'rgba(37,99,235,0.07)' },
  { amount: '2 ₽',   event: 'за клик',          type: 'CPC',            dur: '',          color: 'var(--purple)', bg: 'rgba(124,58,237,0.07)' },
  { amount: '10%',   event: 'с продажи',        type: 'CPS',            dur: '3 месяца',  color: 'var(--green)',  bg: 'rgba(22,163,74,0.07)' },
  { amount: '30%',   event: 'пожизненно',       type: 'Rev-share',      dur: 'навсегда',  color: '#f59e0b',       bg: 'rgba(245,158,11,0.07)' },
]

export default function PartnersPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════ HERO */}
      <PageHero
        eyebrow="Revroute Partners"
        eyebrowColor="purple"
        title={
          <>
            Растите выручку через{' '}
            <em style={{ fontStyle: 'italic' }}>партнёрства</em>
          </>
        }
        desc="Современная платформа партнёрского маркетинга: запускайте программы, работайте с блогерами и агентами. Подключайте своих пользователей как партнёров."
        actions={
          <>
            <PrimaryButton href={APP_URL}>Запустить программу</PrimaryButton>
            <SecondaryButton href={PARTNERS_URL}>Стать партнёром ↗</SecondaryButton>
          </>
        }
      />

      {/* ═══════════════════════════════════════ PARTNER PROGRAM SCREENSHOT */}
      <section style={{ padding: '0 0 60px' }}>
        <AnimateOnScroll>
          <BrowserMockup
            src="/images/screenshots/partner-program.png"
            alt="Кабинет партнёрской программы Revroute: аналитика, выплаты, партнёры"
            url="app.revroute.ru/partners"
            width={2048}
            height={1180}
            glow="purple"
            priority
          />
        </AnimateOnScroll>
      </section>

      {/* ═══════════════════════════════════════ REVENUE ON AUTOPILOT */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">

            {/* Text */}
            <div>
              <Eyebrow color="green">Выручка на автопилоте</Eyebrow>
              <SectionHeading className="mt-5">
                Масштабируйте
                <br />
                <em style={{ fontStyle: 'italic' }}>партнёрскую выручку</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Продвинутые структуры вознаграждений, двусторонние стимулы и атрибуция в реальном
                времени — всё, что нужно, чтобы разогнать выручку через партнёров.
              </SectionDesc>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  { icon: '⚡', title: 'Гибкие вознаграждения', desc: 'CPC, CPA и rev-share — настраивайте комиссии под продукт и сегмент партнёра.' },
                  { icon: '🎁', title: 'Двусторонние стимулы', desc: 'Бонус партнёру и скидка его клиенту — лучший способ разогнать регистрации.' },
                  { icon: '📡', title: 'Атрибуция в реальном времени', desc: 'Партнёр и ваша команда видят, что работает, сразу — без ручных отчётов.' },
                ].map((f) => (
                  <div key={f.title} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-base">{f.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{f.title}</div>
                      <div className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reward cards illustration */}
            <AnimateOnScroll>
              <div className="grid grid-cols-2 gap-3">
                {REWARDS.map((r) => (
                  <div
                    key={r.event}
                    className="rounded-2xl border p-5"
                    style={{
                      background: 'var(--bg-white)',
                      borderColor: 'var(--border)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{ background: r.bg, color: r.color, letterSpacing: '0.08em' }}
                    >
                      {r.type}
                    </div>
                    <div
                      className="mt-3 text-2xl font-extrabold leading-none"
                      style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}
                    >
                      {r.amount}
                    </div>
                    <div className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.event}
                    </div>
                    {r.dur && (
                      <div
                        className="mt-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                        style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                      >
                        {r.dur}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ QUOTE */}
      <InlineQuote
        text="Revroute — это готовая партнёрская инфраструктура. Если хотите 10× рост через сообщество и партнёров — рекомендую запускать программу именно здесь."
        name="Артём Соколов"
        role="CEO, TapFlow"
      />

      {/* ═══════════════════════════════════════════ EFFORTLESS PAYOUTS */}
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

          <AnimateOnScroll>
            <BrowserMockup
              src="/images/screenshots/payouts.png"
              alt="Массовые выплаты партнёрам в Revroute: список, статусы, инвойсы"
              width={2048}
              height={1180}
              glow="green"
              chrome="none"
              maxWidth={1240}
            />
          </AnimateOnScroll>

          <FeatureGrid
            cards={[
              { title: 'Выплаты в 1 клик', desc: 'Платите всем партнёрам сразу. Экономия до 40 часов в месяц на ручных таблицах.' },
              { title: 'Налоговый комплаенс', desc: 'Автоматическая работа с самозанятыми и ИП — формы, акты, инвойсы.' },
              { title: 'Закрывающие документы', desc: 'Счета и акты по каждой выплате — бухгалтерия довольна, партнёры тоже.' },
            ]}
            cols={3}
            className="mt-12"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ STATS */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading>
            Проверенная
            <br />
            <em style={{ fontStyle: 'italic' }}>инфраструктура</em>
          </SectionHeading>
          <p className="mt-6 max-w-[600px] text-base" style={{ color: 'var(--text-muted)' }}>
            Сотни программ, миллионы конверсий и миллиарды рублей выручки через атрибуцию Revroute.
          </p>

          <div className="mx-auto mt-12 grid max-w-[960px] grid-cols-3 gap-5 max-md:grid-cols-1">
            {[
              { value: brandStats.commissionsPaid, label: 'Комиссий выплачено', sub: 'партнёрам', trend: [3,4,5,6,7,9,11,14], color: 'var(--purple)', fill: 'rgba(124,58,237,0.14)' },
              { value: brandStats.partnerRevenue,  label: 'Выручки через',      sub: 'партнёрские программы', trend: [20,24,30,38,44,50,58,68], color: 'var(--green)', fill: 'rgba(22,163,74,0.14)' },
              { value: brandStats.partnersCount,   label: 'Активных партнёров', sub: 'в сети', trend: [2,4,5,6,8,9,11,12], color: 'var(--blue)', fill: 'rgba(37,99,235,0.14)' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border p-7 text-left"
                style={{ background: 'var(--bg-white)', borderColor: 'var(--border)' }}
              >
                <div className="text-[32px] font-extrabold" style={{ letterSpacing: '-1.5px' }}>
                  {s.value}
                </div>
                <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {s.label} <span style={{ color: 'var(--text-secondary)' }}>{s.sub}</span>
                </div>
                <Sparkline
                  data={s.trend}
                  width={220}
                  height={36}
                  stroke={s.color}
                  fill={s.fill}
                  strokeWidth={2}
                  className="mt-4 w-full"
                />
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-[1100px]">
            <AnimateOnScroll>
              <WorldMap height={300} />
            </AnimateOnScroll>
            <div className="mt-4 text-xs" style={{ color: 'var(--text-dim)' }}>
              Партнёры работают из {brandStats.countriesCovered} стран — выплаты в рублях, USD и EUR
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ SOCIAL BOUNTIES */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="orange">Вирусный контент</Eyebrow>
              <SectionHeading className="mt-5">
                Поощряйте
                <br />
                <em style={{ fontStyle: 'italic' }}>вирусный контент</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Платите авторам за то, что реально приносит охват: просмотры на YouTube,
                лайки и репосты в соцсетях, упоминания в подкастах. Гибкая конфигурация
                вознаграждений настраивается под вашу модель — от фикса за публикацию
                до ставки за каждые 1 000 просмотров.
              </SectionDesc>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  { title: 'Просмотры и охваты', desc: 'YouTube, VK Видео, Rutube, Telegram-каналы — оплата за подтверждённый охват.' },
                  { title: 'Реакции и репосты', desc: 'Лайки, шеры, упоминания бренда в соцсетях — фиксируются как отдельные события.' },
                  { title: 'Гибкие ставки', desc: 'CPM, CPV, фикс за публикацию или комбинация — всё настраивается без кода.' },
                ].map((f) => (
                  <div key={f.title}>
                    <div className="text-sm font-semibold">{f.title}</div>
                    <div className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <AnimateOnScroll>
              <div
                className="rounded-2xl border p-6"
                style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
              >
                {/* Bounty badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <span style={{ color: '#f59e0b' }}>★</span>
                  Вознаграждение · баунти
                </div>

                <div className="mt-4 text-lg font-bold">
                  1 ₽ за просмотр видео про Revroute
                </div>

                {/* Creator card */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}
                  >
                    Е
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Evan Brooks</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>YouTube · 120K подписчиков</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-[11px]" style={{ color: 'var(--text-dim)' }}>Заработано</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--green)' }}>48 320 ₽</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>48 320 просмотров</span>
                    <span>цель: 100 000</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--bg-muted)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: '48%', background: 'linear-gradient(90deg,var(--purple),#a855f7)' }}
                    />
                  </div>
                  <Sparkline
                    data={[10,14,18,22,28,33,38,42,45,48]}
                    width={320}
                    height={32}
                    stroke="var(--purple)"
                    fill="rgba(124,58,237,0.14)"
                    strokeWidth={2}
                    className="mt-3 w-full"
                  />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ SEAMLESS INTEGRATION */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 max-w-[640px]">
            <Eyebrow color="blue">Бесшовная интеграция</Eyebrow>
            <SectionHeading className="mt-5">
              Регистрация партнёров —
              <br />
              <em style={{ fontStyle: 'italic' }}>без трения</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Брендированные лендинги партнёрских программ и встроенный реферальный дашборд прямо в
              вашем продукте — настраивается за день.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <BrowserMockup
              src="/images/screenshots/partners-offers.png"
              alt="Интерфейс Revroute Partners: офферы и настройки партнёрской программы"
              width={1848}
              height={894}
              glow="blue"
              chrome="none"
              maxWidth={1240}
            />
          </AnimateOnScroll>

          <FeatureGrid
            cards={[
              {
                title: 'AI-генератор лендингов',
                desc: 'Брендированный лендинг партнёрской программы — за минуту, с вашими цветами, логотипом и оффером.',
              },
              {
                title: 'Встроенный дашборд',
                desc: 'Подключите своих пользователей как партнёров прямо из продукта: ссылка, статистика и выплаты в одном окне.',
              },
              {
                title: 'Запуск за часы',
                desc: 'Нативные интеграции со Stripe, YooKassa, amoCRM и Bitrix24. Шаги настройки — без кода.',
              },
            ]}
            cols={3}
            className="mt-12"
          />
        </div>
      </section>

      {/* ══════════════════════════════════ PARTNER DISCOVERY */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">

            {/* Leaderboard */}
            <AnimateOnScroll>
              <div
                className="overflow-hidden rounded-2xl border"
                style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
              >
                <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-sm font-bold">Топ партнёры</div>
                  <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Апрель 2026</div>
                </div>
                {partnersLeaderboard.slice(0, 3).map((p, i) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-4 border-b px-5 py-4"
                    style={{ borderColor: 'var(--border-light, #f5f5f4)' }}
                  >
                    <div className="w-5 text-center text-sm font-black" style={{ color: 'var(--text-dim)' }}>
                      {i + 1}
                    </div>
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: p.bg }}
                    >
                      {p.initials}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{p.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.flag} {p.country}</div>
                    </div>
                    <Sparkline
                      data={p.data.slice(-8)}
                      width={72}
                      height={28}
                      stroke={p.bg}
                      fill={`${p.bg}22`}
                    />
                    <div className="text-right">
                      <div
                        className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                        style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                      >
                        {p.badge}
                      </div>
                      <div className="mt-0.5 text-xs" style={{ color: 'var(--text-dim)' }}>{p.sales}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Text */}
            <div>
              <Eyebrow color="purple">Поиск партнёров</Eyebrow>
              <SectionHeading className="mt-5">
                Правильные партнёры,
                <br />
                <em style={{ fontStyle: 'italic' }}>а не любые</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Находите партнёров, у которых уже есть результаты в вашей нише или аудитория,
                совпадающая с вашей ICP. Marketplace программ Revroute помогает избегать случайных
                кандидатов.
              </SectionDesc>
              <div className="mt-8">
                <a
                  href={APP_URL}
                  className="inline-flex items-center rounded-xl border px-6 py-3 text-sm font-semibold transition-colors hover:bg-[var(--bg-muted)]"
                  style={{
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  Запустить программу
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════ CUSTOMER STORIES */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading className="mb-3">
            Любимы <em style={{ fontStyle: 'italic' }}>современными SaaS</em>
          </SectionHeading>
          <p className="mb-12 max-w-[600px] text-base" style={{ color: 'var(--text-muted)' }}>
            Команды используют Revroute Partners, чтобы запускать и масштабировать партнёрские программы,
            которые приносят миллионы в месяц.
          </p>
          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            <TestimonialCard
              t={{
                stars: true,
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

      {/* ═══════════════════════════════════════════════════ CTA */}
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

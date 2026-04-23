import { AnimateOnScroll } from './AnimateOnScroll'
import { AreaChart } from '../shared/AreaChart'
import { Sparkline } from '../shared/Sparkline'
import { SpotlightCard } from '../shared/SpotlightCard'
import { WorldMap } from '../shared/WorldMap'
import {
  FeatureIcon,
  IconBolt,
  IconCash,
  IconGlobe,
  IconLayers,
  IconQR,
  IconShield,
  IconSparkles,
  IconTarget,
  IconUsers,
} from '../shared/Icons'
import type { ReactElement, SVGProps } from 'react'

const featurePills = [
  'Срок действия',
  'A/B-тесты',
  'Таргетинг по устройствам',
  'Гео-таргетинг',
  'UTM-разметка',
  'Кастомные превью',
  'Папки и теги',
  'Парольная защита',
  'Клоакинг',
  'Диплинки',
]

const linkRows = [
  {
    favicon: 'f1',
    letter: 'R',
    url: 'go.revroute.ru/promo',
    dest: 'revroute.ru/landing/summer-sale-2025',
    clicks: '184K',
    conversions: '12.4K',
    badge: 'Активна',
    badgeClass: 'badge-active',
  },
  {
    favicon: 'f2',
    letter: 'A',
    url: 'acme.link/demo',
    dest: 'app.acme.ru/signup?ref=tg',
    clicks: '67K',
    conversions: '5.2K',
    badge: 'Подтверждён',
    badgeClass: 'badge-verified',
  },
  {
    favicon: 'f3',
    letter: 'P',
    url: 'go.revroute.ru/partner',
    dest: 'revroute.ru/affiliate/join',
    clicks: '23K',
    conversions: '1.8K',
    badge: 'Модерация',
    badgeClass: 'badge-pending',
  },
]

const faviconColors: Record<string, string> = {
  f1: '#0c0a09',
  f2: '#2563eb',
  f3: '#16a34a',
}

const badgeStyles: Record<string, { background: string; color: string }> = {
  'badge-active': { background: 'var(--green-bg, #f0fdf4)', color: 'var(--green)' },
  'badge-verified': { background: 'var(--blue-bg, #eff6ff)', color: 'var(--blue)' },
  'badge-pending': { background: 'var(--orange-bg, #fff7ed)', color: 'var(--orange)' },
}

type Card = {
  title: string
  desc: string
  icon: (p: SVGProps<SVGSVGElement>) => ReactElement
  color: string
  bg: string
}

const linksFeatureCards: Card[] = [
  {
    title: 'Кастомные домены',
    desc: 'Повышайте CTR на 30% с брендированными доменами, которые соответствуют вашему бренду.',
    icon: IconGlobe,
    color: 'var(--blue)',
    bg: 'var(--blue-bg)',
  },
  {
    title: 'Расширенные функции',
    desc: 'Кастомные превью ссылок, таргетинг по устройствам и гео, A/B-тесты, диплинки и многое другое.',
    icon: IconTarget,
    color: 'var(--purple)',
    bg: '#f5f3ff',
  },
  {
    title: 'QR-коды',
    desc: 'Создавайте брендированные QR-коды, автоматически генерируемые с каждой короткой ссылкой.',
    icon: IconQR,
    color: 'var(--orange)',
    bg: 'var(--orange-bg)',
  },
]

const analyticsChart = [
  8, 10, 14, 12, 18, 22, 20, 26, 32, 30, 38, 44, 42, 48, 56, 54, 62, 70, 66, 74, 82, 88, 94, 102, 98,
  108, 118, 126, 134, 142,
]

const analyticsFeatureCards: Card[] = [
  {
    title: 'Отслеживание конверсий',
    desc: 'Полный путь клиента — от первого клика до оплаты.',
    icon: IconBolt,
    color: 'var(--green)',
    bg: 'var(--green-bg)',
  },
  {
    title: 'Аналитика реального времени',
    desc: 'Клики, лиды и продажи — всё в реальном времени с детализацией.',
    icon: IconSparkles,
    color: 'var(--blue)',
    bg: 'var(--blue-bg)',
  },
  {
    title: 'Профили клиентов',
    desc: 'Понимайте путь каждого клиента, LTV и показатели удержания.',
    icon: IconUsers,
    color: 'var(--purple)',
    bg: '#f5f3ff',
  },
]

const partnerPrograms = [
  {
    reward: <>Зарабатывайте <strong style={{ color: 'var(--green)' }}>30%</strong> с каждой продажи <strong style={{ color: 'var(--green)' }}>12 месяцев</strong></>,
    detail: 'Реферальная программа SaaS',
    avatars: [
      { initials: 'ИВ', bg: '#3b82f6' },
      { initials: 'МК', bg: '#8b5cf6' },
      { initials: 'АЛ', bg: '#ec4899' },
      { initials: 'ДП', bg: '#f97316' },
      { initials: '+10', bg: '#a8a29e', color: 'var(--text)' },
    ],
  },
  {
    reward: <>Зарабатывайте <strong style={{ color: 'var(--green)' }}>$2.00</strong> за каждую регистрацию</>,
    detail: 'CPA-программа для блогеров',
    avatars: [
      { initials: 'ОС', bg: '#14b8a6' },
      { initials: 'НР', bg: '#f43f5e' },
      { initials: '+24', bg: '#a8a29e', color: 'var(--text)' },
    ],
  },
  {
    reward: <>Зарабатывайте <strong style={{ color: 'var(--green)' }}>70%</strong> с каждой продажи <strong style={{ color: 'var(--green)' }}>навсегда</strong></>,
    detail: 'Lifetime партнёрская программа',
    avatars: [
      { initials: 'КА', bg: '#6366f1' },
      { initials: 'ВС', bg: '#0ea5e9' },
      { initials: 'ТН', bg: '#84cc16' },
      { initials: '+13', bg: '#a8a29e', color: 'var(--text)' },
    ],
  },
  {
    reward: <>Зарабатывайте <strong style={{ color: 'var(--green)' }}>$0.50</strong> за каждый клик</>,
    detail: 'Программа для медиа-партнёров',
    avatars: [
      { initials: 'ЕМ', bg: '#f59e0b' },
      { initials: 'ЛГ', bg: '#10b981' },
      { initials: '+16', bg: '#a8a29e', color: 'var(--text)' },
    ],
  },
]

const partnersFeatureCards: Card[] = [
  {
    title: 'Глобальные выплаты в 1 клик',
    desc: 'Отправляйте выплаты партнёрам по всему миру с встроенной налоговой отчётностью.',
    icon: IconCash,
    color: 'var(--green)',
    bg: 'var(--green-bg)',
  },
  {
    title: 'Гибкие комиссии',
    desc: 'Настраивайте логику комиссий по партнёру, продукту, стране клиента и другим параметрам.',
    icon: IconLayers,
    color: 'var(--purple)',
    bg: '#f5f3ff',
  },
  {
    title: 'Встроенный реферальный дашборд',
    desc: 'Интегрируйте реферальную программу прямо в ваш продукт.',
    icon: IconShield,
    color: 'var(--blue)',
    bg: 'var(--blue-bg)',
  },
]

function FeatureLabel({ text, color = 'var(--blue)' }: { text: string; color?: string }) {
  return (
    <span
      className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase"
      style={{ color, letterSpacing: '1.5px' }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor' }} />
      {text}
    </span>
  )
}

function FeatureGrid({ cards }: { cards: Card[] }) {
  return (
    <AnimateOnScroll>
      <div className="stagger-children mt-12 grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {cards.map((card) => (
          <SpotlightCard
            key={card.title}
            className="border transition-all hover:-translate-y-0.5"
            style={{
              padding: '28px',
              background: 'var(--bg-white)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <FeatureIcon icon={card.icon} color={card.color} bg={card.bg} />
            <h4 className="mb-1.5 text-base font-bold">{card.title}</h4>
            <p className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
              {card.desc}
            </p>
          </SpotlightCard>
        ))}
      </div>
    </AnimateOnScroll>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-4"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(32px, 4vw, 48px)',
        fontWeight: 400,
        letterSpacing: '-0.5px',
        lineHeight: 1.15,
      }}
    >
      {children}
    </h2>
  )
}

export function FeaturesSection() {
  return (
    <>
      {/* Links Feature */}
      <section id="features" style={{ padding: '120px 0' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <FeatureLabel text="Управление ссылками" />
          <SectionHeading>
            Всё начинается
            <br />с{' '}
            <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              ссылки
            </em>
          </SectionHeading>
          <p
            className="mb-12 text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '560px' }}
          >
            Создавайте брендированные короткие ссылки с суперспособностями: QR-коды,
            таргетинг, A/B-тесты, диплинки и многое другое.
          </p>

          {/* Dashboard card */}
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
                className="mb-5 flex items-center justify-between border-b pb-4"
                style={{ borderColor: 'var(--border-light, #f5f5f4)' }}
              >
                <span className="text-[15px] font-bold">Мои ссылки</span>
                <div
                  className="flex gap-0.5 rounded-lg p-[3px]"
                  style={{ background: 'var(--bg-muted)' }}
                >
                  {['Все', 'Активные', 'Архив'].map((tab, i) => (
                    <span
                      key={tab}
                      className="cursor-pointer rounded-md px-3.5 py-1 text-[13px] font-medium"
                      style={{
                        background: i === 0 ? 'var(--bg-white)' : 'transparent',
                        color: i === 0 ? 'var(--text)' : 'var(--text-dim)',
                        boxShadow: i === 0 ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {linkRows.map((row) => (
                  <div
                    key={row.url}
                    className="flex items-center justify-between border transition-all hover:shadow-sm"
                    style={{
                      padding: '14px 18px',
                      background: 'var(--bg)',
                      borderRadius: 'var(--radius)',
                      borderColor: 'var(--border-light, #f5f5f4)',
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[15px] font-bold text-white"
                        style={{ background: faviconColors[row.favicon] }}
                      >
                        {row.letter}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{row.url}</div>
                        <div
                          className="mt-px text-xs"
                          style={{ color: 'var(--text-dim)' }}
                        >
                          {row.dest}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 max-md:hidden">
                      <div className="text-right">
                        <div className="text-[15px] font-bold">{row.clicks}</div>
                        <div
                          className="text-[10px] font-medium uppercase"
                          style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}
                        >
                          Клики
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[15px] font-bold">{row.conversions}</div>
                        <div
                          className="text-[10px] font-medium uppercase"
                          style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}
                        >
                          Конверсии
                        </div>
                      </div>
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={badgeStyles[row.badgeClass]}
                      >
                        {row.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap gap-2 max-md:gap-1.5">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="flex items-center gap-1.5 rounded-full border text-[13px] font-medium transition-all hover:border-[var(--text-dim)] max-md:px-3 max-md:py-1.5 max-md:text-xs"
                style={{
                  padding: '8px 16px',
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          <FeatureGrid cards={linksFeatureCards} />
        </div>
      </section>

      {/* Analytics Feature */}
      <section
        id="analytics"
        className="border-t"
        style={{ padding: '120px 0', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <FeatureLabel text="Аналитика" />
          <SectionHeading>
            Измеряйте то,
            <br />
            что{' '}
            <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              важно
            </em>
          </SectionHeading>
          <p
            className="mb-12 text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '560px' }}
          >
            От первого клика до конверсии — поймите, как именно ваш маркетинг генерирует
            выручку.
          </p>

          <AnimateOnScroll>
            <div
              className="relative mb-12 overflow-hidden border"
              style={{
                background: 'var(--bg-white)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                boxShadow: 'var(--shadow)',
              }}
            >
              {/* Subtle grid behind chart */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-dots bg-fade-mask opacity-60"
              />

              <div
                className="relative mb-7 grid grid-cols-4 gap-4 border-b pb-5 max-md:grid-cols-2"
                style={{ borderColor: 'var(--border-light, #f5f5f4)' }}
              >
                {[
                  { value: '7.2K', label: 'Клики', delta: '+18.4%', color: 'var(--blue)', data: [4, 6, 5, 8, 9, 12, 14, 16, 18, 22] },
                  { value: '165', label: 'Лиды', delta: '+12.1%', color: 'var(--purple)', data: [2, 3, 3, 4, 5, 6, 7, 9, 10, 12] },
                  { value: '506 ₽', label: 'Продажи', delta: '+42.3%', color: 'var(--green)', data: [1, 2, 3, 2, 4, 5, 7, 8, 11, 14] },
                  { value: '6.8%', label: 'Конверсия', delta: '+2.1 pp', color: 'var(--orange)', data: [3, 4, 3, 5, 4, 6, 7, 8, 9, 11] },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-3">
                    <div>
                      <span
                        className="text-[11px] font-semibold uppercase"
                        style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
                      >
                        {stat.label}
                      </span>
                      <h3
                        className="mt-1 text-[28px] font-extrabold"
                        style={{ letterSpacing: '-1px' }}
                      >
                        {stat.value}
                      </h3>
                      <span
                        className="mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                      >
                        {stat.delta}
                      </span>
                    </div>
                    <Sparkline
                      data={stat.data}
                      width={80}
                      height={40}
                      stroke={stat.color}
                      fill="rgba(37, 99, 235, 0.08)"
                    />
                  </div>
                ))}
              </div>

              <AreaChart
                data={analyticsChart}
                height={240}
                stroke="var(--blue)"
                fillTop="rgba(37, 99, 235, 0.25)"
                fillBottom="rgba(37, 99, 235, 0)"
              />

              <div className="relative mt-4 flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="inline-flex items-center gap-2">
                  <span className="pulse-dot" />
                  В реальном времени
                </span>
                <span>•</span>
                <span>7 дней</span>
                <span>•</span>
                <span>Все ссылки</span>
                <span className="ml-auto font-mono text-[11px]" style={{ color: 'var(--text-dim)' }}>
                  обновлено 2 сек назад
                </span>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="mt-4 grid grid-cols-[1.4fr_1fr] gap-6 max-lg:grid-cols-1">
              <WorldMap height={300} />
              <div
                className="flex flex-col gap-4 border p-6"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                <div className="text-[13px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                  Топ стран · 24ч
                </div>
                {[
                  { flag: '🇷🇺', name: 'Россия', value: 48_214, share: 62 },
                  { flag: '🇰🇿', name: 'Казахстан', value: 12_478, share: 22 },
                  { flag: '🇧🇾', name: 'Беларусь', value: 6_102, share: 12 },
                  { flag: '🇦🇪', name: 'ОАЭ', value: 2_104, share: 8 },
                  { flag: '🇩🇪', name: 'Германия', value: 1_482, share: 6 },
                ].map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3 text-sm">
                    <span className="text-base">{c.flag}</span>
                    <span className="w-28 font-medium">{c.name}</span>
                    <div className="relative flex-1 overflow-hidden rounded-md" style={{ background: 'var(--bg-muted)', height: 8 }}>
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

          <FeatureGrid cards={analyticsFeatureCards} />
        </div>
      </section>

      {/* Partners Feature */}
      <section
        id="partners"
        className="border-t"
        style={{ padding: '120px 0', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <FeatureLabel text="Партнёры" />
          <SectionHeading>
            Растите через
            <br />
            <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              партнёрства
            </em>
          </SectionHeading>
          <p
            className="mb-12 text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '560px' }}
          >
            Создавайте мощные реферальные и аффилиатные программы для роста продукта и
            увеличения выручки.
          </p>

          <AnimateOnScroll>
            <div className="stagger-children grid grid-cols-2 gap-6 max-lg:grid-cols-1">
              {partnerPrograms.map((prog, i) => (
                <SpotlightCard
                  key={i}
                  className="border"
                  style={{
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="mb-2 text-[15px] font-semibold">{prog.reward}</div>
                  <div className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    {prog.detail}
                  </div>
                  <div className="mt-4 flex">
                    {prog.avatars.map((av, j) => (
                      <div
                        key={j}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-bold text-white"
                        style={{
                          background: av.bg,
                          borderColor: 'var(--bg-white)',
                          marginLeft: j === 0 ? 0 : '-8px',
                          color: av.color || '#fff',
                        }}
                      >
                        {av.initials}
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Partner leaderboard */}
          <AnimateOnScroll>
            <div
              className="mt-8 overflow-hidden border"
              style={{
                background: 'var(--bg-white)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div
                className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b px-6 py-3 text-[11px] font-semibold uppercase max-md:hidden"
                style={{ borderColor: 'var(--border)', color: 'var(--text-dim)', letterSpacing: '0.08em' }}
              >
                <div>Партнёр</div>
                <div>Страна</div>
                <div>Клики · 30д</div>
                <div className="text-right">Продажи</div>
                <div className="text-right">Выплата</div>
              </div>
              {[
                { name: 'Сергей Иванов', handle: '@sergio_marketer', flag: '🇷🇺', initials: 'СИ', bg: '#3b82f6', clicks: 18240, sales: '584 200 ₽', payout: '175 260 ₽', data: [12, 14, 18, 20, 26, 34, 30, 42, 48, 52, 60, 68] },
                { name: 'Мария Козлова', handle: '@masha_affiliate', flag: '🇧🇾', initials: 'МК', bg: '#8b5cf6', clicks: 12480, sales: '312 800 ₽', payout: '93 840 ₽', data: [8, 10, 12, 11, 14, 16, 22, 20, 28, 32, 38, 42] },
                { name: 'Aleksey Petrov', handle: '@alex.growth', flag: '🇰🇿', initials: 'АП', bg: '#ec4899', clicks: 9620, sales: '248 400 ₽', payout: '74 520 ₽', data: [6, 8, 9, 11, 10, 14, 16, 18, 22, 26, 28, 32] },
                { name: 'Darya Volkova', handle: '@darya_content', flag: '🇷🇺', initials: 'ДВ', bg: '#f97316', clicks: 7820, sales: '184 900 ₽', payout: '55 470 ₽', data: [4, 6, 7, 9, 8, 12, 10, 14, 18, 20, 22, 26] },
                { name: 'Nikita Sokolov', handle: '@nik_ads', flag: '🇩🇪', initials: 'НС', bg: '#14b8a6', clicks: 5480, sales: '124 600 ₽', payout: '37 380 ₽', data: [3, 4, 5, 6, 8, 7, 9, 11, 13, 14, 17, 19] },
              ].map((p, i) => (
                <div
                  key={p.handle}
                  className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b px-6 py-3.5 text-sm last:border-b-0 max-md:grid-cols-[1fr_auto] max-md:gap-2"
                  style={{ borderColor: 'var(--border-light)', animation: `fadeUp 0.6s ease ${0.1 + i * 0.08}s both` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: p.bg }}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                        {p.handle}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm max-md:hidden">
                    <span className="mr-1.5 text-base">{p.flag}</span>
                  </div>
                  <div className="flex items-center gap-3 max-md:hidden">
                    <Sparkline
                      data={p.data}
                      width={70}
                      height={24}
                      stroke="var(--green)"
                      fill="rgba(22, 163, 74, 0.12)"
                    />
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                      {p.clicks.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="text-right font-semibold max-md:hidden">{p.sales}</div>
                  <div className="text-right font-bold max-md:col-start-2" style={{ color: 'var(--green)' }}>
                    {p.payout}
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <FeatureGrid cards={partnersFeatureCards} />
        </div>
      </section>
    </>
  )
}

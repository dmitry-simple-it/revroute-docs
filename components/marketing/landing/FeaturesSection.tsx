import { AnimateOnScroll } from './AnimateOnScroll'

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

const linksFeatureCards = [
  {
    title: 'Кастомные домены',
    desc: 'Повышайте CTR на 30% с брендированными доменами, которые соответствуют вашему бренду.',
  },
  {
    title: 'Расширенные функции',
    desc: 'Кастомные превью ссылок, таргетинг по устройствам и гео, A/B-тесты, диплинки и многое другое.',
  },
  {
    title: 'QR-коды',
    desc: 'Создавайте брендированные QR-коды, автоматически генерируемые с каждой короткой ссылкой.',
  },
]

const analyticsBarHeights = [35, 50, 42, 68, 55, 78, 90, 85, 72, 95, 88, 100, 82, 75, 60, 45, 55, 70, 65, 80]

const analyticsFeatureCards = [
  { title: 'Отслеживание конверсий', desc: 'Полный путь клиента — от первого клика до оплаты.' },
  { title: 'Аналитика реального времени', desc: 'Клики, лиды и продажи — всё в реальном времени с детализацией.' },
  { title: 'Профили клиентов', desc: 'Понимайте путь каждого клиента, LTV и показатели удержания.' },
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

const partnersFeatureCards = [
  { title: 'Глобальные выплаты в 1 клик', desc: 'Отправляйте выплаты партнёрам по всему миру с встроенной налоговой отчётностью.' },
  { title: 'Гибкие комиссии', desc: 'Настраивайте логику комиссий по партнёру, продукту, стране клиента и другим параметрам.' },
  { title: 'Встроенный реферальный дашборд', desc: 'Интегрируйте реферальную программу прямо в ваш продукт.' },
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

function FeatureGrid({ cards }: { cards: { title: string; desc: string }[] }) {
  return (
    <AnimateOnScroll>
      <div className="mt-12 grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {cards.map((card) => (
          <div
            key={card.title}
            className="border transition-all hover:-translate-y-0.5"
            style={{
              padding: '28px',
              background: 'var(--bg-white)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h4 className="mb-1.5 text-base font-bold">{card.title}</h4>
            <p className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
              {card.desc}
            </p>
          </div>
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
              className="mb-12 border"
              style={{
                background: 'var(--bg-white)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div
                className="mb-7 flex gap-8 border-b pb-5 max-md:flex-col max-md:gap-4"
                style={{ borderColor: 'var(--border-light, #f5f5f4)' }}
              >
                {[
                  { value: '7.2K', label: 'Клики' },
                  { value: '165', label: 'Лиды' },
                  { value: '$506', label: 'Продажи' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <h3
                      className="text-[32px] font-extrabold"
                      style={{ letterSpacing: '-1px' }}
                    >
                      {stat.value}
                    </h3>
                    <span
                      className="text-xs uppercase"
                      style={{ color: 'var(--text-dim)', letterSpacing: '0.5px' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-1.5 py-4" style={{ height: '120px' }}>
                {analyticsBarHeights.map((h, i) => (
                  <div
                    key={i}
                    className="min-h-2 flex-1 rounded-t transition-colors hover:!bg-[var(--text)]"
                    style={{
                      height: `${h}%`,
                      background: 'var(--bg-muted)',
                    }}
                  />
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
            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
              {partnerPrograms.map((prog, i) => (
                <div
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

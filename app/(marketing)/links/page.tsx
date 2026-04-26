import type { Metadata } from 'next'
import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'
import { LogoMarquee } from '@/components/marketing/landing/LogoMarquee'
import { BrowserMockup } from '@/components/marketing/shared/BrowserMockup'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { InlineQuote } from '@/components/marketing/shared/TestimonialCard'
import { CodeBlock, Comment, Ident, Keyword, StringLit } from '@/components/marketing/shared/CodeBlock'
import { WorldMap } from '@/components/marketing/shared/WorldMap'

export const metadata: Metadata = {
  title: 'Ссылки — короткие ссылки с суперспособностями',
  description:
    'Revroute Links — брендированные короткие ссылки с QR-кодами, кастомными превью, UTM-шаблонами, гео- и устройство-таргетингом, A/B-тестами, диплинками и командным доступом.',
  alternates: { canonical: '/links' },
}

const featureCards = [
  {
    title: 'Кастомные превью',
    desc: 'Заголовок, описание и изображение для каждой ссылки отдельно — клиент видит нужный контент ещё до клика.',
  },
  {
    title: 'Кастомные домены',
    desc: 'Брендируйте ссылки своим доменом go.brand.ru — доверие к переходу и узнаваемость растут.',
  },
  {
    title: 'UTM-шаблоны',
    desc: 'Командные стандарты трекинга в один клик — аналитика без ручной нормализации данных.',
  },
  {
    title: 'Диплинки',
    desc: 'Открывайте нужный экран в iOS/Android — даже если приложение ещё не установлено.',
  },
  {
    title: 'Папки и теги',
    desc: 'Организуйте сотни ссылок по кампаниям с мгновенной фильтрацией и раздельным доступом.',
  },
  {
    title: 'Гео- и устройство-таргетинг',
    desc: 'Одна ссылка — разные лендинги для разных стран, городов и устройств.',
  },
  {
    title: 'Брендированные QR-коды',
    desc: 'Динамический URL под кодом — меняйте назначение без перепечатки макетов и флаеров.',
  },
  {
    title: 'A/B-тесты',
    desc: 'Ротируйте несколько целевых страниц и сравнивайте конверсию — не меняя ссылку и QR.',
  },
]

const utmFeatures = [
  {
    title: 'Командные стандарты',
    desc: 'Договоритесь о номенклатуре UTM один раз — все ссылки команды создаются по единому правилу.',
  },
  {
    title: 'Быстрое применение',
    desc: 'Начните вводить название кампании — Revroute предложит подходящие шаблоны из истории.',
  },
  {
    title: 'Аналитика по кампаниям',
    desc: 'Агрегированные клики, лиды и продажи для каждого utm_campaign — без SQL и BI-инструментов.',
  },
]

const orgFeatures = [
  {
    title: 'Рабочие пространства',
    desc: 'Разделите ссылки по брендам, клиентам или командам с раздельным доступом и аналитикой.',
  },
  {
    title: 'Теги и фильтры',
    desc: 'Многоуровневая фильтрация: тег, домен, UTM, кампания — комбинируйте в любом сочетании.',
  },
  {
    title: 'Роли и права доступа',
    desc: 'Owner, Admin и Member с гранулярными правами на создание, редактирование и экспорт ссылок.',
  },
]

const deeplinkFeatures = [
  {
    title: 'iOS и Android',
    desc: 'Универсальные ссылки для обеих платформ — один URL, корректное поведение на каждом устройстве.',
  },
  {
    title: 'Отложенный диплинк',
    desc: 'Новый пользователь установит приложение и окажется на нужном экране — без дополнительных шагов.',
  },
  {
    title: 'Веб-фолбэк',
    desc: 'Если приложение недоступно — пользователь попадает на лендинг, а не на пустую страницу.',
  },
]

const abFeatures = [
  {
    title: 'Взвешенное распределение',
    desc: 'Направляйте 10/90 % или 50/50 % — любую пропорцию трафика на разные целевые URL.',
  },
  {
    title: 'Сравнение по конверсии',
    desc: 'Клики и конверсия каждого варианта в одной таблице — без подключения сторонних инструментов.',
  },
  {
    title: 'Без замены ссылки',
    desc: 'Ссылка и QR-код остаются прежними — меняйте варианты и веса не трогая рекламные кабинеты.',
  },
]

const qrFeatures = [
  {
    title: 'Динамический URL',
    desc: 'Меняйте назначение ссылки в любой момент — QR-код остаётся прежним, перепечатывать не нужно.',
  },
  {
    title: 'Брендированный дизайн',
    desc: 'Логотип в центре, кастомные цвета и форма модулей — QR-код как элемент фирменного стиля.',
  },
]

const infraCards = [
  {
    title: 'REST API',
    desc: 'Управляйте ссылками, событиями и пространствами программно в любом стеке.',
  },
  {
    title: 'SDK для 5 языков',
    desc: 'Нативные клиенты для TypeScript, Python, Go, PHP и Ruby.',
  },
  {
    title: 'Вебхуки в реальном времени',
    desc: 'Уведомления о новых ссылках, кликах и продажах — мгновенно.',
  },
]

export default function LinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Revroute Links"
        eyebrowColor="blue"
        title={
          <>
            Короткие ссылки с<br />
            <em style={{ fontStyle: 'italic' }}>суперспособностями</em>
          </>
        }
        desc="Платформа управления ссылками для маркетинговых команд, основателей и авторов. Создавайте, нацеливайте и анализируйте ссылки в любом масштабе."
        actions={
          <>
            <PrimaryButton href="https://app.revroute.ru/">Начать бесплатно</PrimaryButton>
            <SecondaryButton href="/contact/support">Запросить демо</SecondaryButton>
          </>
        }
      />

      {/* ── Брендированные ссылки ─────────────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Брендированные ссылки</Eyebrow>
            <SectionHeading className="mt-5">
              Короткие ссылки,
              <br />
              <em style={{ fontStyle: 'italic' }}>которые замечают</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Настройте домен, слаг, превью, UTM и QR — всё в одном конструкторе. Создавайте
              брендированные ссылки, на которые кликают охотнее.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <BrowserMockup
              src="/images/screenshots/create-links.png"
              alt="Конструктор брендированных ссылок Revroute: домен, слаг, теги, QR и превью"
              url="app.revroute.ru/links/new"
              width={2048}
              height={1180}
              glow="blue"
              priority
            />
          </AnimateOnScroll>

          <FeatureGrid cards={featureCards} cols={4} className="mt-12" />
        </div>
      </section>

      {/* ── UTM-шаблоны ───────────────────────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="orange">UTM-шаблоны</Eyebrow>
            <SectionHeading className="mt-5">
              Команда говорит на
              <br />
              <em style={{ fontStyle: 'italic' }}>одном языке трекинга</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Создайте UTM-шаблоны один раз — маркетологи применяют их в один клик, аналитики получают
              чистые данные без ручной нормализации.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
              {/* Template library */}
              <div
                className="border"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div
                  className="mb-4 text-[11px] font-semibold uppercase"
                  style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
                >
                  Библиотека шаблонов
                </div>
                {[
                  { name: 'Google Ads — CPC', params: 'source=google · medium=cpc', color: '#4285f4' },
                  { name: 'VK — Таргет', params: 'source=vk · medium=targeted', color: '#0077ff' },
                  { name: 'Email-рассылка', params: 'source=email · medium=newsletter', color: '#16a34a' },
                  { name: 'Telegram-канал', params: 'source=telegram · medium=channel', color: '#0088cc' },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between border-b py-3 last:border-0"
                    style={{ borderColor: 'var(--border-light)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: t.color }}
                      />
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {t.params}
                        </div>
                      </div>
                    </div>
                    <span
                      className="rounded-md border px-2.5 py-1 text-xs font-semibold"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg)',
                      }}
                    >
                      Применить
                    </span>
                  </div>
                ))}
              </div>

              {/* Applied result — реальный скриншот списка ссылок */}
              <BrowserMockup
                src="/images/screenshots/list-links-zoom.png"
                alt="Карточка ссылки в Revroute крупным планом: метки, статистика, действия"
                width={2048}
                height={1180}
                glow="orange"
                chrome="none"
                maxWidth={780}
              />
            </div>
          </AnimateOnScroll>

          <FeatureGrid cards={utmFeatures} cols={3} className="mt-12" />
        </div>
      </section>

      <InlineQuote
        text="У нас было 12 000 ссылок в четырёх разных сервисах и таблицах. В Revroute свели всё в один дашборд за неделю — команда впервые увидела цельную картину трафика."
        name="Артём Соколов"
        role="CEO, TapFlow"
      />

      {/* ── Организация и доступ ──────────────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="purple">Организация и доступ</Eyebrow>
            <SectionHeading className="mt-5">
              Сотни ссылок —
              <br />
              <em style={{ fontStyle: 'italic' }}>один дашборд</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Папки, теги и рабочие пространства — для команд любого размера. Разграничьте доступ по ролям
              и никогда не теряйте нужную ссылку.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <BrowserMockup
              src="/images/screenshots/analytics-conversions.png"
              alt="Аналитика ссылок в Revroute: воронка конверсий, фильтры, командные пространства"
              url="app.revroute.ru/analytics/conversions"
              width={2048}
              height={1180}
              glow="purple"
            />
          </AnimateOnScroll>

          <FeatureGrid cards={orgFeatures} cols={3} className="mt-12" />
        </div>
      </section>

      {/* ── Аналитика preview ─────────────────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Мощная аналитика</Eyebrow>
            <SectionHeading className="mt-5">
              Успех <em style={{ fontStyle: 'italic' }}>с первого взгляда</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Клики, лиды и продажи по каждой ссылке — в реальном времени, с детализацией до города, устройства
              и UTM. Полная атрибуция от первого клика до оплаты.
            </SectionDesc>
          </div>
          <AnimateOnScroll>
            <BrowserMockup
              src="/images/screenshots/analytics.png"
              alt="Аналитика ссылок Revroute: клики, лиды, продажи и таблица топ-партнёров"
              url="app.revroute.ru/analytics"
              width={2048}
              height={1180}
              glow="green"
            />
          </AnimateOnScroll>
          <div className="mt-8 flex justify-end">
            <a
              href="/analytics"
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Подробнее про аналитику <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Гео и устройство-таргетинг ───────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 grid grid-cols-2 items-center gap-10 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="purple">Гео и устройство-таргетинг</Eyebrow>
              <SectionHeading className="mt-5">
                Одна ссылка —
                <br />
                <em style={{ fontStyle: 'italic' }}>разные назначения</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Маршрутизируйте трафик по стране, городу, языку и устройству. Одна и та же ссылка
                отправит пользователя на локализованный лендинг или в нужный магазин приложений —
                без правок в рекламных кабинетах и перепечатки QR-кодов.
              </SectionDesc>
            </div>
            <AnimateOnScroll>
              <WorldMap height={340} />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── Диплинки ──────────────────────────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Диплинки</Eyebrow>
            <SectionHeading className="mt-5">
              Точный маршрут
              <br />
              <em style={{ fontStyle: 'italic' }}>в приложение</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Один QR-код или ссылка — и пользователь попадает на нужный экран iOS или Android.
              Новый пользователь? Сначала магазин приложений, затем нужный экран — автоматически.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <div
              className="border"
              style={{
                background: 'var(--bg-white)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '40px 32px',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div className="flex flex-col items-center gap-0">
                {/* Source link */}
                <div
                  className="rounded-xl border px-8 py-3 text-sm font-semibold"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}
                >
                  go.revroute.ru/app
                </div>
                <div className="py-2 text-lg" style={{ color: 'var(--text-dim)' }}>↓</div>

                {/* Detection */}
                <div
                  className="rounded-xl border px-8 py-3 text-sm font-semibold"
                  style={{
                    borderColor: 'var(--blue)',
                    background: 'rgba(37, 99, 235, 0.06)',
                    color: 'var(--blue)',
                  }}
                >
                  Revroute определяет ОС и статус установки
                </div>
                <div className="py-3 text-lg" style={{ color: 'var(--text-dim)' }}>↓</div>

                {/* Three paths */}
                <div className="grid w-full max-w-2xl grid-cols-3 gap-4 max-md:grid-cols-1">
                  {[
                    {
                      icon: '🍎',
                      label: 'iOS',
                      installed: '→ Нужный экран',
                      fallback: '→ App Store + отложенный диплинк',
                      color: '#0a84ff',
                    },
                    {
                      icon: '🤖',
                      label: 'Android',
                      installed: '→ Нужный экран',
                      fallback: '→ Google Play + отложенный диплинк',
                      color: '#3ddc84',
                    },
                    {
                      icon: '🖥',
                      label: 'Desktop',
                      installed: '→ Лендинг или веб-версия',
                      fallback: '',
                      color: '#64748b',
                    },
                  ].map((path) => (
                    <div
                      key={path.label}
                      className="rounded-xl border p-4"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xl">{path.icon}</span>
                        <span className="text-sm font-bold">{path.label}</span>
                      </div>
                      <div
                        className="text-xs leading-relaxed"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Приложение установлено:
                        <br />
                        <span style={{ color: path.color, fontWeight: 600 }}>
                          {path.installed}
                        </span>
                        {path.fallback && (
                          <>
                            <br />
                            <br />
                            Не установлено:
                            <br />
                            <span style={{ color: 'var(--text-dim)' }}>{path.fallback}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-xs" style={{ color: 'var(--text-dim)' }}>
                  Отложенный диплинк сохраняет параметры через установку приложения
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <FeatureGrid cards={deeplinkFeatures} cols={3} className="mt-12" />
        </div>
      </section>

      {/* ── A/B-тесты ─────────────────────────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="orange">A/B-тесты</Eyebrow>
            <SectionHeading className="mt-5">
              Одна ссылка —
              <br />
              <em style={{ fontStyle: 'italic' }}>несколько гипотез</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Ротируйте несколько целевых страниц под одной ссылкой, задайте любую пропорцию трафика
              и сравнивайте конверсию — не меняя QR-коды и рекламные объявления.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
              {/* Split results */}
              <div
                className="border"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-bold">go.revroute.ru/summer</div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                  >
                    Активен
                  </span>
                </div>

                {[
                  {
                    variant: 'Вариант A',
                    url: '/landing-v1',
                    pct: 50,
                    clicks: 9214,
                    conv: '3.2%',
                    winner: false,
                  },
                  {
                    variant: 'Вариант B',
                    url: '/landing-v2',
                    pct: 50,
                    clicks: 9108,
                    conv: '5.1%',
                    winner: true,
                  },
                ].map((v) => (
                  <div key={v.variant} className="mb-5">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{v.variant}</span>
                        {v.winner && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                          >
                            Лидер
                          </span>
                        )}
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>{v.pct}%</span>
                    </div>
                    <div
                      className="relative h-8 overflow-hidden rounded-md"
                      style={{ background: 'var(--bg-muted)' }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 flex items-center px-3"
                        style={{
                          width: `${v.pct}%`,
                          background: v.winner ? 'var(--green)' : 'var(--blue)',
                          opacity: 0.85,
                        }}
                      >
                        <span className="truncate text-xs font-semibold text-white">{v.url}</span>
                      </div>
                    </div>
                    <div
                      className="mt-1.5 flex gap-4 text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span>{v.clicks.toLocaleString('ru-RU')} кликов</span>
                      <span>
                        Конверсия:{' '}
                        <span
                          className="font-semibold"
                          style={{ color: v.winner ? 'var(--green)' : 'inherit' }}
                        >
                          {v.conv}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Config panel */}
              <div
                className="flex flex-col gap-4 border"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div
                  className="text-[11px] font-semibold uppercase"
                  style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
                >
                  Настройка распределения
                </div>

                {[
                  { label: 'Вариант A', url: '/landing-v1', pct: '50' },
                  { label: 'Вариант B', url: '/landing-v2', pct: '50' },
                ].map((v) => (
                  <div
                    key={v.label}
                    className="rounded-lg border p-3"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                  >
                    <div className="mb-1 text-xs font-semibold">{v.label}</div>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex-1 font-mono text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        revroute.ru{v.url}
                      </span>
                      <span
                        className="rounded-md border px-2 py-0.5 font-mono text-xs font-semibold"
                        style={{
                          borderColor: 'var(--border)',
                          minWidth: 36,
                          textAlign: 'center',
                        }}
                      >
                        {v.pct}%
                      </span>
                    </div>
                  </div>
                ))}

                <div
                  className="mt-auto rounded-lg border p-4 text-xs leading-relaxed"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-muted)',
                    color: 'var(--text-muted)',
                  }}
                >
                  Пользователь всегда получает один и тот же вариант — ротация не мешает атрибуции
                  и сессионному поведению.
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <FeatureGrid cards={abFeatures} cols={3} className="mt-12" />
        </div>
      </section>

      {/* ── QR-коды ───────────────────────────────────────────────────── */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="blue">QR-коды</Eyebrow>
              <SectionHeading className="mt-5">
                QR, который переживёт
                <br />
                <em style={{ fontStyle: 'italic' }}>любой редизайн</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Динамические QR-коды — меняйте ссылку под кодом без перепечатки материалов. Брендированный
                логотип, кастомные цвета и аналитика каждого сканирования.
              </SectionDesc>
              <FeatureGrid cards={qrFeatures} cols={2} className="mt-8" />
            </div>

            {/* QR preview */}
            <AnimateOnScroll>
              <div
                className="flex flex-col items-center border"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '36px',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <div
                  className="mb-4 text-[11px] font-semibold uppercase"
                  style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
                >
                  Предпросмотр
                </div>

                <div className="relative">
                  <div
                    role="presentation"
                    aria-hidden
                    className="grid gap-0.5 rounded-xl p-4"
                    style={{
                      gridTemplateColumns: 'repeat(14, 8px)',
                      background: 'var(--bg-white)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {Array.from({ length: 196 }).map((_, i) => {
                      const on = (i * 37 + (i % 7) * 13) % 3 !== 0
                      return (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-[2px]"
                          style={{ background: on ? 'var(--text)' : 'transparent' }}
                        />
                      )
                    })}
                  </div>
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    aria-hidden
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{
                        background: 'var(--accent)',
                        boxShadow: '0 0 0 4px var(--bg-white)',
                      }}
                    >
                      R
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center text-sm font-semibold">
                  go.revroute.ru/promo
                </div>
                <div
                  className="mt-1 text-center text-xs"
                  style={{ color: 'var(--text-muted)' }}
                >
                  2 418 сканирований · последнее 3 мин. назад
                </div>

                <div
                  className="mt-5 flex gap-2 text-[11px] font-semibold"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {['PNG', 'SVG', 'PDF'].map((fmt) => (
                    <span
                      key={fmt}
                      className="rounded-md border px-3 py-1"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <LogoMarquee />

      {/* ── API / Инфраструктура ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="blue">Enterprise-класс</Eyebrow>
              <SectionHeading className="mt-5">
                Программное управление
                <br />
                <em style={{ fontStyle: 'italic' }}>миллионами ссылок</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Встройте инфраструктуру Revroute в свои воркфлоу: REST API, SDK для 5 языков, вебхуки
                реального времени и диплинки для мобильных приложений.
              </SectionDesc>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/api"
                  className="inline-flex items-center justify-center rounded-[10px] border px-5 py-2.5 text-sm font-semibold"
                  style={{
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  Документация API
                </a>
                <a
                  href="/enterprise"
                  className="inline-flex items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-semibold"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Enterprise-возможности →
                </a>
              </div>
              <FeatureGrid cards={infraCards} cols={3} className="mt-8" />
            </div>

            <CodeBlock label="TypeScript">
              <Keyword>import</Keyword> {'{ Revroute }'} <Keyword>from</Keyword>{' '}
              <StringLit>&quot;revroute&quot;</StringLit>;{'\n\n'}
              <Keyword>const</Keyword> revroute = <Keyword>new</Keyword> Revroute({'{'}{'\n  '}
              <Ident>token</Ident>: <StringLit>&quot;REVROUTE_API_KEY&quot;</StringLit>,{'\n})'};
              {'\n\n'}
              <Keyword>const</Keyword> {'{ shortLink }'} = <Keyword>await</Keyword>{' '}
              revroute.links.create({'{'}{'\n  '}
              <Ident>url</Ident>: <StringLit>&quot;https://example.com&quot;</StringLit>,{'\n  '}
              <Ident>domain</Ident>: <StringLit>&quot;go.revroute.ru&quot;</StringLit>,{'\n  '}
              <Ident>tags</Ident>: [<StringLit>&quot;summer-sale&quot;</StringLit>],{'\n  '}
              <Ident>geo</Ident>: {'{'}{'\n    '}
              <Ident>RU</Ident>: <StringLit>&quot;https://example.com/ru&quot;</StringLit>,{'\n    '}
              <Ident>KZ</Ident>: <StringLit>&quot;https://example.com/kz&quot;</StringLit>,{'\n  '}
              {'}'},{'\n})'};{'\n\n'}
              console.log(shortLink);{'\n'}
              <Comment>{'// → https://go.revroute.ru/abc123'}</Comment>
            </CodeBlock>
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Всё для ссылок —
            <br />
            <em style={{ fontStyle: 'italic' }}>в одном месте</em>
          </>
        }
        desc="Брендированные ссылки, аналитика конверсий, A/B-тесты, диплинки и QR-коды — начните бесплатно, масштабируйте по мере роста."
      />
    </>
  )
}

import type { Metadata } from 'next'
import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'
import { LogoMarquee } from '@/components/marketing/landing/LogoMarquee'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { LinkBuilderMock, StatsCard } from '@/components/marketing/shared/DashboardMocks'
import { InlineQuote } from '@/components/marketing/shared/TestimonialCard'
import { CodeBlock, Comment, Ident, Keyword, StringLit } from '@/components/marketing/shared/CodeBlock'
import { WorldMap } from '@/components/marketing/shared/WorldMap'
import { Sparkline } from '@/components/marketing/shared/Sparkline'
import { SpotlightCard } from '@/components/marketing/shared/SpotlightCard'

export const metadata: Metadata = {
  title: 'Ссылки — короткие ссылки с суперспособностями',
  description:
    'Revroute Links — брендированные короткие ссылки с QR-кодами, кастомными превью, гео- и устройство-таргетингом, A/B-тестами, диплинками и командным доступом.',
  alternates: { canonical: '/links' },
}

const featureCards = [
  {
    title: 'Кастомные превью',
    desc: 'Увеличивайте CTR до 30% с собственными превью для соцсетей и мессенджеров.',
  },
  {
    title: 'Кастомные домены',
    desc: 'Брендируйте ссылки своим доменом и повышайте доверие к переходу.',
  },
  {
    title: 'UTM-шаблоны',
    desc: 'Создавайте стандарты трекинга команды и переиспользуйте их в один клик.',
  },
  {
    title: 'Диплинки',
    desc: 'Отправляйте пользователей в нужный экран iOS/Android — даже при первой установке.',
  },
  {
    title: 'Папки и теги',
    desc: 'Поддерживайте порядок в сотнях ссылок и фильтруйте аналитику по группам.',
  },
  {
    title: 'Гео- и устройство-таргетинг',
    desc: 'Динамически меняйте назначение ссылки под страну, город или устройство.',
  },
  {
    title: 'Брендированные QR-коды',
    desc: 'Автоматически генерируемые QR-коды с вашим брендом и логотипом внутри.',
  },
  {
    title: 'A/B-тесты',
    desc: 'Ротируйте несколько целевых URL под одной ссылкой и выбирайте победителя по данным.',
  },
]

const infraCards = [
  {
    title: 'REST API',
    desc: 'Управляйте ссылками, событиями и партнёрами программно в любом стеке.',
  },
  {
    title: 'SDK для 5 языков',
    desc: 'Нативные клиенты для TypeScript, Python, Go, PHP и Ruby.',
  },
  {
    title: 'Вебхуки в реальном времени',
    desc: 'Получайте уведомления о новых ссылках, кликах и продажах — мгновенно.',
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
        desc="Современная платформа управления ссылками для маркетинговых команд, основателей и авторов. Создавайте, кастомизируйте и анализируйте ссылки в масштабе."
        actions={
          <>
            <PrimaryButton href="https://app.revroute.ru/">Начать бесплатно</PrimaryButton>
            <SecondaryButton href="/contact/support">Запросить демо</SecondaryButton>
          </>
        }
      />

      {/* Branded short links */}
      <section style={{ padding: '80px 0' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Брендированные ссылки</Eyebrow>
            <SectionHeading className="mt-5">
              Короткие ссылки,
              <br />
              <em style={{ fontStyle: 'italic' }}>которые замечают</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Настраивайте домен, превью, UTM и QR — всё в одном link-builder&apos;е. Организуйте сотни кампаний
              в папках и отслеживайте то, что важно.
            </SectionDesc>
          </div>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
              <LinkBuilderMock />
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
                <div className="mb-4 text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                  Превью в соцсетях
                </div>
                <div className="mb-3 text-sm font-semibold">LinkedIn</div>
                <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                  <div
                    className="h-32"
                    style={{
                      background:
                        'linear-gradient(135deg, #0c0a09 0%, #44403c 40%, #78716c 100%)',
                    }}
                  />
                  <div className="p-3" style={{ background: 'var(--bg)' }}>
                    <div className="text-[11px] uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                      revroute.ru
                    </div>
                    <div className="mt-1 text-sm font-bold">Revroute — платформа управления ссылками</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Короткие ссылки, аналитика и партнёрские программы.
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm font-semibold">WhatsApp / Telegram</div>
                <div className="mt-2 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                  <div
                    className="h-20"
                    style={{
                      background:
                        'linear-gradient(135deg, #0c0a09 0%, #44403c 40%, #78716c 100%)',
                    }}
                  />
                  <div className="p-3" style={{ background: 'var(--bg)' }}>
                    <div className="text-xs font-bold">Превращайте клики в выручку</div>
                    <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      revroute.ru
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <FeatureGrid cards={featureCards} cols={4} className="mt-12" />
        </div>
      </section>

      <InlineQuote
        text="У нас было 12 000 ссылок в четырёх разных сервисах и таблицах. В Revroute свели всё в один дашборд за неделю — команда впервые увидела цельную картину трафика."
        name="Артём Соколов"
        role="CEO, TapFlow"
      />

      {/* Analytics preview */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Мощная аналитика</Eyebrow>
            <SectionHeading className="mt-5">
              Успех <em style={{ fontStyle: 'italic' }}>с первого взгляда</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Клики, лиды и продажи по каждой ссылке — в реальном времени, с детализацией до города, устройства и UTM.
              Полная атрибуция от первого клика до оплаты.
            </SectionDesc>
          </div>
          <AnimateOnScroll>
            <StatsCard />
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

      {/* Geo & device targeting */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 grid grid-cols-2 gap-10 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="purple">Гео и устройство-таргетинг</Eyebrow>
              <SectionHeading className="mt-5">
                Одна ссылка —
                <br />
                <em style={{ fontStyle: 'italic' }}>разные назначения</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Маршрутизируйте трафик под страну, город, язык и устройство. Одна и та же короткая ссылка
                отправит пользователя на локализованный лендинг или в нужный магазин приложений.
              </SectionDesc>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { label: 'Россия', share: '42%', trend: [6, 8, 7, 9, 11, 10, 13, 14] },
                  { label: 'Казахстан', share: '14%', trend: [2, 3, 3, 4, 5, 5, 6, 7] },
                  { label: 'Беларусь', share: '9%', trend: [1, 2, 2, 2, 3, 3, 3, 4] },
                  { label: 'Другие', share: '35%', trend: [4, 5, 5, 6, 6, 7, 7, 8] },
                ].map((r) => (
                  <SpotlightCard
                    key={r.label}
                    className="border p-4"
                    style={{
                      background: 'var(--bg-white)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="text-sm font-semibold">{r.label}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {r.share}
                      </div>
                    </div>
                    <Sparkline
                      data={r.trend}
                      width={220}
                      height={28}
                      stroke="var(--blue)"
                      fill="rgba(37, 99, 235, 0.1)"
                      className="mt-2 w-full"
                    />
                  </SpotlightCard>
                ))}
              </div>
            </div>
            <AnimateOnScroll>
              <WorldMap height={320} />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <LogoMarquee />

      {/* Infra / API */}
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
                Встройте инфраструктуру Revroute в свои воркфлоу: REST API, SDK, вебхуки реального времени и
                диплинки для мобильных приложений.
              </SectionDesc>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/api"
                  className="inline-flex items-center justify-center rounded-[10px] border px-5 py-2.5 text-sm font-semibold"
                  style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)' }}
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
              <Keyword>import</Keyword> {'{ Revroute }'} <Keyword>from</Keyword> <StringLit>&quot;revroute&quot;</StringLit>;
              {'\n\n'}
              <Keyword>const</Keyword> revroute = <Keyword>new</Keyword> Revroute({'{'}
              {'\n  '}
              <Ident>token</Ident>: <StringLit>&quot;REVROUTE_API_KEY&quot;</StringLit>,
              {'\n})'};{'\n\n'}
              <Keyword>const</Keyword> {'{ shortLink }'} = <Keyword>await</Keyword> revroute.links.create({'{'}
              {'\n  '}
              <Ident>url</Ident>: <StringLit>&quot;https://example.com&quot;</StringLit>,
              {'\n  '}
              <Ident>domain</Ident>: <StringLit>&quot;go.revroute.ru&quot;</StringLit>,
              {'\n  '}
              <Ident>tags</Ident>: [<StringLit>&quot;summer-sale&quot;</StringLit>],
              {'\n})'};{'\n\n'}
              console.log(shortLink);{'\n'}
              <Comment>{'// → https://go.revroute.ru/abc123'}</Comment>
            </CodeBlock>
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Короткие ссылки с<br />
            <em style={{ fontStyle: 'italic' }}>супер-способностями</em>
          </>
        }
        desc="Revroute Links — современная платформа атрибуции: короткие ссылки, аналитика конверсий и партнёрские программы в одном сервисе."
      />
    </>
  )
}

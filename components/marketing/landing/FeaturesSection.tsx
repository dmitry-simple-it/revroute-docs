import Link from 'next/link'
import { AnimateOnScroll } from './AnimateOnScroll'
import { BrowserMockup } from '../shared/BrowserMockup'
import { SpotlightCard } from '../shared/SpotlightCard'
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
  'Маскирование',
  'Диплинки',
]

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

function MoreLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <Link
      href={href}
      className="mb-12 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
      style={{ color }}
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
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
            className="mb-6 text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '560px' }}
          >
            Создавайте брендированные короткие ссылки с суперспособностями: QR-коды,
            таргетинг, A/B-тесты, диплинки и многое другое.
          </p>

          <MoreLink href="/links" label="Подробнее про ссылки" color="var(--blue)" />

          <div className="mb-10">
            <AnimateOnScroll>
              <BrowserMockup
                src="/images/screenshots/create-links.png"
                alt="Конструктор брендированных ссылок Revroute: домен, slug, теги, QR и превью"
                url="app.revroute.ru/links/new"
                width={2048}
                height={1180}
                glow="blue"
              />
            </AnimateOnScroll>
          </div>

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
            className="mb-6 text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '560px' }}
          >
            От первого клика до конверсии — поймите, как именно ваш маркетинг генерирует
            выручку.
          </p>

          <MoreLink href="/analytics" label="Подробнее про аналитику" color="var(--green)" />

          <div className="mb-12">
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
          </div>

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
            className="mb-6 text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '560px' }}
          >
            Создавайте мощные реферальные и аффилиатные программы для роста продукта и
            увеличения выручки.
          </p>

          <MoreLink href="/partners" label="Подробнее про партнёрки" color="var(--purple)" />

          <AnimateOnScroll>
            <BrowserMockup
              src="/images/screenshots/partner-program.png"
              alt="Кабинет партнёрской программы Revroute: аналитика, выплаты, партнёры"
              url="app.revroute.ru/partners"
              width={2048}
              height={1180}
              glow="purple"
            />
          </AnimateOnScroll>

          <FeatureGrid cards={partnersFeatureCards} />
        </div>
      </section>
    </>
  )
}

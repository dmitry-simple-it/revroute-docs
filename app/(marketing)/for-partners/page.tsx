import type { Metadata } from 'next'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { StatsRow } from '@/components/marketing/shared/StatsRow'
import { SpotlightCard } from '@/components/marketing/shared/SpotlightCard'
import { WorldMap } from '@/components/marketing/shared/WorldMap'
import { InlineQuote } from '@/components/marketing/shared/TestimonialCard'
import { OffersCarousel } from '@/components/marketing/for-partners/OffersCarousel'
import { brandStats } from '@/content/brand-stats'

export const metadata: Metadata = {
  title: 'Партнёрам — зарабатывайте с маркетплейсом офферов Revroute',
  description:
    'Подключайтесь к маркетплейсу партнёрских программ Revroute: десятки офферов от российских и глобальных брендов, прозрачные выплаты, аналитика в реальном времени и персональный менеджер.',
  alternates: { canonical: '/for-partners' },
}

const PARTNERS_URL = 'https://partners.revroute.ru/'

const benefits = [
  {
    title: 'Прозрачные выплаты',
    desc: 'Выплаты по заявке партнёра — рубли, USD, EUR и криптовалюта. Закрывающие документы формируются автоматически.',
  },
  {
    title: 'Аналитика в реальном времени',
    desc: 'Клики, лиды и конверсии в кабинете без задержек. Знаете сразу, какой контент и какой канал работают.',
  },
  {
    title: 'Готовые креативы',
    desc: 'Баннеры, UTM-шаблоны, брендированные лендинги и короткие ссылки — всё, что нужно, чтобы запустить кампанию за час.',
  },
  {
    title: 'Лучшие офферы в одном месте',
    desc: 'Десятки программ от проверенных брендов. Подключайтесь к новым офферам в один клик — без повторной модерации.',
  },
  {
    title: 'Персональный менеджер',
    desc: 'С топ-партнёрами работает команда Revroute: помогаем вырасти, делимся инсайтами и отраслевыми бенчмарками.',
  },
  {
    title: 'Бонусы и баунти',
    desc: 'Дополнительные выплаты за охваты, конкурсы и сезонные промо. Партнёрам выгодно расти вместе с брендами.',
  },
]

const steps = [
  {
    n: '01',
    title: 'Зарегистрируйтесь',
    desc: 'Создайте кабинет на partners.revroute.ru. Заполните профиль — укажите площадки, аудиторию и тематику.',
  },
  {
    n: '02',
    title: 'Подключите офферы',
    desc: 'Выберите программы в маркетплейсе. Каждая программа одобряется партнёром — большинство принимают заявки за час.',
  },
  {
    n: '03',
    title: 'Получайте выплаты',
    desc: 'Продвигайте через свою короткую ссылку, смотрите конверсии в реальном времени и запрашивайте выплату в один клик.',
  },
]

const faq = [
  {
    q: 'Сколько стоит подключение к Revroute Partners?',
    a: 'Для партнёров платформа полностью бесплатна. Мы получаем комиссию от брендов, а не от вас.',
  },
  {
    q: 'Как я получаю выплаты?',
    a: 'Настройте реквизиты один раз — карта, самозанятый, ИП, TON, USDT. Запрашивайте выплаты по мере роста баланса, минималка — от 1 000 ₽.',
  },
  {
    q: 'Подходит ли это для YouTube/Telegram/ВКонтакте?',
    a: 'Да, большинство программ принимают трафик из соцсетей и мессенджеров. Часть программ дополнительно поддерживает контекст, SEO и email.',
  },
  {
    q: 'Что с отменами и возвратами?',
    a: 'Комиссия списывается только при подтверждённой оплате. После холд-периода (обычно 14–30 дней) средства становятся доступны к выводу.',
  },
]

export default function ForPartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Партнёрам"
        eyebrowColor="purple"
        title={
          <>
            Зарабатывайте
            <br />
            на <em style={{ fontStyle: 'italic' }}>рекомендациях брендов</em>
          </>
        }
        desc="Маркетплейс партнёрских программ Revroute: десятки офферов от российских и глобальных брендов, прозрачные выплаты, готовые креативы и аналитика в реальном времени."
        actions={
          <>
            <PrimaryButton href={PARTNERS_URL}>Стать партнёром</PrimaryButton>
            <SecondaryButton href="#offers">Смотреть офферы</SecondaryButton>
          </>
        }
      />

      <section style={{ padding: '20px 0 80px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <StatsRow
            stats={[
              { value: brandStats.partnersCount, label: 'Активных партнёров в сети Revroute' },
              { value: brandStats.commissionsPaid, label: 'Комиссий выплачено партнёрам' },
              { value: brandStats.programsInMarketplace, label: 'Брендов-программ в маркетплейсе' },
            ]}
          />
        </div>
      </section>

      {/* Offers marketplace preview */}
      <section
        id="offers"
        className="border-t"
        style={{ padding: '80px 0', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 grid grid-cols-2 gap-10 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="blue">Маркетплейс офферов</Eyebrow>
              <SectionHeading className="mt-5">
                Десятки программ —
                <br />
                <em style={{ fontStyle: 'italic' }}>в одном кабинете</em>
              </SectionHeading>
            </div>
            <SectionDesc className="self-end">
              Подключайтесь к SaaS, финтеху, образованию, e-commerce. Все программы с подтверждёнными условиями,
              прозрачными холдами и прямыми выплатами от брендов.
            </SectionDesc>
          </div>

          <OffersCarousel />

          <div className="mt-10 text-center">
            <a
              href={PARTNERS_URL}
              className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold"
              style={{
                background: 'var(--bg-white)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            >
              Смотреть все офферы в кабинете →
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Почему Revroute</Eyebrow>
            <SectionHeading className="mt-5">
              Партнёрам —
              <br />
              <em style={{ fontStyle: 'italic' }}>удобно и прозрачно</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Мы создаём единый кабинет для работы со всеми программами. Один UTM-шаблон, одна статистика,
              одна выплата — минимум рутины, максимум фокуса на трафике.
            </SectionDesc>
          </div>
          <FeatureGrid cards={benefits} cols={3} />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 text-center">
            <Eyebrow color="orange">Как начать</Eyebrow>
            <SectionHeading className="mt-5" align="center">
              Три шага
              <br />
              <em style={{ fontStyle: 'italic' }}>до первой выплаты</em>
            </SectionHeading>
          </div>
          <div className="grid grid-cols-3 gap-4 stagger-children max-md:grid-cols-1">
            {steps.map((s) => (
              <SpotlightCard
                key={s.n}
                className="border"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                }}
              >
                <div
                  className="text-xs font-bold tracking-wider"
                  style={{ color: 'var(--text-dim)', letterSpacing: '0.12em' }}
                >
                  ШАГ {s.n}
                </div>
                <h4 className="mt-3 text-lg font-bold tracking-tight">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {s.desc}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Global map */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 grid grid-cols-2 gap-10 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="purple">География</Eyebrow>
              <SectionHeading className="mt-5">
                Партнёры —
                <br />
                <em style={{ fontStyle: 'italic' }}>из {brandStats.countriesCovered} стран</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Revroute принимает партнёров из России, СНГ и дальнего зарубежья. Выплаты идут в рублях, долларах,
                евро и стейблкоинах — выбирайте удобный способ.
              </SectionDesc>
            </div>
            <WorldMap height={320} />
          </div>
        </div>
      </section>

      <InlineQuote
        text="За первый квартал в Revroute мой канал вышел в топ-3 по выплатам. Один кабинет, прозрачная статистика по каждому офферу, менеджер всегда на связи — я больше не трачу вечер пятницы на сверку таблиц."
        name="Мария Ту"
        role="Контент-партнёр, Казахстан"
      />

      {/* FAQ */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 text-center">
            <Eyebrow color="blue">FAQ</Eyebrow>
            <SectionHeading className="mt-5" align="center">
              Частые вопросы
            </SectionHeading>
          </div>
          <div className="mx-auto grid max-w-[960px] grid-cols-2 gap-4 stagger-children max-md:grid-cols-1">
            {faq.map((f) => (
              <SpotlightCard
                key={f.q}
                className="border"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                }}
              >
                <div className="text-base font-bold tracking-tight">{f.q}</div>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {f.a}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Готовы
            <br />
            <em style={{ fontStyle: 'italic' }}>зарабатывать?</em>
          </>
        }
        desc="Зарегистрируйтесь в кабинете партнёра и подключите первые офферы за несколько минут."
        primary={{ href: PARTNERS_URL, label: 'Стать партнёром' }}
        secondary={{ href: '/contact/support', label: 'Связаться с командой' }}
      />
    </>
  )
}

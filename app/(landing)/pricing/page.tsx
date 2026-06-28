import type { Metadata } from 'next'
import { PricingTable } from '@/components/ds/PricingTable'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon } from '@/components/ds/primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'
const TELEGRAM = 'https://t.me/revroute_bot'

export const metadata: Metadata = {
  title: 'Тарифы',
  description:
    'Тарифы RevRoute: фиксированная подписка от 2 450 ₽/мес плюс прозрачная агентская комиссия 5% за расчёты с партнёрами — из бюджета выплат, не сверху.',
  alternates: { canonical: '/pricing' },
}

const PLANS = [
  {
    name: 'Business',
    priceMonth: '2 950 ₽',
    priceYear: '2 450 ₽',
    per: '/мес · помесячно',
    perYear: '/мес при оплате за год',
    cta: 'Создать программу',
    href: APP_REGISTER,
    features: [
      'Выплаты партнёрам до 250 000 ₽/мес',
      'Базовые структуры вознаграждений',
      'Двусторонние стимулы',
      'AI-генератор партнёрских лендингов',
      'Вебхуки',
      'До 10 пользователей, 3 группы партнёров',
      'Поддержка по email',
    ],
  },
  {
    name: 'Advanced',
    priceMonth: '9 999 ₽',
    priceYear: '8 299 ₽',
    per: '/мес · помесячно',
    perYear: '/мес при оплате за год',
    cta: 'Создать программу',
    href: APP_REGISTER,
    popular: true,
    features: [
      'Всё из Business',
      'Выплаты партнёрам до 1 500 000 ₽/мес',
      'Partners API',
      'Центр сообщений',
      'Защита от фрода',
      'Email-кампании и реферальный дашборд',
      'До 20 пользователей, без лимита групп',
      'Поддержка в Slack',
    ],
  },
  {
    name: 'Enterprise',
    priceMonth: <span style={{ fontSize: 28 }}>По запросу</span>,
    priceYear: <span style={{ fontSize: 28 }}>По запросу</span>,
    per: 'индивидуальные условия',
    perYear: 'индивидуальные условия',
    cta: 'Обсудить условия',
    href: TELEGRAM,
    features: [
      'Всё из Advanced',
      'Выплаты без ограничений',
      'SSO / SAML',
      'Аудит-логи',
      'Выделенный менеджер',
      'Индивидуальный SLA',
    ],
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="ds-band ds-container" style={{ paddingBottom: 40 }}>
        <div style={{ maxWidth: 720, marginInline: 'auto', textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Тарифы</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 14 }}>Цена видна сразу.</h1>
          <p className="rr-lead" style={{ marginTop: 16, marginInline: 'auto', maxWidth: 600 }}>
            Фиксированная подписка плюс прозрачная комиссия 5% за расчёты — из бюджета выплат, а не сверху. НДС не облагается (УСН).
          </p>
        </div>
        <PricingTable plans={PLANS} initialPeriod="Год" discountLabel="−17%" />
      </section>

      {/* Что вы платите */}
      <section className="ds-container" style={{ paddingBottom: 40 }}>
        <div className="card" style={{ maxWidth: 920, marginInline: 'auto', display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 12, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)', flexShrink: 0 }}>
            <Icon name="percent" size={22} />
          </span>
          <div style={{ flex: '1 1 320px' }}>
            <h2 className="rr-h3">Что вы платите</h2>
            <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 10 }}>
              Подписка по тарифу <b style={{ color: 'var(--ink)' }}>+ 5%</b> за расчёты с партнёрами. Комиссия удерживается <b style={{ color: 'var(--ink)' }}>из бюджета на выплаты</b>, а не выставляется сверху отдельным счётом.
            </p>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 10 }}>
              Выплатили 100 000 ₽ → 5 000 ₽ комиссия RevRoute, 95 000 ₽ — партнёрам. Транзитные средства не наш доход. Лимит выплат в тарифе — порог для подбора плана, а не потолок: превысили — переходите на старший тариф, выплаты не блокируются.
            </p>
          </div>
        </div>
      </section>

      <section className="ds-band ds-container">
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 44 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Вопросы о цене</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Коротко о деньгах.</h2>
        </div>
        <div style={{ maxWidth: 760, marginInline: 'auto' }}>
          <FaqList
            items={[
              { q: 'Почему 5%, а не выставляете счёт сверху?', a: '5% — это часть той суммы, которую вы и так платите партнёрам: комиссия удерживается из бюджета на выплаты, отдельного счёта от RevRoute сверху нет. Индивидуальная ставка — свыше 0% до 20% включительно.' },
              { q: 'Что значит «лимит выплат» в тарифе?', a: 'Это порог, по которому подбирается план, а не потолок. Превысили — переходите на старший тариф; выплаты при этом не блокируются.' },
              { q: 'Годовая оплата — это выгоднее?', a: 'Да, при оплате за год действует скидка 17% к помесячной цене. Цены указаны за месяц, в рублях. НДС не облагается (УСН).' },
              { q: 'Это законно?', a: 'Да. Мы работаем по агентским договорам как технический (расчётный) агент вендора. Мы не платёжный агент и не банк. Транзитные средства партнёрам — не наш доход. Данные локализуем в РФ.' },
              { q: 'Что входит в Enterprise?', a: 'Всё из Advanced плюс SSO/SAML, аудит-логи, выделенный менеджер и индивидуальный SLA. Условия и цена — по запросу.' },
            ]}
          />
        </div>
      </section>

      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum"
          title="Запустите партнёрский канал под ключ."
          body="Фиксированная подписка и прозрачные 5% за расчёты — без двойной оплаты."
          primary={{ label: 'Создать программу', href: APP_REGISTER }}
          secondary={{ label: 'Платформа PRM', href: '/prm' }}
        />
      </section>
    </>
  )
}

const CheckIcon = () => (
  <span className="inline-block shrink-0 w-[18px] h-[18px] mt-0.5 rounded-full bg-[var(--accent)]" style={{
    WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E") center/12px no-repeat`,
    mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E") center/12px no-repeat`,
  }} />
)

export type PricingVariant = 'partners' | 'links'

interface PlanCard {
  tier: string
  amount?: string
  amountCustom?: string
  currency?: string
  period?: string
  priceNote: string
  description: string
  ctaText: string
  ctaHref: string
  ctaStyle: 'primary' | 'outline'
  featured?: boolean
  badge?: string
  features: (string | { bold: string; rest: string })[]
}

const partnerPlans: PlanCard[] = [
  {
    tier: 'Business',
    amount: '2\u00a0450',
    currency: '\u20BD',
    period: '/ мес',
    priceNote: 'При оплате за год. Экономия 17%',
    description: 'Для быстрорастущих стартапов, масштабирующих партнёрские и реферальные программы',
    ctaText: 'Начать',
    ctaHref: 'https://app.revroute.ru/',
    ctaStyle: 'outline',
    features: [
      { bold: '125\u00a0000\u00a0\u20BD', rest: ' выплат партнёрам/мес' },
      'Базовые структуры вознаграждений',
      'Двусторонние стимулы',
      'Программные баунти',
      'Аналитика в реальном времени',
      'AI-генератор лендингов',
      'Вебхуки событий',
      'Базовая email-поддержка',
    ],
  },
  {
    tier: 'Advanced',
    amount: '12\u00a0450',
    currency: '\u20BD',
    period: '/ мес',
    priceNote: 'При оплате за год. Экономия 17%',
    description: 'Для масштабирующихся команд с высоким объёмом партнёрского трафика и white-label',
    ctaText: 'Начать',
    ctaHref: 'https://app.revroute.ru/',
    ctaStyle: 'primary',
    featured: true,
    badge: 'Лучшее предложение',
    features: [
      { bold: '750\u00a0000\u00a0\u20BD', rest: ' выплат партнёрам/мес' },
      'Расширенные структуры вознаграждений',
      'Email-кампании',
      'Центр сообщений',
      'Обнаружение фрода',
      'Встроенный реферальный дашборд',
      'Partners API',
      'Приоритетная поддержка в Slack',
    ],
  },
  {
    tier: 'Enterprise',
    amountCustom: 'Индивидуально',
    priceNote: 'Условия под ваш бизнес',
    description: 'Для крупных организаций с выделенной поддержкой и неограниченным использованием',
    ctaText: 'Запросить демо',
    ctaHref: '/contact/support',
    ctaStyle: 'outline',
    features: [
      { bold: 'Безлимитные', rest: ' выплаты партнёрам' },
      'Скидки за объём',
      'Доступ к Partner Network',
      'Публикация в маркетплейсе программ',
      'SSO / SAML',
      'Аудит-логи',
      'Пользовательский SLA',
      'Выделенный менеджер успеха',
    ],
  },
]

const linksPlans: PlanCard[] = [
  {
    tier: 'Free',
    amount: '0',
    currency: '\u20BD',
    period: '/ навсегда',
    priceNote: 'Старт без карты',
    description: 'Для инди-разработчиков и авторов, которые только пробуют платформу',
    ctaText: 'Создать аккаунт',
    ctaHref: 'https://app.revroute.ru/',
    ctaStyle: 'outline',
    features: [
      { bold: '1\u00a0000', rest: ' ссылок' },
      { bold: '50\u00a0000', rest: ' кликов/мес' },
      '1 кастомный домен',
      'Базовая аналитика',
      'Брендированные QR-коды',
      'Community-поддержка',
    ],
  },
  {
    tier: 'Pro',
    amount: '1\u00a0450',
    currency: '\u20BD',
    period: '/ мес',
    priceNote: 'При оплате за год. Экономия 17%',
    description: 'Для маркетинговых команд, которые хотят полный контроль над ссылками',
    ctaText: 'Начать',
    ctaHref: 'https://app.revroute.ru/',
    ctaStyle: 'primary',
    featured: true,
    badge: 'Популярный',
    features: [
      { bold: '50\u00a0000', rest: ' ссылок' },
      { bold: '1 млн', rest: ' кликов/мес' },
      '10 кастомных доменов',
      'UTM-шаблоны, папки, теги',
      'A/B-тесты, диплинки, гео-таргетинг',
      'Расширенная аналитика и конверсии',
      'API, SDK, вебхуки',
    ],
  },
  {
    tier: 'Business',
    amount: '4\u00a0450',
    currency: '\u20BD',
    period: '/ мес',
    priceNote: 'При оплате за год. Экономия 17%',
    description: 'Для растущих команд с высоким объёмом и потребностью в коллаборации',
    ctaText: 'Начать',
    ctaHref: 'https://app.revroute.ru/',
    ctaStyle: 'outline',
    features: [
      { bold: '500\u00a0000', rest: ' ссылок' },
      { bold: '10 млн', rest: ' кликов/мес' },
      '50 кастомных доменов',
      'Командный доступ (RBAC)',
      'Встроенные парольная защита и клоакинг',
      'Приоритетная поддержка',
    ],
  },
  {
    tier: 'Enterprise',
    amountCustom: 'Индивидуально',
    priceNote: 'Условия под ваш бизнес',
    description: 'Для крупных организаций с SAML/SSO и расширенными SLA',
    ctaText: 'Запросить демо',
    ctaHref: '/contact/support',
    ctaStyle: 'outline',
    features: [
      { bold: 'Безлимитные', rest: ' ссылки и клики' },
      'SAML / SSO, аудит-логи',
      'Приватная облачная инсталляция',
      'Выделенный менеджер',
      'SLA 99.99%',
    ],
  },
]

export default function PricingCards({ variant = 'partners' }: { variant?: PricingVariant }) {
  const plans = variant === 'links' ? linksPlans : partnerPlans
  const colsClass = plans.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-5 mt-12 max-w-[480px] lg:max-w-none mx-auto`}>
      {plans.map((plan) => (
        <div
          key={plan.tier}
          className={`relative bg-[var(--bg-white)] border rounded-3xl px-6 py-8 transition-all duration-300 hover:shadow-[var(--shadow)] ${
            plan.featured
              ? 'border-[var(--text)] shadow-[0_0_0_1px_var(--text)] hover:shadow-[0_0_0_1px_var(--text),var(--shadow-lg)]'
              : 'border-[var(--border)] hover:border-[var(--text-dim)]'
          }`}
        >
          {plan.badge && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-xs font-bold tracking-wide px-4 py-1 rounded-full uppercase">
              {plan.badge}
            </span>
          )}

          <div className="text-[15px] font-bold text-[var(--text-secondary)] mb-4 tracking-tight">
            {plan.tier}
          </div>

          <div className="mb-2 flex items-baseline gap-1">
            {plan.amountCustom ? (
              <span className="text-3xl font-extrabold tracking-tight text-[var(--text)] leading-none">
                {plan.amountCustom}
              </span>
            ) : (
              <>
                <span className="text-4xl font-extrabold tracking-[-2px] text-[var(--text)] leading-none">
                  {plan.amount}
                </span>
                <span className="text-2xl font-bold text-[var(--text)]">{plan.currency}</span>
                <span className="text-[13px] text-[var(--text-muted)] ml-0.5">{plan.period}</span>
              </>
            )}
          </div>

          <p className="text-[12px] text-[var(--text-dim)] mb-5">{plan.priceNote}</p>

          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 min-h-[42px]">
            {plan.description}
          </p>

          <a
            href={plan.ctaHref}
            className={`block w-full text-center py-3 px-6 rounded-[10px] text-sm font-semibold transition-all duration-200 cursor-pointer ${
              plan.ctaStyle === 'primary'
                ? 'bg-[var(--accent)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:bg-[var(--accent-hover)] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                : 'bg-[var(--bg-white)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--text-dim)] hover:bg-[var(--bg-muted)]'
            }`}
          >
            {plan.ctaText}
          </a>

          <div className="h-px bg-[var(--border)] my-6" />

          <ul className="list-none">
            {plan.features.map((feature, i) => (
              <li key={i} className="text-sm text-[var(--text-secondary)] py-1.5 flex items-start gap-2.5">
                <CheckIcon />
                <span>
                  {typeof feature === 'string' ? (
                    feature
                  ) : (
                    <>
                      <strong className="font-semibold text-[var(--text)]">{feature.bold}</strong>
                      {feature.rest}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

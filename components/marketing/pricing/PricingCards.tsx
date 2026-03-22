const CheckIcon = () => (
  <span className="inline-block shrink-0 w-[18px] h-[18px] mt-0.5 rounded-full bg-[var(--accent)]" style={{
    WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E") center/12px no-repeat`,
    mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E") center/12px no-repeat`,
  }} />
)

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

const plans: PlanCard[] = [
  {
    tier: 'Business',
    amount: '2 450',
    currency: '\u20BD',
    period: '/ мес',
    priceNote: 'При оплате за год. Экономия 17%',
    description: 'Для быстрорастущих стартапов, масштабирующих партнёрские и реферальные программы',
    ctaText: 'Начать',
    ctaHref: 'https://app.revroute.ru/',
    ctaStyle: 'outline',
    features: [
      { bold: '125 000 \u20BD', rest: ' выплат партнёрам/мес' },
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
    amount: '12 450',
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
      { bold: '750 000 \u20BD', rest: ' выплат партнёрам/мес' },
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

export default function PricingCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-12 max-w-[480px] lg:max-w-none mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.tier}
          className={`relative bg-[var(--bg-white)] border rounded-3xl px-8 py-9 transition-all duration-300 hover:shadow-[var(--shadow)] ${
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
              <span className="text-4xl font-extrabold tracking-tight text-[var(--text)] leading-none">
                {plan.amountCustom}
              </span>
            ) : (
              <>
                <span className="text-5xl font-extrabold tracking-[-2px] text-[var(--text)] leading-none">
                  {plan.amount}
                </span>
                <span className="text-2xl font-bold text-[var(--text)]">{plan.currency}</span>
                <span className="text-[15px] text-[var(--text-muted)] ml-0.5">{plan.period}</span>
              </>
            )}
          </div>

          <p className="text-[13px] text-[var(--text-dim)] mb-5">{plan.priceNote}</p>

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

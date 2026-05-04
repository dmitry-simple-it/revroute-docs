import type { Metadata } from 'next'
import { SolutionPage } from '@/components/marketing/shared/SolutionPage'

export const metadata: Metadata = {
  title: 'Для SaaS: атрибуция и referral-рост — Revroute',
  description:
    'Сквозная атрибуция от клика до MRR, встроенные referral-программы, API, SDK и вебхуки — инфраструктура для product-led роста SaaS.',
  alternates: { canonical: '/solutions/saas' },
}

export default function SaasPage() {
  return (
    <SolutionPage
      cfg={{
        eyebrow: 'Для SaaS',
        eyebrowColor: 'blue',
        title: (
          <>
            Product-led рост —
            <br />
            <em style={{ fontStyle: 'italic' }}>по-новому</em>
          </>
        ),
        desc:
          'Точная сквозная атрибуция от клика до оплаты подписки, референс-программы и интеграция в ваш продукт. Revroute помогает SaaS-командам масштабироваться без потери прозрачности по каналам.',
        heroScreenshot: {
          src: '/images/screenshots/analytics-conversions.png',
          alt: 'Сквозная атрибуция в Revroute: клики, лиды, продажи и подписки SaaS',
          url: 'app.revroute.ru/analytics/conversions',
          glow: 'blue',
        },
        stats: [
          { value: '99.99%', label: 'SLA на API и редиректах' },
          { value: '<70 мс', label: 'Среднее время редиректа по России' },
          { value: '5 SDK', label: 'TypeScript, Python, Go, PHP, Ruby' },
        ],
        sections: [
          {
            eyebrow: 'Атрибуция',
            eyebrowColor: 'green',
            title: (
              <>
                От клика <em style={{ fontStyle: 'italic' }}>до MRR</em>
              </>
            ),
            desc:
              'Понимайте, какие кампании, блогеры и партнёры приводят платящих клиентов. Сквозная атрибуция с учётом пробных периодов и аплифтов.',
            screenshot: {
              src: '/images/screenshots/ltv-customer.png',
              alt: 'Карточка клиента в Revroute: LTV, источник, UTM и таймлайн событий',
              url: 'app.revroute.ru/customers',
              glow: 'green',
            },
            features: [
              { title: 'Server-side трекинг', desc: 'События через API без потерь из-за adblock и ITP.' },
              { title: 'Stripe / YooKassa', desc: 'Подключите биллинг — конверсии считаются сами.' },
              { title: 'Когорты', desc: 'LTV и удержание в разрезе каналов и партнёров.' },
            ],
          },
          {
            eyebrow: 'Referral',
            eyebrowColor: 'purple',
            title: (
              <>
                Рефералки <em style={{ fontStyle: 'italic' }}>встроенные в продукт</em>
              </>
            ),
            desc:
              'Встройте реферальный дашборд в ваш SaaS: ваши пользователи становятся партнёрами без отдельной регистрации и сложных интеграций.',
            features: [
              { title: 'Встроенный дашборд', desc: 'iframe или API — выберите под свой стек.' },
              { title: 'Двусторонние стимулы', desc: 'Скидка клиенту + бонус реферёру — готовая механика.' },
              { title: 'Автовыплаты', desc: 'Моментальные выплаты в крипто, фиат или кредиты в продукт.' },
            ],
          },
          {
            eyebrow: 'Инфраструктура',
            eyebrowColor: 'blue',
            title: (
              <>
                Масштабируется вместе
                <br />
                <em style={{ fontStyle: 'italic' }}>с вашим ростом</em>
              </>
            ),
            desc:
              'REST API, SDK и вебхуки реального времени — встраивается в ваш стек и выдерживает миллиарды событий в год.',
            features: [
              { title: 'REST API', desc: 'Полный интерфейс платформы с rate-limit 3000 rpm.' },
              { title: 'Webhooks', desc: 'HMAC-подписанные события с задержкой <200 мс.' },
              { title: 'Bring your own domain', desc: 'Кастомные домены с SSL автопровижном.' },
            ],
          },
        ],
        quote: {
          text:
            'Нам нужна была точная атрибуция B2B-сделок. Revroute даёт сквозную картину от клика до подписки и позволяет нам принимать решения по росту быстрее.',
          name: 'Илья Миронов',
          role: 'CTO, Paycore',
        },
        relatedLinks: [
          { href: '/analytics', label: 'Аналитика', desc: 'Как считать LTV и ROAS по каналам.' },
          { href: '/partners', label: 'Партнёры', desc: 'Запустите referral за неделю.' },
          { href: '/api', label: 'API и SDK', desc: 'Встраивайте платформу в ваш продукт.' },
        ],
      }}
    />
  )
}

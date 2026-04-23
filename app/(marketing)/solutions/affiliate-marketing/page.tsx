import type { Metadata } from 'next'
import { SolutionPage } from '@/components/marketing/shared/SolutionPage'
import { brandStats } from '@/content/brand-stats'

export const metadata: Metadata = {
  title: 'Аффилиат-маркетинг — платформа партнёрок Revroute',
  description:
    'Запускайте аффилиатные программы для SaaS, e-commerce и финтеха: гибкие комиссии, выплаты, маркетплейс партнёров и атрибуция в реальном времени.',
  alternates: { canonical: '/solutions/affiliate-marketing' },
}

export default function AffiliateMarketingPage() {
  return (
    <SolutionPage
      cfg={{
        eyebrow: 'Для аффилиат-маркетинга',
        eyebrowColor: 'purple',
        title: (
          <>
            Выручка —<br />
            через <em style={{ fontStyle: 'italic' }}>партнёрские программы</em>
          </>
        ),
        desc:
          'Запускайте современные аффилиатные программы с гибкими комиссиями, мгновенной атрибуцией и автоматическими выплатами. Всё, что нужно, чтобы превратить партнёрскую сеть в реальный канал выручки.',
        primary: { href: 'https://app.revroute.ru/', label: 'Запустить программу' },
        secondary: { href: 'https://partners.revroute.ru/', label: 'Стать партнёром' },
        stats: [
          { value: brandStats.partnersCount, label: 'Активных партнёров в сети Revroute' },
          { value: brandStats.commissionsPaid, label: 'Комиссий выплачено партнёрам' },
          { value: brandStats.partnerRevenue, label: 'Выручки принесли партнёрские программы' },
        ],
        sections: [
          {
            eyebrow: 'Гибкие условия',
            eyebrowColor: 'green',
            title: (
              <>
                Любая структура
                <br />
                <em style={{ fontStyle: 'italic' }}>вознаграждения</em>
              </>
            ),
            desc:
              'Стройте программы под ICP: фикс за регистрацию, rev-share с клиента на N месяцев, тиры, бонусы за объём, двусторонние стимулы для клиента.',
            features: [
              {
                title: 'CPA, CPC, rev-share',
                desc: 'Выбирайте модель под продукт — или комбинируйте сразу несколько.',
              },
              {
                title: 'Тиры и бонусы',
                desc: 'Разгоняйте мотивацию верхних партнёров: повышайте ставку при достижении целей.',
              },
              {
                title: 'Двусторонние стимулы',
                desc: 'Скидка клиенту + бонус партнёру — классика high-converting программ.',
              },
            ],
          },
          {
            eyebrow: 'Выплаты',
            eyebrowColor: 'blue',
            title: (
              <>
                Автоматизация —<br />
                <em style={{ fontStyle: 'italic' }}>от клика до выплаты</em>
              </>
            ),
            desc:
              'Налоговый комплаенс, счета, массовые выплаты в несколько валют — берём рутину на себя, чтобы ваша команда занималась ростом.',
            features: [
              { title: 'Массовые выплаты', desc: 'Сотни партнёров — один клик.' },
              { title: 'Налоги и закрывающие', desc: 'Формы, акты и счета генерируются автоматически.' },
              { title: 'Anti-fraud', desc: 'Детектор дубликатов, cookie-stuffing и подозрительных источников.' },
            ],
          },
          {
            eyebrow: 'Masterplace',
            eyebrowColor: 'orange',
            title: (
              <>
                Маркетплейс
                <br />
                <em style={{ fontStyle: 'italic' }}>активных партнёров</em>
              </>
            ),
            desc:
              'Опубликуйте программу в маркетплейсе Revroute и получайте заявки от проверенных блогеров, агентств и арбитражных команд.',
            features: [
              { title: 'Поиск по нише', desc: 'Фильтры по ICP: индустрия, аудитория, страна.' },
              { title: 'Рейтинг партнёров', desc: 'Видите историю конверсий и отзывы других программ.' },
              { title: 'Автоприём', desc: 'Настройте правила автоматического подтверждения.' },
            ],
          },
        ],
        quote: {
          text:
            'Revroute заменил нам и Rewardful, и ручные таблицы. За квартал прирост партнёрской выручки составил 3×.',
          name: 'Артём Соколов',
          role: 'CEO, TapFlow',
        },
        relatedLinks: [
          { href: '/partners', label: 'Как работает /partners', desc: 'Подробнее про продукт партнёрских программ.' },
          { href: '/analytics', label: 'Атрибуция конверсий', desc: 'Почему данные в реальном времени критичны.' },
          { href: '/pricing', label: 'Тарифы партнёрок', desc: 'Сколько стоит запустить программу.' },
        ],
      }}
    />
  )
}

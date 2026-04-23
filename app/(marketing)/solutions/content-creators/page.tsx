import type { Metadata } from 'next'
import { SolutionPage } from '@/components/marketing/shared/SolutionPage'

export const metadata: Metadata = {
  title: 'Для блогеров и авторов — ссылки и аналитика',
  description:
    'Revroute для блогеров и авторов: брендированные короткие ссылки, QR-коды, UTM, аналитика CTR и интеграции с партнёрскими программами для монетизации.',
  alternates: { canonical: '/solutions/content-creators' },
}

export default function ContentCreatorsPage() {
  return (
    <SolutionPage
      cfg={{
        eyebrow: 'Для авторов и блогеров',
        eyebrowColor: 'orange',
        title: (
          <>
            Монетизируйте
            <br />
            вашу <em style={{ fontStyle: 'italic' }}>аудиторию</em>
          </>
        ),
        desc:
          'Короткие ссылки и аналитика уровня маркетингового отдела — для авторов YouTube, Telegram, ВКонтакте, подкастов и Instagram. Подключайтесь к партнёрским программам и зарабатывайте на трафике.',
        primary: { href: 'https://app.revroute.ru/', label: 'Создать аккаунт' },
        secondary: { href: 'https://partners.revroute.ru/', label: 'Стать партнёром' },
        stats: [
          { value: '30%', label: 'Средний рост CTR с брендированными ссылками' },
          { value: '1 клик', label: 'Подключение к партнёрской программе бренда' },
          { value: 'До 70%', label: 'Комиссия в Lifetime-программах партнёров Revroute' },
        ],
        sections: [
          {
            eyebrow: 'Бренд',
            eyebrowColor: 'blue',
            title: (
              <>
                Ссылки,
                <br />
                <em style={{ fontStyle: 'italic' }}>которые узнают</em>
              </>
            ),
            desc:
              'Ваш домен, ваши превью, ваши QR-коды. Аудитория видит бренд, а не случайный сервис сокращения ссылок.',
            features: [
              { title: 'Кастомный домен', desc: 'Свой домен увеличивает CTR до 30%.' },
              { title: 'Кастомные превью', desc: 'OG-карточка с вашим брендом для соцсетей и мессенджеров.' },
              { title: 'QR-коды', desc: 'Автогенерируемые QR для оффлайн-материалов.' },
            ],
          },
          {
            eyebrow: 'Аналитика',
            eyebrowColor: 'green',
            title: (
              <>
                Узнайте,
                <br />
                <em style={{ fontStyle: 'italic' }}>что работает</em>
              </>
            ),
            desc:
              'Какие ролики, посты и выпуски приносят реальную выручку, а какие просто собирают просмотры. Атрибуция до конкретного платящего зрителя.',
            features: [
              { title: 'Источники трафика', desc: 'YouTube, TG, VK, Instagram, подкасты — в одном срезе.' },
              { title: 'Гео / устройство', desc: 'Видите, откуда и с какого устройства слушают/смотрят.' },
              { title: 'Выручка до автора', desc: 'Сквозная атрибуция от просмотра до платежа.' },
            ],
          },
          {
            eyebrow: 'Партнёрки',
            eyebrowColor: 'purple',
            title: (
              <>
                Партнёрские программы —
                <br />
                <em style={{ fontStyle: 'italic' }}>в одном кабинете</em>
              </>
            ),
            desc:
              'Сотни программ от SaaS, маркетплейсов, онлайн-школ и сервисов — подключайтесь в один клик и управляйте выплатами из одного кабинета на partners.revroute.ru.',
            features: [
              { title: 'Маркетплейс программ', desc: 'Фильтр по нише, комиссии и условиям выплат.' },
              { title: 'Единый кабинет', desc: 'Все ваши комиссии и выплаты в одном месте.' },
              { title: 'Выплаты на карту', desc: 'Массовые выплаты, включая самозанятых и ИП.' },
            ],
          },
        ],
        quote: {
          text:
            'Как автор работаю сразу с тремя программами через Revroute. Все комиссии в одном кабинете — намного удобнее, чем вести свои таблицы.',
          name: 'Екатерина Новикова',
          role: 'Автор канала «Рост в цифре»',
        },
        relatedLinks: [
          { href: '/links', label: 'Короткие ссылки', desc: 'Подробнее про link-builder и домены.' },
          { href: '/analytics', label: 'Аналитика', desc: 'Считаем CTR, подписки и выручку.' },
          { href: 'https://partners.revroute.ru/', label: 'Кабинет партнёра', desc: 'Откройте доступ к сотням программ.' },
        ],
      }}
    />
  )
}

import type { Metadata } from 'next'
import { UtmBuilder } from '@/components/marketing/tools/UtmBuilder'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, webApplication } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'UTM-конструктор — бесплатный инструмент Revroute',
  description:
    'Бесплатный UTM-конструктор: собирайте правильно размеченные ссылки для Яндекс.Директа, Google Ads, таргетированной рекламы и соцсетей за секунды.',
  alternates: { canonical: '/tools/utm' },
  openGraph: { url: '/tools/utm' },
}

export default function UtmToolPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Инструменты' },
            { name: 'UTM-конструктор' },
          ]),
          webApplication({
            name: 'UTM-конструктор Revroute',
            url: '/tools/utm',
            description:
              'Бесплатный конструктор UTM-меток для ссылок: соберите правильно размеченные ссылки для Яндекс.Директа, Google Ads, таргетированной рекламы, ВКонтакте, Telegram Ads и email-рассылок за секунды. Без регистрации.',
          }),
        ]}
      />
      <PageHero
        eyebrow="Бесплатный инструмент"
        eyebrowColor="blue"
        title={
          <>
            UTM-<em style={{ fontStyle: 'italic' }}>конструктор</em>
          </>
        }
        desc="Соберите UTM-размеченную ссылку за секунды и скопируйте её в буфер. Без регистрации."
      />

      <section style={{ padding: '20px 0 100px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <UtmBuilder />
        </div>
      </section>

      <PageCTA
        title={
          <>
            Хотите <em style={{ fontStyle: 'italic' }}>большего</em>?
          </>
        }
        desc="В Revroute UTM-шаблоны команды закрепляются и работают вместе с аналитикой конверсий."
        primary={{ href: '/links', label: 'О продукте «Ссылки»' }}
        secondary={{ href: 'https://app.revroute.ru/', label: 'Начать бесплатно' }}
      />
    </>
  )
}

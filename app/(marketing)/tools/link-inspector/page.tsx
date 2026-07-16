import type { Metadata } from 'next'
import { LinkInspector } from '@/components/marketing/tools/LinkInspector'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, webApplication } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Инспектор ссылок — бесплатный инструмент Revroute',
  description:
    'Проверьте короткую ссылку перед переходом: куда она ведёт, какие редиректы по пути, какой сертификат и отдаёт ли метаданные.',
  alternates: { canonical: '/tools/link-inspector' },
  openGraph: { url: '/tools/link-inspector', images: ['/brand/og-default.png'] },
}

export default function LinkInspectorPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Инструменты' },
            { name: 'Инспектор ссылок' },
          ]),
          webApplication({
            name: 'Инспектор ссылок Revroute',
            url: '/tools/link-inspector',
            description:
              'Бесплатный инструмент проверки коротких и длинных ссылок: разбор домена, протокола, пути, UTM-меток и IDN-punycode; цепочка редиректов и метаданные страницы. Без регистрации.',
          }),
        ]}
      />
      <PageHero
        eyebrow="Бесплатный инструмент"
        eyebrowColor="purple"
        title={
          <>
            Инспектор <em style={{ fontStyle: 'italic' }}>ссылок</em>
          </>
        }
        desc="Разберите любую ссылку по частям: домен, протокол, путь, UTM-метки и IDN-punycode. Быстро отличить безопасную ссылку от подозрительной."
      />

      <section style={{ padding: '20px 0 100px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <LinkInspector />
        </div>
      </section>

      <PageCTA
        title={
          <>
            Безопасные <em style={{ fontStyle: 'italic' }}>короткие</em> ссылки
          </>
        }
        desc="Revroute не даёт спамерам маскироваться под ваш бренд: собственный домен, превью и защита от фрода."
        primary={{ href: '/links', label: 'Подробнее о /links' }}
        secondary={{ href: 'https://app.revroute.ru/', label: 'Начать бесплатно' }}
      />
    </>
  )
}

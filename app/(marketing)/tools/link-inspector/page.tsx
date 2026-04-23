import type { Metadata } from 'next'
import { LinkInspector } from '@/components/marketing/tools/LinkInspector'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'

export const metadata: Metadata = {
  title: 'Инспектор ссылок — бесплатный инструмент Revroute',
  description:
    'Проверьте короткую ссылку перед переходом: куда она ведёт, какие редиректы по пути, какой сертификат и отдаёт ли метаданные.',
  alternates: { canonical: '/tools/link-inspector' },
}

export default function LinkInspectorPage() {
  return (
    <>
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

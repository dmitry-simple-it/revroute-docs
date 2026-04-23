import type { Metadata } from 'next'
import { QrBuilder } from '@/components/marketing/tools/QrBuilder'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'

export const metadata: Metadata = {
  title: 'QR-код — бесплатный генератор Revroute',
  description:
    'Генерируйте QR-коды для ссылок, визиток и промо-материалов. Настраиваемый размер, PNG/SVG, без регистрации.',
  alternates: { canonical: '/tools/qr' },
}

export default function QrToolPage() {
  return (
    <>
      <PageHero
        eyebrow="Бесплатный инструмент"
        eyebrowColor="green"
        title={
          <>
            QR-<em style={{ fontStyle: 'italic' }}>генератор</em>
          </>
        }
        desc="Создайте QR-код под любую ссылку за пару секунд. Скачайте PNG или SVG и используйте в промо-материалах."
      />

      <section style={{ padding: '20px 0 100px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <QrBuilder />
        </div>
      </section>

      <PageCTA
        title={
          <>
            Динамические <em style={{ fontStyle: 'italic' }}>QR</em>
          </>
        }
        desc="В Revroute QR-код крепится к короткой ссылке — меняйте целевой URL, не перепечатывая баннеры."
        primary={{ href: '/links', label: 'Подробнее о /links' }}
        secondary={{ href: 'https://app.revroute.ru/', label: 'Создать аккаунт' }}
      />
    </>
  )
}

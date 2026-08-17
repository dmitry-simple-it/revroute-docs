import type { Metadata } from 'next'
import { HeroCentered } from '@/components/ds/HeroCentered'
import { Steps } from '@/components/ds/Steps'
import { LeadForm } from '@/components/marketing/landing/LeadForm'
import { Button, Eyebrow } from '@/components/ds/primitives'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, service } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

export const metadata: Metadata = {
  title: 'Упаковка партнёрской программы',
  description:
    'Упакуем партнёрскую программу: оффер и структура вознаграждений, посадочная и материалы для партнёров, запуск на платформе RevRoute.',
  alternates: { canonical: '/packaging' },
  openGraph: og('/packaging'),
}

export default function PackagingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Упаковка партнёрской программы' },
          ]),
          service({
            name: 'Упаковка партнёрской программы',
            url: '/packaging',
            description:
              'Диагностика продукта и экономики канала, сборка оффера и моделей вознаграждения, посадочная и материалы для партнёров, тест связок оффер-партнёр и запуск программы в маркетплейсе RevRoute.',
            serviceType: 'Partner program packaging',
            audienceType: 'B2B vendors',
          }),
        ]}
      />

      {/* ── 1. Hero — короткий, по канону центрированных hero ── */}
      <HeroCentered
        eyebrow="Услуга"
        title="Упакуем вашу партнёрскую программу"
        body={
          <>
            Оффер и&nbsp;структура вознаграждений, посадочная и&nbsp;материалы для партнёров, запуск на&nbsp;платформе.
          </>
        }
        theses={['Оффер и условия', 'Посадочная и материалы', 'Запуск на платформе']}
        primary={{ label: 'Оставить заявку', href: '#lead', ymGoal: 'packaging_hero_cta', demoCta: 'hero' }}
        secondary={{ label: 'Написать в Telegram', href: TELEGRAM }}
      />

      {/* ── 2. Как проходит — четыре шага (детализация по методологии упаковки), без обещаний сроков ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 24 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Как проходит</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Четыре шага до запуска программы.</h2>
        </div>
        <Steps
          columns={4}
          steps={[
            { icon: 'gauge', title: 'Диагностика.', body: 'Разбираем продукт и экономику канала: чек, LTV, конверсии, программы конкурентов. Определяем профиль целевого партнёра — кто уже рекомендует такие продукты.' },
            { icon: 'rocket', title: 'Упаковка.', body: 'Собираем оффер: модели вознаграждения на выбор, бонусы за объём и целевые действия, условия программы. Плюс посадочная и материалы для партнёров — под вашим брендом.' },
            { icon: 'target', title: 'Тест связок.', body: 'Проверяем связки оффер-партнёр на первых подключениях: какие сегменты партнёров приводят оплаты. Что сработало — усиливаем, что нет — корректируем оффер и материалы.' },
            { icon: 'globe', title: 'Запуск.', body: 'Размещаем оффер в маркетплейсе — после модерации его видят партнёры платформы. Передаём регламенты: онбординг партнёров, FAQ, правила трафика.' },
          ]}
        />
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p className="rr-caption" style={{ marginBottom: 14 }}>Что получаете на руки</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 720, marginInline: 'auto' }}>
            {['Оффер и модели вознаграждения', 'Бонусная система', 'Посадочная и материалы', 'Регламенты онбординга и FAQ', 'Программа в маркетплейсе'].map((t) => (
              <span key={t} className="chip" style={{ padding: '8px 14px', fontSize: 13.5 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Мост: канал под ключ ── */}
      <section className="ds-container" style={{ paddingBottom: 48 }}>
        <div className="card-flat" style={{ maxWidth: 760, marginInline: 'auto', padding: '22px 26px', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <p className="rr-small" style={{ margin: 0, flex: '1 1 380px', color: 'var(--ink-2)' }}>
            Нужна не только упаковка, но и весь канал? Подписка «Канал под ключ»: поиск и онбординг
            партнёров, выплаты и продажи через партнёрскую сеть RevRoute — с гарантией окупаемости.
          </p>
          <Button variant="ghost" size="md" href="/partner-channel" iconRight="arrow-right">Канал под ключ</Button>
        </div>
      </section>

      {/* ── 3. Лид-форма ── */}
      <section id="lead" className="ds-band ds-container" style={{ paddingTop: 0, scrollMarginTop: 90 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 36 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Заявка</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Обсудим вашу программу.</h2>
          <p className="rr-lead" style={{ marginTop: 14, marginInline: 'auto', maxWidth: 560 }}>
            Оставьте контакты — вернёмся с вопросами по продукту и предложением по упаковке.
          </p>
        </div>
        <div style={{ maxWidth: 560, marginInline: 'auto' }}>
          <LeadForm page="packaging" />
        </div>
        <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 24, textAlign: 'center' }}>
          Или напрямую:{' '}
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>Telegram</a>
          {' · '}
          <a href={`mailto:${PARTNERS_EMAIL}`} style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>{PARTNERS_EMAIL}</a>
        </p>
      </section>
    </>
  )
}

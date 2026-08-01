import type { Metadata } from 'next'
import { HeroCentered } from '@/components/ds/HeroCentered'
import { Steps } from '@/components/ds/Steps'
import { LeadForm } from '@/components/marketing/landing/LeadForm'
import { Button, Eyebrow } from '@/components/ds/primitives'

const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

export const metadata: Metadata = {
  title: 'Аудит партнёрской программы',
  description:
    'Аудит партнёрской программы: разберём экономику, УТП и структуру вознаграждений, найдём, что тормозит рост канала, и соберём дорожную карту. Оставьте заявку — обсудим вашу программу.',
  alternates: { canonical: '/audit' },
}

export default function AuditPage() {
  return (
    <>
      {/* ── 1. Hero — коротко, по канону journey-этапа 01 ── */}
      <HeroCentered
        eyebrow="Услуга"
        title="Аудит партнёрской программы"
        body={
          <>
            Разберём экономику и&nbsp;точки роста: механика, УТП, структура вознаграждений — и&nbsp;что тормозит рост канала.
          </>
        }
        theses={['Экономика и УТП', 'Структура вознаграждений', 'Точки роста']}
        primary={{ label: 'Оставить заявку', href: '#lead', ymGoal: 'audit_hero_cta' }}
        secondary={{ label: 'Написать в Telegram', href: TELEGRAM }}
      />

      {/* ── 2. Как проходит — три шага, без обещаний сроков ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 24 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Как проходит</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Три шага до дорожной карты.</h2>
        </div>
        <Steps
          columns={3}
          steps={[
            { icon: 'eye', title: 'Разбор программы.', body: 'Смотрим условия глазами партнёра: статусы, вознаграждения, закрепление сделок, материалы. Сверяем экономику: чек, LTV, стоимость привлечения.' },
            { icon: 'list-checks', title: 'Оценка по чек-листу.', body: 'Проверяем программу по ключевым блокам — от структуры и коммерческих условий до маркетинга и спорных ситуаций: что есть, чего не хватает, что тормозит рост.' },
            { icon: 'trending-up', title: 'Рекомендации.', body: 'Отчёт с приоритетными исправлениями и дорожной картой: что чинить сначала, как усилить оффер и где автоматизация снимет ручной труд.' },
          ]}
        />
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p className="rr-caption" style={{ marginBottom: 14 }}>Что получаете на руки</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 720, marginInline: 'auto' }}>
            {['Оценка программы по блокам', 'Карта пробелов', 'Приоритетные исправления', 'Дорожная карта развития'].map((t) => (
              <span key={t} className="chip" style={{ padding: '8px 14px', fontSize: 13.5 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Мост: канал под ключ ── */}
      <section className="ds-container" style={{ paddingBottom: 48 }}>
        <div className="card-flat" style={{ maxWidth: 760, marginInline: 'auto', padding: '22px 26px', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <p className="rr-small" style={{ margin: 0, flex: '1 1 380px', color: 'var(--ink-2)' }}>
            Нужен не только диагноз, но и руки? Подписка «Канал под ключ»: строим и ведём
            партнёрский канал за вас — с гарантией окупаемости.
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
            Оставьте контакты — вернёмся с вопросами по программе и форматом аудита.
          </p>
        </div>
        <div style={{ maxWidth: 560, marginInline: 'auto' }}>
          <LeadForm page="audit" />
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

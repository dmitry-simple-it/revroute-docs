import type { Metadata } from 'next'
import { HeroPicker } from '@/components/ds/HeroPicker'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { VideoEmbed } from '@/components/ds/VideoEmbed'
import { BrowserFrame } from '@/components/ds/Hero'
import { Eyebrow, Icon, Button } from '@/components/ds/primitives'

/** Compact two-column icon bullets — ClickBank audience-band pattern. */
function ValueBullets({ items }: { items: { icon: string; label: string; soon?: boolean }[] }) {
  return (
    <div className="rr-vbullets">
      {items.map((b) => (
        <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ display: 'inline-flex', width: 30, height: 30, borderRadius: 9, background: b.soon ? 'var(--chip-bg)' : 'var(--accent-bg)', border: `1px solid ${b.soon ? 'var(--line)' : 'var(--accent-line)'}`, alignItems: 'center', justifyContent: 'center', color: b.soon ? 'var(--ink-3)' : 'var(--accent-strong)', flexShrink: 0 }}>
            <Icon name={b.icon} size={15} strokeWidth={2.2} />
          </span>
          <span className="rr-small" style={{ color: b.soon ? 'var(--ink-3)' : 'var(--ink)', fontWeight: 500 }}>
            {b.label}{b.soon && <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', border: '1px solid var(--line)', borderRadius: 999, padding: '1px 6px', marginLeft: 7, verticalAlign: 'middle' }}>Скоро</span>}
          </span>
        </span>
      ))}
    </div>
  )
}

const APP_REGISTER = 'https://app.revroute.ru/register'
const PARTNERS = 'https://partners.revroute.ru/'
const TELEGRAM = 'https://t.me/revroute_bot'

export const metadata: Metadata = {
  title: 'Масштабируйте бизнес с партнёрами — PRM-платформа',
  description:
    'RevRoute — AI-native PRM-платформа и партнёрская сеть для B2B: сотрудничайте с инфлюенсерами, экспертами и лояльными клиентами. Атрибуция до оплаты, расчёты под ключ, оплата за результат.',
  alternates: { canonical: '/' },
}

/* Путь партнёрской программы — этапы прозрачны обеим аудиториям (вендору и партнёру). */
const JOURNEY = [
  { n: '01', icon: 'list-checks', title: 'Аудит и стратегия', body: 'Разбираем экономику и точки роста партнёрской программы: механика, УТП, структура вознаграждений.', soon: true },
  { n: '02', icon: 'rocket', title: 'Упаковка и запуск', body: 'Оффер, условия, посадочная и материалы для партнёров — программа готова принимать заявки.', soon: true },
  { n: '03', icon: 'users', title: 'Платформа и выплаты', body: 'Трекинг до оплаты, кабинеты вендора и партнёра, вознаграждения и выплаты с документами.', href: '/prm' },
  { n: '04', icon: 'globe', title: 'Партнёры и продвижение', body: 'Маркетплейс офферов и готовая сеть партнёров — рекомендации начинают работать и приводить клиентов.', soon: true },
  { n: '05', icon: 'trending-up', title: 'Системная работа', body: 'Вовлечение и мотивация партнёров: центр сообщений, email-кампании, бонусы и аналитика канала — уже в платформе.', href: '/prm' },
]

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero — позиционирование в духе PartnerStack: рост через B2B-партнёрства ── */}
      <HeroPicker
        eyebrow="PRM-платформа & партнёрская сеть для B2B"
        title="Масштабируйте бизнес с партнёрами"
        body="Увеличивайте выручку, сотрудничая с инфлюенсерами, экспертами и лояльными клиентами. Управляйте потоком рекомендаций на AI-native PRM-платформе."
        theses={['Расчёты под ключ', 'Без разработки', 'Оплата за результат']}
        primary={{ label: 'Создать программу', href: APP_REGISTER }}
        secondary={{ label: 'Узнать о платформе', href: '/prm' }}
        defaultProduct={0}
        products={[
          { id: 'prm', icon: 'users', label: 'PRM-платформа', href: '/prm' },
          { id: 'links', icon: 'link', label: 'Ссылки и трекинг', soon: true },
          { id: 'network', icon: 'globe', label: 'Партнёрская сеть', soon: true },
          { id: 'pack', icon: 'rocket', label: 'Упаковка партнёрского оффера', soon: true },
          { id: 'audit', icon: 'list-checks', label: 'Аудит партнёрской программы', soon: true },
          { id: 'api', icon: 'code', label: 'API', soon: true },
        ]}
        railCta={{ label: 'Я партнёр', sub: 'офферы и условия', href: '/partners' }}
      />

      {/* ── 2. Вендору: демо-видео + 6 возможностей (паттерн ClickBank Sellers) ── */}
      <section className="ds-band ds-container">
        <div className="ds-split" style={{ alignItems: 'center' }}>
          <div>
            <Eyebrow>Привлекайте клиентов через партнёров</Eyebrow>
            <h2 className="rr-h2" style={{ marginTop: 14 }}>Запустите свою программу.</h2>
            <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 14, maxWidth: 480 }}>
              Рекомендации превращаются в учтённую, оплаченную выручку — а выплаты, документы и антифрод платформа берёт на себя.
            </p>
            <ValueBullets items={[
              { icon: 'link', label: 'Трекинг и атрибуция' },
              { icon: 'users', label: 'Управление партнёрами' },
              { icon: 'globe', label: 'Маркетплейс офферов' },
              { icon: 'banknote', label: 'Выплаты и документы' },
              { icon: 'bar-chart-3', label: 'Данные и аналитика' },
              { icon: 'shield-check', label: 'Антифрод и комплаенс' },
            ]} />
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" href={APP_REGISTER} data-ym-goal="landing_signup_click">Создать программу</Button>
              <Button variant="ghost" size="md" href="/prm" iconRight="arrow-right">Подробнее о платформе</Button>
            </div>
          </div>
          <VideoEmbed
            style={{ width: '100%' }}
            sources={[
              { src: '/videos/revroute-promo.webm', type: 'video/webm' },
              { src: '/videos/revroute-promo.mp4', type: 'video/mp4' },
            ]}
            poster="/images/screenshots/ru/overview.png"
            posterAlt="Кабинет вендора RevRoute — обзор партнёрской программы"
            chrome="Промо RevRoute"
            title="Как рекомендация становится выплатой — за 50 секунд"
            duration="0:50"
          />
        </div>
      </section>

      {/* ── 3. Партнёру: что ему реально важно — комиссии, офферы, материалы, поддержка ── */}
      <section className="ds-container" style={{ paddingBottom: 'var(--band-py)' }}>
        <div className="ds-split" style={{ alignItems: 'center' }}>
          <BrowserFrame shot="/images/screenshots/ru/partner-overview.png" alt="Кабинет партнёра RevRoute — статистика и выплаты (данные демо-программы)" url="partners.revroute.ru" />
          <div>
            <Eyebrow>Монетизируйте аудиторию и экспертизу</Eyebrow>
            <h2 className="rr-h2" style={{ marginTop: 14 }}>Станьте партнёром.</h2>
            <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 14, maxWidth: 480 }}>
              Рекомендуйте проверенные B2B-сервисы и зарабатывайте до 50% с платежей — по офферам маркетплейса, с материалами и поддержкой по каждому продукту.
            </p>
            <ValueBullets items={[
              { icon: 'zap', label: 'Высокие комиссии — до 50%' },
              { icon: 'globe', label: 'Растущий маркетплейс офферов' },
              { icon: 'badge-check', label: 'Вендоры проверены вручную' },
              { icon: 'sparkles', label: 'Материалы и посадочные по офферам' },
              { icon: 'message-circle', label: 'Выделенная поддержка' },
              { icon: 'file-check', label: 'Выплаты с чеками и актами' },
            ]} />
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" href={PARTNERS}>Стать партнёром</Button>
              <Button variant="ghost" size="md" href="/partners" iconRight="arrow-right">Подробнее партнёрам</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Путь партнёрской программы — прозрачен обеим сторонам ── */}
      <section className="ds-band ds-container" style={{ background: 'transparent' }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 44 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Путь программы</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Весь путь партнёрской программы — прозрачно.</h2>
          <p className="rr-lead" style={{ marginTop: 14, marginInline: 'auto', maxWidth: 640 }}>
            Компания видит, что мы делаем на каждом шаге, чтобы канал приносил выручку. Партнёр видит, что попадает в зрелые программы — с понятными условиями, материалами и дисциплиной выплат.
          </p>
        </div>
        <div className="ds-grid-3">
          {JOURNEY.map((s) => {
            const inner = (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: s.soon ? 'var(--chip-bg)' : 'var(--brand-ramp)', border: s.soon ? '1px solid var(--line)' : 'none', alignItems: 'center', justifyContent: 'center', color: s.soon ? 'var(--ink-3)' : '#fff' }}>
                    <Icon name={s.icon} size={20} strokeWidth={2} />
                  </span>
                  <span className="rr-mono" aria-hidden style={{ fontSize: 34, fontWeight: 600, lineHeight: 1, color: s.soon ? 'var(--line-strong)' : 'var(--accent-line)' }}>{s.n}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                  <h3 className="rr-h3" style={s.soon ? { color: 'var(--ink-3)' } : undefined}>{s.title}</h3>
                  {s.soon && <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', border: '1px solid var(--line)', borderRadius: 999, padding: '2px 7px', flexShrink: 0 }}>Скоро</span>}
                </div>
                <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{s.body}</p>
                {s.href && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 14, fontWeight: 500, color: 'var(--accent-strong)' }}>Подробнее <Icon name="arrow-right" size={15} color="var(--accent-strong)" /></span>}
              </>
            )
            return s.href ? (
              <a key={s.n} href={s.href} className="card" style={{ textDecoration: 'none' }}>{inner}</a>
            ) : (
              <div key={s.n} className="card-flat">{inner}</div>
            )
          })}
        </div>
      </section>

      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum"
          title="Масштабируйте бизнес с партнёрами."
          body="Компаниям — программа с атрибуцией до оплаты и расчётами под ключ. Партнёрам — офферы, материалы и комиссии до 50%."
          primary={{ label: 'Создать программу', href: APP_REGISTER }}
          secondary={{ label: 'Стать партнёром', href: PARTNERS }}
        />
      </section>
    </>
  )
}

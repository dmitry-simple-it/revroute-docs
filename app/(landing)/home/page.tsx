import type { Metadata } from 'next'
import { HeroPicker } from '@/components/ds/HeroPicker'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon } from '@/components/ds/primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'
const PARTNERS = 'https://partners.revroute.ru/'
const TELEGRAM = 'https://t.me/revroute_bot'

export const metadata: Metadata = {
  title: 'Партнёрский канал под ключ — PRM-платформа',
  description:
    'RevRoute — PRM-платформа для B2B SaaS: запуск и ведение партнёрской программы, атрибуция реферального трафика до оплаты и расчёты с партнёрами под ключ. Партнёрский канал под ключ.',
  alternates: { canonical: '/home' },
}

const CHANNEL = [
  { icon: 'users', title: 'PRM-платформа', body: 'Ядро: подключение партнёров, атрибуция до оплаты, вознаграждения и расчёты под ключ.', href: '/prm', live: true },
  { icon: 'rocket', title: 'Упаковка программы', body: 'Соберём оффер, условия и посадочную для партнёров и запустим программу за вас.' },
  { icon: 'list-checks', title: 'Аудит программы', body: 'Разбор работающей программы: атрибуция, мотивация, риски — что чинить.' },
  { icon: 'globe', title: 'Партнёрская сеть', body: 'Готовая сеть партнёров, которые уже готовы продвигать ваш продукт.' },
]

export default function HomePage() {
  return (
    <>
      <HeroPicker
        eyebrow="PRM-платформа · партнёрский канал под ключ"
        title="Партнёрский канал под ключ."
        body="PRM-платформа для B2B SaaS: запуск и ведение партнёрской программы, атрибуция реферального трафика до оплаты и расчёты с партнёрами — в одном кабинете."
        theses={['Атрибуция до оплаты', 'Расчёты под ключ', 'Без своей разработки']}
        primary={{ label: 'Создать программу', href: APP_REGISTER }}
        secondary={{ label: 'Платформа PRM', href: '/prm' }}
        defaultProduct={0}
        products={[
          { id: 'prm', icon: 'users', label: 'PRM-платформа', href: '/prm' },
          { id: 'links', icon: 'link', label: 'Ссылки и трекинг', soon: true },
          { id: 'network', icon: 'globe', label: 'Партнёрская сеть', soon: true },
          { id: 'pack', icon: 'rocket', label: 'Упаковка', soon: true },
          { id: 'audit', icon: 'list-checks', label: 'Аудит', soon: true },
          { id: 'api', icon: 'code', label: 'API', soon: true },
        ]}
        railCta={{ label: 'Я партнёр', sub: 'partners.revroute.ru', href: PARTNERS }}
      />

      {/* Канал под ключ */}
      <section className="ds-band ds-container">
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 44 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Канал под ключ</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Весь путь партнёрского канала — в одном месте.</h2>
          <p className="rr-lead" style={{ marginTop: 14, marginInline: 'auto', maxWidth: 620 }}>
            Ядро — PRM-платформа. Вокруг — услуги старта и готовая сеть партнёров. Ссылки и трекинг — фундамент и вход.
          </p>
        </div>
        <div className="ds-grid-4">
          {CHANNEL.map((c) => {
            const inner = (
              <>
                <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: c.live ? 'var(--brand-ramp)' : 'var(--chip-bg)', border: c.live ? 'none' : '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: c.live ? '#fff' : 'var(--ink-3)' }}>
                  <Icon name={c.icon} size={20} strokeWidth={2} />
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                  <h3 className="rr-h3" style={{ fontSize: '1.0625rem' }}>{c.title}</h3>
                  {!c.live && <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-4)', border: '1px solid var(--line)', borderRadius: 999, padding: '2px 7px' }}>Скоро</span>}
                </div>
                <p className="rr-body" style={{ fontSize: 14.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 }}>{c.body}</p>
                {c.live && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 14, fontWeight: 500, color: 'var(--accent-strong)' }}>Подробнее <Icon name="arrow-right" size={15} color="var(--accent-strong)" /></span>}
              </>
            )
            return c.href ? (
              <a key={c.title} href={c.href} className="card" style={{ textDecoration: 'none' }}>{inner}</a>
            ) : (
              <div key={c.title} className="card-flat">{inner}</div>
            )
          })}
        </div>
      </section>

      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum"
          title="Запустите партнёрский канал под ключ."
          body="Подключение партнёров, атрибуция до оплаты и расчёты с ними — без своей разработки."
          primary={{ label: 'Создать программу', href: APP_REGISTER }}
          secondary={{ label: 'Написать в Telegram', href: TELEGRAM }}
        />
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { Hero } from '@/components/ds/Hero'
import { FeatureTabs } from '@/components/ds/FeatureTabs'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Chip, Button } from '@/components/ds/primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'
const TELEGRAM = 'https://t.me/revroute_bot'

export const metadata: Metadata = {
  title: 'Для SaaS — партнёрский канал и атрибуция',
  description:
    'RevRoute для B2B SaaS: атрибуция реферального трафика до оплаты, встроенные реферальные программы и расчёты с партнёрами под ключ. Растите выручку через партнёров и рекомендации.',
  alternates: { canonical: '/solutions/saas' },
}

function SectionHead({ eyebrow, title, sub, center }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ maxWidth: center ? 760 : 720, marginInline: center ? 'auto' : undefined, textAlign: center ? 'center' : 'left', marginBottom: 44 }}>
      <Eyebrow style={center ? { justifyContent: 'center' } : undefined}>{eyebrow}</Eyebrow>
      <h2 className="rr-h2" style={{ marginTop: 14 }}>{title}</h2>
      {sub && <p className="rr-lead" style={{ marginTop: 16, marginInline: center ? 'auto' : undefined, maxWidth: 640 }}>{sub}</p>}
    </div>
  )
}

export default function SaasSolutionPage() {
  return (
    <>
      {/* ── Hero ── */}
      <Hero
        eyebrow="Решение · Для SaaS"
        title="Растите выручку через партнёров и рекомендации."
        body="PRM-платформа для B2B SaaS: атрибуция реферального трафика до оплаты и расчёты с партнёрами под ключ — без своей разработки."
        primary={{ label: 'Создать программу', href: APP_REGISTER, ymGoal: 'landing_signup_click' }}
        secondary={{ label: 'Узнать о платформе', href: '/prm' }}
        trust={['Атрибуция до оплаты', 'Stripe и YooKassa', 'Выплаты под ключ']}
        shot="/images/screenshots/ru/analytics.png"
        shotAlt="Аналитика конверсий партнёрского трафика в RevRoute"
        shotUrl="app.revroute.ru/analytics"
      />

      {/* ── Боль сегмента ── */}
      <section className="ds-band ds-container">
        <SectionHead
          eyebrow="Знакомо?"
          title="Рекомендации приводят клиентов — но канал в тумане."
          sub="Вы уже продаёте через партнёров и рекомендации, но управлять этим вручную дальше не получается."
        />
        <div className="ds-grid-4">
          {[
            { icon: 'mouse-pointer-click', t: 'Источник теряется', b: 'Сделки через рекомендации идут вручную — кто привёл клиента, потом не восстановить.' },
            { icon: 'bar-chart-3', t: 'Не видно выручку', b: 'Атрибуции до оплаты нет: считаете клики, а не платящих клиентов и MRR.' },
            { icon: 'receipt', t: 'Выплаты — головная боль', b: 'Партнёры разного статуса (самозанятые, ИП, юрлица): договоры, чеки и переводы съедают время.' },
            { icon: 'code', t: 'Своя разработка — дорого', b: 'Свой партнёрский трекинг и кабинет — это месяцы разработки и поддержка.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Когда мы даём ценность ── */}
      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <div className="card" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', boxShadow: 'none', display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Icon name="info" size={22} color="var(--accent-strong)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: '1 1 320px' }}>
            <p className="rr-body" style={{ color: 'var(--ink)', margin: 0 }}>
              Мы полезны, когда канал уже зарождается: вы сами продаёте продукт, сделали несколько сделок через рекомендации и поняли ICP партнёра. Ориентир — выручка ~5–10 млн ₽/год.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              <Chip>больше 10 партнёров</Chip>
              <Chip>схема «клиент = реферал»</Chip>
              <Chip>нужна атрибуция и антифрод</Chip>
            </div>
          </div>
        </div>
      </section>

      {/* ── Как RevRoute закрывает на языке SaaS ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Как это работает"
          title="Одна платформа, а не пять подписок."
          sub="Реферальный трафик доходит до выручки и до выплаты партнёру — в едином контуре."
        />
        <div className="ds-grid-3">
          {[
            { icon: 'link', t: 'Ссылки и атрибуция', b: 'Реферальный трафик размечается и доводится до оплаты на стороне сервера — без потери конверсий.' },
            { icon: 'users', t: 'PRM-ядро', b: 'Подключение партнёров, гибкие вознаграждения, сегменты и защита от накрутки.' },
            { icon: 'banknote', t: 'Расчёты под ключ', b: 'Один счёт — выплаты всем партнёрам; чеки и документы по юр-статусам на нас.' },
          ].map((c, i) => (
            <div key={c.t} className="card" style={{ position: 'relative' }}>
              <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--brand-ramp)', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name={c.icon} size={20} strokeWidth={2} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ marginTop: 8 }}>{c.b}</p>
              {i < 2 && <span aria-hidden style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', zIndex: 2 }}><Icon name="chevron-right" size={20} /></span>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <Button variant="ghost" size="lg" href="/prm" iconRight="arrow-right">Платформа PRM целиком</Button>
        </div>
      </section>

      {/* ── Что важно для SaaS ── */}
      <section className="ds-band ds-container">
        <SectionHead
          eyebrow="Под задачу SaaS"
          title="Считаем то, что влияет на MRR."
          sub="Не клики ради кликов, а платящие клиенты и пожизненная ценность."
        />
        <FeatureTabs
          features={[
            { icon: 'bar-chart-3', title: 'Атрибуция до оплаты', body: 'Реферальный трафик считается на стороне сервера: клик → лид → оплата, с окном атрибуции до 180 дней. Видно, кто приводит платящих, а не клики.', shot: '/images/screenshots/ru/analytics.png', url: 'app.revroute.ru/analytics' },
            { icon: 'trending-up', title: 'Когорты и LTV', body: 'Смотрите выручку партнёрских когорт во времени — не только первый платёж, но и пожизненную ценность клиента.', shot: '/images/screenshots/ltv-customer.png', url: 'app.revroute.ru/customers' },
            { icon: 'sliders', title: 'Двусторонние стимулы', body: 'Бонус партнёру и выгода клиенту в одной механике — реферальные программы внутри вашего продукта.', shot: '/images/screenshots/ru/rewards.png', url: 'app.revroute.ru/rewards' },
            { icon: 'users', title: 'Сегменты партнёров', body: 'Группы и индивидуальные условия для интеграторов, агентств и амбассадоров — без пересборки программы.', shot: '/images/screenshots/ru/overview.png', url: 'app.revroute.ru/partners' },
          ]}
        />
      </section>

      {/* ── Расчёты тизер ── */}
      <section style={{ background: 'var(--wash)', borderBlock: '1px solid var(--line)' }}>
        <div className="ds-band ds-container" style={{ textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Дифференциатор</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14, maxWidth: 680, marginInline: 'auto' }}>Расчёты с партнёрами под ключ.</h2>
          <p className="rr-lead" style={{ marginTop: 16, maxWidth: 600, marginInline: 'auto' }}>
            Один счёт → разносим всем партнёрам. Договоры, чеки и статусы (самозанятые, ИП, юрлица) — на нас. Комиссия 5% из бюджета выплат, не сверху.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
            <Button variant="ghost" size="lg" href="/prm" iconRight="arrow-right">Как устроены расчёты</Button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="ds-band ds-container">
        <SectionHead center eyebrow="Вопросы" title="Частые вопросы." />
        <div style={{ maxWidth: 760, marginInline: 'auto' }}>
          <FaqList
            items={[
              { q: 'Как считается атрибуция?', a: 'На стороне сервера, по пути клик → лид → оплата. Окно атрибуции — до 180 дней. Это точнее click-based трекинга и не теряет конверсии в одностраничных приложениях.' },
              { q: 'С чем интегрируется оплата и CRM?', a: 'Stripe и YooKassa из коробки, плюс Partners API и вебхуки для собственной логики. CRM — amoCRM и Bitrix24.' },
              { q: 'Можно встроить реферальную программу в продукт?', a: 'Да — через виджет и API, чтобы пользователи приглашали и получали вознаграждение прямо внутри вашего сервиса.' },
              { q: 'Чем это отличается от обычного PRM?', a: 'Мы закрываем то, где локальные PRM заканчиваются: расчёты с партнёрами и документооборот под РФ-комплаенс. Подробнее — на странице платформы PRM.' },
            ]}
          />
        </div>
      </section>

      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <CtaBottom
          tone="spectrum"
          title="Партнёрский рост для вашего SaaS."
          body="Атрибуция до оплаты, встроенные реферальные программы и выплаты под ключ."
          primary={{ label: 'Создать программу', href: APP_REGISTER }}
          secondary={{ label: 'Написать в Telegram', href: TELEGRAM }}
        />
      </section>
    </>
  )
}

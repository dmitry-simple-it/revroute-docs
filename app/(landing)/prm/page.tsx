import type { Metadata } from 'next'
import { Hero, BrowserFrame } from '@/components/ds/Hero'
import { Steps } from '@/components/ds/Steps'
import { FeatureTabs } from '@/components/ds/FeatureTabs'
import { ComparisonTable } from '@/components/ds/ComparisonTable'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Button } from '@/components/ds/primitives'

const APP_REGISTER = 'https://app.revroute.ru/register'
const TELEGRAM = 'https://t.me/revroute_bot'

export const metadata: Metadata = {
  title: 'PRM-платформа для партнёрских программ',
  description:
    'RevRoute — PRM-платформа для запуска и ведения партнёрской программы: подключение партнёров, атрибуция до оплаты, контроль в реальном времени и расчёты с партнёрами под ключ. Без своей разработки и ручных таблиц.',
  alternates: { canonical: '/prm' },
}

function SectionHead({ eyebrow, title, sub, center }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ maxWidth: center ? 760 : 720, marginInline: center ? 'auto' : undefined, textAlign: center ? 'center' : 'left', marginBottom: 40 }}>
      <Eyebrow style={center ? { justifyContent: 'center' } : undefined}>{eyebrow}</Eyebrow>
      <h2 className="rr-h2" style={{ marginTop: 14 }}>{title}</h2>
      {sub && <p className="rr-lead" style={{ marginTop: 14, marginInline: center ? 'auto' : undefined, maxWidth: 640 }}>{sub}</p>}
    </div>
  )
}

/** Promo video in a browser frame. Plays the real ~50s promo; poster shows until play. */
function DemoVideo() {
  return (
    <div style={{ position: 'relative', maxWidth: 980, marginInline: 'auto' }}>
      <div style={{ position: 'absolute', inset: '-60px -10px', zIndex: 0, background: 'radial-gradient(circle at 50% 30%, rgba(124,58,237,.14), transparent 62%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, background: '#fff', border: '1px solid var(--line)', borderRadius: 18, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderBottom: '1px solid var(--line-2)', background: 'var(--bg)' }}>
          <span style={{ display: 'flex', gap: 6 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--line)' }} />)}</span>
          <span style={{ marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>Промо RevRoute · 50&nbsp;секунд</span>
        </div>
        <video controls playsInline preload="none" poster="/videos/revroute-promo-poster.jpg" style={{ display: 'block', width: '100%', height: 'auto', background: '#000' }}>
          <source src="/videos/revroute-promo.webm" type="video/webm" />
          <source src="/videos/revroute-promo.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  )
}

export default function PrmPage() {
  return (
    <>
      {/* ── 1. Hero — категория PRM + core job вендора ── */}
      <Hero
        eyebrow="PRM-платформа для B2B SaaS"
        title="Запускайте и ведите партнёрскую программу."
        body={
          <>
            Превращайте рекомендации партнёров в&nbsp;учтённую и&nbsp;оплаченную выручку: атрибуция до&nbsp;оплаты и&nbsp;<b style={{ color: 'var(--ink)', fontWeight: 600 }}>расчёты с&nbsp;партнёрами под&nbsp;ключ</b> — без&nbsp;своей разработки и&nbsp;ручных таблиц.
            <span className="rr-small" style={{ display: 'block', marginTop: 12, color: 'var(--ink-3)' }}>PRM — управление отношениями с&nbsp;партнёрами. CRM — про&nbsp;клиентов, PRM — про&nbsp;партнёров.</span>
          </>
        }
        primary={{ label: 'Создать программу', href: APP_REGISTER, ymGoal: 'landing_signup_click' }}
        secondary={{ label: 'Посмотреть демо', href: '#demo' }}
        trust={['Без своей разработки', 'Расчёты под ключ', 'Данные клиентов — у вас']}
        shot="/images/screenshots/ru/overview.png"
        shotAlt="Обзор партнёрской программы в кабинете RevRoute"
        shotUrl="app.revroute.ru"
      />

      {/* ── 2. Как это работает — промо-видео + job-карта (4 шага с «контролем») ── */}
      <section id="demo" className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Как это работает"
          title="Рекомендация → атрибуция → оплата."
          sub="Один цикл без таблиц и переписок: подключили партнёра, увидели путь до оплаты, заплатили под ключ."
        />
        <DemoVideo />
        <Steps
          columns={4}
          style={{ marginTop: 48 }}
          steps={[
            { icon: 'user-plus', title: 'Подключаете партнёров.', body: 'Создаёте оффер и условия, партнёр регистрируется и получает свои ссылки, промокоды и материалы.' },
            { icon: 'bar-chart-3', title: 'Считаем до оплаты.', body: 'Трафик атрибутируется партнёру по пути клик → лид → оплата — на стороне сервера, без потери конверсий.' },
            { icon: 'eye', title: 'Контролируете в реальном времени.', body: 'Видно, кто приводит платящих клиентов, а не просто трафик. Защита от накрутки отсекает самореференс и фрод.' },
            { icon: 'banknote', title: 'Платим под ключ.', body: 'Комиссии начисляются автоматически. Один счёт — разносим всем партнёрам; чеки, акты и статусы — на нас.' },
          ]}
        />
      </section>

      {/* ── 3. Квалификатор зрелости (после механизма) ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Для кого"
          title="Excel или автоматизация?"
          sub="Честно говорим, когда мы ещё не нужны. Ориентир — выручка ~5–10 млн ₽/год и зарождающийся партнёрский канал."
        />
        <div className="ds-grid-2">
          <div className="card-flat">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 10, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)' }}><Icon name="clock" size={18} /></span>
              <h3 className="rr-h3">Хватит ручного управления</h3>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Партнёров меньше десяти', 'Вы тестируете гипотезу канала', 'Штучные сделки со сверхвысоким чеком'].map((t) => (
                <li key={t} className="rr-small" style={{ display: 'flex', gap: 10, color: 'var(--ink-2)' }}>
                  <Icon name="minus" size={18} color="var(--ink-4)" style={{ marginTop: 1, flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 10, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)' }}><Icon name="rocket" size={18} /></span>
              <h3 className="rr-h3">Пора автоматизировать</h3>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Больше 10 партнёров', 'Схема «клиент = партнёр по рекомендации»', 'Появилась сетевая или многоуровневая структура', 'Нужны точная атрибуция и защита от накрутки'].map((t) => (
                <li key={t} className="rr-small" style={{ display: 'flex', gap: 10, color: 'var(--ink)' }}>
                  <Icon name="check" size={18} color="var(--accent)" strokeWidth={2.4} style={{ marginTop: 1, flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4. Дифференциатор №1 — расчёты под ключ (жирный) ── */}
      <section style={{ background: 'var(--wash)', borderBlock: '1px solid var(--line)' }}>
        <div className="ds-band ds-container">
          <div className="ds-split">
            <div>
              <Eyebrow>Дифференциатор №1</Eyebrow>
              <h2 className="rr-h2" style={{ marginTop: 14 }}>Расчёты с партнёрами под ключ.</h2>
              <p className="rr-lead" style={{ marginTop: 16 }}>Там, где локальные PRM отдают выплаты вам, — мы закрываем их целиком. Один счёт → разносим всем партнёрам.</p>
              <ul style={{ listStyle: 'none', margin: '28px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Один счёт вместо сотни переводов — платите как одному поставщику.',
                  'Документооборот по самозанятым, ИП и юрлицам — берём на себя.',
                  'Чек партнёра оформляется на вас: вы заказчик услуги — так и должно быть.',
                  'Ваши деньги на выплаты — транзит, а не наш доход.',
                  'Комиссия 5% от стоимости целевого действия. Партнёр получает 95%.',
                ].map((t) => (
                  <li key={t} className="rr-body" style={{ display: 'flex', gap: 12, color: 'var(--ink)' }}>
                    <span style={{ display: 'inline-flex', flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: '#fff', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginTop: 1 }}><Icon name="check" size={15} strokeWidth={2.4} /></span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 24 }}>
                Расчётный контур <b style={{ color: 'var(--ink-2)' }}>поверх</b> программы, не вместо неё. Канал остаётся вашим: ваша программа, ваши партнёры, ваш бренд.
              </p>
            </div>
            <div>
              <BrowserFrame shot="/images/screenshots/ru/payouts.png" alt="Выплаты партнёрам в кабинете RevRoute" url="app.revroute.ru/payouts" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Возможности (+ интеграции) ── */}
      <section className="ds-band ds-container">
        <SectionHead
          eyebrow="Возможности"
          title="Контроль над каналом — в одном кабинете."
          sub="Партнёр получает солидный кабинет, а не Excel и переписку. Паритет с локальными PRM по базе — и то, где они заканчиваются."
        />
        <FeatureTabs
          features={[
            { icon: 'sliders', title: 'Гибкие вознаграждения', body: 'За клик, за действие, за продажу или доля с выручки — в том числе пожизненная. Условия по сегментам и двусторонние стимулы: бонус партнёру и выгода клиенту.', shot: '/images/screenshots/ru/rewards.png', url: 'app.revroute.ru/rewards' },
            { icon: 'bar-chart-3', title: 'Атрибуция до оплаты', body: 'Трафик атрибутируется партнёру по пути клик → лид → оплата. В реальном времени видно, кто приводит платящих клиентов, а не просто трафик.', shot: '/images/screenshots/ru/analytics.png', url: 'app.revroute.ru/analytics' },
            { icon: 'shield-check', title: 'Защита от накрутки', body: 'Антифрод отсекает самореференс и накрутку, а холд и корректировки за возвраты защищают бюджет вознаграждений.', shot: '/images/screenshots/events.png', url: 'app.revroute.ru/events' },
            { icon: 'sparkles', title: 'AI-лендинги для партнёров', body: 'Генератор партнёрских посадочных с вашим брендом — партнёр запускается быстрее, без вашей разработки и дизайна.', shot: '/images/screenshots/ru/branding.png', url: 'app.revroute.ru/branding' },
          ]}
        />
        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px dashed var(--line)' }}>
          <p className="rr-caption" style={{ marginBottom: 16 }}>Интеграции и API · без своей разработки</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Stripe', icon: 'credit-card' },
              { label: 'YooKassa', icon: 'wallet' },
              { label: 'amoCRM', icon: 'briefcase' },
              { label: 'Bitrix24', icon: 'briefcase' },
              { label: 'CMS', icon: 'layers' },
              { label: 'Partners API', icon: 'code' },
              { label: 'Вебхуки', icon: 'webhook' },
            ].map((i) => (
              <span key={i.label} className="chip" style={{ padding: '9px 15px', fontSize: 14 }}>
                <Icon name={i.icon} size={16} color="var(--ink-3)" />{i.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Безопасность данных (блок, не тизер) ── */}
      <section className="ds-band ds-container">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="ds-split" style={{ gap: 0, alignItems: 'stretch' }}>
            <div style={{ padding: 40 }}>
              <Eyebrow>Безопасность данных</Eyebrow>
              <h2 className="rr-h2" style={{ marginTop: 14 }}>Видим только реферальный трафик.</h2>
              <ul style={{ listStyle: 'none', margin: '24px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Данные ваших конечных клиентов остаются у вас — мы их не получаем.',
                  'Не «воруем» атрибуцию у других каналов: органику партнёрам не приписываем.',
                  'Расчёты — по агентской модели; ваши деньги на выплаты транзитом, не наш доход.',
                ].map((t) => (
                  <li key={t} className="rr-small" style={{ display: 'flex', gap: 12, color: 'var(--ink-2)' }}>
                    <Icon name="shield-check" size={19} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />{t}
                  </li>
                ))}
              </ul>
              <p className="rr-caption" style={{ marginTop: 24 }}>Подробно о расчётах и безопасности данных — отдельная страница, скоро.</p>
            </div>
            <div style={{ background: 'var(--bg-sunken)', borderLeft: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <Icon name="lock" size={64} color="var(--accent-soft)" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Чем мы отличаемся ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead center eyebrow="Чем мы отличаемся" title="Там, где локальные PRM заканчиваются." />
        <div style={{ maxWidth: 820, marginInline: 'auto' }}>
          <ComparisonTable
            ours="RevRoute"
            theirs="Локальные PRM / «настрою сам»"
            rows={[
              { label: 'Запуск без своей разработки', ours: true, theirs: false },
              { label: 'Атрибуция до оплаты (клик → оплата)', ours: true, theirs: true },
              { label: 'Контроль и защита от накрутки в реальном времени', ours: true, theirs: true },
              { label: 'Расчёты с партнёрами под ключ', ours: true, theirs: 'выплаты делаете сами' },
              { label: 'Документооборот: самозанятые / ИП / юрлица', ours: true, theirs: false },
              { label: 'Готовая партнёрская сеть', ours: 'в развитии', theirs: false },
            ]}
          />
        </div>
      </section>

      {/* ── 8. Цена-якорь + FAQ + финальный CTA ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <div className="card" style={{ maxWidth: 860, marginInline: 'auto', display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 56 }}>
          <div style={{ flex: '1 1 320px' }}>
            <Eyebrow>Стоимость</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <span className="rr-mono" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.6rem)', fontWeight: 600, color: 'var(--ink)' }}>от 2 450 ₽</span>
              <span style={{ fontSize: 16, color: 'var(--ink-3)' }}>/мес + 5% за расчёты</span>
            </div>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8, maxWidth: 470 }}>
              При оплате за год. Комиссия 5% — из бюджета на выплаты, не сверху. НДС не облагается (УСН).
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="ghost" size="lg" href="/pricing" iconRight="arrow-right">Все тарифы</Button>
            <Button variant="primary" size="lg" href={APP_REGISTER} data-ym-goal="landing_signup_click">Создать программу</Button>
          </div>
        </div>

        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead center eyebrow="Вопросы" title="Коротко о главном." />
          <FaqList
            items={[
              { q: 'Сколько это стоит?', a: 'Фиксированная подписка от 2 450 ₽/мес (при оплате за год) плюс агентская комиссия 5% за расчёты с партнёрами. 5% удерживаются из бюджета на выплаты, а не выставляются сверху отдельным счётом: выплатили партнёрам 100 000 ₽ → 5 000 ₽ комиссия, 95 000 ₽ получают партнёры.' },
              { q: 'Это законно?', a: 'Да. Мы работаем по агентским договорам как технический (расчётный) агент вендора. Мы не платёжный агент и не банк. Транзитные средства партнёрам — не наш доход. Данные локализуем в РФ.' },
              { q: 'Кому RevRoute пока не подходит?', a: 'Если партнёров меньше десяти и вы только тестируете гипотезу канала — ведите его вручную, мы пока не нужны, и говорим это прямо.' },
              { q: 'Вы заберёте наши данные о клиентах?', a: 'Нет. Мы видим только реферальный трафик. Данные ваших конечных клиентов остаются у вас, органику партнёрам мы не приписываем.' },
              { q: 'А если партнёров много или нужен SSO?', a: 'Для крупных программ есть тариф Enterprise: SSO/SAML, аудит-логи, выделенный менеджер и индивидуальный SLA. Обсуждается отдельно.' },
            ]}
          />
        </div>

        <CtaBottom
          tone="spectrum"
          title="Запустите партнёрский канал под ключ."
          body="Подключение партнёров, атрибуция до оплаты, контроль и расчёты с ними — без своей разработки."
          primary={{ label: 'Создать программу', href: APP_REGISTER }}
          secondary={{ label: 'Написать в Telegram', href: TELEGRAM }}
        />
      </section>
    </>
  )
}

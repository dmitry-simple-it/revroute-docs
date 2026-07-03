import type { Metadata } from 'next'
import { Hero } from '@/components/ds/Hero'
import { Steps } from '@/components/ds/Steps'
import { FeatureTabs } from '@/components/ds/FeatureTabs'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Button, Pill } from '@/components/ds/primitives'

const PARTNERS_URL = 'https://partners.revroute.ru/'
const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'
const OFFERS_URL = 'https://offers.revroute.ru/'

/**
 * Витринные офферы — данные строго из offers-static/offers-data.js (зеркало offers.revroute.ru).
 * Ставки и формулировки не выдумывать: при изменении условий обновляйте из offers-data.js.
 */
const MARKET_OFFERS: {
  name: string; logo: string; desc: string; rate: string; rateNote: string; cat: string; q: string
}[] = [
  {
    name: 'Яндекс 360 для бизнеса',
    logo: '/images/offers/yandex-360.png',
    desc: 'Корпоративные сервисы Яндекса: почта, диск, документы, мессенджер и видеовстречи.',
    rate: '20%',
    rateNote: 'от оплат нового клиента за первый год',
    cat: 'Productivity',
    q: 'Яндекс 360',
  },
  {
    name: 'Jivo',
    logo: '/images/offers/jivo.png',
    desc: 'Бизнес-чат для сайтов: 200 000+ компаний, №1 в РФ по числу операторов.',
    rate: 'до 35%',
    rateNote: 'от суммы платежа — тиеры 25/30/35%',
    cat: 'Marketing',
    q: 'Jivo',
  },
  {
    name: 'Albato',
    logo: '/images/offers/albato.png',
    desc: 'No-code интеграции 1000+ приложений, серверы в РФ.',
    rate: 'до 40%',
    rateNote: 'от платежей клиентов — пожизненно',
    cat: 'Dev',
    q: 'Albato',
  },
  {
    name: 'Wazzup',
    logo: '/images/offers/wazzup.png',
    desc: 'Интеграция WhatsApp и мессенджеров с CRM — amoCRM, Битрикс24.',
    rate: 'до 50%',
    rateNote: '35% с каждой оплаты, 50% — после 10-го клиента',
    cat: 'Customer Service',
    q: 'Wazzup',
  },
  {
    name: 'Консоль.Про',
    logo: '/images/offers/konsol-pro.png',
    desc: 'Платформа выплат самозанятым исполнителям — резидент Сколково.',
    rate: '35 000 ₽',
    rateNote: 'фикс с каждой продажи — достаточно рекомендации',
    cat: 'Finance',
    q: 'Консоль.Про',
  },
  {
    name: 'Тендерплан',
    logo: '/images/offers/tenderplan.png',
    desc: 'Мониторинг и управление госзакупками для бизнеса.',
    rate: 'до 30%',
    rateNote: 'с каждого платежа клиента — пожизненно',
    cat: 'Analytics',
    q: 'Тендерплан',
  },
]

export const metadata: Metadata = {
  title: 'Партнёрам — зарабатывайте на рекомендациях B2B-сервисов',
  description:
    'Партнёрская программа RevRoute: рекомендуйте B2B-сервисы аудитории и клиентам и получайте комиссию с реальных оплат. Бесплатно для партнёра, статистика до оплаты, выплаты с чеками и актами — самозанятым, ИП и юрлицам.',
  alternates: { canonical: '/partners' },
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

/** Recurring accrual — a floating stack of reward chips instead of a chart. */
function RecurringChips() {
  const rows: { label: string; sum: string; cls: string; delay?: string }[] = [
    { label: 'Месяц 1', sum: '2 000 ₽', cls: 'rr-float' },
    { label: 'Месяц 2', sum: '+2 000 ₽', cls: 'rr-float-2' },
    { label: 'Месяц 3', sum: '+2 000 ₽…', cls: 'rr-float', delay: '1.4s' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', marginTop: 24 }}>
      {rows.map((r) => (
        <span key={r.label} className={`reward-chip ${r.cls}`} style={r.delay ? { animationDelay: r.delay } : undefined}>
          <span>{r.label} — <b className="rr-mono">{r.sum}</b></span>
        </span>
      ))}
    </div>
  )
}

export default function PartnersPage() {
  return (
    <>
      {/* ── 1. Hero — три страха/желания партнёра, без цифр масштаба ── */}
      <Hero
        eyebrow="Партнёрам"
        title="Комиссии прозрачны. Выплаты — с документами."
        body={
          <>
            Рекомендуйте B2B-сервисы аудитории и&nbsp;клиентам. Комиссия — с&nbsp;реальных оплат; чек и&nbsp;акт формируются автоматически.
          </>
        }
        primary={{ label: 'Стать партнёром', href: PARTNERS_URL, ymGoal: 'landing_partner_signup_click' }}
        secondary={{ label: 'Получать офферы в Telegram', href: TELEGRAM }}
        trust={['Статистика до оплаты', 'Бесплатно для партнёра', 'Чек и акт — автоматически', 'Комиссия с реальных оплат']}
        shot="/images/screenshots/ru/partner-overview.png"
        shotAlt="Кабинет партнёра RevRoute: статистика переходов и начислений — данные демо-программы"
        shotUrl="partners.revroute.ru"
      />

      {/* ── 1b. Терм-шит: вся экономика одним взглядом (категория D методологии) ── */}
      <section className="ds-container" style={{ paddingBottom: 12 }}>
        <div className="card" style={{ padding: '26px 28px' }}>
          <p className="rr-caption" style={{ marginBottom: 18 }}>Условия — одним взглядом</p>
          <div className="rr-termsheet">
            {[
              { k: 'Модель', v: 'recurring · % с продажи · фикс' },
              { k: 'Оплачиваемое событие', v: 'реальная оплата клиента' },
              { k: 'Окно атрибуции', v: 'до 180 дней' },
              { k: 'Выплата', v: 'по заявке из кабинета' },
              { k: 'Документы', v: 'чек и акт — автоматически' },
              { k: 'Вход', v: 'бесплатно, без обязательств' },
            ].map((r) => (
              <div key={r.k} style={{ minWidth: 0 }}>
                <div className="rr-small" style={{ color: 'var(--ink-3)' }}>{r.k}</div>
                <div className="rr-mono" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginTop: 4 }}>{r.v}</div>
              </div>
            ))}
          </div>
          <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 18, marginBottom: 0 }}>
            Ставка, минимальная сумма и холд зависят от оффера — видны в кабинете до подключения.
          </p>
        </div>
      </section>

      {/* ── 2. Кому подходит — сегмент-роутер до экономики ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Кому подходит"
          title="Вы уже рекомендуете — осталось получать комиссию."
          sub="Если вам доверяют выбор инструментов, рекомендация может стать строкой дохода, а не бесплатным советом."
        />
        <div className="ds-grid-4">
          {[
            { icon: 'briefcase', t: 'Интеграторам и агентствам', b: 'Клиенты и так спрашивают, что внедрить. Рекомендуете сервис по делу — получаете комиссию с его оплат.' },
            { icon: 'message-circle', t: 'Авторам каналов и блогов', b: 'Telegram, VK, YouTube или блог: рекомендуете сервисы, которыми пользуетесь сами, — аудитория остаётся вашей.' },
            { icon: 'badge-check', t: 'Консультантам и экспертам', b: 'Вы советуете инструменты по работе. Партнёрская ссылка превращает совет в комиссию — без «продаж».' },
            { icon: 'users', t: 'Комьюнити и курсам', b: 'Сообщества, чаты и обучающие программы: рекомендуете участникам сервисы по теме — со статистикой по каждому офферу.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2b. Как мы помогаем зарабатывать — 6 ценностей (паттерн ClickBank «How We Help You Earn») ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Почему с нами"
          title="Как мы помогаем зарабатывать."
          sub="Шесть вещей, которые важны партнёру, — и что мы делаем по каждой."
        />
        <div className="ds-grid-3">
          {[
            { icon: 'banknote', t: 'Надёжные выплаты', b: 'Вовремя и с документами: чек и акт формируются автоматически, выплаты — через платформы из перечня операторов ФНС. За дисциплиной выплат следим мы.' },
            { icon: 'zap', t: 'Высококонверсионные офферы', b: 'Рекомендация должна срабатывать: у офферов готовые посадочные и материалы, а двусторонние стимулы — бонус и вашему читателю — поднимают отклик на рекомендацию.' },
            { icon: 'badge-check', t: 'Качественные продукты', b: 'Вендоров отбираем лично — никакого скама. B2B-сервисы по подписке: чем дольше клиент пользуется продуктом, тем больше ваша накопленная комиссия.' },
            { icon: 'bar-chart-3', t: 'Трекинг, который не теряет', b: 'Атрибуция на стороне сервера — до самой оплаты, а не до клика, с окном до 180 дней. Комиссия засчитывается, даже если клиент оплатил не сразу.' },
            { icon: 'message-circle', t: 'Включенная поддержка', b: 'Нам действительно важно разобраться и помочь решить ваш вопрос: сделка не засчиталась или выплата задерживается — разбираемся и защищаем сторону партнёра. Алекс на связи в Telegram.' },
            { icon: 'file-text', t: 'Обучение', b: 'База знаний о партнёрском заработке на B2B-сервисах — в разработке. Обязательно будет.', soon: true },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: c.soon ? 'var(--chip-bg)' : 'var(--accent-bg)', border: `1px solid ${c.soon ? 'var(--line)' : 'var(--accent-line)'}`, alignItems: 'center', justifyContent: 'center', color: c.soon ? 'var(--ink-3)' : 'var(--accent-strong)' }}>
                <Icon name={c.icon} size={20} strokeWidth={2} />
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <h3 className="rr-h3" style={c.soon ? { color: 'var(--ink-3)' } : undefined}>{c.t}</h3>
                {c.soon && <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', border: '1px solid var(--line)', borderRadius: 999, padding: '2px 7px', flexShrink: 0 }}>Скоро</span>}
              </div>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Как вы зарабатываете — арифметика вместо счётчиков ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Модели вознаграждения"
          title="Как вы зарабатываете."
          sub="Ставку и модель задаёт вендор в оффере — все условия видны в кабинете до подключения. Выигрывают обе стороны: вы получаете комиссию, ваш клиент — проверенный вручную сервис и, где это предусмотрено оффером, бонус за переход."
        />
        <div className="ds-grid-3">
          <div className="card">
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--brand-ramp)', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name="repeat" size={20} strokeWidth={2} /></span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Recurring — доля с каждого платежа</h3>
            <p className="rr-small" style={{ marginTop: 8 }}>
              Клиент платит <b className="rr-mono" style={{ color: 'var(--accent-strong)' }}>10 000 ₽/мес</b> → ваша комиссия <b className="rr-mono" style={{ color: 'var(--accent-strong)' }}>20%</b> → <b className="rr-mono" style={{ color: 'var(--accent-strong)' }}>2 000 ₽/мес</b>, пока клиент платит. Рекомендация превращается в ренту.
            </p>
            <RecurringChips />
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 20 }}>Пример расчёта — ставка зависит от оффера.</p>
          </div>
          <div className="card-flat">
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name="percent" size={20} /></span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Процент с продажи</h3>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              Разовая комиссия — доля от суммы каждой оплаченной продажи, которую привёл ваш трафик. Начисление появляется в кабинете вместе с оплатой.
            </p>
          </div>
          <div className="card-flat">
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name="target" size={20} /></span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Фикс за действие</h3>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              Фиксированная сумма за целевое действие — лид, регистрацию или первую оплату. Какое действие оплачивается — задано в условиях оффера.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <Button variant="ghost" size="lg" href={PARTNERS_URL} iconRight="arrow-right">Стать партнёром</Button>
        </div>
      </section>

      {/* ── 3b. Офферы — реальные программы из маркетплейса (данные: offers-static/offers-data.js) ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Маркетплейс"
          title="Офферы уже внутри."
          sub="Несколько программ из маркетплейса: модель и ставка — сразу в карточке, полные условия — в кабинете."
        />
        <div className="ds-grid-3">
          {MARKET_OFFERS.map((o) => (
            <a
              key={o.name}
              href={`${OFFERS_URL}?q=${encodeURIComponent(o.q)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-card card-flat"
              style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
            >
              <span className="glow" />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 11, background: '#fff', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={o.logo} alt={`Логотип ${o.name}`} width={24} height={24} style={{ display: 'block', borderRadius: 5 }} />
                </span>
                <span style={{ minWidth: 0, flex: 1, fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{o.name}</span>
                <span style={{ fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap', color: 'var(--ink-3)', background: 'var(--chip-bg)', border: '1px solid var(--line)', borderRadius: 999, padding: '3px 10px', flexShrink: 0 }}>{o.cat}</span>
              </div>
              <p className="rr-small" style={{ position: 'relative', color: 'var(--ink-3)', marginTop: 12, marginBottom: 0 }}>{o.desc}</p>
              <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 16 }}>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <div className="rr-mono" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accent-strong)' }}>{o.rate}</div>
                  <div className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 4 }}>{o.rateNote}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
        <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 28, textAlign: 'center', maxWidth: 640, marginInline: 'auto' }}>
          Условия актуальны на дату публикации — действующие условия и все офферы смотрите в кабинете.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Button variant="ghost" size="lg" href={OFFERS_URL} target="_blank" rel="noopener noreferrer" iconRight="arrow-up-right">Все офферы</Button>
        </div>
      </section>

      {/* ── 4. Путь выплаты — легально, с документами (полоса на bg-sunken) ── */}
      <section style={{ background: 'var(--bg-sunken)', borderBlock: '1px solid var(--line)' }}>
        <div className="ds-band ds-container">
          <SectionHead
            center
            eyebrow="Путь выплаты"
            title="Выплата приходит легально — с документами."
            sub="Статусы самозанятого, ИП и юрлица поддерживаются. Документы формируются автоматически — без ручной возни."
          />
          <Steps
            columns={3}
            steps={[
              { icon: 'send', title: 'Заявка на выплату.', body: 'Запрашиваете выплату из кабинета, когда начисления доступны к выводу.' },
              { icon: 'file-check', title: 'Чек и акт — автоматически.', body: 'Закрывающие документы формируются сами: чек фиксирует доход самозанятого, акт закрывает услугу.' },
              { icon: 'banknote', title: 'Деньги на счёте.', body: 'На банковскую карту, по СБП или на расчётный счёт — как удобно вам.' },
            ]}
          />
          <div className="card-flat" style={{ marginTop: 36, display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Icon name="shield-check" size={22} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: '1 1 320px' }}>
              <p className="rr-body" style={{ margin: 0, color: 'var(--ink)' }}>
                Выплаты самозанятым — через платформы из{' '}
                <a href="https://npd.nalog.ru/aggregators/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>перечня операторов ФНС</a>{' '}
                (Консоль.Про, Самозанятые.рф): статус НПД проверяется перед каждой выплатой.
              </p>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 10 }}>
                Способы выплат: на карту, по СБП или на расчётный счёт. Минимальная сумма и холд зависят от программы — видны в кабинете.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                <Pill tone="green" dot>Самозанятый</Pill>
                <Pill tone="blue" dot>ИП</Pill>
                <Pill dot>Юрлицо</Pill>
              </div>
            </div>
          </div>
          <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 24, textAlign: 'center', maxWidth: 640, marginInline: 'auto' }}>
            Начисление закреплено договором вендора с платформой, за дисциплиной выплат следим мы — программы нарушителей блокируются.
          </p>
        </div>
      </section>

      {/* ── 4b. Безопасность рекомендации (категория F методологии): страх №2 партнёра ── */}
      <section className="ds-band ds-container">
        <div className="ds-split" style={{ alignItems: 'center' }}>
          <div>
            <Eyebrow>Ваша репутация</Eyebrow>
            <h2 className="rr-h2" style={{ marginTop: 14 }}>Рекомендовать — безопасно.</h2>
            <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 14, maxWidth: 480 }}>
              Рекомендация — это ваша репутация. Поэтому границы ответственности проведены явно.
            </p>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Продавать не нужно: вы делитесь ссылкой на посадочную вендора — продажу и переговоры ведёт вендор, вы остаётесь советчиком.',
              'Клиент покупает у вендора напрямую и остаётся его клиентом; путь клик → лид → оплата виден вам в кабинете.',
              'За продукт, онбординг и поддержку клиента отвечает вендор. Вендоров отбираем вручную.',
              'Платформа — на стороне партнёра: программы, нарушающие обязательства по выплатам, блокируются.',
            ].map((t) => (
              <li key={t} className="rr-small" style={{ display: 'flex', gap: 12, color: 'var(--ink)' }}>
                <span style={{ display: 'inline-flex', flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: '#fff', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginTop: 1 }}><Icon name="shield-check" size={15} strokeWidth={2.2} /></span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5b. Кабинет партнёра — тур по продукту ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Кабинет партнёра"
          title="Всё для работы — в одном кабинете."
          sub="Атрибуция, статистика, офферы и материалы — без таблиц и переписок."
        />
        <FeatureTabs
          features={[
            { icon: 'bar-chart-3', title: 'Атрибуция до оплаты', body: 'Переход учитывается на стороне сервера и доводится до оплаты: клик → лид → оплата. Ваша комиссия не теряется по дороге — даже если клиент оплатил не сразу.', shot: '/images/screenshots/ru/analytics.png', url: 'partners.revroute.ru/analytics' },
            { icon: 'gauge', title: 'Статистика в реальном времени', body: 'Клики, лиды и оплаты — в кабинете без задержек. Видно, какой канал и какой контент приносят оплаты, а не просто трафик.', shot: '/images/screenshots/ru/partner-overview.png', url: 'partners.revroute.ru' },
            { icon: 'layers', title: 'Маркетплейс офферов', body: 'Офферы B2B-сервисов в одном кабинете: условия, ставки и материалы каждой программы. Подключаете новые офферы без повторной регистрации.', shot: '/images/screenshots/ru/marketplace.png', url: 'partners.revroute.ru/marketplace' },
            { icon: 'sparkles', title: 'Материалы и лендинги', body: 'Готовые материалы и брендированные посадочные от вендора, включая текст рекомендации, — запускаете быстрее, без своего дизайна и разработки.', shot: '/images/screenshots/ru/branding.png', url: 'partners.revroute.ru/materials' },
          ]}
        />
        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px dashed var(--line)', display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Icon name="message-circle" size={20} color="var(--ink-3)" style={{ marginTop: 2 }} />
          <p className="rr-small" style={{ margin: 0, color: 'var(--ink-2)', flex: '1 1 320px' }}>
            Вопросы — Алекс,{' '}
            <a href={`mailto:${PARTNERS_EMAIL}`} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>{PARTNERS_EMAIL}</a>{' '}
            или{' '}
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>Telegram</a>, обычно отвечаем в течение нескольких часов.
          </p>
        </div>
      </section>

      {/* ── 6. Три шага ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead center eyebrow="Как начать" title="Три шага до первой выплаты." />
        <Steps
          columns={3}
          steps={[
            { icon: 'user-plus', title: 'Зарегистрируйтесь.', body: 'Создайте кабинет на partners.revroute.ru — бесплатно и без обязательств.' },
            { icon: 'link', title: 'Подключите оффер.', body: 'Выберите программу в маркетплейсе и получите свою ссылку и материалы. Ставка и условия — в карточке оффера.' },
            { icon: 'banknote', title: 'Получайте выплаты.', body: 'Комиссия начисляется с реальных оплат. Заявка на выплату — из кабинета, чек и акт — автоматически.' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <Button variant="ghost" size="lg" href={PARTNERS_URL} iconRight="arrow-right">Стать партнёром</Button>
        </div>
      </section>

      {/* ── 7. FAQ — механика и юр-возражения, честно ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead center eyebrow="Вопросы" title="Частые вопросы." />
          <FaqList
            items={[
              {
                q: 'Это бесплатно для партнёра?',
                a: 'Да. Кабинет, офферы, статистика и выплаты бесплатны для партнёра. Комиссию платформе платит вендор.',
              },
              {
                q: 'Как и в какие сроки приходят выплаты?',
                a: 'Фиксированного платёжного календаря нет: вы запрашиваете выплату из кабинета в любой момент, когда начисления доступны к выводу после холда. Способы — на банковскую карту, по СБП или на расчётный счёт; самозанятым — через платформы из перечня операторов ФНС (Консоль.Про, Самозанятые.рф). Минимальная сумма и холд зависят от программы и видны в кабинете, чек и акт формируются автоматически.',
              },
              {
                q: 'Подходит ли Telegram, VK или блог?',
                a: 'Да. Большинство программ принимают трафик из соцсетей, мессенджеров и блогов. Требования к площадкам и источникам — в условиях конкретного оффера в кабинете.',
              },
              {
                q: 'Что с возвратами и холдом?',
                a: 'Клиент покупает напрямую у вендора и возвращает деньги по его условиям. Комиссия начисляется только с подтверждённых оплат: если клиент вернул деньги, начисление корректируется — для этого и нужен холд. Его длительность зависит от программы и видна в кабинете.',
              },
              {
                q: 'Что можно обещать клиентам?',
                a: 'Только то, что написано в условиях оффера вендора. Комиссия начисляется с реальных оплат, а возвраты корректируют начисление — преувеличенные обещания бьют по вашему же доходу. Честная рекомендация выгоднее и вам, и клиенту.',
              },
              {
                q: 'Что, если я слечу с НПД или превышу лимит 2,4 млн ₽?',
                a: 'Статус НПД проверяется перед каждой выплатой, а лимит 2,4 млн ₽ контролирует платформа выплат (Консоль.Про, Самозанятые.рф). Если статус потерян или лимит исчерпан, выплаты приостанавливаются, а начисления сохраняются — обновите статус или перейдите на выплаты как ИП или юрлицо.',
              },
              {
                q: 'Что будет, если вендор не пополнит бюджет?',
                a: 'Выплата идёт из бюджета вендора, но начисленная комиссия — не жест доброй воли, а обязательство вендора по договору с платформой: она не сгорает из-за пустого баланса. За дисциплиной выплат следим мы: программа вендора, нарушающего обязательства перед партнёрами, блокируется на платформе — а терять канал и репутацию дороже, чем вовремя пополнить бюджет. И мы не нейтральный посредник: в вопросах выплат платформа всячески защищает сторону партнёра.',
              },
              {
                q: 'Кто отвечает за маркировку рекламы (ЕРИР)?',
                a: 'Маркировка рекламы (ЕРИР) — обязанность партнёра: мы не берём её на себя и автомаркировку не обещаем. Учитывайте требования закона о рекламе для своих площадок и форматов.',
              },
              {
                q: 'Что обо мне видит вендор?',
                a: 'Статистику по своей программе: переходы, лиды, оплаты и начисленные комиссии — плюс профиль, который вы заполнили при подключении к его офферу. Вашу работу с другими программами вендор не видит.',
              },
            ]}
          />
        </div>

        {/* ── 8. Финальный CTA ── */}
        <CtaBottom
          tone="spectrum"
          title="Зарабатывайте на рекомендациях B2B-сервисов."
          body="Бесплатно для партнёра. Комиссия — с реальных оплат, чек и акт — автоматически."
          primary={{ label: 'Стать партнёром', href: PARTNERS_URL }}
          secondary={{ label: 'Написать Алексу в Telegram', href: TELEGRAM }}
        />
      </section>
    </>
  )
}

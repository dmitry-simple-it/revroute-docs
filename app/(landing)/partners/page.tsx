import type { Metadata } from 'next'
import { HeroCentered } from '@/components/ds/HeroCentered'
import { Steps } from '@/components/ds/Steps'
import { FeatureTabs } from '@/components/ds/FeatureTabs'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Button, Pill } from '@/components/ds/primitives'

const PARTNERS_URL = 'https://partners.revroute.ru/'
const PARTNERS_REGISTER_URL = 'https://partners.revroute.ru/register'
const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

/**
 * Витринные офферы — данные строго из offers-static/offers-data.js (зеркало offers.revroute.ru).
 * Ставки и формулировки не выдумывать: при изменении условий обновляйте из offers-data.js.
 * Клики по офферам ведут на регистрацию партнёра (решение владельца 21.07.2026).
 */
const MARKET_OFFERS: {
  name: string; logo: string; desc: string; rate: string; rateNote: string; cat: string
}[] = [
  {
    name: 'Яндекс 360 для бизнеса',
    logo: '/images/offers/yandex-360.png',
    desc: 'Корпоративные сервисы Яндекса: почта, диск, документы, мессенджер и видеовстречи.',
    rate: '20%',
    rateNote: 'от оплат нового клиента за первый год',
    cat: 'Productivity',
  },
  {
    name: 'Jivo',
    logo: '/images/offers/jivo.png',
    desc: 'Бизнес-чат для сайтов: 200 000+ компаний, №1 в РФ по числу операторов.',
    rate: 'до 35%',
    rateNote: 'от суммы платежа — тиеры 25/30/35%',
    cat: 'Marketing',
  },
  {
    name: 'Albato',
    logo: '/images/offers/albato.png',
    desc: 'No-code интеграции 1000+ приложений, серверы в РФ.',
    rate: 'до 40%',
    rateNote: 'от платежей клиентов — пожизненно',
    cat: 'Dev',
  },
  {
    name: 'Wazzup',
    logo: '/images/offers/wazzup.png',
    desc: 'Интеграция WhatsApp и мессенджеров с CRM — amoCRM, Битрикс24.',
    rate: 'до 50%',
    rateNote: '35% с каждой оплаты, 50% — после 10-го клиента',
    cat: 'Customer Service',
  },
  {
    name: 'Консоль.Про',
    logo: '/images/offers/konsol-pro.png',
    desc: 'Платформа выплат самозанятым исполнителям — резидент Сколково.',
    rate: '35 000 ₽',
    rateNote: 'фикс с каждой продажи — достаточно рекомендации',
    cat: 'Finance',
  },
  {
    name: 'Тендерплан',
    logo: '/images/offers/tenderplan.png',
    desc: 'Мониторинг и управление госзакупками для бизнеса.',
    rate: 'до 30%',
    rateNote: 'с каждого платежа клиента — пожизненно',
    cat: 'Analytics',
  },
]

export const metadata: Metadata = {
  title: 'Партнёрам — зарабатывайте на рекомендациях B2B-сервисов',
  description:
    'Партнёрская программа RevRoute: рекомендуйте B2B-сервисы и зарабатывайте до 50% комиссии с реальных оплат. Бесплатно для партнёра, атрибуция до оплаты, выплаты с чеками и актами — самозанятым, ИП и юрлицам.',
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

export default function PartnersPage() {
  return (
    <>
      {/* ── 1. Hero — центрированный, без картинки, как на главной (решение владельца 16.07.2026) ── */}
      <HeroCentered
        eyebrow="Партнёрам"
        title="Зарабатывайте на рекомендациях"
        body={
          <>
            Рекомендуйте проверенные B2B-сервисы аудитории и&nbsp;клиентам. Комиссия — с&nbsp;реальных оплат; путь клиента до&nbsp;оплаты виден в&nbsp;кабинете.
          </>
        }
        theses={['До 50% комиссии', 'Бесплатно для партнёра', 'Чек и акт — автоматически']}
        primary={{ label: 'Стать партнёром', href: PARTNERS_URL, ymGoal: 'landing_partner_signup_click' }}
        secondary={{ label: 'Подобрать офферы в Telegram', href: TELEGRAM }}
      />

      {/* ── 2. Проблема — почему совет должен приносить доход ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Почему партнёрство"
          title="Рекомендации работают. Пока — бесплатно."
          sub="Вы уже советуете инструменты — клиентам, аудитории, коллегам. Разница между советом и доходом — только в инфраструктуре."
        />
        <div className="ds-grid-3">
          {[
            { icon: 'message-circle', t: 'Совет уходит бесплатно', b: 'Вы уже приводите клиентов сервисам — словом, кейсом, ссылкой. Вознаграждения за это не предусмотрено.' },
            { icon: 'eye-off', t: 'Партнёрки непрозрачны', b: 'Клик засчитан, а оплата — нет: без атрибуции до оплаты комиссия теряется по дороге, и проверить это нечем.' },
            { icon: 'file-text', t: 'Выплаты — с юр-вознёй', b: 'Чек, акт и статус НПД в обычных программах остаются на партнёре — возня отбивает желание рекомендовать за деньги.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Кому подходит — сегмент-роутер ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Кому подходит"
          title="Вы уже рекомендуете — осталось получать комиссию."
          sub="Если вам доверяют выбор инструментов, рекомендация может стать статьёй дохода, а не бесплатным советом. Продажу при этом ведёт вендор — вы остаётесь советчиком."
        />
        <div className="ds-grid-4">
          {[
            { icon: 'briefcase', t: 'Интеграторам и агентствам', b: 'Клиенты и так спрашивают, что внедрить. Рекомендуете сервис по делу — получаете комиссию с оплат клиента, а отношения с клиентом остаются вашими.' },
            { icon: 'message-circle', t: 'Авторам каналов и блогов', b: 'Telegram, VK, YouTube или блог: рекомендуете сервисы, которыми пользуетесь сами, — аудитория остаётся вашей.' },
            { icon: 'badge-check', t: 'Консультантам и экспертам', b: 'Вы и так советуете инструменты в своей практике. Партнёрская ссылка превращает совет в комиссию — без «продаж».' },
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

      {/* ── 4. Решение — три шага до первой выплаты (переезд с позиции 10) ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead center eyebrow="Решение" title="Три шага до первой выплаты." />
        <Steps
          columns={3}
          steps={[
            { icon: 'user-plus', title: 'Зарегистрируйтесь.', body: 'Создайте кабинет на partners.revroute.ru.' },
            { icon: 'link', title: 'Подключите оффер.', body: 'Выберите программу в маркетплейсе — ссылка и материалы появятся в кабинете. Ставка и условия — в карточке оффера.' },
            { icon: 'banknote', title: 'Получайте выплаты.', body: 'Комиссия начисляется, когда клиент платит. Заявка на выплату — прямо из кабинета.' },
          ]}
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <Button variant="ghost" size="lg" href={PARTNERS_URL} iconRight="arrow-right">Стать партнёром</Button>
        </div>
      </section>

      {/* ── 5. Как вы зарабатываете — модели, арифметика вместо счётчиков ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Модели вознаграждения"
          title="Как вы зарабатываете."
          sub="Ставку и модель задаёт вендор — все условия видны в кабинете до подключения."
        />
        <div className="ds-grid-4">
          <div className="card">
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--brand-ramp)', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon name="repeat" size={20} strokeWidth={2} /></span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Recurring — доля с платежей</h3>
            <p className="rr-small" style={{ marginTop: 8 }}>
              Клиент платит <b className="rr-mono" style={{ color: 'var(--accent-strong)' }}>10 000 ₽/мес</b>, ваша комиссия <b className="rr-mono" style={{ color: 'var(--accent-strong)' }}>20%</b> — это <b className="rr-mono" style={{ color: 'var(--accent-strong)' }}>2 000 ₽/мес</b>, пока подписка активна. Пять таких клиентов — уже <b className="rr-mono" style={{ color: 'var(--accent-strong)' }}>10 000 ₽/мес</b>.
            </p>
          </div>
          <div className="card-flat">
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name="percent" size={20} /></span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Процент с продажи</h3>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              Разовая комиссия — доля от суммы каждой продажи, пришедшей по вашей ссылке. Начисление появляется вместе с оплатой.
            </p>
          </div>
          <div className="card-flat">
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name="target" size={20} /></span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Фикс за действие</h3>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              Фиксированная сумма за лид, регистрацию или первую оплату. Что именно оплачивается — задано в условиях оффера.
            </p>
          </div>
          <div className="card-flat">
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name="trending-up" size={20} /></span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Бонусы за объём</h3>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>
              Вендоры поощряют результат: повышенная ставка с ростом числа клиентов и бонусы за целевые действия — условия в карточке оффера.
            </p>
          </div>
        </div>
        <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 24, textAlign: 'center' }}>
          Примеры расчёта — ставка и модель зависят от оффера.
        </p>
      </section>

      {/* ── 6. Офферы — реальные программы из маркетплейса (данные: offers-static/offers-data.js) ── */}
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
              href={PARTNERS_REGISTER_URL}
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
          Условия актуальны на дату публикации — действующие ставки и все офферы смотрите в кабинете.
        </p>
        <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 10, textAlign: 'center', maxWidth: 640, marginInline: 'auto' }}>
          Не нашли нужный сервис? <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>Предложите его</a> — подключим к маркетплейсу.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Button variant="ghost" size="lg" href={PARTNERS_REGISTER_URL} target="_blank" rel="noopener noreferrer" iconRight="arrow-up-right">Все офферы</Button>
        </div>
      </section>

      {/* ── 7. Кабинет партнёра — табы, поглотившие грид ценностей (якорь для моста с /prm) ── */}
      <section id="cabinet" className="ds-band ds-container" style={{ paddingTop: 0, scrollMarginTop: 90 }}>
        <SectionHead
          center
          eyebrow="Кабинет партнёра"
          title="Всё для работы — в одном кабинете."
          sub="Атрибуция, статистика, офферы и материалы — без таблиц и переписок."
        />
        <FeatureTabs
          features={[
            { icon: 'bar-chart-3', title: 'Атрибуция до оплаты', body: 'Переход учитывается на стороне сервера и доводится до оплаты: клик → лид → оплата, окно до 180 дней. Пост продолжает работать: клиент может вернуться и оплатить через месяц — комиссия всё равно ваша.', shot: '/images/screenshots/ru/analytics.png', url: 'partners.revroute.ru/analytics' },
            { icon: 'gauge', title: 'Статистика в реальном времени', body: 'Клики, лиды и оплаты — без задержек. Видно, какой канал и какой контент приводят платящих клиентов, а не просто трафик.', shot: '/images/screenshots/ru/partner-overview.png', url: 'partners.revroute.ru' },
            { icon: 'layers', title: 'Маркетплейс офферов', body: 'Офферы B2B-сервисов в одном кабинете: условия, ставки и материалы каждой программы. Вендоров отбираем вручную — случайные продукты не проходят отбор; новые офферы подключаются без повторной регистрации.', shot: '/images/screenshots/ru/marketplace.png', url: 'partners.revroute.ru/marketplace' },
            { icon: 'sparkles', title: 'Материалы и посадочные', body: 'Готовые материалы и брендированные посадочные от вендора, включая текст рекомендации. Где предусмотрено оффером, бонус за переход получает и ваш клиент — отклик на рекомендацию выше.', shot: '/images/screenshots/ru/branding.png', url: 'partners.revroute.ru/materials' },
          ]}
        />
        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px dashed var(--line)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Icon name="message-circle" size={20} color="var(--accent-strong)" style={{ marginTop: 2 }} />
            <p className="rr-small" style={{ margin: 0, color: 'var(--ink-2)', flex: '1 1 320px' }}>
              Выделенная поддержка: сделка не засчиталась или выплата задерживается — разбираемся и защищаем сторону партнёра. Алекс:{' '}
              <a href={`mailto:${PARTNERS_EMAIL}`} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>{PARTNERS_EMAIL}</a>{' '}
              или{' '}
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>Telegram</a>.
            </p>
          </div>
          <p className="rr-caption" style={{ marginTop: 18 }}>Обучение партнёрскому заработку на B2B-сервисах — в разработке. Обязательно будет.</p>
        </div>
      </section>

      {/* ── 8. Путь выплаты — раскрытие ключевой возможности + «Почему вам заплатят» ── */}
      <section style={{ background: 'var(--bg-sunken)', borderBlock: '1px solid var(--line)' }}>
        <div className="ds-band ds-container">
          <SectionHead
            center
            eyebrow="Путь выплаты"
            title="Выплата приходит легально — с документами."
            sub="Статусы самозанятого, ИП и юрлица поддерживаются."
          />
          <Steps
            columns={3}
            steps={[
              { icon: 'send', title: 'Заявка на выплату.', body: 'Запрашиваете выплату из кабинета, когда начисления доступны к выводу.' },
              { icon: 'file-check', title: 'Чек и акт — автоматически.', body: 'Закрывающие документы формируются сами: чек фиксирует доход самозанятого, акт подтверждает услугу.' },
              { icon: 'banknote', title: 'Деньги на счёте.', body: 'На банковскую карту, по СБП или на расчётный счёт — как удобно вам.' },
            ]}
          />
          {/* Почему вам заплатят — гарантии механикой, не клятвами */}
          <div className="card-flat" style={{ marginTop: 36, background: '#fff' }}>
            <p className="rr-caption" style={{ marginBottom: 16 }}>Почему вам заплатят</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                <>Начисление — обязательство вендора по договору с платформой: оно не сгорает.</>,
                <>Выплаты самозанятым — через платформы из{' '}
                  <a href="https://npd.nalog.ru/aggregators/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>перечня операторов ФНС</a>: статус НПД проверяется перед каждой выплатой.</>,
                <>Программы, нарушающие обязательства по выплатам, блокируются — платформа на стороне партнёра.</>,
              ].map((t, i) => (
                <li key={i} className="rr-small" style={{ display: 'flex', gap: 12, color: 'var(--ink)' }}>
                  <span style={{ display: 'inline-flex', flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginTop: 1 }}><Icon name="shield-check" size={15} strokeWidth={2.2} /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
              <Pill tone="green" dot>Самозанятый</Pill>
              <Pill tone="blue" dot>ИП</Pill>
              <Pill dot>Юрлицо</Pill>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ + финальный CTA ── */}
      <section className="ds-band ds-container">
        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead center eyebrow="Вопросы" title="Частые вопросы." />
          <FaqList
            items={[
              {
                q: 'Это бесплатно для партнёра?',
                a: 'Да. Кабинет, офферы, статистика и выплаты бесплатны для партнёра. Комиссию платформе платит вендор.',
              },
              {
                q: 'Подходит ли Telegram, VK или блог?',
                a: 'Да. Большинство программ принимают трафик из соцсетей, мессенджеров и блогов. Требования к площадкам и источникам — в условиях конкретного оффера.',
              },
              {
                q: 'Как и в какие сроки приходят выплаты?',
                a: 'Фиксированного платёжного календаря нет: вы запрашиваете выплату из кабинета, когда начисления доступны после холда. Способы — на банковскую карту, по СБП или на расчётный счёт. Минимальная сумма и холд зависят от оффера.',
              },
              {
                q: 'Я физлицо без статуса — смогу ли получать выплаты?',
                a: 'Для выплат нужен статус самозанятого, ИП или юрлица. Самозанятость оформляется бесплатно за несколько минут в приложении «Мой налог» — без визитов и отчётности: налог считается автоматически, чек по каждой выплате формирует платформа. Начисления копятся и до оформления статуса — вы ничего не теряете.',
              },
              {
                q: 'Что, если я слечу с НПД или превышу лимит 2,4 млн ₽?',
                a: 'Статус НПД проверяется перед каждой выплатой, а лимит 2,4 млн ₽ контролирует платформа выплат. Если статус потерян или лимит исчерпан, выплаты приостанавливаются, а начисления сохраняются — обновите статус или перейдите на выплаты как ИП или юрлицо.',
              },
              {
                q: 'Клиент заплатит больше, если придёт по моей ссылке?',
                a: 'Нет. Цена не зависит от источника перехода: комиссия партнёра идёт из маркетингового бюджета вендора, а не из кармана клиента. Где предусмотрено оффером, по ссылке клиент получает бонус — условия даже лучше.',
              },
              {
                q: 'Что с возвратами и холдом?',
                a: 'Клиент покупает напрямую у вендора и возвращает деньги по его условиям. Комиссия начисляется только с подтверждённых оплат: если клиент вернул деньги, начисление корректируется — для этого и нужен холд. Его длительность зависит от оффера и видна в кабинете.',
              },
              {
                q: 'Что можно обещать клиентам?',
                a: 'Только то, что написано в условиях оффера вендора. За продукт, онбординг и поддержку клиента отвечает вендор. Комиссия начисляется с реальных оплат, а возвраты корректируют начисление — преувеличенные обещания бьют по вашему же доходу.',
              },
              {
                q: 'Что будет, если вендор не пополнит бюджет?',
                a: 'Выплата идёт из бюджета вендора, но начисленная комиссия — не жест доброй воли, а обязательство вендора по договору с платформой: она не сгорает из-за пустого баланса. За дисциплиной выплат следим мы: программа вендора, нарушающего обязательства перед партнёрами, блокируется на платформе — а терять канал и репутацию дороже, чем вовремя пополнить бюджет. И мы не нейтральный посредник: в вопросах выплат платформа на стороне партнёра.',
              },
              {
                q: 'Нужно ли заключать договор?',
                a: 'Отдельный бумажный договор не нужен: регистрируясь, вы принимаете оферту сервиса, а подключая оффер — оферту партнёрской программы конкретного вендора. Реквизиты для выплат указываете в кабинете.',
              },
              {
                q: 'Кто отвечает за маркировку рекламы (ЕРИР)?',
                a: 'Маркировка рекламы (ЕРИР) — зона ответственности рекламодателя и партнёра, размещающего рекламу: мы её на себя не берём и автомаркировку не обещаем. Учитывайте требования закона о рекламе для своих площадок и форматов.',
              },
              {
                q: 'Что обо мне видит вендор?',
                a: 'Статистику по своей программе: переходы, лиды, оплаты и начисленные комиссии — плюс профиль, который вы заполнили при подключении к его офферу. Вашу работу с другими программами вендор не видит.',
              },
            ]}
          />
        </div>

        <CtaBottom
          tone="spectrum"
          title="Зарабатывайте на рекомендациях B2B-сервисов."
          body="Бесплатно для партнёра. Первая выплата — в три шага: кабинет, оффер, заявка."
          primary={{ label: 'Стать партнёром', href: PARTNERS_URL }}
          secondary={{ label: 'Написать Алексу в Telegram', href: TELEGRAM }}
        />
      </section>
    </>
  )
}

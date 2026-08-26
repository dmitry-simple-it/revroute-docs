import type { Metadata } from 'next'
import { Hero, BrowserFrame } from '@/components/ds/Hero'
import { Steps } from '@/components/ds/Steps'
import { FeatureTabs } from '@/components/ds/FeatureTabs'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { VideoEmbed, GLABIX_DEMO_SRC } from '@/components/ds/VideoEmbed'
import { Eyebrow, Icon, Button, Term } from '@/components/ds/primitives'
import { LeadForm } from '@/components/marketing/landing/LeadForm'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, service } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

const APP_REGISTER = 'https://app.revroute.ru/register'
const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

export const metadata: Metadata = {
  title: 'PRM-платформа для партнёрских программ',
  description:
    'PRM-платформа для B2B: атрибуция до оплаты, расчёты с партнёрами под ключ, оплата за результат — без разработки и ручных таблиц. От 2 450 ₽/мес.',
  alternates: { canonical: '/prm' },
  openGraph: og('/prm'),
}

/**
 * Полная цена — одной формулой: подписка плюс агентская комиссия. Используется
 * и в описании Service, и в priceDescription, чтобы разметка не обещала меньше,
 * чем видит пользователь в блоке «Стоимость».
 */
const PRICE_MODEL =
  'подписка от 2 450 ₽/мес при оплате за год (2 950 ₽ помесячно) плюс агентская комиссия 5% за расчёты — из бюджета выплат, а не сверху'

/** FAQ страницы: один массив и в видимый аккордеон, и в FAQPage JSON-LD. */
const FAQ: { q: string; a: string }[] = [
  { q: 'Сколько это стоит?', a: 'Фиксированная подписка от 2 450 ₽/мес (при оплате за год) плюс агентская комиссия 5% за расчёты с партнёрами — из бюджета выплат, не сверху: из 100 000 ₽ бюджета 95 000 ₽ получают партнёры, 5 000 ₽ — комиссия RevRoute.' },
  { q: 'Сколько это стоит в пересчёте на выручку канала?', a: 'Пример: выручка канала 1 000 000 ₽, комиссия партнёрам 20% → бюджет выплат 200 000 ₽. Из него 190 000 ₽ получают партнёры, 10 000 ₽ — комиссия RevRoute. В этом примере комиссия — около 1% от выручки канала; плюс подписка от 2 450 ₽/мес — вся цена, ничего сверху.' },
  { q: 'Что нужно, чтобы запуститься?', a: 'Оффер, условия вознаграждений и ссылки настраиваются в кабинете — без разработки. Сделки и оплаты подтягиваются через интеграцию с вашей CRM — amoCRM или Bitrix24, — которую настраиваем под вас; для своих сценариев — Partners API и вебхуки.' },
  { q: 'Мы уже ведём партнёров в таблицах. Как переехать?', a: 'Прошлые периоды закрываете как раньше — историю переносить не требуется. Перенесите условия в оффер и пришлите действующим партнёрам приглашение: каждый регистрируется сам и сразу видит условия, ссылки и материалы в кабинете.' },
  { q: 'Вы даёте базу партнёров?', a: 'Готовой базы «в аренду» нет — это было бы нечестно. Ваша программа после модерации размещается в маркетплейсе офферов, где её находят партнёры платформы; действующих партнёров вы подключаете по своей ссылке.' },
  { q: 'Чем RevRoute отличается от CPA-сетей вроде Admitad?', a: 'CPA-сети — про B2C-ритейл и арбитраж трафика: партнёры анонимны, канал принадлежит сети. RevRoute — PRM для B2B: программа и партнёры ваши, комиссии — в том числе recurring с каждого платежа, а выплаты идут с чеками и актами по вашему поручению.' },
  { q: 'Чем партнёрская программа отличается от реферальной?', a: 'Партнёрская — внешние партнёры (эксперты, агентства, авторы) рекомендуют вас за вознаграждение. Реферальная — ваши собственные клиенты приводят коллег за бонус. В RevRoute обе механики работают в одной платформе, включая двусторонние стимулы: бонус партнёру и выгода клиенту.' },
  { q: 'Это законно?', a: 'Да. Вы работаете с RevRoute по агентскому договору — схема расписана выше, публичная оферта открыта. Мы не платёжный агент и не банк: выплаты идут по вашему поручению, бюджет выплат — не наш доход. Данные локализованы в РФ.' },
  { q: 'Что, если у партнёра нет статуса самозанятого — или он его потерял?', a: 'Партнёр может оформить самозанятость в приложении «Мой налог» и получать выплаты как обычно; поддерживаются также ИП и юрлица. Статус НПД проверяется перед каждой выплатой: если он потерян, выплата ставится на паузу до восстановления статуса или перехода на ИП или юрлицо — начисления не сгорают.' },
  { q: 'Что будет с деньгами на выплаты, если вы перестанете работать?', a: 'Бюджет выплат — ваши средства по агентскому договору, а не наши: до выплаты партнёрам они принадлежат вам и используются только по назначению. При расторжении договора неизрасходованный остаток возвращается.' },
  { q: 'Кто маркирует рекламу партнёра?', a: 'Обязанности по маркировке несут рекламодатель и партнёр, размещающий рекламу, — RevRoute не участвует в рекламной цепочке.' },
  { q: 'Вы заберёте наши данные о клиентах?', a: 'Нет. Мы видим только реферальный трафик. Данные ваших конечных клиентов остаются у вас, органику партнёрам мы не приписываем.' },
  { q: 'А если партнёров много или нужен SSO?', a: 'Для крупных программ есть Enterprise: SSO, аудит-логи, выделенный менеджер и SLA. Состав и условия — на странице тарифов.' },
]

function SectionHead({ eyebrow, title, sub, center }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ maxWidth: center ? 760 : 720, marginInline: center ? 'auto' : undefined, textAlign: center ? 'center' : 'left', marginBottom: 40 }}>
      <Eyebrow style={center ? { justifyContent: 'center' } : undefined}>{eyebrow}</Eyebrow>
      <h2 className="rr-h2" style={{ marginTop: 14 }}>{title}</h2>
      {sub && <p className="rr-lead" style={{ marginTop: 14, marginInline: center ? 'auto' : undefined, maxWidth: 640 }}>{sub}</p>}
    </div>
  )
}

/** Small "who does this step" marker: the vendor or the platform. */
function StepWho({ us, children }: { us?: boolean; children: React.ReactNode }) {
  return (
    <>
      <span style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: us ? 'var(--accent-strong)' : 'var(--ink-3)', marginBottom: 6 }}>
        {us ? 'RevRoute' : 'Вы'}
      </span>
      {children}
    </>
  )
}

export default function PrmPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'PRM-платформа' },
          ]),
          service({
            name: 'PRM-платформа RevRoute',
            url: '/prm',
            description:
              `Платформа управления партнёрскими программами для B2B: подключение партнёров, гибкие вознаграждения, атрибуция до оплаты, антифрод и расчёты с партнёрами под ключ. Цена — ${PRICE_MODEL}.`,
            serviceType: 'Partner relationship management platform',
            audienceType: 'B2B vendors',
            offersUrl: '/pricing',
            price: 2450,
            priceUnitText: 'MONTH',
            priceDescription: `Цена видна на странице: ${PRICE_MODEL}. НДС не облагается (УСН).`,
          }),
          faqPage(FAQ),
        ]}
      />

      {/* ── 1. Hero — H1 владельца (03.07.2026), демо-видео вместо скриншота.
             «Заказать демо» ведёт на форму #demo внизу, а не сразу в Telegram:
             заявка остаётся у нас с контактом и согласиями, а не растворяется
             в чате. ── */}
      <Hero
        eyebrow={<><Term hint="PRM — управление отношениями с партнёрами. CRM — про клиентов, PRM — про партнёров.">PRM</Term>-платформа для B2B</>}
        title="Запускайте партнёрскую программу"
        body={
          <>
            Превращайте поток рекомендаций в&nbsp;учтённую выручку. Атрибуция до&nbsp;оплаты показывает, кто привёл платящего клиента, — а&nbsp;не&nbsp;просто трафик.
          </>
        }
        primary={{ label: 'Начать', href: APP_REGISTER, ymGoal: 'landing_signup_click' }}
        secondary={{ label: 'Заказать демо', href: '#demo', ymGoal: 'prm_demo_cta', demoCta: 'hero' }}
        trust={['Расчёты под ключ', 'Без разработки', 'Оплата за результат']}
        mock={
          <VideoEmbed
            style={{ width: '100%' }}
            embedSrc={GLABIX_DEMO_SRC}
            sources={[
              { src: '/videos/revroute-promo.webm', type: 'video/webm' },
              { src: '/videos/revroute-promo.mp4', type: 'video/mp4' },
            ]}
            poster="/images/screenshots/ru/overview.png"
            posterAlt="Кабинет вендора RevRoute — обзор партнёрской программы"
            chrome="Промо RevRoute"
            title="Как рекомендация становится выплатой"
            duration="3:19"
            sizes="(max-width: 920px) 100vw, 560px"
          />
        }
      />

      {/* ── 2. Проблема — почему партнёрская программа актуальна сегодня ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Почему партнёрская программа"
          title="Реклама дорожает. Доверие — нет."
          sub="Performance-каналы перегреты, площадок всё меньше. А решения в B2B по-прежнему принимают по рекомендациям тех, кому доверяют."
        />
        <div className="ds-grid-3">
          {[
            { icon: 'trending-up', t: 'Клики дорожают', b: 'Ставки аукционов растут, а бюджет уходит в показы, которые не превращаются в сделки.' },
            { icon: 'minus', t: 'Каналов всё меньше', b: 'Часть площадок недоступна, органика растёт медленно — привычные источники лидов сжимаются.' },
            { icon: 'message-circle', t: 'Доверие работает', b: 'У ваших будущих клиентов уже есть люди, чьим рекомендациям они верят: подрядчики, эксперты, коллеги по рынку.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
        {/* Выход: разные роли становятся амбассадорами продукта */}
        <div className="card" style={{ marginTop: 24, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', boxShadow: 'none' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 12, background: 'var(--brand-ramp)', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}><Icon name="users" size={22} strokeWidth={2} /></span>
            <div style={{ flex: '1 1 320px' }}>
              <h3 className="rr-h3">Сделайте их амбассадорами продукта.</h3>
              <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 8, maxWidth: 640 }}>
                RevRoute превращает тех, кому доверяют ваши клиенты, в управляемый канал продаж: у каждого — своя ссылка, условия и вознаграждение за результат.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                {[
                  { icon: 'briefcase', label: 'Интеграторы и агентства' },
                  { icon: 'badge-check', label: 'Консультанты и эксперты' },
                  { icon: 'send', label: 'Авторы каналов и блогов' },
                  { icon: 'users', label: 'Лояльные клиенты' },
                ].map((r) => (
                  <span key={r.label} className="chip" style={{ padding: '9px 15px', fontSize: 14, background: '#fff' }}>
                    <Icon name={r.icon} size={16} color="var(--accent-strong)" />{r.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Когда запускать и когда автоматизировать — квалификатор + критерии готовности ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Когда"
          title="Когда запускать — и когда автоматизировать."
          sub={'Честно говорим, когда мы ещё не нужны. Ориентир — выручка от ~5 млн ₽/год и рекомендации, которые уже приводят сделки.'}
        />
        <div className="ds-grid-2">
          <div className="card-flat">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name="clock" size={18} /></span>
              <h3 className="rr-h3">Пока хватает и ручного управления</h3>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Меньше 10 партнёров', 'Вы тестируете гипотезу канала', 'Штучные сделки со сверхвысоким чеком', 'Небольшой рынок или ограниченный объём поставок'].map((t) => (
                <li key={t} className="rr-small" style={{ display: 'flex', gap: 10, color: 'var(--ink-2)' }}>
                  <Icon name="minus" size={18} color="var(--ink-4)" style={{ marginTop: 1, flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 18 }}>
              Пока рано? <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>Напишите в Telegram</a> — подскажем, когда пора.
            </p>
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)' }}><Icon name="rocket" size={18} /></span>
              <h3 className="rr-h3">Пора автоматизировать</h3>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Больше 10 партнёров', 'Схема «клиент = партнёр по рекомендации»', 'Появилась сетевая или многоуровневая структура', 'Нужны точная атрибуция и защита от накрутки'].map((t) => (
                <li key={t} className="rr-small" style={{ display: 'flex', gap: 10, color: 'var(--ink)' }}>
                  <Icon name="check" size={18} color="var(--accent)" strokeWidth={2.4} style={{ marginTop: 1, flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Критерии готовности бизнеса к партнёрской программе (тезисы владельца 03.07.2026) */}
        <div style={{ marginTop: 32 }}>
          <h3 className="rr-h3" style={{ marginBottom: 20, textAlign: 'center' }}>Критерии готовности к партнёрской программе.</h3>
          <div className="ds-grid-3">
            {[
              { icon: 'percent', t: 'Маржинальность', b: 'Экономика выдерживает вознаграждение: у партнёра — заметная комиссия на единицу усилий, у вас — прибыльная сделка.' },
              { icon: 'network', t: 'Готовая сеть рекомендателей', b: 'Вокруг продукта уже есть агентства, интеграторы, эксперты и профессиональные сообщества. Вы не формируете новую привычку, а встраиваетесь в существующий процесс рекомендаций.' },
              { icon: 'mouse-pointer-click', t: 'Цифровая зрелость', b: 'Клиент может пройти путь до оплаты онлайн с минимальным участием человека — партнёрский трафик не упирается в ручные продажи.' },
            ].map((c) => (
              <div key={c.t} className="card-flat">
                <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
                <h4 className="rr-h3" style={{ marginTop: 16, fontSize: 17 }}>{c.t}</h4>
                <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
              </div>
            ))}
          </div>
          <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 18, textAlign: 'center' }}>
            А также: репутационная совместимость, ёмкость рынка и пропускная способность вендора и партнёров без падения качества.
          </p>
        </div>
      </section>

      {/* ── 4. Решение — как это работает (4 шага, субъекты «Вы/RevRoute») ── */}
      <section id="how" className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Решение"
          title="Рекомендация → оплата клиента → выплата партнёру."
          sub="Один цикл без таблиц и переписок. Что делаете вы — и что берёт на себя платформа."
        />
        <Steps
          columns={4}
          steps={[
            { icon: 'user-plus', title: <StepWho>Подключаете партнёров.</StepWho>, body: 'Создаёте оффер и условия. Партнёр регистрируется сам и получает ссылки, промокоды и материалы — без вашей ручной работы.' },
            { icon: 'bar-chart-3', title: <StepWho us>Считаем до оплаты.</StepWho>, body: 'Серверный трекинг привязывает каждую оплату к партнёру по пути клик → лид → оплата.' },
            { icon: 'eye', title: <StepWho>Видите канал в реальном времени.</StepWho>, body: 'Кто приводит платящих клиентов, а не просто трафик. Фрод в цифры не попадает.' },
            { icon: 'banknote', title: <StepWho us>Платим под ключ.</StepWho>, body: 'Комиссии начислены — выплаты и документы берём на себя.' },
          ]}
        />
      </section>

      {/* ── 5. Возможности платформы — все табы с визуализацией (грид упразднён по решению владельца) ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Возможности платформы"
          title="Всё для канала — в одной платформе."
          sub="Весь цикл — от трекинга до антифрода. Каждый экран — реальный интерфейс платформы."
        />
        <FeatureTabs
          features={[
            { icon: 'link', title: 'Трекинг и атрибуция до оплаты', body: 'Партнёрские ссылки и промокоды. Серверный трекинг ведёт путь клик → лид → оплата с окном до 180 дней; он устойчив к блокировщикам и ограничениям cookies. Начисление — только после реальной оплаты клиента.', shot: '/images/screenshots/ru/analytics.png', url: 'app.revroute.ru/analytics' },
            { icon: 'users', title: 'Управление партнёрами', body: 'Заявки и подключение, группы и сегменты, индивидуальные условия — весь путь до первой выплаты. Партнёр работает в полноценном кабинете, а не в Excel и переписке.', shot: '/images/screenshots/ru/overview.png', url: 'app.revroute.ru/partners' },
            { icon: 'sliders', title: 'Гибкие вознаграждения', body: 'За клик, лид или продажу — либо доля с выручки, в том числе recurring: процент с каждого платежа клиента, пока тот платит. Двусторонние стимулы: бонус партнёру, выгода клиенту.', shot: '/images/screenshots/ru/rewards.png', url: 'app.revroute.ru/rewards' },
            { icon: 'globe', title: 'Маркетплейс офферов', body: 'Карточка вашей программы в каталоге, где партнёры выбирают офферы, — без холодного рекрутинга с нуля. Размещение проходит модерацию: партнёры видят только проверенные программы.', shot: '/images/screenshots/ru/marketplace.png', url: 'partners.revroute.ru/marketplace' },
            { icon: 'bar-chart-3', title: 'Данные и аналитика', body: 'Конверсии до оплаты, топ-партнёры по выручке, источники трафика и качество канала — в реальном времени, а не в таблицах.', shot: '/images/screenshots/analytics-conversions.png', url: 'app.revroute.ru/analytics' },
            { icon: 'shield-check', title: 'Антифрод и защита бюджета', body: 'Самореференс и подозрительные конверсии отсекаются автоматически. Холд удерживает вознаграждение до подтверждения оплаты, возвраты корректируют комиссию.', shot: '/images/screenshots/events.png', url: 'app.revroute.ru/events' },
            { icon: 'lock', title: 'Безопасность данных', body: 'Видим только реферальный трафик: переходы и оплаты по партнёрским ссылкам. Клиентская база, продукт и аналитика остаются у вас; органику партнёрам не приписываем. Данные локализованы в РФ.' },
            { icon: 'sparkles', title: 'AI-лендинги для партнёров', body: 'Генератор партнёрских посадочных с вашим брендом — партнёр запускается быстрее, без вашей разработки и дизайна.', shot: '/images/screenshots/ru/branding.png', url: 'app.revroute.ru/branding' },
          ]}
        />
        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px dashed var(--line)' }}>
          <p className="rr-caption" style={{ marginBottom: 10 }}>Интеграции и API · без разработки</p>
          <p className="rr-small" style={{ color: 'var(--ink-3)', maxWidth: 640, marginBottom: 16 }}>
            Сделки и оплаты подтягиваются через интеграцию с вашей CRM, которую настраиваем под вас; для своих сценариев — Partners API и вебхуки.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'amoCRM', icon: 'briefcase' },
              { label: 'Bitrix24', icon: 'briefcase' },
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

      {/* ── 6. Расчёты с партнёрами под ключ — одна из возможностей, раскрытая подробно ── */}
      <section style={{ background: 'var(--wash)', borderBlock: '1px solid var(--line)' }}>
        <div className="ds-band ds-container">
          <SectionHead
            center
            eyebrow="Как устроены выплаты"
            title="Расчёты с партнёрами под ключ."
            sub="Локальные PRM оставляют выплаты на вас — мы закрываем их целиком."
          />
          <div className="ds-split">
            <div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Один счёт вместо сотни переводов — платите как одному поставщику.',
                  'Документы по самозанятым, ИП и юрлицам — на нас: чеки и акты формируются автоматически.',
                  'Чек партнёра оформляется на вас: вы заказчик услуги — так и должно быть.',
                ].map((t) => (
                  <li key={t} className="rr-body" style={{ display: 'flex', gap: 12, color: 'var(--ink)' }}>
                    <span style={{ display: 'inline-flex', flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: '#fff', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginTop: 1 }}><Icon name="check" size={15} strokeWidth={2.4} /></span>
                    {t}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
                {['чек', 'акт', 'проверка статуса НПД перед выплатой'].map((b) => (
                  <span key={b} className="chip" style={{ padding: '7px 13px', fontSize: 13 }}>
                    <Icon name="file-check" size={14} color="var(--accent-strong)" />{b}
                  </span>
                ))}
              </div>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 24 }}>
                Расчётный контур <b style={{ color: 'var(--ink-2)' }}>поверх</b> программы, а не вместо неё. Канал остаётся вашим: ваша программа, ваши партнёры, ваш бренд.
              </p>
            </div>
            <div>
              <BrowserFrame shot="/images/screenshots/ru/payouts.png" alt="Выплаты партнёрам в кабинете RevRoute" url="app.revroute.ru/payouts" />
            </div>
          </div>
          {/* Договор и деньги — анти-блокер финансиста */}
          <div style={{ marginTop: 48 }}>
            <h3 className="rr-h3" style={{ marginBottom: 20, textAlign: 'center' }}>Как это оформлено.</h3>
            <div className="ds-grid-3">
              {[
                { icon: 'file-text', t: 'Агентский договор', b: <>Вы заключаете с RevRoute агентский договор — публичная оферта открыта, её можно прочитать до регистрации. <a href="/ru/legal/agency-offer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>Агентская оферта →</a></> },
                { icon: 'wallet', t: 'Бюджет выплат — ваш', b: 'Выплаты партнёрам идут по вашему поручению в рамках агентского договора. Бюджет выплат — не наш доход, он не смешивается с нашей выручкой.' },
                { icon: 'badge-check', t: 'Выплаты самозанятым', b: 'Проходят через сервисы из реестра операторов электронных площадок ФНС; статус НПД проверяется перед каждой выплатой.' },
              ].map((c) => (
                <div key={c.t} className="card-flat" style={{ background: '#fff' }}>
                  <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)' }}><Icon name={c.icon} size={19} /></span>
                  <h4 className="rr-h3" style={{ marginTop: 14, fontSize: 17 }}>{c.t}</h4>
                  <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Цена-якорь + FAQ + финальный CTA ── */}
      <section className="ds-band ds-container">
        <div className="card" style={{ maxWidth: 860, marginInline: 'auto', display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 56 }}>
          <div style={{ flex: '1 1 320px' }}>
            <Eyebrow>Стоимость</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <span className="rr-mono" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.6rem)', fontWeight: 600, color: 'var(--ink)' }}>от 2&nbsp;450&nbsp;₽</span>
              <span style={{ fontSize: 16, color: 'var(--ink-3)' }}>/мес + 5% за расчёты</span>
            </div>
            <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8, maxWidth: 470 }}>
              При оплате за год. НДС не облагается (УСН). Подписка — доступ к платформе; 5% начисляются только на фактические выплаты партнёрам: нет выплат — нет переменной части.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="ghost" size="lg" href="/pricing" iconRight="arrow-right">Все тарифы</Button>
            <Button variant="primary" size="lg" href={APP_REGISTER} data-ym-goal="landing_signup_click">Начать</Button>
          </div>
        </div>

        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead center eyebrow="Вопросы" title="Коротко о главном." />
          <FaqList items={FAQ} />
        </div>

        <CtaBottom
          tone="spectrum"
          title="Запускайте программу — расчёты с партнёрами возьмём на себя."
          body="Настройте оффер и условия в кабинете — без разработки. Хотите сначала посмотреть — закажите демо."
          primary={{ label: 'Начать', href: APP_REGISTER }}
          secondary={{ label: 'Заказать демо', href: '#demo', demoCta: 'bottom' }}
        />
      </section>

      {/* ── 8. Демо — заявка на показ платформы. Раньше кнопка «Заказать демо»
             вела прямо в Telegram: заявка не фиксировалась, согласий не было. ── */}
      <section id="demo" className="ds-band ds-container" style={{ scrollMarginTop: 90 }}>
        <SectionHead
          center
          eyebrow="Демо"
          title="Покажем платформу на ваших задачах."
          sub="Оставьте контакты — согласуем время и разберём, как настроить оффер, вознаграждения и расчёты под вашу программу."
        />
        <div style={{ maxWidth: 560, marginInline: 'auto' }}>
          <LeadForm
            page="prm-demo"
            aboutLabel="Что показать на демо"
            aboutPlaceholder="Что за продукт, кто вас рекомендует и что хотите увидеть в первую очередь"
            submitLabel="Заказать демо"
            doneText="Свяжемся, чтобы согласовать время демо."
          />
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

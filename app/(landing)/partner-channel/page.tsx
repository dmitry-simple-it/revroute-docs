import type { Metadata } from 'next'
import { HeroCentered } from '@/components/ds/HeroCentered'
import { FaqList } from '@/components/ds/FaqList'
import { Eyebrow, Icon, Button } from '@/components/ds/primitives'
import { ChannelHoursCalc, ChannelLostCalc } from '@/components/marketing/landing/ChannelHoursCalc'
import { ChannelLeadForm } from '@/components/marketing/landing/ChannelLeadForm'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, service } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

const TELEGRAM = 'https://t.me/revroute_bot'
const PARTNERS_EMAIL = 'partners@revroute.ru'

/**
 * Страница оффера «Партнёрский канал под ключ по подписке» — реализация спеки
 * 30-gtm/offers/channel-subscription-landing-spec.md (рынок РФ).
 * Цена и гарантия — решения фаундера 31.07.2026, критерии «Кого мы берём» —
 * Partner-Ready Score v2.1 (guarantee-operations.md §9.1). Числа не выдумывать;
 * «бесплатно» в обещаниях работ не использовать («без новых счетов»).
 */

export const metadata: Metadata = {
  title: 'Партнёрский канал под ключ — с гарантией окупаемости',
  description:
    '250 000 ₽/мес, гарантия 100% окупаемости: строим и ведём партнёрский канал вашего продукта — упаковка программы, поиск и онбординг партнёров, учёт и выплаты.',
  alternates: { canonical: '/partner-channel' },
  openGraph: og('/partner-channel'),
}

/** FAQ: plain-текст уходит в FAQPage JSON-LD, rich — в видимый аккордеон (текст совпадает). */
const FAQ: { q: string; a: string; rich?: React.ReactNode }[] = [
  {
    q: 'Чем это отличается от найма менеджера по партнёрствам?',
    a: 'Менеджер — это один человек: месяцы на найм и погружение, отпуска и риск ухода. Подписка даёт команду и готовую систему — от упаковки программы до учёта, выплат и продаж через нашу партнёрскую сеть. Плюс гарантия окупаемости — условие, которое ни один кандидат на собеседовании на себя не возьмёт.',
  },
  {
    q: 'Почему подписка, а не процент с продаж?',
    a: 'Первые месяцы канала — это строительство: упаковка, дистрибуция, онбординг партнёров. Работа только за процент толкает исполнителя к быстрым разовым сделкам, а не к системе. Подписка оплачивает строительство, гарантия окупаемости снимает ваш риск, а процент в модели тоже есть: за сделки через сеть RevRoute мы получаем комиссию по условиям вашей программы, как любой партнёр.',
  },
  {
    q: 'Что, если партнёры не приведут сделок?',
    a: 'На этот случай и существует гарантия: если прибыль с новых сделок от новых партнёров за гарантийное окно не покрыла стоимость подписки — работаем без оплаты, пока канал не окупится. И мы не ждём чужих продаж: с первых недель продаём ваш продукт через партнёрскую сеть RevRoute.',
  },
  {
    q: 'Мы уже пробовали партнёрку — не взлетела. Что изменится?',
    a: 'Чаще всего «не взлетела» означает: условия на словах, онбординга партнёров нет, партнёр предоставлен самому себе. Это лечится системой — разбор покажет, что именно сломано. А если проблема в экономике оффера, честно скажем, что канал пока не нужен, и предложим начать с аудита программы.',
    rich: (
      <>
        Чаще всего «не взлетела» означает: условия на словах, онбординга партнёров нет, партнёр
        предоставлен самому себе. Это лечится системой — разбор покажет, что именно сломано. А если
        проблема в экономике оффера, честно скажем, что канал пока не нужен, и предложим начать с{' '}
        <a href="/audit" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>аудита программы</a>.
      </>
    ),
  },
  {
    q: 'У нас чек 50–70 тысяч — подойдёт ли?',
    a: 'Считаем не разовый чек, а доход с клиента за первый год: подписка, допродажи, пополнения. Если клиент приносит от 100 тыс. ₽ за год — экономика канала сходится. Если меньше — предложим платформу по обычному тарифу или упаковку программы без гарантии окупаемости.',
    rich: (
      <>
        Считаем не разовый чек, а доход с клиента за первый год: подписка, допродажи, пополнения.
        Если клиент приносит от 100 тыс. ₽ за год — экономика канала сходится. Если меньше —
        предложим{' '}
        <a href="/pricing" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>платформу по обычному тарифу</a>{' '}
        или{' '}
        <a href="/packaging" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>упаковку программы</a>{' '}
        без гарантии окупаемости.
      </>
    ),
  },
  {
    q: 'Соберём сами: таблицы, конструктор, вайб-кодинг. Зачем вы?',
    a: 'Собрать трекинг-прототип можно. Дальше начинается контур, который дорого поддерживать: атрибуция без споров, антифрод, маркировка рекламы, закрывающие документы и чеки самозанятых, реестры выплат. Платформа делает это из коробки, а подписка добавляет руки: поиск, онбординг партнёров и продажи через нашу сеть.',
    rich: (
      <>
        Собрать трекинг-прототип можно. Дальше начинается контур, который дорого поддерживать:
        атрибуция без споров, антифрод, маркировка рекламы, закрывающие документы и чеки
        самозанятых, реестры выплат.{' '}
        <a href="/prm" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>Платформа</a>{' '}
        делает это из коробки, а подписка добавляет руки: поиск, онбординг партнёров и продажи
        через нашу сеть.
      </>
    ),
  },
  {
    q: 'Какой у нас доступ к данным и что будет при уходе?',
    a: 'Кабинет и данные — ваши с первого дня: партнёры, сделки, атрибуция, история выплат. Экспорт доступен в любой момент. Решите уйти — база партнёров и материалы программы остаются у вас.',
  },
  {
    q: 'Кто общается с партнёрами?',
    a: 'Скрипты, регламенты и welcome-цепочки — наши, голос — ваш. Живое общение ведёт ваш куратор — минимум 8 часов в неделю; self-serve онбординг снимает большую часть вопросов до того, как они дойдут до человека. Лиды и закрытие сделок — ваш отдел продаж: это отдельная роль, не куратор.',
  },
  {
    q: 'Подойдёт ли это нам?',
    a: 'Ориентиры: выручка от 10 млн ₽ в год и рост, доход с клиента от 100 тыс. ₽ за первый год, цикл сделки до 60 дней, вовлечённый фаундер. Вне критериев — предложим платформу по обычному тарифу или упаковку программы. Компании с выручкой от 100 млн ₽ в год — отдельный KPI на объём.',
    rich: (
      <>
        Ориентиры: выручка от 10 млн ₽ в год и рост, доход с клиента от 100 тыс. ₽ за первый год,
        цикл сделки до 60 дней, вовлечённый фаундер. Вне критериев — предложим{' '}
        <a href="/pricing" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>платформу по обычному тарифу</a>{' '}
        или{' '}
        <a href="/packaging" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>упаковку программы</a>.
        Компании с выручкой от 100 млн ₽ в год — отдельный KPI на объём.
      </>
    ),
  },
]

/** B2. «Сейчас → станет» — 6 пар из спеки. */
const WAS_NOW: { was: string; now: string }[] = [
  {
    was: 'Новые партнёры появляются только из знакомств — системного притока нет.',
    now: 'Системный поиск: каталоги партнёрских программ и сети, базы партнёров, отбор под ваш профиль.',
  },
  {
    was: 'Условия «на словах», с каждым партнёром — отдельные переговоры.',
    now: 'Понятная для всех экономика: уровни партнёров, бонусы, правила атрибуции, защита от накруток.',
  },
  {
    was: 'Онбординга и сопровождения нет — партнёр «разбирается сам» и пропадает.',
    now: 'Self-serve онбординг партнёров: welcome-цепочки, регламенты, FAQ, скрипты для вашего куратора.',
  },
  {
    was: 'База партнёров живёт в чатах и таблицах.',
    now: 'Кабинеты, ссылки, статистика и история начислений — на платформе.',
  },
  {
    was: 'Выплаты вручную: закрывающие документы, самозанятые и ИП, чеки НПД.',
    now: 'Расчёт партнёрских комиссий, реестры выплат, закрывающие документы — в едином окне.',
  },
  {
    was: 'Учёта «кто кого привёл» нет — споры, чья сделка.',
    now: 'Атрибуция «клик → лид → сделка» или процесс закрепления клиента: спорить не о чем.',
  },
]

/** B4. Что входит в подписку — 10 блоков (продажи через сеть RevRoute — отдельной карточкой). */
const INCLUDED: { icon: string; title: string; body: React.ReactNode }[] = [
  {
    icon: 'database',
    title: 'Переезд базы партнёров.',
    body: 'Собираем действующих партнёров на платформу и отправляем письмо-анонс новых условий.',
  },
  {
    icon: 'percent',
    title: 'Оффер и экономика программы.',
    body: 'Анализ программ конкурентов, тиры, welcome-бонусы и бонусы за объём.',
  },
  {
    icon: 'layers',
    title: 'Витрина и материалы.',
    body: 'Страница программы и промокомплект для партнёров — под вашим брендом.',
  },
  {
    icon: 'scale',
    title: 'Юридический комплект РФ.',
    body: 'Оферта для партнёров, правила трафика, маркировка рекламы (ОРД), процедура проверки партнёров.',
  },
  {
    icon: 'shield-check',
    title: 'Защита от накруток.',
    body: 'Карта фрода под вашу программу и регламент проверки трафика.',
  },
  {
    icon: 'star',
    title: 'Кейсы партнёров.',
    body: 'Упаковка трёх историй, которые помогают продавать программу новым партнёрам.',
  },
  {
    icon: 'globe',
    title: 'Дистрибуция программы.',
    body: 'Заведение в каталоги и сетки, прямой поиск по базе RevRoute, цепочки писем.',
  },
  {
    icon: 'user-plus',
    title: 'Рекрутинг и онбординг партнёров.',
    body: 'Welcome-цепочка, онбординг-инструкция, FAQ и скрипты для вашего куратора — без созвонов с нашей стороны.',
  },
  {
    icon: 'wallet',
    title: 'Учёт и выплаты.',
    body: (
      <>
        Расчёт комиссий, реестры, закрывающие документы, выплаты самозанятым и ИП единым окном — на{' '}
        <a href="/prm" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>платформе RevRoute</a>.
      </>
    ),
  },
  {
    icon: 'bar-chart-3',
    title: 'Управление каналом.',
    body: 'Еженедельный отчёт по воронке — кандидаты в партнёры, активные партнёры, сделки — и решения на неделю.',
  },
]

/** B7. Плашка «Кого мы берём» — 5 объективных критериев (PRS v2.1). */
const CRITERIA: string[] = [
  'Выручка от 10 млн ₽ в год — и растёт: примерно от 30% год к году или минимум два квартала подряд в плюс. Мы зарабатываем, когда вы способны масштабировать производство.',
  'Клиент приносит от 100 тыс. ₽ за первый год: подписка, допродажи, пополнения. Партнёру выгодно вас продавать.',
  'Цикл сделки — до 60 дней. При более длинном цикле считаем гарантийное окно длиннее или предлагаем индивидуальные условия гарантии.',
  'Продукт масштабируется. Это позволяет привлечь крупных партнёров, готовых отгружать большой объём лидов.',
  'Фаундер вовлечён, выделен куратор канала минимум на 8 часов в неделю. Канал не строится «без вас вообще».',
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

const linkStyle = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 } as const

export default function PartnerChannelPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Партнёрский канал под ключ' },
          ]),
          service({
            name: 'Партнёрский канал под ключ',
            url: '/partner-channel',
            description:
              'Подписка на построение и ведение партнёрского канала: упаковка программы, поиск и онбординг партнёров, учёт вознаграждений и выплаты на платформе RevRoute, продажи продукта через партнёрскую сеть RevRoute. 250 000 ₽/мес, минимум 3 месяца, гарантия 100% окупаемости по итогам диагностики.',
            serviceType: 'Partner channel management',
            audienceType: 'B2B software vendors',
            offersUrl: '/partner-channel#pricing',
            // Ровно та цена, что видна в блоке «Фиксированная цена».
            price: 250000,
            priceUnitText: 'MONTH',
            priceDescription: 'Ежемесячно, минимум 3 месяца. Гарантия 100% окупаемости по итогам диагностики.',
          }),
          faqPage(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />

      {/* ── B1. Hero — один call-to-action на первом экране ── */}
      <HeroCentered
        eyebrow="Услуга · По подписке"
        title="Партнёрский канал под ключ — с гарантией окупаемости"
        body={
          <>
            Строим и&nbsp;ведём партнёрский канал вашего продукта: упаковка программы, поиск
            и&nbsp;онбординг партнёров, готовых продавать ваш продукт.
          </>
        }
        primary={{ label: 'Записаться на разбор канала', href: '#lead', ymGoal: 'pc_cta_razbor' }}
      />

      {/* микрокопия под CTA + 3 стат-карты конструкции оффера */}
      <section className="ds-container" style={{ paddingBottom: 56 }}>
        <p className="rr-small" style={{ color: 'var(--ink-3)', textAlign: 'center', maxWidth: 560, margin: '-28px auto 40px' }}>
          Разбор вашей текущей партнёрской программы — 30 минут с основателем. Не найдём точек
          роста или не подтвердим готовность к развитию канала — честно скажем, что канал вам пока
          не нужен.
        </p>
        <div className="ds-grid-3">
          {[
            {
              n: '100%',
              l: 'гарантия окупаемости',
              body: 'Вложения возвращаются через прибыль с новых сделок от новых партнёров. Фиксируем на старте с учётом среднего чека и цикла сделки.',
            },
            {
              n: '3 месяца',
              l: 'до работающей сети',
              body: 'Партнёры прошли онбординг и продают ваш продукт. Партнёрский канал можно масштабировать.',
            },
            {
              n: 'Ваш актив',
              l: 'а не услуга в аренду',
              body: 'База партнёров, программа и процессы остаются у вас — в вашем кабинете, с экспортом в любой момент.',
            },
          ].map((s) => (
            <div key={s.l} className="card-flat" style={{ padding: 24 }}>
              <div style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, color: 'var(--ink)' }}>{s.n}</div>
              <div className="rr-caption" style={{ marginTop: 6 }}>{s.l}</div>
              <p className="rr-small" style={{ marginTop: 10 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── B2. «Сейчас → станет» ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Знакомо?"
          title="Канал держится на личных договорённостях."
        />
        <div className="ds-grid-2" style={{ maxWidth: 980, marginInline: 'auto' }}>
          <div className="card-flat" style={{ padding: 26 }}>
            <p className="rr-caption" style={{ margin: 0 }}>Сейчас</p>
            <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {WAS_NOW.map((row) => (
                <li key={row.was} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="x" size={17} color="var(--ink-3)" strokeWidth={2.4} style={{ marginTop: 3 }} />
                  <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{row.was}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-flat" style={{ padding: 26 }}>
            <p className="rr-caption" style={{ margin: 0 }}>На подписке</p>
            <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {WAS_NOW.map((row) => (
                <li key={row.now} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="check" size={17} color="var(--accent)" strokeWidth={2.6} style={{ marginTop: 3 }} />
                  <span className="rr-small" style={{ color: 'var(--ink)' }}>{row.now}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── B3. Сколько канал стоит в часах ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Цена ручного канала"
          title="Сколько канал стоит вам сейчас — в часах."
          sub="Оценки типовые — поправьте цифры под свой процесс и посмотрите на итог."
        />
        <div style={{ maxWidth: 760, marginInline: 'auto' }}>
          <ChannelHoursCalc />
          <div style={{ marginTop: 20 }}>
            <ChannelLostCalc />
          </div>
          <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 16, textAlign: 'center' }}>
            Это общая оценка процесса — точную картину покажет{' '}
            <a href="#lead" style={linkStyle}>разбор</a>.
          </p>
          <p className="rr-body" style={{ color: 'var(--ink)', marginTop: 20, textAlign: 'center', maxWidth: 620, marginInline: 'auto' }}>
            На подписке за вами остаются два процесса: живое общение с партнёрами по нашим
            скриптам и подтверждение реестра выплат.
          </p>
        </div>
      </section>

      {/* ── B4. Что входит в подписку ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Что входит"
          title="Десять рабочих блоков — и продажи через нашу сеть."
          sub="Подписка закрывает канал целиком: от упаковки программы до проведения новой выручки."
        />
        <div className="ds-grid-2">
          {INCLUDED.map((f) => (
            <div key={f.title} className="card-flat" style={{ padding: 24 }}>
              <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 11, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <Icon name={f.icon} size={20} />
              </span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{f.title}</h3>
              <p className="rr-small" style={{ marginTop: 8 }}>{f.body}</p>
            </div>
          ))}
          {/* выделенная карточка «Продажи через партнёрскую сеть RevRoute» */}
          <div className="card" style={{ gridColumn: '1 / -1', padding: 28, border: '1px solid var(--accent-line)', background: 'var(--accent-bg)' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 12, background: '#fff', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)', flexShrink: 0 }}>
                <Icon name="network" size={23} />
              </span>
              <div style={{ flex: '1 1 320px' }}>
                <h3 className="rr-h3">Продажи через партнёрскую сеть RevRoute.</h3>
                <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 8 }}>
                  У нас своя партнёрская сеть — и на время подписки мы продаём через неё ваш продукт
                  за партнёрскую комиссию по условиям вашей программы. Так возврат ваших вложений
                  обеспечен не обещаниями, а нашими продажами: продажа чужих продуктов за комиссию —
                  наш действующий бизнес.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── B6. Зоны ответственности ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Зоны ответственности"
          title="Мы строим систему с вами."
          sub="Вы лучше всех знаете свой продукт. Встречные обязательства фиксируются в договоре."
        />
        <div className="ds-grid-2" style={{ maxWidth: 980, marginInline: 'auto' }}>
          <div className="card-flat" style={{ padding: 26 }}>
            <h3 className="rr-h3">Наша зона.</h3>
            <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Формирование базы партнёров и размещение программы в каталогах',
                'Аудит и упаковка программы для партнёров, обеспечение её прозрачности и привлекательности',
                'Автоматизация онбординга партнёров и сопровождение',
                'Внедрение, интеграция и сопровождение PRM-системы для масштабирования программы',
                'Обеспечение окупаемости канала',
              ].map((t) => (
                <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="check" size={17} color="var(--accent)" strokeWidth={2.6} style={{ marginTop: 3 }} />
                  <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-flat" style={{ padding: 26 }}>
            <h3 className="rr-h3">Остаётся за вами.</h3>
            <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                <>Куратор канала — от 8 часов в неделю; живое общение с партнёрами по нашим скриптам</>,
                <><b style={{ color: 'var(--ink)' }}>Обработка лидов от партнёров — не дольше 24 часов</b> (центральное условие гарантии: лид остывает быстро)</>,
                <>Демо и закрытие сделок — ваш отдел продаж, это отдельная роль, не куратор</>,
                <>Обратная связь по сделкам</>,
                <>Условия программы меняются только по согласованию — за 14 дней</>,
              ].map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="chevron-right" size={17} color="var(--ink-3)" strokeWidth={2.4} style={{ marginTop: 3 }} />
                  <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── B7. Гарантия ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Гарантия"
          title="100% окупаемости — или работаем без оплаты, пока канал не окупится."
        />
        <div style={{ maxWidth: 980, marginInline: 'auto' }}>
          {/* визуальный мини-расчёт */}
          <div className="card-flat" style={{ padding: '22px 26px', background: 'var(--bg-sunken)' }}>
            <p className="rr-caption" style={{ margin: 0 }}>Пример</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 14 }}>
              {[
                { v: '200 000 ₽', l: 'чек сделки' },
                { op: '×' },
                { v: '40%', l: 'маржа' },
                { op: '=' },
                { v: '80 000 ₽', l: 'прибыли со сделки' },
              ].map((t, i) =>
                'op' in t ? (
                  <span key={i} style={{ fontSize: 20, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{t.op}</span>
                ) : (
                  <span key={i} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '10px 16px' }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{t.v}</span>
                    <span className="rr-caption" style={{ fontSize: 11 }}>{t.l}</span>
                  </span>
                )
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 12 }}>
              {[
                { v: '750 000 ₽', l: 'подписка: 3 мес × 250 000 ₽' },
                { op: '÷' },
                { v: '80 000 ₽', l: 'прибыли со сделки' },
                { op: '≈' },
                { v: '9–10 сделок', l: 'за окно — и канал окупился', accent: true },
              ].map((t, i) =>
                'op' in t ? (
                  <span key={i} style={{ fontSize: 20, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{t.op}</span>
                ) : (
                  <span key={i} style={{ background: t.accent ? 'var(--accent-bg)' : '#fff', border: `1px solid ${t.accent ? 'var(--accent-line)' : 'var(--line)'}`, borderRadius: 12, padding: '10px 16px' }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 600, color: t.accent ? 'var(--accent-strong)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{t.v}</span>
                    <span className="rr-caption" style={{ fontSize: 11 }}>{t.l}</span>
                  </span>
                )
              )}
            </div>
            <p className="rr-small" style={{ marginTop: 14, color: 'var(--ink-2)' }}>
              Наше обязательство: прибыль с новых сделок от новых партнёров — включая сделки через
              сеть RevRoute — за гарантийное окно покрывает стоимость подписки. Порядок расчёта
              фиксируем на разборе: формула прибыли, число сделок и срок окна — по вашему среднему
              чеку и циклу сделки; окно — обычно квартал. Недобор к концу окна — работаем без
              оплаты, пока канал не окупится.
            </p>
            <p className="rr-small" style={{ marginTop: 10, color: 'var(--ink-3)' }}>
              Конкретные KPI фиксируем в плане квартала после оценки партнёрской программы и
              продукта: минимум — окупаемость, дальше — индивидуальные условия. При рекуррентном
              чеке окупаемость достигается меньшим числом клиентов.
            </p>
          </div>
        </div>

        {/* плашка «Кого мы берём» */}
        <div className="card" style={{ maxWidth: 980, marginInline: 'auto', marginTop: 20, padding: 28 }}>
          <h3 className="rr-h3">Кого мы берём.</h3>
          <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 6 }}>
            Мы работаем с теми, кто идёт в лидеры своей ниши. Пять объективных критериев:
          </p>
          <ol style={{ margin: '16px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, counterReset: 'crit' }}>
            {CRITERIA.map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: 8, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)', fontSize: 12.5, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{c}</span>
              </li>
            ))}
          </ol>
        </div>
        <div style={{ maxWidth: 980, marginInline: 'auto', marginTop: 20, textAlign: 'center' }}>
          <p className="rr-small" style={{ color: 'var(--ink-3)', maxWidth: 720, marginInline: 'auto' }}>
            Гарантию фиксируем по итогам разбора. Не сошлось по критериям — честно предложим{' '}
            <a href="/packaging" style={linkStyle}>упаковку программы</a> без гарантии окупаемости
            или <a href="/pricing" style={linkStyle}>платформу по обычному тарифу</a>; результаты
            разбора в любом случае остаются у вас. Компании с выручкой от 100 млн ₽ в год —
            отдельный KPI на объём.
          </p>
          <div style={{ marginTop: 20 }}>
            <Button variant="primary" size="lg" href="#lead" iconRight="arrow-right" data-ym-goal="pc_cta_razbor">Записаться на разбор</Button>
          </div>
        </div>
      </section>

      {/* ── B8. Что дальше ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead center eyebrow="Что дальше" title="Когда канал заработал." />
        <div className="ds-grid-2" style={{ maxWidth: 980, marginInline: 'auto' }}>
          <div className="card-flat" style={{ padding: 26 }}>
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 11, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <Icon name="zap" size={20} />
            </span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>Нашли работающую связку.</h3>
            <p className="rr-small" style={{ marginTop: 8 }}>
              Бюджет на ускорение — платные размещения и партнёрские активности — согласуем
              отдельно, когда видно, что именно масштабировать.
            </p>
          </div>
          <div className="card-flat" style={{ padding: 26 }}>
            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 11, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <Icon name="repeat" size={20} />
            </span>
            <h3 className="rr-h3" style={{ marginTop: 16 }}>После квартала — два пути.</h3>
            <p className="rr-small" style={{ marginTop: 8 }}>
              Масштабируете сами — канал уже ваш. Или продолжаете по тому же тарифу с новыми
              квартальными KPI.
            </p>
          </div>
        </div>
      </section>

      {/* ── B9. Тарифы ── */}
      <section id="pricing" className="ds-band ds-container" style={{ paddingTop: 0, scrollMarginTop: 90 }}>
        <SectionHead
          center
          eyebrow="Цена"
          title="Фиксированная цена."
          sub="Ежемесячно. Платформа и продажи через сеть RevRoute включены."
        />
        <div className="ds-grid-2" style={{ maxWidth: 980, marginInline: 'auto', alignItems: 'stretch' }}>
          <div className="card" style={{ padding: 30, border: '1px solid var(--accent-line)', display: 'flex', flexDirection: 'column' }}>
            <p className="rr-caption" style={{ margin: 0 }}>Подписка</p>
            <h3 className="rr-h3" style={{ marginTop: 8 }}>Канал под ключ.</h3>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: 'var(--ink)' }}>250 000 ₽</span>
              <span className="rr-small" style={{ color: 'var(--ink-3)' }}>/мес · минимум 3 месяца</span>
            </div>
            <ul style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {[
                'Все десять блоков подписки + продажи через сеть RevRoute',
                'Платформа RevRoute включена',
                'Гарантия 100% окупаемости — фиксируется на разборе',
              ].map((t) => (
                <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="check" size={17} color="var(--accent)" strokeWidth={2.6} style={{ marginTop: 3 }} />
                  <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{t}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 22 }}>
              <Button variant="accent" size="lg" href="#lead" iconRight="arrow-right" data-ym-goal="pc_cta_razbor" style={{ width: '100%', justifyContent: 'center' }}>Записаться на разбор</Button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card-flat" style={{ padding: 26, flex: 1 }}>
              <p className="rr-caption" style={{ margin: 0 }}>Посадка или альтернатива</p>
              <h3 className="rr-h3" style={{ marginTop: 8 }}>«Сервис».</h3>
              <p className="rr-small" style={{ marginTop: 8 }}>
                Платформа RevRoute самостоятельно: тарифы от 2 450 ₽/мес плюс 5% от суммы выплат
                партнёрам. Путь после квартала — или если канал вы строите своими руками.
              </p>
              <div style={{ marginTop: 16 }}>
                <Button variant="ghost" size="md" href="/pricing" iconRight="arrow-right">Тарифы платформы</Button>
              </div>
            </div>
            <div className="card-flat" style={{ padding: 26, flex: 1 }}>
              <p className="rr-caption" style={{ margin: 0 }}>Отдельно</p>
              <h3 className="rr-h3" style={{ marginTop: 8 }}>Ускорение.</h3>
              <p className="rr-small" style={{ marginTop: 8 }}>
                Бюджет на платные размещения и партнёрские активности — по согласованию. Цен на
                странице нет: смета зависит от связок, которые покажет квартал.
              </p>
            </div>
          </div>
        </div>
        <div className="card-flat" style={{ maxWidth: 980, marginInline: 'auto', marginTop: 20, padding: '20px 26px' }}>
          <p className="rr-caption" style={{ margin: 0 }}>Для сравнения</p>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li className="rr-small" style={{ color: 'var(--ink-2)' }}>
              Штатный менеджер по партнёрствам — зарплата и налоги, месяцы на найм и погружение, и
              это один человек, а не система с платформой и гарантией.
            </li>
            <li className="rr-small" style={{ color: 'var(--ink-2)' }}>
              Профильные консультанты — выстроят стратегию, но не будут упаковывать и тестировать
              сегменты партнёров за вас. Без платформы и гарантии окупаемости.
            </li>
          </ul>
        </div>
      </section>

      {/* ── B11. FAQ ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead center eyebrow="Вопросы" title="Спрашивают перед разбором." />
        <div style={{ maxWidth: 760, marginInline: 'auto' }}>
          <FaqList items={FAQ.map(({ q, a, rich }) => ({ q, a: rich ?? a }))} />
        </div>
      </section>

      {/* ── B12. Финальный CTA + форма ── */}
      <section id="lead" className="ds-band ds-container" style={{ paddingTop: 0, scrollMarginTop: 90 }}>
        <SectionHead
          center
          eyebrow="Заявка"
          title="Начните с разбора канала."
          sub="Разбор вашей партнёрской программы — 30 минут с основателем. Не найдём точек роста или не подтвердим готовность к развитию канала — честно скажем, что канал вам пока не нужен."
        />
        <div style={{ maxWidth: 560, marginInline: 'auto' }}>
          <ChannelLeadForm />
        </div>
        <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 20, textAlign: 'center' }}>
          Разборы проводит основатель лично — слоты ограничены.
        </p>
        <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8, textAlign: 'center' }}>
          Или напрямую:{' '}
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>Telegram</a>
          {' · '}
          <a href={`mailto:${PARTNERS_EMAIL}`} style={{ color: 'var(--accent-strong)', textDecoration: 'none', fontWeight: 500 }}>{PARTNERS_EMAIL}</a>
        </p>
      </section>
    </>
  )
}

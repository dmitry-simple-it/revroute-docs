import type { Metadata } from 'next'
import { HeroCentered } from '@/components/ds/HeroCentered'
import { Steps } from '@/components/ds/Steps'
import { FaqList } from '@/components/ds/FaqList'
import { Eyebrow, Icon, Button } from '@/components/ds/primitives'
import { ChannelLeadForm } from '@/components/marketing/landing/ChannelLeadForm'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, service } from '@/lib/seo/schemas'

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
  title: 'Партнёрский канал под ключ — подписка с гарантией окупаемости',
  description:
    'Строим и ведём партнёрский канал вашего продукта по подписке: упаковка программы, сорсинг и ввод партнёров, учёт и выплаты на платформе RevRoute. И сами продаём ваш продукт как партнёр №1. 250 000 ₽/мес, гарантия 100% окупаемости.',
  alternates: { canonical: '/partner-channel' },
}

/** FAQ: plain-текст уходит в FAQPage JSON-LD, rich — в видимый аккордеон (текст совпадает). */
const FAQ: { q: string; a: string; rich?: React.ReactNode }[] = [
  {
    q: 'Чем это отличается от найма менеджера по партнёрствам?',
    a: 'Менеджер — это один человек: месяцы на найм и погружение, отпуска и риск ухода. Подписка — команда с готовой системой: упаковка программы, дистрибуция, платформа учёта и выплат, собственные продажи как партнёр №1 — и гарантия окупаемости, под которую не подпишется ни один кандидат на собеседовании.',
  },
  {
    q: 'Почему подписка, а не процент с продаж?',
    a: 'Первые месяцы канала — это строительство: упаковка, дистрибуция, ввод партнёров. Работа только за процент толкает исполнителя к быстрым разовым сделкам, а не к системе. Подписка оплачивает строительство, гарантия окупаемости снимает ваш риск, а процент в модели тоже есть: комиссию партнёра №1 мы получаем по сетке вашей программы, как любой партнёр.',
  },
  {
    q: 'Что, если партнёры не приведут сделок?',
    a: 'На этот случай и существует гарантия: если чистая маржа со сделок через новых партнёров за гарантийное окно не покрыла оплату подписки, новые счета не выставляются — работаем, пока канал не окупится. И мы не ждём чужих продаж: как партнёр №1 сами продаём ваш продукт с первых недель.',
  },
  {
    q: 'Мы уже пробовали партнёрку — не взлетела. Что изменится?',
    a: 'Чаще всего «не взлетела» означает: условия на словах, ввода партнёров нет, партнёр предоставлен самому себе. Это лечится системой — разбор покажет, что именно сломано. А если проблема в экономике оффера, честно скажем, что канал пока не нужен, и предложим начать с аудита программы.',
    rich: (
      <>
        Чаще всего «не взлетела» означает: условия на словах, ввода партнёров нет, партнёр
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
    a: 'Собрать трекинг-прототип можно. Дальше начинается контур, который дорого поддерживать: атрибуция без споров, антифрод, маркировка рекламы, закрывающие документы и чеки самозанятых, реестры выплат. Платформа делает это из коробки, а подписка добавляет руки: сорсинг, ввод партнёров и продажи партнёра №1.',
    rich: (
      <>
        Собрать трекинг-прототип можно. Дальше начинается контур, который дорого поддерживать:
        атрибуция без споров, антифрод, маркировка рекламы, закрывающие документы и чеки
        самозанятых, реестры выплат.{' '}
        <a href="/prm" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>Платформа</a>{' '}
        делает это из коробки, а подписка добавляет руки: сорсинг, ввод партнёров и продажи
        партнёра №1.
      </>
    ),
  },
  {
    q: 'Какой у нас доступ к данным и что будет при уходе?',
    a: 'Кабинет и данные — ваши с первого дня: партнёры, сделки, атрибуция, история выплат. Экспорт доступен в любой момент. Решите уйти — база партнёров и материалы программы остаются у вас.',
  },
  {
    q: 'Кто общается с партнёрами?',
    a: 'Сценарии, регламенты и welcome-цепочки — наши, голос — ваш. Живое общение ведёт ваш куратор, до 8 часов в неделю; self-serve онбординг снимает большую часть вопросов до того, как они дойдут до человека.',
  },
  {
    q: 'Подойдёт ли это нам?',
    a: 'Ориентиры: выручка от 10 млн ₽ в год и рост, доход с клиента от 100 тыс. ₽ за первый год, цикл сделки до 60 дней, вовлечённый фаундер. Вне критериев — предложим платформу по обычному тарифу или упаковку программы. Компании с выручкой от 100 млн ₽ в год — отдельный разговор про условия на объём.',
    rich: (
      <>
        Ориентиры: выручка от 10 млн ₽ в год и рост, доход с клиента от 100 тыс. ₽ за первый год,
        цикл сделки до 60 дней, вовлечённый фаундер. Вне критериев — предложим{' '}
        <a href="/pricing" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>платформу по обычному тарифу</a>{' '}
        или{' '}
        <a href="/packaging" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>упаковку программы</a>.
        Компании с выручкой от 100 млн ₽ в год — отдельный разговор про условия на объём.
      </>
    ),
  },
]

/** B2. «Сейчас → станет» — 6 пар из спеки. */
const WAS_NOW: { was: string; now: string }[] = [
  {
    was: 'Партнёры приходят из знакомств, канал держится на личных договорённостях.',
    now: 'Системный сорсинг: каталоги, сетки, базы вебмастеров, отбор под ваш профиль.',
  },
  {
    was: 'Условия «на словах», с каждым партнёром — отдельные переговоры.',
    now: 'Спроектированная экономика: тиры, бонусы, правила атрибуции, защита от накруток.',
  },
  {
    was: 'Ввода и сопровождения нет — партнёр «разбирается сам» и пропадает.',
    now: 'Self-serve ввод: welcome-цепочка, регламенты, FAQ, сценарии для вашего куратора.',
  },
  {
    was: 'База партнёров живёт в чатах и таблицах.',
    now: 'Кабинеты, ссылки, статистика и история начислений — на платформе.',
  },
  {
    was: 'Выплаты вручную: закрывающие документы, самозанятые и ИП, чеки НПД.',
    now: 'Расчёт комиссий, реестры выплат, закрывающие документы — единым окном по агентской схеме.',
  },
  {
    was: 'Учёта «кто кого привёл» нет — споры по атрибуции.',
    now: 'Атрибуция «клик → лид → сделка»: спорить не о чем.',
  },
]

/** B3. Операции ручного канала — оценки в часах (est), итог ≈13–32 ч/мес. */
const HOURS: { op: string; est: string }[] = [
  { op: 'Поиск и переговоры с новыми партнёрами', est: '≈4–10 ч' },
  { op: 'Онбординг и ответы на вопросы партнёров', est: '≈3–6 ч' },
  { op: 'Ручной учёт «кто кого привёл», сверка сделок', est: '≈2–6 ч' },
  { op: 'Расчёт вознаграждений и реестры выплат', est: '≈2–5 ч' },
  { op: 'Закрывающие документы и чеки самозанятых вручную', est: '≈1–3 ч' },
  { op: 'Обновление материалов и условий программы', est: '≈1–2 ч' },
]

/** B4. Что входит в подписку — 10 блоков (партнёр №1 — отдельной карточкой). */
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
    body: 'Заведение в каталоги и сетки, прямой сорсинг из базы RevRoute, цепочки писем.',
  },
  {
    icon: 'user-plus',
    title: 'Рекрутинг и ввод партнёров.',
    body: 'Welcome-цепочка, онбординг-инструкция, FAQ и сценарии для вашего куратора — без созвонов с нашей стороны.',
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
    body: 'Еженедельный отчёт по воронке — кандидаты, диалоги, введённые партнёры, сделки — и решения на неделю.',
  },
]

/** B7. Плашка «Кого мы берём» — 5 объективных критериев (PRS v2.1). */
const CRITERIA: string[] = [
  'Выручка от 10 млн ₽ в год — и растёт: примерно от 30% год к году или минимум два квартала подряд в плюс. Мы зарабатываем, когда канал растёт вместе с вами, — и под это подписываемся гарантией.',
  'Клиент приносит от 100 тыс. ₽ за первый год — разовым чеком или суммой за год: подписка, допродажи, пополнения. Партнёру достаётся ощутимая доля, около 15% годового дохода с клиента: ему выгодно вас продавать.',
  'Цикл сделки — до 60 дней. При более длинном цикле считаем гарантийное окно длиннее или предлагаем гарантию по введённым партнёрам.',
  'Продукт масштабируется: исполнение не упирается в ручную ёмкость команды. Канал имеет смысл только там, где рост можно принять.',
  'Фаундер вовлечён: куратор канала до 8 часов в неделю. Канал не строится «без вас вообще».',
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
              'Подписка на построение и ведение партнёрского канала: упаковка программы, сорсинг и ввод партнёров, учёт вознаграждений и выплаты на платформе RevRoute, собственные продажи RevRoute как партнёра №1. 250 000 ₽/мес, минимум 3 месяца, гарантия 100% окупаемости по итогам диагностики.',
            serviceType: 'Partner channel management',
            audienceType: 'B2B software vendors',
            offersUrl: '/partner-channel#pricing',
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
            Строим и&nbsp;ведём партнёрский канал вашего продукта: упаковка программы, сорсинг
            и&nbsp;ввод партнёров, учёт вознаграждений и&nbsp;выплаты — на&nbsp;платформе RevRoute.
            И&nbsp;сами продаём ваш продукт как партнёр&nbsp;№1.
          </>
        }
        primary={{ label: 'Записаться на разбор канала', href: '#lead', ymGoal: 'pc_cta_razbor' }}
      />

      {/* микрокопия под CTA + 3 стат-карты конструкции оффера */}
      <section className="ds-container" style={{ paddingBottom: 56 }}>
        <p className="rr-small" style={{ color: 'var(--ink-3)', textAlign: 'center', maxWidth: 560, margin: '-28px auto 40px' }}>
          Разбор — 30 минут с основателем: AI-аудит вашей программы и потенциал канала в рублях.
          Не найдём минимум трёх точек роста — честно скажем, что канал вам пока не нужен.
        </p>
        <div className="ds-grid-3">
          {[
            {
              n: '100%',
              l: 'окупаемости',
              body: 'Канал возвращает всё, что вы заплатили, маржой со сделок через новых партнёров — или продолжаем работу без новых счетов.',
            },
            {
              n: '3 месяца',
              l: 'от старта до канала',
              body: 'База на платформе, программа упакована, новые партнёры продают.',
            },
            {
              n: '2–3',
              l: 'канала одновременно',
              body: 'Гарантию и сопровождение ведёт лично команда основателя — без размытия на десятки клиентов.',
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
          sub="Так выглядит партнёрская программа, которая выросла из знакомств. Слева — как сейчас, справа — как станет на подписке."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 980, marginInline: 'auto' }}>
          {WAS_NOW.map((row) => (
            <div key={row.was} className="card-flat" style={{ padding: '18px 22px' }}>
              <div className="ds-grid-2" style={{ gap: '10px 28px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="x" size={17} color="var(--ink-3)" strokeWidth={2.4} style={{ marginTop: 3 }} />
                  <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{row.was}</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon name="check" size={17} color="var(--accent)" strokeWidth={2.6} style={{ marginTop: 3 }} />
                  <span className="rr-small" style={{ color: 'var(--ink)' }}>{row.now}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── B3. Сколько канал стоит в часах ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Цена ручного канала"
          title="Сколько канал стоит вам сейчас — в часах."
        />
        <div style={{ maxWidth: 760, marginInline: 'auto' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {HOURS.map((h, i) => (
              <div key={h.op} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '15px 24px', borderTop: i === 0 ? 'none' : '1px solid var(--line-2)' }}>
                <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{h.op}</span>
                <span className="pill amber" style={{ flexShrink: 0 }}>{h.est}/мес</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '17px 24px', borderTop: '1px solid var(--line)', background: 'var(--bg-sunken)' }}>
              <span className="rr-body" style={{ fontWeight: 600, color: 'var(--ink)' }}>Итого — фаундерских часов</span>
              <span className="rr-body" style={{ fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>≈13–32 ч/мес</span>
            </div>
          </div>
          <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 16, textAlign: 'center' }}>
            Оценка по типовой картине, не диагноз вашего процесса — точную картину покажет{' '}
            <a href="#lead" style={linkStyle}>разбор</a>.
          </p>
          <p className="rr-body" style={{ color: 'var(--ink)', marginTop: 20, textAlign: 'center', maxWidth: 620, marginInline: 'auto' }}>
            На подписке за вами остаются два процесса: живое общение с партнёрами по нашим
            сценариям и подтверждение реестра выплат.
          </p>
        </div>
      </section>

      {/* ── B4. Что входит в подписку ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Что входит"
          title="Десять рабочих блоков — и партнёр №1."
          sub="Подписка закрывает канал целиком: от упаковки программы до реестров выплат."
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
          {/* выделенная карточка «Мы — ваш партнёр №1» */}
          <div className="card" style={{ gridColumn: '1 / -1', padding: 28, border: '1px solid var(--accent-line)', background: 'var(--accent-bg)' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 12, background: '#fff', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)', flexShrink: 0 }}>
                <Icon name="badge-check" size={23} />
              </span>
              <div style={{ flex: '1 1 320px' }}>
                <h3 className="rr-h3">Мы — ваш партнёр №1.</h3>
                <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 8 }}>
                  На время подписки сами продаём ваш продукт за партнёрскую комиссию по сетке вашей
                  программы. Гарантия обеспечена не обещаниями, а нашими руками: ни одно агентство
                  под этим не подписывается — мы да, потому что продажа чужих продуктов за комиссию —
                  наш действующий бизнес.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── B5. План на квартал ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="План"
          title="Квартал — от фундамента до воронки."
          sub="Числовые контрольные точки фиксируем в плане квартала после разбора — под вашу экономику."
        />
        <Steps
          columns={3}
          steps={[
            {
              icon: 'settings',
              title: 'Месяц 1. Фундамент.',
              body: 'База партнёров на платформе, оффер и экономика программы, витрина, юридический комплект, материалы.',
            },
            {
              icon: 'rocket',
              title: 'Месяц 2. Дистрибуция и рекрутинг.',
              body: 'Каталоги, сетки, прямой сорсинг. Первые диалоги и вводы партнёров. Первые сделки — от нас как партнёра №1.',
            },
            {
              icon: 'trending-up',
              title: 'Месяц 3. Раскрутка воронки.',
              body: 'Больше кандидатов и введённых партнёров, разбор связок, усиление того, что приводит сделки.',
            },
          ]}
        />
      </section>

      {/* ── B6. Зоны ответственности ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Зоны ответственности"
          title="Мы строим систему. Голос программы — ваш."
        />
        <div className="ds-grid-2" style={{ maxWidth: 980, marginInline: 'auto' }}>
          <div className="card-flat" style={{ padding: 26 }}>
            <h3 className="rr-h3">Наша зона.</h3>
            <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Карта кандидатов и размещение программы',
                'Касания и понятность программы для партнёров',
                'Self-serve онбординг партнёров',
                'Учёт, атрибуция и реестры выплат',
                'Собственные продажи как партнёр №1',
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
                <>Куратор канала — до 8 часов в неделю</>,
                <><b style={{ color: 'var(--ink)' }}>Обработка лидов от партнёров — не дольше 24 часов</b> (центральное условие гарантии)</>,
                <>Живое общение с партнёрами — по нашим сценариям</>,
                <>Демо и закрытие продаж</>,
                <>Продукт и его исполнение</>,
                <>Ежемесячный отчёт по сделкам</>,
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
          title="100% окупаемости — или работаем без новых счетов, пока канал не окупится."
        />
        <div className="ds-grid-2" style={{ maxWidth: 980, marginInline: 'auto' }}>
          <div className="card" style={{ padding: 26 }}>
            <h3 className="rr-h3">Обязательство.</h3>
            <p className="rr-small" style={{ marginTop: 10 }}>
              Расчётная чистая маржа со сделок через новых партнёров — включая сделки от нас как
              партнёра №1 — за гарантийное окно покрывает всё, что вы заплатили. Недобор — новые
              счета не выставляются: ведём канал, пока планка не закрыта. Потолка длительности нет.
            </p>
            <p className="rr-small" style={{ marginTop: 10 }}>
              Формула маржи, планка в сделках и срок окна фиксируются на разборе по вашей
              юнит-экономике. Окно — не меньше двух циклов вашей сделки плюс месяц, обычно квартал;
              если оно длиннее трёх месяцев, подписка продолжается на тех же условиях до конца окна.
            </p>
          </div>
          <div className="card" style={{ padding: 26 }}>
            <h3 className="rr-h3">Что делает гарантию честной.</h3>
            <p className="rr-small" style={{ marginTop: 10 }}>
              Гарантия двусторонняя. С вашей стороны: назначенный куратор, обработка лидов не дольше
              24 часов, список действующих партнёров на старте, ежемесячный отчёт по сделкам;
              условия программы меняются только по согласованию за 14 дней.
            </p>
            <p className="rr-small" style={{ marginTop: 10 }}>
              Нарушение не сжигает гарантию: она ставится на паузу или конвертируется в гарантию по
              лидам — и восстанавливается после исправления. Стартует гарантия после контрольного
              лида: сначала проверим, что процесс продаж готов его принять.
            </p>
          </div>
          <div className="card-flat" style={{ gridColumn: '1 / -1', padding: '20px 26px', background: 'var(--bg-sunken)' }}>
            <p className="rr-caption" style={{ margin: 0 }}>Пример, не обещание</p>
            <p className="rr-small" style={{ marginTop: 8, color: 'var(--ink-2)' }}>
              При чеке 200 000 ₽ и марже 40% планку 750 000 ₽ закрывают 9–10 сделок за окно. При
              рекуррентном чеке планка достигается меньшим числом клиентов. Где канал сходится за
              квартал, а где нужно окно длиннее — покажет разбор.
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
            Гарантию выдаём по итогам разбора. Не сошлось по критериям — честно предложим{' '}
            <a href="/packaging" style={linkStyle}>упаковку программы</a> без гарантии окупаемости
            или <a href="/pricing" style={linkStyle}>платформу по обычному тарифу</a>; результаты
            AI-аудита в любом случае остаются у вас. Компании с выручкой от 100 млн ₽ в год —
            отдельный разговор про условия на объём.
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
            <h3 className="rr-h3" style={{ marginTop: 16 }}>После квартала — три пути.</h3>
            <p className="rr-small" style={{ marginTop: 8 }}>
              Масштабируете сами, продолжаете по тому же прайсу с новыми квартальными KPI — или
              переходите на «Сервис»:{' '}
              <a href="/pricing" style={linkStyle}>платформа по открытому тарифу</a>, канал уже ваш.
            </p>
          </div>
        </div>
      </section>

      {/* ── B9. Тарифы ── */}
      <section id="pricing" className="ds-band ds-container" style={{ paddingTop: 0, scrollMarginTop: 90 }}>
        <SectionHead
          center
          eyebrow="Цена"
          title="Одна цена, открыто."
          sub="Помесячно вперёд. Платформа и работа партнёра №1 включены."
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
                'Все десять блоков подписки + мы как партнёр №1',
                'Платформа RevRoute включена',
                'Гарантия 100% окупаемости — выдаётся на разборе, активируется после контрольного лида',
                'Комиссия партнёра №1 — по сетке вашей программы',
                'Гарантийное окно длиннее трёх месяцев — подписка продолжается на тех же условиях',
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
              Профильные консультанты — выстроят стратегию, но без рук, платформы и гарантии
              окупаемости.
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
          sub="AI-аудит по 40+ параметрам, 30 минут с основателем и оценка потенциала канала в рублях. Увидим, что канал вам пока не нужен, — честно скажем и предложим, с чего начать."
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

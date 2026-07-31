import type { Metadata } from 'next'
import { Hero } from '@/components/ds/Hero'
import { Steps } from '@/components/ds/Steps'
import { FeatureTabs } from '@/components/ds/FeatureTabs'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Button, Chip } from '@/components/ds/primitives'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, softwareApp } from '@/lib/seo/schemas'

const APP_REGISTER = 'https://app.revroute.ru/register'
const SHORTENER = '/tools/link-shortener'

/**
 * Лимиты и цены — строго из Документа №2 «Тарифы» (content/ru/legal/tariffs.mdx,
 * п. 3.3.2, линейка RevRoute Links). При изменении тарифов править синхронно.
 */

export const metadata: Metadata = {
  title: 'Короткие ссылки для бизнеса — свой домен, UTM, QR и аналитика',
  description:
    'Сервис коротких ссылок для команд: брендированный домен, UTM-шаблоны, QR-коды, A/B-тесты и аналитика от клика до оплаты. Бесплатно: 1 000 ссылок и 50 000 кликов в месяц.',
  alternates: { canonical: '/links' },
}

/** FAQ: plain-текст уходит в FAQPage JSON-LD, rich — в видимый аккордеон (текст совпадает). */
const FAQ: { q: string; a: string; rich?: React.ReactNode }[] = [
  {
    q: 'Сколько стоят короткие ссылки?',
    a: 'Free — 0 ₽: 1 000 ссылок, 50 000 кликов в месяц, 1 свой домен; статистика хранится 30 дней. Pro — от 248 ₽ в месяц при годовой оплате (299 ₽ при помесячной). Полные условия — на странице тарифов.',
    rich: (
      <>
        Free — 0 ₽: 1 000 ссылок, 50 000 кликов в месяц, 1 свой домен; статистика хранится 30 дней.
        Pro — от 248 ₽ в месяц при годовой оплате (299 ₽ при помесячной). Полные условия —{' '}
        <a href="/pricing" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>на странице тарифов</a>.
      </>
    ),
  },
  {
    q: 'Можно ли подключить свой домен бесплатно?',
    a: 'Да. На Free доступен 1 свой домен, SSL-сертификат выпускается автоматически. На Pro — 10 доменов.',
  },
  {
    q: 'Чем это отличается от бесплатного сокращателя?',
    a: 'Сокращатель работает без регистрации, но не даёт статистики и редактирования. В аккаунте появляются свой домен, аналитика кликов и продаж, папки и теги, а на Pro — командный доступ.',
    rich: (
      <>
        <a href={SHORTENER} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>Сокращатель</a>{' '}
        работает без регистрации, но не даёт статистики и редактирования. В аккаунте появляются свой
        домен, аналитика кликов и продаж, папки и теги, а на Pro — командный доступ.
      </>
    ),
  },
  {
    q: 'Изменится ли QR-код при смене целевого URL?',
    a: 'Нет. URL под кодом динамический: назначение меняется в кабинете, а напечатанный QR-код продолжает работать — макеты перепечатывать не нужно.',
  },
  {
    q: 'Работает ли статистика с включёнными блокировщиками рекламы?',
    a: 'Да. Клик фиксируется на стороне сервера до редиректа, поэтому блокировщики рекламы не влияют на подсчёт. Лид и продажа связываются с кликом через first-party cookie.',
  },
  {
    q: 'Что будет, если исчерпать лимит кликов на Free?',
    a: 'Ссылки и напечатанные QR-коды продолжат работать, клики продолжат учитываться. Ограничится только просмотр аналитики — до перехода на тариф выше. Редиректы не отключаются.',
  },
  {
    q: 'Как переехать с Bitly или другого сокращателя?',
    a: 'Через CSV-импорт: выгружаете ссылки из старого сервиса и загружаете в RevRoute. В справке есть пошаговые гайды по переезду с Bitly, Rebrandly и Short.io.',
  },
  {
    q: 'Есть ли API?',
    a: 'Да: REST API, SDK для TypeScript, Python, Go, PHP и Ruby, вебхуки и bulk-операции до 100 ссылок за запрос. Analytics API доступен на планах Pro и выше.',
  },
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

export default function LinksPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Короткие ссылки' },
          ]),
          softwareApp({
            name: 'RevRoute Links',
            url: '/links',
            description:
              'Короткие ссылки для бизнеса: брендированный домен, UTM-шаблоны, QR-коды, A/B-тесты, диплинки и аналитика от клика до оплаты.',
            applicationSubCategory: 'Link Management',
            featureList: [
              'Брендированный домен со своим SSL',
              'UTM-шаблоны для команды',
              'QR-коды с динамическим URL',
              'A/B-тесты ссылок',
              'Гео- и девайс-таргетинг',
              'Диплинки iOS и Android',
              'Аналитика кликов, лидов и продаж',
              'REST API, SDK и вебхуки',
            ],
            offers: [
              { name: 'Free', price: '0', description: '1 000 ссылок, 50 000 кликов/мес, 1 кастомный домен' },
              { name: 'Pro', price: '299', description: '50 000 ссылок, 1 млн кликов/мес, 10 доменов' },
            ],
          }),
          faqPage(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />

      {/* ── 1. Hero — сплит со скриншотом конструктора ── */}
      <Hero
        eyebrow="Продукт · Короткие ссылки"
        title="Короткие ссылки для бизнеса"
        body={
          <>
            Брендированный домен, UTM-шаблоны, QR и&nbsp;аналитика конверсий — видно не&nbsp;только клики,
            но&nbsp;и&nbsp;оплаты. Тот&nbsp;же трекинг, которым RevRoute считает выплаты партнёрам.
          </>
        }
        trust={['Свой домен — даже на Free', 'Аналитика от клика до оплаты', 'Бесплатно: 1 000 ссылок, 50 000 кликов/мес']}
        primary={{ label: 'Начать бесплатно', href: APP_REGISTER, ymGoal: 'landing_signup_click' }}
        secondary={{ label: 'Сократить ссылку без регистрации', href: SHORTENER }}
        shot="/images/screenshots/create-links.png"
        shotAlt="Конструктор коротких ссылок RevRoute"
        shotUrl="app.revroute.ru/links/new"
      />

      {/* ── 2. Боль ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Знакомо?"
          title="Ссылки разбросаны. Данные — тоже."
          sub="Сократить ссылку умеют все. Понять, какая из них принесла деньги, — почти никто."
        />
        <div className="ds-grid-4">
          {[
            { icon: 'bar-chart-3', t: 'Клики есть. Продаж не видно.', b: 'Сокращатель считает переходы, CRM показывает другие цифры. Какой канал принёс деньги — неизвестно.' },
            { icon: 'sliders', t: 'UTM у каждого свои.', b: 'utm_source=tg, telegram и Telegram — три разные строки в отчёте. Аналитик сводит их руками.' },
            { icon: 'globe', t: 'В ссылке — чужой бренд.', b: 'Bitly дорожает в валюте, бесплатные сокращатели не дают подключить свой домен — и доверие к переходу падает.' },
            { icon: 'qr-code', t: 'QR напечатан — URL не поменять.', b: 'Тираж флаеров и упаковки привязан к ссылке, которую уже нельзя отредактировать.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Честный квалификатор — когда хватит бесплатного сокращателя ── */}
      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <div className="card" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-line)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Icon name="info" size={20} color="var(--accent-strong)" style={{ marginTop: 2 }} />
            <div style={{ flex: '1 1 320px' }}>
              <p className="rr-small" style={{ margin: 0, color: 'var(--ink)' }}>
                Честно: если нужна одна короткая ссылка без статистики — хватит{' '}
                <a href={SHORTENER} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>бесплатного сокращателя</a>{' '}
                без регистрации. Эта страница — про случай, когда нужны свой домен, статистика,
                редактирование и команда.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                <Chip>Сокращатель: без регистрации</Chip>
                <Chip>До 10 ссылок в час</Chip>
                <Chip>UTM сохраняются</Chip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Как это работает ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead center eyebrow="Как это работает" title="От длинного URL до отчёта о продажах." />
        <Steps
          columns={4}
          steps={[
            { icon: 'globe', title: 'Подключите домен.', body: 'Свой go.brand.ru с автоматическим SSL — или начните на домене RevRoute.' },
            { icon: 'link', title: 'Создайте ссылку.', body: 'Слаг, UTM-шаблон команды, превью, пароль и срок действия — в одном конструкторе.' },
            { icon: 'send', title: 'Поделитесь ссылкой.', body: 'Пост, рассылка или QR на макете. Гео- и девайс-таргетинг доведёт клиента до нужной страницы.' },
            { icon: 'bar-chart-3', title: 'Смотрите результат.', body: 'Клики, лиды и продажи по каждой ссылке — в реальном времени.' },
          ]}
        />
      </section>

      {/* ── 5. Возможности — табы на реальных скриншотах ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Возможности"
          title="Всё управление ссылками — в одном месте."
          sub="Конструктор, порядок, аналитика и конверсии — без таблиц и пяти подписок."
        />
        <FeatureTabs
          features={[
            { icon: 'link', title: 'Конструктор ссылок', body: 'Домен, слаг, кастомное превью, UTM-конструктор, защита паролем и срок действия. Ссылка собирается за минуту — по стандартам команды.', shot: '/images/screenshots/create-links.png', url: 'app.revroute.ru/links/new' },
            { icon: 'layers', title: 'Порядок в сотнях ссылок', body: 'Папки с правами доступа, теги и фильтры по домену, кампании и UTM. Комментарии к ссылкам — контекст остаётся в команде.', shot: '/images/screenshots/list-links.png', url: 'app.revroute.ru/links' },
            { icon: 'bar-chart-3', title: 'Аналитика в реальном времени', body: 'Срезы по странам и городам, устройствам, браузерам, реферерам и UTM. Отдельно клики и сканы QR. Поток событий и экспорт.', shot: '/images/screenshots/ru/analytics.png', url: 'app.revroute.ru/analytics' },
            { icon: 'trending-up', title: 'Конверсии и деньги', body: 'Лид и продажа привязываются к ссылке: окно атрибуции 90 дней, first-party cookie, суммы в рублях.', shot: '/images/screenshots/analytics-conversions.png', url: 'app.revroute.ru/events' },
          ]}
        />
      </section>

      {/* ── 6. Больше, чем сокращатель — грид фич ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Больше, чем сокращатель"
          title="Инструменты на вырост."
          sub="QR, A/B-тесты, диплинки и автоматизация пригодятся, когда простых ссылок станет мало."
        />
        <div className="ds-grid-4">
          {[
            { icon: 'qr-code', t: 'QR с динамическим URL.', b: <>Назначение меняется в любой момент — код на макетах остаётся прежним. Попробуйте <a href="/tools/qr" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>QR-генератор</a>.</> },
            { icon: 'split', t: 'A/B-тесты.', b: 'Несколько целевых URL с весами трафика; пользователь стабильно видит свой вариант — ротация не ломает атрибуцию.' },
            { icon: 'smartphone', t: 'Диплинки.', b: 'iOS и Android: отложенный диплинк доводит до нужного экрана даже после установки приложения, web fallback — если приложения нет.' },
            { icon: 'sliders', t: 'UTM-шаблоны.', b: <>Стандарт команды в один клик — чистые данные без ручной нормализации. Есть и открытый <a href="/tools/utm" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>UTM-конструктор</a>.</> },
            { icon: 'map-pin', t: 'Гео- и девайс-таргетинг.', b: 'Одна ссылка — разные назначения по стране, городу и устройству. Без правок в рекламных кабинетах.' },
            { icon: 'lock', t: 'Пароль и срок действия.', b: 'Поставьте пароль или ограничьте время жизни ссылки — для закрытых материалов и акций.' },
            { icon: 'repeat', t: 'Импорт и миграция.', b: 'CSV-импорт и пошаговые гайды по переезду с Bitly, Rebrandly и Short.io — в справке.' },
            { icon: 'database', t: 'Массовые операции.', b: 'Сотни ссылок одним запросом по API — с защитой от дублей и без ручной рутины.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Дифференциатор — почему не Bitly/clck.ru ── */}
      <section style={{ background: 'var(--wash)', borderBlock: '1px solid var(--line)' }}>
        <div className="ds-band ds-container">
          <SectionHead
            center
            eyebrow="Почему мы"
            title="Альтернатива Bitly и clck.ru."
            sub="Не «ещё один сокращатель», а инфраструктура ссылок, которая остаётся вашим активом."
          />
          <div className="card-flat" style={{ maxWidth: 760, marginInline: 'auto', background: '#fff' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                <>Хранение и обработка данных — в России, по 152-ФЗ.</>,
                <>Свой домен с автоматическим SSL — уже на бесплатном тарифе.</>,
                <>Server-side трекинг: клик фиксируется до редиректа, блокировщики не мешают.</>,
                <>Переход сразу на целевой URL — без промежуточных страниц с рекламой.</>,
                <>Оплата в рублях, закрывающие документы для юрлиц и ИП.</>,
              ].map((t, i) => (
                <li key={i} className="rr-small" style={{ display: 'flex', gap: 12, color: 'var(--ink)' }}>
                  <span style={{ display: 'inline-flex', flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginTop: 1 }}><Icon name="shield-check" size={15} strokeWidth={2.2} /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 8. Тарифы-тизер ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Тарифы"
          title="Начните бесплатно."
          sub="Цены — за месяц, в рублях; НДС не облагается (УСН). Годовая оплата — скидка 17%."
        />
        <div className="ds-grid-2" style={{ maxWidth: 760, marginInline: 'auto' }}>
          {[
            { name: 'Free', price: '0 ₽', items: ['1 000 ссылок', '50 000 кликов/мес', '1 свой домен', 'Статистика — 30 дней'] },
            { name: 'Pro', price: 'от 248 ₽/мес', items: ['50 000 ссылок', '1 млн кликов/мес', '10 доменов, 3 пользователя', 'Статистика — 1 год'] },
          ].map((p) => (
            <div key={p.name} className="card-flat">
              <p className="rr-caption" style={{ margin: 0 }}>{p.name}</p>
              <div className="rr-mono" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accent-strong)', marginTop: 8 }}>{p.price}</div>
              <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.items.map((it) => (
                  <li key={it} className="rr-small" style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--ink-2)' }}>
                    <Icon name="check" size={15} color="var(--accent)" strokeWidth={2.2} /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <Button variant="ghost" size="lg" href="/pricing" iconRight="arrow-right">Все тарифы</Button>
        </div>
      </section>

      {/* ── 9. API ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Автоматизация"
          title="API, SDK и вебхуки."
          sub="Встройте ссылки в свой продукт — от одного скрипта до мультитенантного SaaS."
        />
        <div className="ds-grid-3">
          {[
            { icon: 'code-2', t: 'REST API и SDK.', b: 'Клиенты для TypeScript, Python, Go, PHP и Ruby. До 3 000 запросов в минуту.' },
            { icon: 'webhook', t: 'Вебхуки.', b: 'События о новых ссылках, кликах, лидах и продажах — прямо в ваши системы.' },
            { icon: 'database', t: 'Масштаб.', b: 'Bulk-операции до 100 ссылок за запрос, upsert, externalId и tenantId для мультитенантных продуктов.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
        <p className="rr-caption" style={{ marginTop: 20, textAlign: 'center' }}>Analytics API доступен на планах Pro и выше.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <Button variant="ghost" size="lg" href="/api" iconRight="arrow-right">Документация API</Button>
        </div>
      </section>

      {/* ── 10. Мост в экосистему PRM ── */}
      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <div className="card" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-line)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <Icon name="users" size={20} color="var(--accent-strong)" />
            <p className="rr-small" style={{ margin: 0, color: 'var(--ink)', flex: '1 1 320px' }}>
              Ссылки — вход в платформу. Когда решите запустить партнёрскую программу, та же атрибуция
              будет считать комиссии и выплаты партнёрам.
            </p>
            <Button variant="ghost" size="sm" href="/prm" iconRight="arrow-right">Платформа PRM</Button>
          </div>
        </div>
      </section>

      {/* ── 11. FAQ + финальный CTA ── */}
      <section className="ds-band ds-container">
        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead center eyebrow="Вопросы" title="Частые вопросы." />
          <FaqList items={FAQ.map((f) => ({ q: f.q, a: f.rich ?? f.a }))} />
        </div>

        <CtaBottom
          tone="spectrum"
          title="Наведите порядок в ссылках."
          body="Free — это тариф, а не пробный период: свой домен и аналитика от клика до оплаты — бесплатно."
          primary={{ label: 'Начать бесплатно', href: APP_REGISTER }}
          secondary={{ label: 'Сократить без регистрации', href: SHORTENER }}
        />
      </section>
    </>
  )
}

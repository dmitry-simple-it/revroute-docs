import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { QrStudio } from '@/components/ds/QrStudio'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Chip } from '@/components/ds/primitives'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, webApplication } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'
import { HeadlineSwap } from './HeadlineSwap'

const APP_REGISTER = 'https://app.revroute.ru/register'

export const metadata: Metadata = {
  title: 'Генератор QR-кодов онлайн — цвет, логотип, SVG',
  description:
    'Создайте QR-код в браузере: свои цвета, логотип в центре, рамка с подписью. Скачивание в PNG и SVG для печати. Ссылка и логотип никуда не отправляются.',
  alternates: { canonical: '/tools/qr' },
  openGraph: {
    ...og('/tools/qr'),
    title: 'Генератор QR-кодов онлайн — RevRoute',
    description:
      'QR-код за секунду прямо в браузере: цвета, логотип, рамка с подписью, экспорт в PNG и SVG.',
  },
}

/** FAQ: один источник и для аккордеона, и для FAQPage JSON-LD. */
const FAQ: { q: string; a: string; rich?: ReactNode }[] = [
  {
    q: 'Портится ли код от логотипа?',
    a: 'Нет, если не переборщить с размером. При загрузке логотипа генератор автоматически включает уровень коррекции ошибок H — до 30% повреждений восстановимо, а площадь логотипа ограничена примерно десятой частью кода — с запасом на деградацию при печати. Под логотип подставляется белая подложка, чтобы модули не сливались с картинкой.',
  },
  {
    q: 'Сколько живёт код?',
    a: 'Статический код — вечно. Это картинка, в которой зашит сам адрес: ей не нужен наш сервер, подписки и продления. Скачали — и она работает, пока существует страница, на которую ведёт.',
  },
  {
    q: 'Можно ли поменять ссылку внутри кода?',
    a: 'В статическом — нет: адрес зашит в саму картинку. В динамическом — да: такой код ведёт на короткую ссылку RevRoute, а её адрес назначения меняется в аккаунте. Код на напечатанном макете при этом остаётся прежним. Для динамического кода нужен аккаунт.',
  },
  {
    q: 'Что будет, если не продлить подписку?',
    a: 'Статические коды от подписки не зависят вовсе — это картинки. Динамические продолжают вести туда, куда вели: редиректы не отключаются, клики продолжают учитываться. Подробнее — в вопросах и ответах на странице коротких ссылок.',
    rich: (
      <>
        Статические коды от подписки не зависят вовсе — это картинки. Динамические продолжают вести
        туда, куда вели: редиректы не отключаются, клики продолжают учитываться. Подробнее — в{' '}
        <a href="/links" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          вопросах и ответах на странице коротких ссылок
        </a>.
      </>
    ),
  },
]

const USE_CASES: { icon: string; t: string; b: string }[] = [
  { icon: 'file-text', t: 'Визитка', b: 'Контакты, сайт или портфолио — один код вместо длинного адреса мелким шрифтом.' },
  { icon: 'list-checks', t: 'Меню', b: 'Код на столике ведёт на меню. С динамическим кодом обновите блюда без перепечатки.' },
  { icon: 'send', t: 'Листовка и флаер', b: 'С печатной раздачи — сразу на акцию или форму записи, без ручного ввода адреса.' },
  { icon: 'layers', t: 'Упаковка', b: 'Инструкция, состав, регистрация товара — код на коробке экономит место на этикетке.' },
  { icon: 'trending-up', t: 'Презентация', b: 'Код на финальном слайде — зал сканирует и уходит на ваш сайт, а не записывает адрес.' },
  { icon: 'map-pin', t: 'Наружная реклама', b: 'Баннер или постер: крупный контрастный код считывается с расстояния в несколько метров.' },
]

const PRINT_TIPS: { icon: string; t: string; b: string }[] = [
  { icon: 'file-check', t: 'Вектор SVG', b: 'Для типографии отдавайте SVG: вектор не мылится при любом масштабе — от визитки до баннера.' },
  { icon: 'smartphone', t: 'Размер от 2×2 см', b: 'Минимум для сканирования с ~20 см. Правило: дистанция сканирования ≈ 10 размеров кода.' },
  { icon: 'eye', t: 'Контраст', b: 'Тёмный код на светлом фоне. Инверсия и близкие цвета ломают часть сканеров — генератор предупредит.' },
  { icon: 'target', t: 'Квиет-зона', b: 'Свободное поле вокруг кода — 4 модуля. Оно уже входит в файл: не обрезайте его при вёрстке.' },
  { icon: 'check', t: 'Тест перед тиражом', b: 'Распечатайте макет на обычном принтере и просканируйте несколькими телефонами до отправки в типографию.' },
]

const td: CSSProperties = { padding: '14px 18px', borderTop: '1px solid var(--line)', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-2)', verticalAlign: 'top' }
const th: CSSProperties = { padding: '14px 18px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 40 }}>
      <Eyebrow style={{ justifyContent: 'center' }}>{eyebrow}</Eyebrow>
      <h2 className="rr-h2" style={{ marginTop: 14 }}>{title}</h2>
      {sub && <p className="rr-lead" style={{ marginTop: 14, marginInline: 'auto', maxWidth: 640 }}>{sub}</p>}
    </div>
  )
}

export default function QrPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Бесплатные инструменты', url: '/tools' },
            { name: 'Генератор QR-кодов' },
          ]),
          webApplication({
            name: 'Генератор QR-кодов RevRoute',
            url: '/tools/qr',
            description:
              'Бесплатный онлайн-генератор QR-кодов: свои цвета, логотип в центре, рамка с подписью, экспорт в PNG и SVG. Работает прямо в браузере, без регистрации.',
            permissions: 'No registration required',
          }),
          faqPage(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />

      {/* ── 1. Первый экран: страница и есть генератор ── */}
      <section id="generator" className="ds-container" style={{ paddingTop: 72 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Бесплатный инструмент</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 16 }}>
            <HeadlineSwap />
          </h1>
          <p className="rr-lead" style={{ marginTop: 16, marginInline: 'auto', maxWidth: '46ch' }}>
            Создайте код за секунду. Ссылку внутри можно поменять, не&nbsp;перепечатывая макет.
          </p>
        </div>
        <div style={{ maxWidth: 860, marginInline: 'auto', marginTop: 36 }}>
          <QrStudio />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          <Chip>Без регистрации</Chip>
          <Chip>PNG и SVG</Chip>
          <Chip>Логотип не покидает браузер</Chip>
        </div>
      </section>

      {/* ── 2. Статический и динамический ── */}
      <section className="ds-band ds-container">
        <SectionHead
          eyebrow="Два вида кодов"
          title="Статический и динамический."
          sub="Статический — картинка навсегда. Динамический — код на короткой ссылке: адрес меняется, статистика видна."
        />
        <div style={{ maxWidth: 900, marginInline: 'auto', overflowX: 'auto', borderRadius: 14, border: '1px solid var(--line)', background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
            <thead>
              <tr>
                <th style={{ ...th, width: '24%' }} scope="col" aria-label="Параметр" />
                <th style={th} scope="col">Статический код</th>
                <th style={th} scope="col">Динамический код</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ ...td, fontWeight: 600, color: 'var(--ink)' }} scope="row">Цена</th>
                <td style={td}>Бесплатно — прямо на этой странице.</td>
                <td style={td}>Нужен аккаунт RevRoute; создать код можно на бесплатном тарифе.</td>
              </tr>
              <tr>
                <th style={{ ...td, fontWeight: 600, color: 'var(--ink)' }} scope="row">Срок работы</th>
                <td style={td}>Вечно: это картинка, ей не нужен наш сервер. Нечего продлевать.</td>
                <td style={td}>Пока живёт короткая ссылка — редиректы не отключаются даже без подписки.</td>
              </tr>
              <tr>
                <th style={{ ...td, fontWeight: 600, color: 'var(--ink)' }} scope="row">Адрес после печати</th>
                <td style={td}>Поменять нельзя: адрес зашит в саму картинку.</td>
                <td style={td}>Меняется в аккаунте: код ведёт на короткую ссылку, а её назначение можно переназначить.</td>
              </tr>
              <tr>
                <th style={{ ...td, fontWeight: 600, color: 'var(--ink)' }} scope="row">Статистика</th>
                <td style={td}>Нет.</td>
                <td style={td}>Переходы, устройства, города и время — в аналитике короткой ссылки.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="rr-small" style={{ maxWidth: 900, marginInline: 'auto', marginTop: 16, color: 'var(--ink-3)', textAlign: 'center' }}>
          В большинстве сервисов динамический код — платная функция верхних тарифов. В RevRoute он
          доступен уже на бесплатном тарифе: 1&nbsp;000 ссылок и 50&nbsp;000 переходов в месяц.
        </p>
      </section>

      {/* ── 3. Где применяют ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Где применяют"
          title="От визитки до баннера."
          sub="Один и тот же код работает и на экране, и на бумаге — меняется только размер."
        />
        <div className="ds-grid-3">
          {USE_CASES.map((c) => (
            <div key={c.t} className="card-flat" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
                <Icon name={c.icon} size={19} />
              </span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8, flexGrow: 1 }}>{c.b}</p>
              <a
                href="#generator"
                className="rr-small"
                style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent-strong)', fontWeight: 500, textDecoration: 'none' }}
              >
                Создать код
                <Icon name="arrow-right" size={15} strokeWidth={2} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Печать ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Печать"
          title="Чтобы код сканировался с бумаги."
          sub="Пять правил, которые спасают тираж."
        />
        <div className="ds-grid-3">
          {PRINT_TIPS.map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <Icon name={c.icon} size={19} />
              </span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Аналитика динамического кода ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Аналитика"
          title="Что видно по динамическому коду."
          sub="Динамический код ведёт на короткую ссылку RevRoute, поэтому вся статистика — это аналитика переходов по этой ссылке."
        />
        <div className="ds-grid-4">
          {[
            { icon: 'mouse-pointer-click', t: 'Переходы', b: 'Сколько раз перешли по коду — по дням и суммарно.' },
            { icon: 'smartphone', t: 'Устройства', b: 'Телефон или компьютер, операционная система, браузер.' },
            { icon: 'map-pin', t: 'География', b: 'Страны и города, из которых сканировали код.' },
            { icon: 'clock', t: 'Время', b: 'Часы и дни активности — когда тираж «выстреливает».' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
                <Icon name={c.icon} size={19} />
              </span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. FAQ + финальный CTA ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead eyebrow="Вопросы" title="Частые вопросы." />
          <FaqList items={FAQ.map((f) => ({ q: f.q, a: f.rich ?? f.a }))} />
        </div>

        <CtaBottom
          tone="spectrum"
          title="Код, который не устаревает."
          body="Динамический QR на короткой ссылке: адрес меняется без перепечатки, статистика переходов — в аналитике. Бесплатный тариф: 1 000 ссылок и 50 000 переходов в месяц."
          primary={{ label: 'Начать бесплатно', href: APP_REGISTER }}
          secondary={{ label: 'Короткие ссылки для бизнеса', href: '/links' }}
        />
      </section>
    </>
  )
}

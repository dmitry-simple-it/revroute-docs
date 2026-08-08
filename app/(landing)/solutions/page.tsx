import type { Metadata } from 'next'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Chip, Button } from '@/components/ds/primitives'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, itemList } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

const APP_REGISTER = 'https://app.revroute.ru/register'

/**
 * ВНИМАНИЕ: `title` здесь обязан быть СТРОКОЙ.
 * Nextra строит page map по всем статическим `app/**​/page.tsx` и кладёт
 * `metadata.title` в page map как есть, а тема рендерит это React-ребёнком.
 * Объект (`{ absolute }`, `{ default, template }`) роняет весь раздел
 * документации: «Objects are not valid as a React child». Страж — на prebuild:
 * `node scripts/check-app-metadata.mjs`.
 */
export const metadata: Metadata = {
  title: 'Решения: SaaS, e-commerce, партнёрки, авторы',
  description:
    'Под какие сценарии подходит RevRoute: партнёрский канал для B2B SaaS, атрибуция и партнёрки для e-commerce, запуск программы, монетизация трафика у авторов.',
  alternates: { canonical: '/solutions' },
  openGraph: og('/solutions'),
}

/**
 * Единственный источник карточек и ItemList: имя в разметке дословно совпадает
 * с видимым заголовком карточки и с крошкой на самой странице решения.
 * Описания собраны по содержимому этих страниц, без обещаний сверху.
 */
const SOLUTIONS = [
  {
    name: 'Для SaaS',
    href: '/solutions/saas',
    icon: 'code-2',
    description:
      'Серверная атрибуция реферального трафика по пути клик → лид → оплата с окном до 180 дней, реферальная программа внутри продукта через виджет и API, расчёты с партнёрами под ключ.',
    tags: ['Атрибуция до оплаты', 'amoCRM и Bitrix24', 'Partners API'],
  },
  {
    name: 'Для e-commerce',
    href: '/solutions/ecommerce',
    icon: 'credit-card',
    description:
      'UTM-шаблоны и массовый импорт целевых страниц под сезонные кампании, брендированные и динамические QR, гео- и устройство-таргетинг одной короткой ссылки, разные ставки по категориям товаров.',
    tags: ['UTM в масштабе', 'Динамические QR', 'CPA по товару'],
  },
  {
    name: 'Партнёрский маркетинг',
    href: '/solutions/affiliate-marketing',
    icon: 'users',
    description:
      'Запуск программы с нуля: CPA, CPC и rev-share в одной программе, тиры и бонусы под ваши KPI, массовые выплаты с закрывающими документами, антифрод и маркетплейс партнёров.',
    tags: ['Гибкие комиссии', 'Выплаты и документы', 'Антифрод'],
  },
  {
    name: 'Для авторов и блогеров',
    href: '/solutions/content-creators',
    icon: 'send',
    description:
      'Короткие ссылки на своём домене и QR для оффлайна, аналитика по источникам, гео и устройствам, подключение к нескольким партнёрским программам в одном кабинете партнёра.',
    tags: ['Свой домен', 'Источники трафика', 'Кабинет партнёра'],
  },
]

export default function SolutionsHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Решения' },
          ]),
          itemList({
            name: 'Решения RevRoute по сценариям',
            ordered: false,
            items: SOLUTIONS.map((s) => ({
              name: s.name,
              url: s.href,
              description: s.description,
            })),
          }),
        ]}
      />

      {/* ── 1. Заголовок раздела ── */}
      <section className="ds-container" style={{ paddingTop: 72, paddingBottom: 8 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Решения</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 16 }}>Под какие сценарии подходит платформа</h1>
          <p className="rr-lead" style={{ marginTop: 18, marginInline: 'auto', maxWidth: '54ch' }}>
            Платформа одна, а задачи разные: у&nbsp;SaaS это атрибуция реферальной выручки,
            у&nbsp;магазина — разметка кампаний и&nbsp;ставки по&nbsp;категориям, у&nbsp;автора —
            монетизация трафика. Ниже — четыре сценария и&nbsp;что в&nbsp;каждом делает RevRoute.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <Chip>Атрибуция до оплаты</Chip>
          <Chip>Расчёты с партнёрами</Chip>
          <Chip>Данные в РФ</Chip>
        </div>
      </section>

      {/* ── 2. Карточки решений ── */}
      <section className="ds-band ds-container">
        <div className="ds-grid-2">
          {SOLUTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="card-flat"
              style={{ display: 'flex', flexDirection: 'column', gap: 12, textDecoration: 'none', color: 'inherit' }}
            >
              <span
                style={{
                  display: 'inline-flex', width: 40, height: 40, borderRadius: 12,
                  background: 'var(--accent-bg)', border: '1px solid var(--accent-line)',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)',
                }}
              >
                <Icon name={s.icon} size={20} />
              </span>
              {/*
                Уровень h2, а не h3: карточки — единственное содержимое своей секции,
                над ними нет заголовка-секции, поэтому h3 давал скачок h1 → h3.
                На остальных страницах DS v2 порядок всегда h1 → h2 → h3. Размер
                держим классом rr-h3 (тот же приём — /pricing, «Что вы платите»).
              */}
              <h2 className="rr-h3" style={{ marginTop: 4 }}>{s.name}</h2>
              <p className="rr-small" style={{ color: 'var(--ink-3)', margin: 0 }}>{s.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {s.tags.map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
              <span
                className="rr-small"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 14, color: 'var(--accent-strong)', fontWeight: 500 }}
              >
                Смотреть решение
                <Icon name="arrow-right" size={16} color="var(--accent-strong)" strokeWidth={2} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── 3. Что общего у всех сценариев ── */}
      <section className="ds-container" style={{ paddingBottom: 40 }}>
        <div className="card" style={{ maxWidth: 920, marginInline: 'auto', display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex', width: 44, height: 44, borderRadius: 12,
              background: 'var(--bg-sunken)', border: '1px solid var(--line)',
              alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', flexShrink: 0,
            }}
          >
            <Icon name="layers" size={22} />
          </span>
          <div style={{ flex: '1 1 320px' }}>
            <h2 className="rr-h3">Что общего у всех сценариев</h2>
            <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 10 }}>
              Под каждым сценарием — одна и та же основа: короткие ссылки с трекингом, атрибуция
              до оплаты, кабинеты вендора и партнёра, вознаграждения и выплаты с закрывающими
              документами. Меняется не платформа, а настройка условий под ваш продукт.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
              <Button variant="ghost" size="sm" href="/prm" iconRight="arrow-right">Платформа PRM</Button>
              <Button variant="ghost" size="sm" href="/pricing" iconRight="arrow-right">Тарифы</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Финальный CTA ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <CtaBottom
          tone="spectrum"
          title="Не нашли свой сценарий?"
          body="Разберём вашу задачу и покажем, как она собирается на платформе: условия для партнёров, атрибуция и расчёты."
          primary={{ label: 'Создать программу', href: APP_REGISTER }}
          secondary={{ label: 'Тарифы', href: '/pricing' }}
        />
      </section>
    </>
  )
}

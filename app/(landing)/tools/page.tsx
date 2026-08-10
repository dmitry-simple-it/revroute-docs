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
  title: 'Бесплатные инструменты: ссылки, UTM и QR',
  description:
    'Четыре бесплатных инструмента без регистрации: сокращатель ссылок, конструктор UTM-меток, генератор QR-кодов и разбор чужой короткой ссылки перед переходом.',
  alternates: { canonical: '/tools' },
  openGraph: og('/tools'),
}

/**
 * Единственный источник карточек и ItemList: имя в разметке физически не может
 * разойтись с видимым заголовком карточки. Описания сверены с содержимым самих
 * страниц — включая то, чего инструменты НЕ умеют (см. `limits`).
 */
const TOOLS = [
  {
    name: 'Сократить ссылку',
    href: '/tools/link-shortener',
    icon: 'link',
    description:
      'Вставьте длинный URL — получите короткую ссылку за секунду. Все query-параметры исходного адреса, включая utm_*, сохраняются и доезжают до целевой страницы.',
    limits: ['До 10 ссылок в час', 'Без статистики'],
  },
  {
    name: 'UTM-конструктор',
    href: '/tools/utm',
    icon: 'sliders',
    description:
      'Соберите ссылку с utm_source, utm_medium, utm_campaign, utm_term и utm_content и скопируйте её в буфер. Рядом — рекомендованные source и medium для 15 каналов.',
    limits: ['Разбор пяти типовых ошибок', 'Корректный разделитель ? и &'],
  },
  {
    name: 'QR-генератор',
    href: '/qr',
    icon: 'qr-code',
    description:
      'QR-код под любую ссылку: задаёте размер и цвета, скачиваете PNG или SVG. Код статический — целевой URL зашит внутрь картинки и после печати не меняется.',
    limits: ['PNG и SVG', 'Без статистики сканов'],
  },
  {
    name: 'Инспектор ссылок',
    href: '/tools/link-inspector',
    icon: 'eye',
    description:
      'Разбирает ссылку по частям прямо в браузере: протокол, хост, путь, TLD, список параметров и счётчик UTM-меток. Punycode в домене подсвечивается как риск фишинга.',
    limits: ['Без внешних запросов', 'Редиректы не прослеживает'],
  },
]

export default function ToolsHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Инструменты' },
          ]),
          itemList({
            name: 'Бесплатные инструменты RevRoute',
            ordered: false,
            items: TOOLS.map((t) => ({
              name: t.name,
              url: t.href,
              description: t.description,
            })),
          }),
        ]}
      />

      {/* ── 1. Заголовок раздела ── */}
      <section className="ds-container" style={{ paddingTop: 72, paddingBottom: 8 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Бесплатные инструменты</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 16 }}>Инструменты для работы со ссылками</h1>
          <p className="rr-lead" style={{ marginTop: 18, marginInline: 'auto', maxWidth: '54ch' }}>
            Четыре инструмента, которые закрывают разовую задачу: сократить ссылку, разметить её
            UTM-метками, сделать QR-код и разобрать чужую ссылку до перехода. Без&nbsp;регистрации
            и&nbsp;без&nbsp;оплаты — открыли, сделали, забрали результат.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <Chip>Без регистрации</Chip>
          <Chip>Работают в браузере</Chip>
          <Chip>Результат сразу</Chip>
        </div>
      </section>

      {/* ── 2. Карточки инструментов ── */}
      <section className="ds-band ds-container">
        <div className="ds-grid-2">
          {TOOLS.map((t) => (
            <a
              key={t.href}
              href={t.href}
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
                <Icon name={t.icon} size={20} />
              </span>
              {/*
                Уровень h2, а не h3: карточки — единственное содержимое своей секции,
                над ними нет заголовка-секции, поэтому h3 давал скачок h1 → h3.
                На остальных страницах DS v2 порядок всегда h1 → h2 → h3. Размер
                держим классом rr-h3 (тот же приём — /pricing, «Что вы платите»).
              */}
              <h2 className="rr-h3" style={{ marginTop: 4 }}>{t.name}</h2>
              <p className="rr-small" style={{ color: 'var(--ink-3)', margin: 0 }}>{t.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {t.limits.map((l) => (
                  <span key={l} className="pill">{l}</span>
                ))}
              </div>
              <span
                className="rr-small"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 14, color: 'var(--accent-strong)', fontWeight: 500 }}
              >
                Открыть инструмент
                <Icon name="arrow-right" size={16} color="var(--accent-strong)" strokeWidth={2} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── 3. Где заканчивается бесплатное ── */}
      <section className="ds-container" style={{ paddingBottom: 40 }}>
        <div className="card" style={{ maxWidth: 920, marginInline: 'auto', display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex', width: 44, height: 44, borderRadius: 12,
              background: 'var(--bg-sunken)', border: '1px solid var(--line)',
              alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', flexShrink: 0,
            }}
          >
            <Icon name="bar-chart-3" size={22} />
          </span>
          <div style={{ flex: '1 1 320px' }}>
            <h2 className="rr-h3">Где заканчивается бесплатное</h2>
            <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 10 }}>
              Инструменты выше не хранят историю и не считают клики: они решают задачу
              один раз и ничего о ней не помнят. Постоянную работу со ссылками — свой домен,
              статистику переходов, редактирование целевого URL и UTM-шаблоны команды — ведут
              в кабинете.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
              <Button variant="ghost" size="sm" href="/links" iconRight="arrow-right">Короткие ссылки для бизнеса</Button>
              <Button variant="ghost" size="sm" href="/prm" iconRight="arrow-right">Платформа PRM</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Финальный CTA ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <CtaBottom
          tone="spectrum"
          title="Ссылки, которые считают деньги."
          body="Свой домен, аналитика от клика до оплаты и партнёрские программы — в RevRoute. Бесплатные инструменты остаются бесплатными."
          primary={{ label: 'Начать бесплатно', href: APP_REGISTER }}
          secondary={{ label: 'Платформа PRM', href: '/prm' }}
        />
      </section>
    </>
  )
}

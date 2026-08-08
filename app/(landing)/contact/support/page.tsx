import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { HeroCentered } from '@/components/ds/HeroCentered'
import { Eyebrow, Icon, Pill } from '@/components/ds/primitives'
import { IconMax, IconTelegram } from '@/components/marketing/shared/Icons'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'
import { CONTACT_EMAILS, CONTACT_MESSENGERS } from '@/lib/contacts'

/**
 * ВНИМАНИЕ: `title` здесь обязан быть СТРОКОЙ.
 * Nextra строит page map по всем статическим `app/**​/page.tsx` и кладёт
 * `metadata.title` в page map как есть, а тема рендерит это React-ребёнком.
 * Объект (`{ absolute }`, `{ default, template }`) роняет весь раздел
 * документации: «Objects are not valid as a React child». Страж — на prebuild:
 * `node scripts/check-app-metadata.mjs`.
 */
export const metadata: Metadata = {
  title: 'Поддержка — свяжитесь с командой',
  description:
    'Поддержка RevRoute: Telegram, MAX и почта support@revroute.ru — вопросы по продукту, биллингу и интеграциям. Обычно отвечаем в течение нескольких часов.',
  alternates: { canonical: '/contact/support' },
  openGraph: og('/contact/support'),
}

/**
 * Конверт: в наборе глифов DS (`components/ds/primitives.tsx` → ICONS) почтовой
 * иконки нет, а расширять набор ради одной страницы избыточно. Геометрия — та же
 * lucide-форма, что стояла на прежней версии страницы, размер и обводка сведены
 * с DS-глифами (`strokeWidth 1.8`).
 */
function MailGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

/** Плашка 40×40 под глиф — та же, что на карточках /tools и /solutions. */
function GlyphTile({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex', width: 40, height: 40, borderRadius: 12,
        background: 'var(--accent-bg)', border: '1px solid var(--accent-line)',
        alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)',
      }}
    >
      {children}
    </span>
  )
}

/** «https://t.me/revroute_bot» → «t.me/revroute_bot»: видимая подпись не может разойтись с href. */
const humanUrl = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/**
 * Каналы связи. Адреса и ссылки — только из `lib/contacts.ts`: страница ничего
 * не хардкодит, поэтому смена контакта в одном файле доезжает и сюда, и в футер,
 * и в JSON-LD организации (`lib/seo/schemas.ts` → contactPoint).
 */
const CHANNELS: {
  key: string
  title: string
  body: string
  handle: string
  href: string
  external?: boolean
  icon: ReactNode
  ymGoal?: string
}[] = [
  {
    key: 'telegram',
    title: 'Telegram',
    body: 'Короткий вопрос, ссылка или скриншот прямо в диалоге — без формы и тикетов.',
    handle: humanUrl(CONTACT_MESSENGERS.telegram),
    href: CONTACT_MESSENGERS.telegram,
    external: true,
    icon: <IconTelegram idSuffix="support" width={40} height={40} />,
  },
  {
    key: 'max',
    title: 'MAX',
    body: 'Тот же диалог с поддержкой в мессенджере MAX — если Telegram вам неудобен.',
    handle: humanUrl(CONTACT_MESSENGERS.max),
    href: CONTACT_MESSENGERS.max,
    external: true,
    icon: <IconMax idSuffix="support" width={40} height={40} />,
  },
  {
    key: 'email',
    title: 'Электронная почта',
    body: 'Для длинных описаний и вложений: выгрузки, счета, документы, запись экрана.',
    handle: CONTACT_EMAILS.support,
    href: `mailto:${CONTACT_EMAILS.support}`,
    icon: <GlyphTile><MailGlyph /></GlyphTile>,
    // Цель осталась прежней (была на кнопке почты на старой версии страницы),
    // чтобы не разрывать историю конверсий в Метрике.
    ymGoal: 'landing_lead_form_submit',
  },
]

/** Что приложить к обращению — чтобы первый ответ был по делу, а не уточняющим вопросом. */
const CHECKLIST: { icon: string; title: string; body: string }[] = [
  {
    icon: 'link',
    title: 'Ссылку, где проявилась проблема',
    body: 'Короткая ссылка, страница кабинета или адрес запроса к API — по ней мы воспроизведём то, что видите вы.',
  },
  {
    icon: 'briefcase',
    title: 'Рабочее пространство и программу',
    body: 'Название рабочего пространства и партнёрской программы, о которой речь: так мы сразу найдём нужный аккаунт.',
  },
  {
    icon: 'clock',
    title: 'Что ожидали и что получилось',
    body: 'С датой и временем — по ним видно, что в этот момент происходило на стороне платформы.',
  },
  {
    icon: 'eye',
    title: 'Скриншот или запись экрана',
    body: 'Кадр с ошибкой объясняет больше абзаца текста. Если браузер показал ошибку в консоли — приложите и её.',
  },
]

/** Адреса не для поддержки — формулировки взяты из `lib/contacts.ts`. */
const OTHER_EMAILS: { title: string; body: string; email: string; icon: string }[] = [
  {
    title: 'Сотрудничество и партнёрства',
    body: 'Интеграции, совместные проекты, предложения о сотрудничестве.',
    email: CONTACT_EMAILS.partners,
    icon: 'users',
  },
  {
    title: 'Вопросы по работе и вакансии',
    body: 'Резюме, отклики и всё, что касается работы в команде.',
    email: CONTACT_EMAILS.jobs,
    icon: 'user-plus',
  },
]

/** Самопомощь: разделы, где ответ, скорее всего, уже написан. */
const SELF_HELP: { title: string; body: string; href: string; icon: string }[] = [
  {
    title: 'Документация',
    body: 'Короткие ссылки, атрибуция и аналитика конверсий, партнёрские программы, REST API и вебхуки.',
    href: '/ru/docs',
    icon: 'file-text',
  },
  {
    title: 'Центр помощи',
    body: 'Пошаговые инструкции: запуск программы, выплаты партнёрам, настройка рабочего пространства.',
    href: '/ru/help',
    icon: 'list-checks',
  },
  {
    title: 'Глоссарий PRM',
    body: 'Термины партнёрского маркетинга, атрибуции и PRM-систем простыми словами.',
    href: '/glossary',
    icon: 'info',
  },
]

export default function SupportPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Поддержка' },
          ]),
        ]}
      />

      {/* ── 1. Hero ── */}
      <HeroCentered
        eyebrow="Поддержка"
        title="Свяжитесь с командой"
        body={
          <>
            Поможем с&nbsp;любым вопросом по&nbsp;продукту, биллингу или&nbsp;интеграциям —
            выберите канал, в&nbsp;котором вам удобнее писать.
          </>
        }
        theses={['Продукт и настройка', 'Биллинг и документы', 'Интеграции и API']}
        primary={{
          label: 'Написать на почту',
          href: `mailto:${CONTACT_EMAILS.support}`,
          ymGoal: 'landing_lead_form_submit',
        }}
        secondary={{ label: 'Написать в Telegram', href: CONTACT_MESSENGERS.telegram }}
      />

      {/* ── 2. Каналы связи ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 8 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 36 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Каналы связи</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Три способа написать.</h2>
          <p className="rr-lead" style={{ marginTop: 14, marginInline: 'auto', maxWidth: '48ch' }}>
            Все три ведут в&nbsp;одну поддержку — пишите туда, где вам удобнее.
          </p>
        </div>

        <div className="ds-grid-3">
          {CHANNELS.map((c) => (
            <a
              key={c.key}
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              data-ym-goal={c.ymGoal}
              className="card-flat"
              style={{ display: 'flex', flexDirection: 'column', gap: 12, textDecoration: 'none', color: 'inherit' }}
            >
              {c.icon}
              <h3 className="rr-h3" style={{ marginTop: 4 }}>{c.title}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', margin: 0 }}>{c.body}</p>
              <span
                className="rr-small"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'auto',
                  paddingTop: 14, color: 'var(--accent-strong)', fontWeight: 500, wordBreak: 'break-word',
                }}
              >
                {c.handle}
                <Icon
                  name={c.external ? 'arrow-up-right' : 'arrow-right'}
                  size={16}
                  color="var(--accent-strong)"
                  strokeWidth={2}
                />
              </span>
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Pill tone="green" dot>Обычно отвечаем в течение нескольких часов</Pill>
        </div>
      </section>

      {/* ── 3. Что приложить к обращению ── */}
      <section className="ds-container" style={{ paddingBottom: 40 }}>
        <div className="card" style={{ maxWidth: 920, marginInline: 'auto' }}>
          <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex', width: 44, height: 44, borderRadius: 12,
                background: 'var(--bg-sunken)', border: '1px solid var(--line)',
                alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', flexShrink: 0,
              }}
            >
              <Icon name="list-checks" size={22} />
            </span>
            <div style={{ flex: '1 1 320px' }}>
              <h2 className="rr-h3">Что приложить к обращению</h2>
              <p className="rr-body" style={{ color: 'var(--ink-2)', marginTop: 10 }}>
                Чем конкретнее первое сообщение, тем меньше уточняющих вопросов в&nbsp;ответ.
                Ничего страшного, если под рукой не&nbsp;всё, — пишите с&nbsp;тем, что есть,
                остальное спросим сами.
              </p>
            </div>
          </div>

          <div className="ds-grid-2" style={{ marginTop: 24 }}>
            {CHECKLIST.map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span
                  style={{
                    display: 'inline-flex', width: 34, height: 34, borderRadius: 10,
                    background: 'var(--accent-bg)', border: '1px solid var(--accent-line)',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)', flexShrink: 0,
                  }}
                >
                  <Icon name={item.icon} size={17} />
                </span>
                <div>
                  <h3 className="rr-small" style={{ margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{item.title}</h3>
                  <p className="rr-small" style={{ margin: '4px 0 0', color: 'var(--ink-3)' }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Другие адреса ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 32 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Ещё адреса</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Не про поддержку.</h2>
        </div>
        <div className="ds-grid-2" style={{ maxWidth: 760, marginInline: 'auto' }}>
          {OTHER_EMAILS.map((o) => (
            <div key={o.email} className="card-flat" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span
                style={{
                  display: 'inline-flex', width: 34, height: 34, borderRadius: 10,
                  background: 'var(--bg-sunken)', border: '1px solid var(--line)',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)', flexShrink: 0,
                }}
              >
                <Icon name={o.icon} size={17} />
              </span>
              <div style={{ minWidth: 0 }}>
                <h3 className="rr-small" style={{ margin: 0, color: 'var(--ink)', fontWeight: 600 }}>{o.title}</h3>
                <p className="rr-small" style={{ margin: '4px 0 0', color: 'var(--ink-3)' }}>{o.body}</p>
                <a
                  href={`mailto:${o.email}`}
                  className="rr-small"
                  style={{
                    display: 'inline-block', marginTop: 8, color: 'var(--accent-strong)',
                    fontWeight: 500, textDecoration: 'none', wordBreak: 'break-word',
                  }}
                >
                  {o.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Самопомощь ── */}
      <section className="ds-container" style={{ paddingBottom: 72 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center', marginBottom: 32 }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Пока ждёте ответа</Eyebrow>
          <h2 className="rr-h2" style={{ marginTop: 14 }}>Ответ может быть уже написан.</h2>
        </div>
        <div className="ds-grid-3">
          {SELF_HELP.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="card-flat"
              style={{ display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', color: 'inherit' }}
            >
              <GlyphTile><Icon name={s.icon} size={20} /></GlyphTile>
              <h3 className="rr-h3" style={{ marginTop: 4 }}>{s.title}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', margin: 0 }}>{s.body}</p>
              <span
                className="rr-small"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 'auto',
                  paddingTop: 14, color: 'var(--accent-strong)', fontWeight: 500,
                }}
              >
                Открыть
                <Icon name="arrow-right" size={16} color="var(--accent-strong)" strokeWidth={2} />
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

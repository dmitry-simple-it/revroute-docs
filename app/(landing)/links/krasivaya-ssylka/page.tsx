import type { Metadata } from 'next'
import { ShortenerCard } from '@/components/ds/ShortenerCard'
import { Steps } from '@/components/ds/Steps'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Button, Chip } from '@/components/ds/primitives'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, webApplication } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

const APP_REGISTER = 'https://app.revroute.ru/register'

/**
 * Посадочная под группу объявлений «красивая ссылка» (Директ).
 *
 * Требования модерации: H1 повторяет запрос, рабочий инструмент — на первом
 * экране, никакой регистрации до результата. Слова «брендированная» и «для
 * бизнеса» в заголовках не используются сознательно (сужают и удорожают клик).
 *
 * Лимиты и цены — строго из content/ru/legal/tariffs.mdx, п. 3.3.2 (линейка
 * RevRoute Links): Free — 0 ₽, 1 000 ссылок, 50 000 кликов/мес, 1 свой домен,
 * статистика 30 дней; Pro — от 248 ₽/мес при годовой оплате, 10 доменов.
 * При изменении тарифов править синхронно.
 *
 * Конкурентов по именам и их цены не приводим — только обобщённая отстройка
 * («в большинстве сокращателей свой домен — платная функция»). Исключение —
 * пример «до/после» и вопрос FAQ про clck.ru/vk.cc: там сравнение строго
 * функциональное, без цен.
 */

/**
 * ВНИМАНИЕ: `title` здесь обязан быть СТРОКОЙ (не объектом) — Nextra кладёт
 * его в page map и рендерит React-ребёнком; объект роняет все страницы
 * документации. Страж — scripts/check-app-metadata.mjs.
 */
export const metadata: Metadata = {
  title: 'Красивая ссылка на своём домене — сделать бесплатно',
  description:
    'Сделайте красивую короткую ссылку: сократите URL без регистрации и подключите свой домен — go.вашбренд.ru вместо чужого сервиса. Свой домен — уже на тарифе Free.',
  alternates: { canonical: '/links/krasivaya-ssylka' },
  openGraph: og('/links/krasivaya-ssylka'),
}

/** FAQ: plain-текст уходит в FAQPage JSON-LD, rich — в видимый аккордеон (текст совпадает). */
const FAQ: { q: string; a: string; rich?: React.ReactNode }[] = [
  {
    q: 'Что значит «красивая ссылка»?',
    a: 'Короткая ссылка, которую не стыдно показывать: ваш домен вместо адреса сокращателя и понятное слово вместо случайных символов — например, go.вашбренд.ru/акция. Такая ссылка читается, запоминается и вызывает больше доверия при переходе.',
  },
  {
    q: 'Свой домен — это платно?',
    a: 'Нет. На бесплатном тарифе Free доступен 1 свой домен, SSL-сертификат выпускается автоматически. На Pro — 10 доменов. Полные условия — в Тарифах.',
    rich: (
      <>
        Нет. На бесплатном тарифе Free доступен 1 свой домен, SSL-сертификат выпускается
        автоматически. На Pro — 10 доменов. Полные условия —{' '}
        <a href="/ru/legal/tariffs" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>в Тарифах</a>.
      </>
    ),
  },
  {
    q: 'Что будет со ссылками, если не платить?',
    a: 'Ничего плохого: Free — это тариф, а не пробный период, платить не обязательно. Ссылки и напечатанные QR-коды продолжат работать, редиректы не отключаются. Даже если исчерпать лимит кликов, ограничится только просмотр аналитики — до перехода на тариф выше.',
  },
  {
    q: 'Чем это отличается от clck.ru или vk.cc?',
    a: 'Функционально: в массовых сокращателях ссылка живёт на общем домене сервиса, подключить собственный нельзя. В RevRoute вы подключаете свой домен уже на бесплатном тарифе, видите статистику переходов и можете поменять адрес назначения после публикации.',
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

export default function KrasivayaSsylkaPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Короткие ссылки', url: '/links' },
            { name: 'Красивая ссылка' },
          ]),
          // Схема та же, что у /tools/link-shortener: на первом экране — тот же
          // рабочий сокращатель без регистрации, поэтому WebApplication.
          webApplication({
            name: 'Красивая короткая ссылка RevRoute',
            url: '/links/krasivaya-ssylka',
            description:
              'Бесплатный сокращатель без регистрации и короткие ссылки на собственном домене: go.вашбренд.ru вместо адреса чужого сервиса. Свой домен — уже на тарифе Free.',
            permissions: 'No registration required',
          }),
          faqPage(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />

      {/* ── 1. Первый экран: H1 = запрос + рабочий сокращатель ── */}
      <section className="ds-container" style={{ paddingTop: 72 }}>
        <div style={{ maxWidth: 780, marginInline: 'auto', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Бесплатный инструмент</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 16 }}>Красивая короткая ссылка на вашем домене</h1>
          <p className="rr-lead" style={{ marginTop: 16, marginInline: 'auto', maxWidth: '52ch' }}>
            Сократите ссылку прямо здесь — бесплатно и без&nbsp;регистрации. А&nbsp;в&nbsp;аккаунте
            подключите свой домен, чтобы короткие ссылки выглядели как часть вашего сайта,
            а&nbsp;не&nbsp;чужого сервиса.
          </p>
        </div>
        <div style={{ maxWidth: 860, marginInline: 'auto', marginTop: 36 }}>
          <ShortenerCard />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          <Chip>Без регистрации</Chip>
          <Chip>До 10 ссылок в час</Chip>
          <Chip>Свой домен — на Free</Chip>
        </div>
      </section>

      {/* ── 2. Свой домен вместо чужого сервиса ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Свой домен"
          title="go.вашбренд.ru вместо чужого сервиса."
          sub="Подключите собственный домен — и каждая короткая ссылка будет работать на ваш бренд, а не на сокращатель."
        />
        <div className="ds-grid-3">
          {[
            { icon: 'globe', t: 'Часть вашего сайта.', b: 'Ссылки вида go.вашбренд.ru читаются как продолжение сайта: получатель сразу видит, чей это адрес и куда он ведёт.' },
            { icon: 'shield-check', t: 'SSL — автоматически.', b: 'Сертификат для домена выпускается и продлевается сам: ссылки открываются по https без ручных настроек.' },
            { icon: 'zap', t: 'Настройка за несколько минут.', b: 'Добавьте домен в кабинете и подтвердите его одной записью у регистратора — подробные шаги ниже.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>

        {/* Ключевое отличие — крупно. Цель регистрации живёт на этой кнопке:
            CtaBottom не пробрасывает data-атрибуты на свои ссылки (тот же
            приём, что на /links и /prm — трекаемый CTA в теле страницы). */}
        <div className="card" style={{ maxWidth: 860, marginInline: 'auto', marginTop: 28, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', textAlign: 'center' }}>
          <h3 className="rr-h2" style={{ margin: 0 }}>Свой домен доступен уже на&nbsp;бесплатном тарифе.</h3>
          <p className="rr-body" style={{ color: 'var(--ink-2)', margin: '14px auto 0', maxWidth: 640 }}>
            Free — 0&nbsp;₽: 1&nbsp;свой домен, 1&nbsp;000 ссылок и 50&nbsp;000 кликов в месяц.
            В большинстве сокращателей свой домен — платная функция верхних тарифов;
            здесь он входит в бесплатный план.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
            <Button variant="primary" size="lg" href={APP_REGISTER} iconRight="arrow-right" data-ym-goal="landing_signup_click">Подключить свой домен</Button>
          </div>
        </div>
      </section>

      {/* ── 3. До/после: что значит «красивая» ── */}
      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <SectionHead
          center
          eyebrow="До и после"
          title="Почему «красивая»."
          sub="Одна и та же ссылка — на чужом домене и на вашем."
        />
        <div className="card" style={{ maxWidth: 760, marginInline: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <p className="rr-caption" style={{ margin: 0 }}>Было — чужой сервис</p>
              <p className="rr-mono" style={{ margin: '8px 0 0', fontSize: 'clamp(1.1rem, 0.95rem + 1vw, 1.45rem)', color: 'var(--ink-3)', wordBreak: 'break-all' }}>
                clck.ru/3Fk2mQ
              </p>
              <p className="rr-small" style={{ margin: '8px 0 0', color: 'var(--ink-3)' }}>
                Случайный набор символов на чужом домене: по ссылке не видно ни бренда, ни того, куда она ведёт.
              </p>
            </div>
            <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <Icon name="arrow-right" size={18} color="var(--ink-3)" style={{ transform: 'rotate(90deg)' }} />
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>
            <div>
              <p className="rr-caption" style={{ margin: 0 }}>Стало — ваш домен</p>
              <p className="rr-mono" style={{ margin: '8px 0 0', fontSize: 'clamp(1.1rem, 0.95rem + 1vw, 1.45rem)', fontWeight: 600, color: 'var(--accent-strong)', wordBreak: 'break-all' }}>
                go.вашбренд.ru/акция
              </p>
              <p className="rr-small" style={{ margin: '8px 0 0', color: 'var(--ink-2)' }}>
                Ваш домен и понятное слово вместо кода: ссылка читается, запоминается и вызывает
                доверие — это и называют «красивой».
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Как подключить домен ── */}
      <section className="ds-band ds-container">
        <SectionHead
          center
          eyebrow="Подключение"
          title="Как подключить домен."
          sub="Три шага — от регистрации до работающего https-домена."
        />
        <Steps
          columns={3}
          steps={[
            { icon: 'user-plus', title: 'Зарегистрируйтесь.', body: 'Создайте бесплатный аккаунт RevRoute — карта не нужна, тариф Free бессрочный.' },
            { icon: 'globe', title: 'Добавьте домен и CNAME-запись.', body: 'Укажите домен (например, go.вашбренд.ru) в кабинете и создайте у своего регистратора CNAME-запись на адрес, который покажет платформа.' },
            { icon: 'shield-check', title: 'Получите SSL автоматически.', body: 'После проверки записи сертификат выпустится сам — обычно за несколько минут, и домен начнёт открываться по https.' },
          ]}
        />
      </section>

      {/* ── 5. Что даёт аккаунт ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Что даёт аккаунт"
          title="Больше, чем сокращатель."
          sub="Всё ниже — возможности RevRoute Links; свой домен и статистика доступны уже на Free."
        />
        <div className="ds-grid-4">
          {[
            { icon: 'globe', t: 'Свой домен.', b: 'go.вашбренд.ru вместо чужого адреса. 1 домен — на Free, 10 — на Pro.' },
            { icon: 'bar-chart-3', t: 'Статистика переходов.', b: 'Клики, страны, устройства и источники по каждой ссылке. На Free статистика хранится 30 дней.' },
            { icon: 'refresh-cw', t: 'Редактирование после публикации.', b: 'Адрес назначения короткой ссылки можно поменять в любой момент — сама ссылка не изменится.' },
            { icon: 'qr-code', t: 'QR для каждой ссылки.', b: 'Скачайте QR-код, ведущий на короткую ссылку: адрес назначения меняется в кабинете, а напечатанный код продолжает работать.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-strong)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. FAQ + финальный CTA ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead center eyebrow="Вопросы" title="Частые вопросы." />
          <FaqList items={FAQ.map((f) => ({ q: f.q, a: f.rich ?? f.a }))} />
        </div>

        <CtaBottom
          tone="spectrum"
          title="Красивые ссылки начинаются с домена."
          body="Подключите свой домен, следите за переходами и меняйте адрес назначения без перевыпуска ссылок. Free: 1 свой домен, 1 000 ссылок и 50 000 кликов в месяц."
          primary={{ label: 'Начать бесплатно', href: APP_REGISTER }}
          secondary={{ label: 'Все возможности Links', href: '/links' }}
        />
      </section>
    </>
  )
}

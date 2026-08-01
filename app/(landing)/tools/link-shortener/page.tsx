import type { Metadata } from 'next'
import { ShortenerCard } from '@/components/ds/ShortenerCard'
import { Steps } from '@/components/ds/Steps'
import { FaqList } from '@/components/ds/FaqList'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { Eyebrow, Icon, Button, Chip } from '@/components/ds/primitives'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, howTo, webApplication } from '@/lib/seo/schemas'

const APP_REGISTER = 'https://app.revroute.ru/register'

export const metadata: Metadata = {
  title: 'Сократить ссылку онлайн бесплатно — с QR и аналитикой',
  description:
    'Бесплатный сокращатель ссылок без регистрации: вставьте длинный URL — получите короткую ссылку за секунду. Аналитика и свой домен — в полной версии.',
  alternates: { canonical: '/tools/link-shortener' },
  openGraph: {
    title: 'Сократить ссылку онлайн бесплатно — Revroute',
    description:
      'Сократите длинную ссылку за секунду без регистрации. С аналитикой и QR — в полной версии.',
    url: '/tools/link-shortener',
    images: ['/images/og/link-shortener.png'],
  },
}

/** FAQ: plain уходит в FAQPage JSON-LD, rich — в аккордеон (текст совпадает). */
const FAQ: { q: string; a: string; rich?: React.ReactNode }[] = [
  {
    q: 'Как сократить ссылку?',
    a: 'Вставьте длинный URL в поле выше и нажмите «Сократить». Готовая короткая ссылка появится за секунду — её можно скопировать и сразу использовать. Регистрация не требуется.',
  },
  {
    q: 'Это бесплатно?',
    a: 'Да, полностью. Лимит — 10 ссылок в час с одного IP. Если нужно больше или нужна статистика — создайте аккаунт RevRoute: на тарифе Free доступны 1 000 ссылок и 50 000 кликов в месяц.',
  },
  {
    q: 'Можно ли посмотреть статистику переходов?',
    a: 'У формы без регистрации статистики нет. Чтобы видеть клики, страны, города, устройства и рефереры — создайте бесплатный аккаунт RevRoute и сокращайте ссылки внутри платформы.',
  },
  {
    q: 'Можно ли подключить свой домен?',
    a: 'Да, в аккаунте RevRoute — включая бесплатный тариф. Подключите свой домен (например, go.brand.ru) и получите брендированные короткие ссылки; SSL-сертификат выпускается автоматически.',
  },
  {
    q: 'Сохранятся ли UTM-метки в короткой ссылке?',
    a: 'Да. Все query-параметры исходного URL, включая utm_source, utm_medium, utm_campaign и любые другие, сохраняются и передаются на целевую страницу при переходе.',
  },
  {
    q: 'Безопасно ли сокращать ссылки?',
    a: 'Да. Мы валидируем URL и не пропускаем некорректные адреса. А чужую короткую ссылку перед переходом можно проверить бесплатным инспектором ссылок.',
    rich: (
      <>
        Да. Мы валидируем URL и не пропускаем некорректные адреса. А чужую короткую ссылку перед
        переходом можно проверить бесплатным{' '}
        <a href="/tools/link-inspector" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>инспектором ссылок</a>.
      </>
    ),
  },
  {
    q: 'Можно ли сделать QR-код для короткой ссылки?',
    a: 'Да, отдельно — через бесплатный QR-генератор. В аккаунте QR крепится к короткой ссылке, и целевой URL можно менять без перепечатки макетов.',
    rich: (
      <>
        Да, отдельно — через бесплатный{' '}
        <a href="/tools/qr" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>QR-генератор</a>.
        В аккаунте QR крепится к короткой ссылке, и целевой URL можно менять без перепечатки макетов.
      </>
    ),
  },
  {
    q: 'Как удалить или отредактировать короткую ссылку?',
    a: 'У формы без регистрации редактирование недоступно. В аккаунте RevRoute вы можете изменить целевой URL короткой ссылки, добавить теги и удалить её в любой момент.',
  },
  {
    q: 'Чем RevRoute отличается от clck.ru, Bitly и Goo.su?',
    a: 'RevRoute — не только сокращатель, а инфраструктура ссылок: свой домен уже на бесплатном тарифе, аналитика от клика до оплаты, UTM-шаблоны, QR с динамическим URL и API. Данные хранятся в России.',
    rich: (
      <>
        RevRoute — не только сокращатель, а{' '}
        <a href="/links" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>инфраструктура ссылок</a>:
        свой домен уже на бесплатном тарифе, аналитика от клика до оплаты, UTM-шаблоны, QR с
        динамическим URL и API. Данные хранятся в России.
      </>
    ),
  },
]

const HOWTO_STEPS = [
  {
    name: 'Вставьте длинный URL',
    text: 'Скопируйте ссылку из адресной строки и вставьте её в поле «Длинная ссылка». Подойдёт любой http(s)-адрес.',
  },
  {
    name: 'Нажмите «Сократить»',
    text: 'Сервис проверит URL и за секунду вернёт короткую ссылку. Ничего регистрировать не нужно.',
  },
  {
    name: 'Скопируйте короткую ссылку',
    text: 'Нажмите «Скопировать» рядом с результатом — ссылка окажется в буфере обмена и готова для рассылки, постов и QR-кодов.',
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

export default function LinkShortenerPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Инструменты', url: '/tools' },
            { name: 'Сократить ссылку' },
          ]),
          webApplication({
            name: 'Бесплатный сокращатель ссылок RevRoute',
            url: '/tools/link-shortener',
            description:
              'Бесплатный онлайн-сокращатель ссылок без регистрации: вставьте длинный URL — получите короткую ссылку за секунду.',
            permissions: 'No registration required',
          }),
          howTo({
            name: 'Как сократить ссылку онлайн',
            description: 'Пошаговая инструкция по сокращению ссылки в бесплатном сервисе RevRoute без регистрации.',
            totalTime: 'PT30S',
            steps: HOWTO_STEPS.map((s) => ({ ...s, url: '/tools/link-shortener' })),
          }),
          faqPage(FAQ.map(({ q, a }) => ({ q, a }))),
        ]}
      />

      {/* ── 1. Компактный hero + виджет — CTA страницы это сама форма ── */}
      <section className="ds-container" style={{ paddingTop: 72 }}>
        <div style={{ maxWidth: 760, marginInline: 'auto', textAlign: 'center' }}>
          <Eyebrow style={{ justifyContent: 'center' }}>Бесплатный инструмент</Eyebrow>
          <h1 className="rr-h1" style={{ marginTop: 16 }}>Сократить ссылку</h1>
          <p className="rr-lead" style={{ marginTop: 16, marginInline: 'auto', maxWidth: '46ch' }}>
            Вставьте длинный URL — получите короткую ссылку за&nbsp;секунду. Без&nbsp;регистрации.
          </p>
        </div>
        <div style={{ maxWidth: 860, marginInline: 'auto', marginTop: 36 }}>
          <ShortenerCard />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          <Chip>Без регистрации</Chip>
          <Chip>До 10 ссылок в час</Chip>
          <Chip>UTM сохраняются</Chip>
        </div>
      </section>

      {/* ── 2. Как это работает ── */}
      <section className="ds-band ds-container">
        <SectionHead center eyebrow="Как это работает" title="Три шага — и готово." />
        <Steps
          columns={3}
          steps={[
            { icon: 'link', title: 'Вставьте длинный URL.', body: HOWTO_STEPS[0].text },
            { icon: 'mouse-pointer-click', title: 'Нажмите «Сократить».', body: HOWTO_STEPS[1].text },
            { icon: 'check', title: 'Скопируйте результат.', body: HOWTO_STEPS[2].text },
          ]}
        />
      </section>

      {/* ── 3. Что входит — и что открывает аккаунт ── */}
      <section className="ds-band ds-container" style={{ paddingTop: 0 }}>
        <SectionHead
          center
          eyebrow="Что входит"
          title="Бесплатно здесь. Больше — в аккаунте."
          sub="Форма выше закрывает разовую задачу. Постоянную работу со ссылками удобнее вести в кабинете."
        />
        <div className="ds-grid-3">
          {[
            { icon: 'zap', t: 'Без регистрации.', b: 'Вставьте URL — получите короткую ссылку за секунду. Никаких аккаунтов и e-mail.' },
            { icon: 'shield-check', t: 'Валидация URL.', b: 'Некорректные адреса не проходят проверку — на выходе только рабочие ссылки.' },
            { icon: 'sliders', t: 'UTM сохраняются.', b: 'Все utm_* и query-параметры передаются на целевую страницу при переходе.' },
            { icon: 'bar-chart-3', t: 'Статистика — в аккаунте.', b: 'Клики, страны, устройства и конверсии — в RevRoute Links, бесплатно с тарифа Free.' },
            { icon: 'globe', t: 'Свой домен — в аккаунте.', b: 'Брендируйте ссылки доменом go.brand.ru — доступно даже на Free, SSL автоматически.' },
            { icon: 'qr-code', t: 'QR и API — в аккаунте.', b: 'Динамические QR-коды и REST API — для маркетинговых команд и разработчиков.' },
          ].map((c) => (
            <div key={c.t} className="card-flat">
              <span style={{ display: 'inline-flex', width: 38, height: 38, borderRadius: 11, background: 'var(--bg-sunken)', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name={c.icon} size={19} /></span>
              <h3 className="rr-h3" style={{ marginTop: 16 }}>{c.t}</h3>
              <p className="rr-small" style={{ color: 'var(--ink-3)', marginTop: 8 }}>{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Мост на /links ── */}
      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <div className="card" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-line)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <Icon name="link" size={20} color="var(--accent-strong)" />
            <p className="rr-small" style={{ margin: 0, color: 'var(--ink)', flex: '1 1 320px' }}>
              Ссылок больше десяти и нужна статистика? В RevRoute Links — свой домен, аналитика
              от клика до оплаты и редактирование. Free: 1 000 ссылок и 50 000 кликов в месяц.
            </p>
            <Button variant="ghost" size="sm" href="/links" iconRight="arrow-right">Короткие ссылки для бизнеса</Button>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ + финальный CTA ── */}
      <section className="ds-band ds-container">
        <div style={{ maxWidth: 760, marginInline: 'auto', marginBottom: 56 }}>
          <SectionHead center eyebrow="Вопросы" title="Частые вопросы." />
          <FaqList items={FAQ.map((f) => ({ q: f.q, a: f.rich ?? f.a }))} />
        </div>

        <CtaBottom
          tone="spectrum"
          title="Больше, чем сокращатель."
          body="Свой домен, аналитика от клика до оплаты и QR с динамическим URL — в RevRoute Links. Free: 1 000 ссылок и 50 000 кликов в месяц."
          primary={{ label: 'Начать бесплатно', href: APP_REGISTER }}
          secondary={{ label: 'Короткие ссылки для бизнеса', href: '/links' }}
        />
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { ShortenerWidget } from '@/components/marketing/tools/ShortenerWidget'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, howTo, webApplication } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Сократить ссылку онлайн бесплатно — с QR и аналитикой | Revroute',
  description:
    'Бесплатный сокращатель ссылок без регистрации: вставьте длинный URL — получите короткую ссылку за секунду. Аналитика и кастомный домен — в полной версии.',
  alternates: { canonical: '/tools/link-shortener' },
  openGraph: {
    title: 'Сократить ссылку онлайн бесплатно — Revroute',
    description:
      'Сократите длинную ссылку за секунду без регистрации. С аналитикой и QR — в полной версии.',
    url: '/tools/link-shortener',
    images: ['/images/og/link-shortener.png'],
  },
}

const faqItems = [
  {
    q: 'Как сократить ссылку?',
    a: 'Вставьте длинный URL в поле выше и нажмите «Сократить». Готовая короткая ссылка появится за секунду — её можно скопировать и сразу использовать. Регистрация не требуется.',
  },
  {
    q: 'Это бесплатно?',
    a: 'Да, полностью бесплатно. Лимит — 10 ссылок в час с одного IP. Если нужно больше или нужна аналитика — создайте аккаунт Revroute, на тарифе Free доступно 1 000 ссылок и 50 000 кликов в месяц.',
  },
  {
    q: 'Можно ли посмотреть статистику переходов?',
    a: 'У бесплатной формы без регистрации статистики нет. Чтобы видеть клики, страны, города, устройства и реферера — создайте бесплатный аккаунт Revroute и сокращайте ссылки внутри платформы.',
  },
  {
    q: 'Можно ли подключить свой домен?',
    a: 'Да, на любом тарифе Revroute Links — включая Free. Подключите свой домен (например, go.brand.ru) и получите брендированные короткие ссылки с SSL. Подключение занимает 5 минут.',
  },
  {
    q: 'Сохранятся ли UTM-метки в короткой ссылке?',
    a: 'Да. Все query-параметры исходного URL, включая utm_source, utm_medium, utm_campaign и любые другие, сохраняются и передаются на целевую страницу при переходе.',
  },
  {
    q: 'Безопасно ли сокращать ссылки?',
    a: 'Да. Мы валидируем URL и не пропускаем некорректные адреса. Для проверки чужой короткой ссылки перед переходом используйте бесплатный инспектор ссылок.',
  },
  {
    q: 'Можно ли сделать QR-код для короткой ссылки?',
    a: 'Да, отдельно — через бесплатный QR-генератор Revroute. В полной версии QR крепится к короткой ссылке, и вы можете менять целевой URL без перепечатки QR-кодов.',
  },
  {
    q: 'Как удалить или отредактировать короткую ссылку?',
    a: 'У бесплатной формы без регистрации редактирование недоступно. В аккаунте Revroute вы можете изменить целевой URL короткой ссылки, добавить теги и удалить её в любой момент.',
  },
  {
    q: 'Чем Revroute отличается от clck.ru, Bitly и Goo.su?',
    a: 'Revroute — это платформа атрибуции с встроенным партнёрским маркетингом и аналитикой конверсий, не только сокращатель. Поддержка кастомных доменов от 0 ₽, поддержка самозанятых для выплат партнёрам, российская инфраструктура.',
  },
]

const howToSteps = [
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
    text: 'Нажмите кнопку «Скопировать» рядом с результатом — короткая ссылка окажется в буфере обмена и готова для рассылки, постов и QR-кодов.',
  },
]

const benefitCards = [
  { title: 'Без регистрации', desc: 'Вставьте URL — получите короткую ссылку за секунду. Никаких аккаунтов и e-mail.' },
  { title: 'Лимит 10/час', desc: 'Базовая защита от злоупотреблений. Хотите больше — создайте бесплатный аккаунт.' },
  { title: 'UTM сохраняются', desc: 'Все utm_* и query-параметры передаются на целевую страницу при переходе.' },
  { title: 'Аналитика — в полной версии', desc: 'Клики, страны, устройства и конверсии — в Revroute Links от 0 ₽.' },
  { title: 'Свой домен — в полной версии', desc: 'Брендируйте ссылки своим доменом go.brand.ru — доступно даже на Free.' },
  { title: 'QR-коды и API', desc: 'Динамические QR и REST API — для маркетинговых команд и разработчиков.' },
]

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
            name: 'Бесплатный сокращатель ссылок Revroute',
            url: '/tools/link-shortener',
            description:
              'Бесплатный онлайн-сокращатель ссылок без регистрации: вставьте длинный URL — получите короткую ссылку за секунду.',
            permissions: 'No registration required',
          }),
          howTo({
            name: 'Как сократить ссылку онлайн',
            description: 'Пошаговая инструкция по сокращению ссылки в бесплатном сервисе Revroute без регистрации.',
            totalTime: 'PT30S',
            steps: howToSteps.map((s) => ({ ...s, url: '/tools/link-shortener' })),
          }),
          faqPage(faqItems),
        ]}
      />

      <PageHero
        eyebrow="Бесплатный инструмент"
        eyebrowColor="orange"
        title={
          <>
            Сократить <em style={{ fontStyle: 'italic' }}>ссылку</em>
          </>
        }
        desc="Вставьте длинный URL — получите короткую ссылку за секунду. Без регистрации, лимит 10 в час с одного IP."
      />

      <section style={{ padding: '20px 0 60px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <ShortenerWidget />
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="orange">Как это работает</Eyebrow>
            <SectionHeading className="mt-5">
              Три шага — <em style={{ fontStyle: 'italic' }}>и готово</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Сокращение занимает меньше минуты. Никаких форм регистрации, подтверждений или
              скрытых полей — только то, что нужно.
            </SectionDesc>
          </div>
          <ol className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {howToSteps.map((s, i) => (
              <li
                key={i}
                className="border p-6"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {i + 1}
                </div>
                <div className="text-base font-bold mb-2">{s.name}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {s.text}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Что входит</Eyebrow>
            <SectionHeading className="mt-5">
              Бесплатный сокращатель — <em style={{ fontStyle: 'italic' }}>и не только</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Если нужны кастомный домен, аналитика кликов, QR-коды и UTM-шаблоны — переходите на
              <a href="/links" className="underline underline-offset-2" style={{ color: 'var(--text)' }}> Revroute Links</a>.
              Бесплатно: 1 000 ссылок и 50 000 кликов в месяц.
            </SectionDesc>
          </div>
          <FeatureGrid cards={benefitCards} cols={3} />
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[760px] px-6">
          <div className="mb-10">
            <Eyebrow color="purple">Частые вопросы</Eyebrow>
            <SectionHeading className="mt-5">
              Что нужно <em style={{ fontStyle: 'italic' }}>знать</em>
            </SectionHeading>
          </div>
          <div className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="border"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 22px',
                }}
              >
                <summary
                  className="cursor-pointer text-base font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {item.q}
                </summary>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Хочется <em style={{ fontStyle: 'italic' }}>больше</em>?
          </>
        }
        desc="В Revroute Links — кастомный домен, аналитика, UTM-шаблоны, QR с динамическим URL и API. Бесплатно: 1 000 ссылок и 50 000 кликов в месяц."
        primary={{ href: 'https://app.revroute.ru/', label: 'Создать аккаунт' }}
        secondary={{ href: '/links', label: 'Подробнее о /links' }}
      />
    </>
  )
}

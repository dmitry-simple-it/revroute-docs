import type { Metadata } from 'next'
import { UtmBuilder } from '@/components/marketing/tools/UtmBuilder'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, howTo, webApplication } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'UTM-конструктор — бесплатный инструмент Revroute',
  description:
    'Бесплатный UTM-конструктор: собирайте правильно размеченные ссылки для Яндекс.Директа, Google Ads, таргетированной рекламы и соцсетей за секунды.',
  alternates: { canonical: '/tools/utm' },
  openGraph: { url: '/tools/utm', images: ['/brand/og-default.png'] },
}

const howToSteps = [
  {
    name: 'Введите целевой URL',
    text: 'Скопируйте посадочную страницу, на которую ведёте трафик. Это может быть главная сайта, конкретный лендинг, карточка товара, форма заявки или статья в блоге.',
  },
  {
    name: 'Заполните обязательные параметры',
    text: 'utm_source (источник: yandex, vk, telegram, newsletter), utm_medium (тип: cpc, social, email, banner), utm_campaign (название кампании: spring-sale-2026). Эти три параметра — минимум для корректной аналитики.',
  },
  {
    name: 'Опционально: utm_term и utm_content',
    text: 'utm_term — ключевое слово или сегмент аудитории. utm_content — версия баннера, объявления или CTA, чтобы различать варианты в A/B-тестах. Можно оставить пустыми.',
  },
  {
    name: 'Скопируйте размеченную ссылку',
    text: 'Готовый URL появится снизу — нажмите «Скопировать» и вставляйте в рекламную кампанию, рассылку, пост или баннер. Метки автоматически попадут в Яндекс.Метрику, Google Analytics и Revroute Analytics.',
  },
]

const useCases = [
  {
    title: 'Яндекс.Директ',
    desc: 'Размечайте кампании отдельно для поиска, РСЯ и ретаргетинга. utm_source=yandex, utm_medium=cpc, utm_campaign — имя кампании в кабинете. Дополняйте yclid и openstat — Я.Метрика разберёт автоматически.',
  },
  {
    title: 'VK Ads',
    desc: 'utm_source=vk, utm_medium=cpc (или cpm для охватных), utm_campaign=ad-set-name. Размечайте отдельные креативы через utm_content, чтобы видеть, какой баннер привёл подписку.',
  },
  {
    title: 'Telegram Ads и каналы',
    desc: 'utm_source=telegram, utm_medium=social для постов и cpc для официальной Telegram Ads. utm_campaign — название канала или поста. Полезно для оценки ROI публикаций у блогеров.',
  },
  {
    title: 'Email-рассылки',
    desc: 'utm_source=newsletter (или имя сервиса: sendpulse, mindbox), utm_medium=email, utm_campaign — название письма. Размечайте отдельные кнопки через utm_content, чтобы видеть, что кликают чаще.',
  },
  {
    title: 'Инфлюенсеры и блогеры',
    desc: 'utm_source=influencer, utm_medium=social, utm_campaign=имя-блогера. Для каждой публикации — отдельный utm_content. Так понятно, кто из блогеров приносит реальную выручку, а не только клики.',
  },
  {
    title: 'Контент-промо и SEO',
    desc: 'utm_source=blog, utm_medium=content, utm_campaign — тема серии материалов. Полезно для оценки, какой пост в блоге приносит регистрации, а какой просто собирает охват без конверсии.',
  },
]

type UtmStandard = {
  channel: string
  source: string
  medium: string
  example: string
}

const utmStandards: UtmStandard[] = [
  { channel: 'Яндекс.Директ — поиск', source: 'yandex', medium: 'cpc', example: 'utm_campaign=search-brand-2026-q2' },
  { channel: 'Яндекс.Директ — РСЯ', source: 'yandex', medium: 'cpc', example: 'utm_campaign=rsya-retargeting-q2' },
  { channel: 'VK Ads — клики', source: 'vk', medium: 'cpc', example: 'utm_campaign=vk-leads-spring' },
  { channel: 'VK Ads — охватные', source: 'vk', medium: 'cpm', example: 'utm_campaign=vk-awareness-brand' },
  { channel: 'Telegram Ads', source: 'telegram', medium: 'cpc', example: 'utm_campaign=tg-official-q2' },
  { channel: 'Telegram-канал (пост)', source: 'telegram', medium: 'social', example: 'utm_campaign=tg-channel-post' },
  { channel: 'Email-рассылка (Sendpulse)', source: 'sendpulse', medium: 'email', example: 'utm_campaign=newsletter-2026-05' },
  { channel: 'Email-рассылка (Mindbox)', source: 'mindbox', medium: 'email', example: 'utm_campaign=trigger-cart-abandon' },
  { channel: 'Push-уведомления', source: 'push', medium: 'notification', example: 'utm_campaign=push-discount-friday' },
  { channel: 'Инфлюенсер — пост у блогера', source: 'influencer', medium: 'social', example: 'utm_campaign=blogger-name-post-1' },
  { channel: 'Инфлюенсер — Stories', source: 'influencer', medium: 'stories', example: 'utm_campaign=blogger-name-stories' },
  { channel: 'YouTube — описание видео', source: 'youtube', medium: 'video', example: 'utm_campaign=channel-video-slug' },
  { channel: 'Блог Revroute / контент', source: 'blog', medium: 'content', example: 'utm_campaign=guide-utm-2026' },
  { channel: 'Партнёрская программа', source: 'partner', medium: 'referral', example: 'utm_campaign=partner-slug' },
  { channel: 'Оффлайн (QR на постере)', source: 'offline', medium: 'qr', example: 'utm_campaign=event-name-2026' },
]

type UtmMistake = {
  bad: string
  good: string
  why: string
}

const utmMistakes: UtmMistake[] = [
  {
    bad: '?utm_source=Яндекс Директ',
    good: '?utm_source=yandex&utm_medium=cpc',
    why: 'Кириллица и пробелы URL-кодируются в %D1%8F%D0%BD... и нечитаемы в отчётах. Только латиница, разделитель — дефис, без пробелов.',
  },
  {
    bad: '?utm_source=VK&UTM_Medium=CPC',
    good: '?utm_source=vk&utm_medium=cpc',
    why: 'Регистр имеет значение — utm_source и UTM_SOURCE считаются разными источниками. Стандарт: всё строчными буквами.',
  },
  {
    bad: '?utm_source=yandex&utm_campaign=кампания_весна_2026',
    good: '?utm_source=yandex&utm_campaign=spring-sale-2026',
    why: 'Подчёркивания и кириллица плохо ведут себя в отчётах. Стандарт именования: латиница, дефисы, год в конце.',
  },
  {
    bad: '?utm_source=newsletter (только source)',
    good: '?utm_source=newsletter&utm_medium=email&utm_campaign=monthly-digest',
    why: 'Минимум три параметра обязательны: source, medium, campaign. Без medium и campaign отчёты сгруппируются криво.',
  },
  {
    bad: 'site.ru/page?param=1?utm_source=...',
    good: 'site.ru/page?param=1&utm_source=...',
    why: 'Два знака `?` в URL — синтаксическая ошибка. После первого `?` все параметры разделяются `&`. Конструктор Revroute проверяет и подставляет правильный разделитель.',
  },
]

const faqItems = [
  {
    q: 'Что такое UTM-метки и зачем они нужны?',
    a: 'UTM (Urchin Tracking Module) — это параметры в query-строке URL, которые передают информацию об источнике трафика в системы аналитики. Метки добавляются к ссылке: example.ru?utm_source=yandex&utm_medium=cpc&utm_campaign=spring. Без UTM аналитика видит только «прямой» или «реферальный» трафик; с UTM — точную кампанию, канал и источник.',
  },
  {
    q: 'Какие параметры обязательные, а какие опциональные?',
    a: 'Обязательные три: utm_source (где разместили: yandex, vk, telegram), utm_medium (тип трафика: cpc, social, email), utm_campaign (название конкретной кампании). Опциональные: utm_term (ключевое слово) и utm_content (вариант объявления или баннера). Минимум для рабочей аналитики — три обязательных; пять — полная разметка.',
  },
  {
    q: 'Можно ли использовать кириллицу в UTM-метках?',
    a: 'Технически — да, но не рекомендуется. Кириллица URL-кодируется в %D1%80%D1%83... и плохо читается в отчётах. Стандарт команды: только латиница в нижнем регистре, разделители — дефис (spring-sale), без пробелов и спецсимволов. Это работает во всех платформах: Я.Метрика, GA4, Roistat, Adjust, AppsFlyer, Revroute.',
  },
  {
    q: 'Нужно ли размечать ссылки в Яндекс.Директе, если есть yclid?',
    a: 'Да, рекомендуется. Я.Директ автоматически подставляет в URL служебные параметры yclid, ymclid и openstat — они позволяют Я.Метрике сопоставить клик с конкретным объявлением. Но это работает только в связке Я.Директ + Я.Метрика. Для остальных систем (Revroute, GA4, Roistat) нужны явные UTM-метки. Безопаснее использовать оба — yclid от Я.Директа сам подставится, а UTM — для всех остальных систем.',
  },
  {
    q: 'В чём разница между utm_term и utm_content?',
    a: 'utm_term — это ключевое слово или сегмент аудитории (часто заполняется автоматически в Я.Директе и Google Ads). utm_content — это вариант креатива: баннер «А» vs баннер «B», красная кнопка vs синяя, текст 1 vs текст 2. Используйте utm_content, когда хотите сравнить варианты в A/B-тесте; utm_term — когда хотите понять, по какому запросу пришёл пользователь.',
  },
  {
    q: 'Я.Метрика и Google Analytics 4 читают UTM по-разному?',
    a: 'Базовые UTM (source, medium, campaign, term, content) читают одинаково. Разница в трактовке source/medium: GA4 строже придерживается «правильных» значений (organic, paid, referral), Я.Метрика более гибкая. Главное — единый стандарт внутри команды: один сервис называется одинаково в Я.Метрике и в GA4, иначе отчёты будут расходиться.',
  },
  {
    q: 'Как UTM сохраняются в короткой ссылке?',
    a: 'Все query-параметры (включая utm_*) сохраняются при переадресации через короткие ссылки Revroute. Создаёте длинный URL с UTM, сокращаете через Revroute Links — пользователь, перешедший по короткой ссылке, попадает на целевую страницу с полной разметкой UTM. Это работает на всех тарифах, включая Free.',
  },
  {
    q: 'Что делать, если URL уже содержит query-параметры?',
    a: 'UTM-конструктор автоматически добавляет метки через корректный разделитель: если в URL уже есть ?param=value, новые параметры присоединяются через &. Можно безопасно размечать любые URL — например, страницы с фильтрами товаров или результатами поиска. Главное — не дублировать имена параметров.',
  },
  {
    q: 'Как поддерживать единый стандарт UTM в команде?',
    a: 'Заведите внутренний документ-справочник: единые имена для utm_source (всегда yandex, не Yandex и не яндекс), единые типы medium (cpc для контекстной, social для соцсетей, email для рассылок), правила именования campaign (spring-sale-2026, а не SaleSpring или весенняя_распродажа). В Revroute Links UTM-шаблоны закрепляются на уровне рабочего пространства — команда генерирует размеченные ссылки в один клик с правильным стандартом.',
  },
  {
    q: 'Сохраняются ли UTM при редиректе с www на не-www или с http на https?',
    a: 'Да, если редирект настроен корректно (301 или 302 с сохранением query-string). Большинство современных серверов и CDN передают query-параметры при переадресации, но проверять имеет смысл: разметьте тестовую ссылку с UTM, пройдите по полной цепочке редиректов и проверьте в Я.Метрике или GA4, что параметры дошли.',
  },
]

export default function UtmToolPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Инструменты' },
            { name: 'UTM-конструктор' },
          ]),
          webApplication({
            name: 'UTM-конструктор Revroute',
            url: '/tools/utm',
            description:
              'Бесплатный конструктор UTM-меток для ссылок: соберите правильно размеченные ссылки для Яндекс.Директа, Google Ads, таргетированной рекламы, ВКонтакте, Telegram Ads и email-рассылок за секунды. Без регистрации.',
          }),
          howTo({
            name: 'Как разметить ссылку UTM-метками',
            description:
              'Пошаговая инструкция по созданию ссылки с UTM-параметрами для рекламной кампании, email-рассылки или поста в соцсетях.',
            totalTime: 'PT1M',
            steps: howToSteps.map((s) => ({ ...s, url: '/tools/utm' })),
          }),
          faqPage(faqItems),
        ]}
      />

      <PageHero
        eyebrow="Бесплатный инструмент"
        eyebrowColor="blue"
        title={
          <>
            UTM-<em style={{ fontStyle: 'italic' }}>конструктор</em>
          </>
        }
        desc="Соберите ссылку с UTM-метками за секунды и скопируйте её в буфер. Подходит для Яндекс.Директа, VK Ads, Telegram Ads, email-рассылок и постов у инфлюенсеров. Без регистрации."
      />

      <section style={{ padding: '20px 0 60px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <UtmBuilder />
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Как разметить ссылку</Eyebrow>
            <SectionHeading className="mt-5">
              Четыре шага — <em style={{ fontStyle: 'italic' }}>и ссылка готова</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Минимальная разметка — три параметра: source, medium, campaign. Пять параметров —
              полный стандарт. Конструктор подскажет рабочие комбинации под популярные платформы.
            </SectionDesc>
          </div>
          <ol className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
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
            <Eyebrow color="orange">Под какие каналы</Eyebrow>
            <SectionHeading className="mt-5">
              Шесть популярных <em style={{ fontStyle: 'italic' }}>сценариев</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              UTM — единственный способ свести оплаченный, органический, email- и партнёрский трафик
              в одну сравнимую картину. Ниже — стандартные комбинации параметров под популярные каналы.
            </SectionDesc>
          </div>
          <FeatureGrid cards={useCases} cols={3} />
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Стандарты разметки</Eyebrow>
            <SectionHeading className="mt-5">
              UTM-метки <em style={{ fontStyle: 'italic' }}>под 15 каналов</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Рекомендованные комбинации <code>utm_source</code> и <code>utm_medium</code> для популярных
              каналов в России. Закрепите эти стандарты в редполитике, чтобы отчёты в Я.Метрике и GA4
              были сравнимы между кампаниями и периодами.
            </SectionDesc>
          </div>
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse text-sm"
              style={{
                background: 'var(--bg-white)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              <thead>
                <tr style={{ background: 'var(--bg-muted)' }}>
                  {['Канал', 'utm_source', 'utm_medium', 'Пример campaign'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase"
                      style={{
                        color: 'var(--text-dim)',
                        letterSpacing: '0.06em',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {utmStandards.map((s, j) => (
                  <tr key={j}>
                    <td
                      className="px-3 py-2.5 align-top text-sm"
                      style={{
                        borderBottom: j === utmStandards.length - 1 ? 'none' : '1px solid var(--border)',
                        color: 'var(--text)',
                        fontWeight: 600,
                      }}
                    >
                      {s.channel}
                    </td>
                    <td
                      className="px-3 py-2.5 align-top font-mono text-xs"
                      style={{
                        borderBottom: j === utmStandards.length - 1 ? 'none' : '1px solid var(--border)',
                        color: 'var(--blue)',
                      }}
                    >
                      {s.source}
                    </td>
                    <td
                      className="px-3 py-2.5 align-top font-mono text-xs"
                      style={{
                        borderBottom: j === utmStandards.length - 1 ? 'none' : '1px solid var(--border)',
                        color: 'var(--purple)',
                      }}
                    >
                      {s.medium}
                    </td>
                    <td
                      className="px-3 py-2.5 align-top font-mono text-xs"
                      style={{
                        borderBottom: j === utmStandards.length - 1 ? 'none' : '1px solid var(--border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {s.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <div className="mb-10">
            <Eyebrow color="orange">Частые ошибки</Eyebrow>
            <SectionHeading className="mt-5">
              Пять <em style={{ fontStyle: 'italic' }}>типовых ошибок</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Большинство «странных» отчётов в аналитике — следствие одной из пяти ошибок ниже. Все они
              лечатся за минуту, но требуют внимания на этапе создания ссылки.
            </SectionDesc>
          </div>
          <div className="flex flex-col gap-4">
            {utmMistakes.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4 border p-5 max-md:grid-cols-1"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  className="border p-3"
                  style={{
                    background: 'rgba(239, 68, 68, 0.04)',
                    borderColor: 'rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    className="mb-2 text-[11px] font-bold uppercase"
                    style={{ color: '#ef4444', letterSpacing: '0.06em' }}
                  >
                    ❌ Неправильно
                  </div>
                  <code className="block break-all text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {m.bad}
                  </code>
                </div>
                <div
                  className="border p-3"
                  style={{
                    background: 'rgba(22, 163, 74, 0.04)',
                    borderColor: 'rgba(22, 163, 74, 0.25)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    className="mb-2 text-[11px] font-bold uppercase"
                    style={{ color: 'var(--green)', letterSpacing: '0.06em' }}
                  >
                    ✓ Правильно
                  </div>
                  <code className="block break-all text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {m.good}
                  </code>
                </div>
                <div
                  className="col-span-2 text-sm leading-relaxed max-md:col-span-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>Почему: </span>
                  {m.why}
                </div>
              </div>
            ))}
          </div>
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
            Хотите <em style={{ fontStyle: 'italic' }}>большего</em>?
          </>
        }
        desc="В Revroute Links UTM-шаблоны закрепляются на уровне рабочего пространства, ссылки работают как короткие, а конверсии падают в аналитику автоматически. Бесплатно: 1 000 ссылок и 50 000 кликов в месяц."
        primary={{ href: '/links', label: 'О продукте «Ссылки»' }}
        secondary={{ href: 'https://app.revroute.ru/', label: 'Начать бесплатно' }}
      />
    </>
  )
}

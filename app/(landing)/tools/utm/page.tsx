import type { Metadata } from 'next'
import { UtmBuilder } from '@/components/ds/UtmBuilder'
import { CtaBottom } from '@/components/ds/CtaBottom'
import { FaqList } from '@/components/ds/FaqList'
import { Steps } from '@/components/ds/Steps'
import { Eyebrow, Icon } from '@/components/ds/primitives'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, howTo, webApplication } from '@/lib/seo/schemas'
import { og } from '@/lib/seo/og'

export const metadata: Metadata = {
  title: 'UTM-конструктор — бесплатно, без регистрации',
  description: 'Соберите ссылку с UTM-метками: шаблоны каналов, редактирование готовой разметки, сохранение параметров и якоря. Бесплатно, без регистрации.',
  alternates: { canonical: '/tools/utm' },
  openGraph: {
    ...og('/tools/utm'),
    title: 'UTM-конструктор — бесплатно, без регистрации',
    description: 'Разметьте ссылку для рекламы, рассылки или поста. Шаблоны каналов и проверка основных меток прямо в браузере.',
  },
}

const howToSteps = [
  { name: 'Вставьте адрес страницы', text: 'Добавьте страницу, на которую ведёте трафик. Если в ссылке уже есть UTM-метки, они появятся в полях для редактирования.', icon: 'link-2' },
  { name: 'Выберите канал и кампанию', text: 'Шаблон заполнит источник и канал. Укажите своё название кампании, а при необходимости — вариант объявления и ключевое слово.', icon: 'sliders' },
  { name: 'Скопируйте и проверьте', text: 'Вставьте готовую ссылку в объявление, письмо или пост. Перед запуском откройте её и убедитесь, что после редиректов метки доходят до страницы.', icon: 'check' },
]

const standards = [
  { channel: 'Яндекс.Директ — поиск', source: 'yandex', medium: 'cpc', campaign: 'search-brand-2026' },
  { channel: 'Яндекс.Директ — РСЯ', source: 'yandex', medium: 'cpc', campaign: 'rsya-retargeting-2026' },
  { channel: 'VK Реклама — клики', source: 'vk_ads', medium: 'cpc', campaign: 'vk-leads-autumn' },
  { channel: 'VK Реклама — охват', source: 'vk_ads', medium: 'cpm', campaign: 'vk-awareness' },
  { channel: 'Telegram Ads', source: 'telegram_ads', medium: 'cpc', campaign: 'tg-ads-autumn' },
  { channel: 'Пост в Telegram', source: 'telegram', medium: 'messenger', campaign: 'channel-post' },
  { channel: 'Email — SendPulse', source: 'sendpulse', medium: 'email', campaign: 'newsletter-2026-10' },
  { channel: 'Email — Mindbox', source: 'mindbox', medium: 'email', campaign: 'cart-reminder' },
  { channel: 'Push-уведомление', source: 'push', medium: 'notification', campaign: 'friday-offer' },
  { channel: 'Пост у блогера', source: 'blogger-name', medium: 'social', campaign: 'autumn-launch' },
  { channel: 'Stories у блогера', source: 'blogger-name', medium: 'social', campaign: 'autumn-launch' },
  { channel: 'Описание видео YouTube', source: 'youtube', medium: 'social', campaign: 'video-launch' },
  { channel: 'Статья на внешнем сайте', source: 'publication-name', medium: 'referral', campaign: 'guest-article' },
  { channel: 'Партнёрская публикация', source: 'partner-name', medium: 'referral', campaign: 'partner-launch' },
  { channel: 'QR на постере', source: 'offline', medium: 'qr', campaign: 'event-2026' },
]

const faqItems = [
  {
    q: 'Что UTM-метки дают, а чего не дают?',
    a: 'UTM описывают источник, канал и кампанию, из которых пришёл посетитель. Система аналитики на целевой странице читает эти значения. Сами метки не считают клики, не измеряют продажи и не устанавливают аналитику: для этого нужны счётчик, события и настроенные конверсии.',
  },
  {
    q: 'Какие поля нужно заполнить?',
    a: 'Этот конструктор проверяет три основные метки: utm_source, utm_medium и utm_campaign. Так у ссылки есть источник, канал и название кампании. Вариант объявления (utm_content) и ключевое слово (utm_term) необязательны. Требования конкретных систем могут отличаться; Google рекомендует заполнять все три основные метки.',
  },
  {
    q: 'Что произойдёт с метками, которые уже есть в ссылке?',
    a: 'Пять основных UTM-меток подставятся в поля. Изменённое значение заменит прежнее, пустое поле уберёт метку. Повторы и варианты имени с разным регистром объединяются в одну метку с именем в нижнем регистре. Остальные параметры, включая utm_id, utm_source_platform и click ID, сохраняются.',
  },
  {
    q: 'Можно ли использовать кириллицу, пробелы и подчёркивания?',
    a: 'Да, конструктор кодирует текст для передачи в URL. Подчёркивание не является ошибкой. Для команды удобнее выбрать единый стиль, например autumn-sale-2026, и соблюдать его. Значения чувствительны к регистру: Yandex и yandex могут оказаться разными строками в отчёте. Конструктор не меняет язык и регистр за вас.',
  },
  {
    q: 'Шаблоны каналов — это обязательный стандарт?',
    a: 'Это стартовые значения, которые можно изменить под правила вашей команды. Группировка каналов зависит от системы аналитики: например, messenger и qr распознаются Метрикой, а в GA4 могут потребовать своей группы каналов. Для конкретного партнёра или блогера укажите узнаваемое имя в utm_source, чтобы отличать его от других.',
  },
  {
    q: 'Можно ли использовать {keyword} и другие динамические параметры?',
    a: 'Да, макросы в фигурных скобках сохраняются в готовой ссылке. Например, Яндекс.Директ может подставить ключевую фразу вместо {keyword}. Используйте только макросы, которые поддерживает ваша рекламная площадка: этот инструмент собирает ссылку, но не подставляет рекламные данные.',
  },
  {
    q: 'Нужны ли UTM, если включена автоматическая разметка рекламы?',
    a: 'Зависит от системы и задачи. Автоматическая разметка помогает связанной аналитике получить данные рекламной площадки; UTM полезны для общей схемы именования и других систем. Не вписывайте yclid или gclid вручную: площадки добавляют click ID сами. Существующие click ID конструктор сохраняет.',
  },
  {
    q: 'Стоит ли размечать ссылки между страницами своего сайта?',
    a: 'Используйте UTM для входящих ссылок из рекламы, писем и внешних публикаций. Для сравнения внутренних кнопок и баннеров настройте события аналитики. Так внешняя кампания и действие посетителя внутри сайта остаются отдельными измерениями.',
  },
  {
    q: 'Как сделать размеченную ссылку короткой?',
    a: 'Скопируйте результат и вставьте его в бесплатный сокращатель RevRoute. При переходе короткая ссылка должна передавать UTM на целевую страницу. Перед публикацией проверьте конечный адрес: редиректы вашего сайта тоже должны сохранять параметры.',
  },
  {
    q: 'Ссылка сохраняется или отправляется на сервер?',
    a: 'Конструктор собирает ссылку в браузере. Для этой операции не нужен аккаунт и не вызывается API. После обновления страницы поля очистятся. Готовую ссылку можно скопировать и хранить в своей таблице кампаний.',
  },
]

export default function UtmToolPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbs([{ name: 'Главная', url: '/' }, { name: 'Бесплатные инструменты', url: '/tools' }, { name: 'UTM-конструктор' }]),
        webApplication({ name: 'UTM-конструктор RevRoute', url: '/tools/utm', description: metadata.description as string, permissions: 'No registration required' }),
        howTo({ name: 'Как разметить ссылку UTM-метками', description: 'Добавьте адрес страницы, выберите канал и кампанию, скопируйте размеченную ссылку.', totalTime: 'PT1M', steps: howToSteps.map(({ name, text }) => ({ name, text, url: '/tools/utm' })) }),
        faqPage(faqItems),
      ]} />

      <section className="ds-container rr-utm-hero">
        <Eyebrow style={{ justifyContent: 'center' }}>Бесплатно · без регистрации</Eyebrow>
        <h1 className="rr-h1" style={{ marginTop: 16 }}>UTM-конструктор</h1>
        <p className="rr-lead">Разметьте ссылку для рекламы, рассылки или поста, чтобы различать источники и кампании в аналитике.</p>
      </section>

      <section className="ds-container" aria-label="Конструктор UTM-меток">
        <UtmBuilder />
      </section>

      <section className="ds-container ds-band">
        <Eyebrow>Как пользоваться</Eyebrow>
        <h2 className="rr-h2" style={{ marginTop: 14 }}>От адреса до готовой ссылки</h2>
        <Steps steps={howToSteps.map(({ icon, name, text }) => ({ icon, title: name, body: text }))} style={{ marginTop: 28 }} />
      </section>

      <section className="ds-container" style={{ paddingBottom: 64 }}>
        <Eyebrow>Чтобы отчётам можно было доверять</Eyebrow>
        <h2 className="rr-h2" style={{ marginTop: 14 }}>Смысл меток — в единых правилах</h2>
        <div className="ds-grid-3 rr-utm-guide">
          {[
            { icon: 'list-checks', title: 'Одно имя на всю кампанию', body: 'Используйте одинаковый utm_campaign во всех её размещениях. Источник укажет площадку, а utm_content поможет сравнить варианты.' },
            { icon: 'mouse-pointer-click', title: 'Размечайте входящий трафик', body: 'UTM — для рекламы, писем и внешних публикаций. Клики по кнопкам внутри сайта измеряйте отдельными событиями.' },
            { icon: 'bar-chart-3', title: 'Проверьте сбор данных', body: 'На целевой странице должен работать счётчик. Метки отвечают «откуда пришли», а настроенные события и конверсии — «что сделали».' },
          ].map(({ icon, title, body }) => (
            <div key={title} className="card-flat">
              <Icon name={icon} size={24} color="var(--accent-strong)" />
              <h3 className="rr-h3" style={{ marginTop: 18 }}>{title}</h3>
              <p className="rr-small" style={{ margin: '12px 0 0' }}>{body}</p>
            </div>
          ))}
        </div>

        <details className="rr-utm-standard" style={{ marginTop: 28 }}>
          <summary>Примеры разметки для 15 каналов<Icon name="chevron-down" size={20} /></summary>
          <p className="rr-small" style={{ padding: '0 24px 16px', margin: 0 }}>Стартовые значения для своей схемы. Названия кампаний замените на ваши; правила группировки каналов проверьте в выбранной аналитике.</p>
          <div className="rr-utm-table-scroll" tabIndex={0} role="region" aria-label="Таблица примеров UTM-разметки">
            <table>
              <caption className="sr-only">Примеры значений UTM для рекламных каналов и внешних размещений</caption>
              <thead><tr><th scope="col">Размещение</th><th scope="col">utm_source</th><th scope="col">utm_medium</th><th scope="col">utm_campaign</th></tr></thead>
              <tbody>{standards.map((item) => <tr key={item.channel}><th scope="row">{item.channel}</th><td>{item.source}</td><td>{item.medium}</td><td>{item.campaign}</td></tr>)}</tbody>
            </table>
          </div>
        </details>
        <p className="rr-utm-sources">
          <span>Справка по разметке:</span>
          <a href="https://yandex.ru/support/metrica/ru/general/source-tags" target="_blank" rel="noopener noreferrer">Яндекс.Метрика</a>
          <a href="https://support.google.com/analytics/answer/10917952?hl=ru" target="_blank" rel="noopener noreferrer">Google Analytics</a>
          <a href="/blog/utm-in-yandex-direct-2026">Инструкция для Яндекс.Директа</a>
        </p>
      </section>

      <section className="ds-container" style={{ paddingBottom: 64 }}>
        <Eyebrow>Вопросы о разметке</Eyebrow>
        <h2 className="rr-h2" style={{ marginTop: 14, marginBottom: 28 }}>Перед запуском кампании</h2>
        <FaqList items={faqItems} />
        <p className="rr-small" style={{ marginTop: 24 }}>
          Ссылка готова? <a href="/tools/link-shortener" style={{ color: 'var(--accent-strong)', textUnderlineOffset: 3 }}>Сократите её бесплатно</a> или используйте в <a href="/tools/qr" style={{ color: 'var(--accent-strong)', textUnderlineOffset: 3 }}>QR-коде</a>.
        </p>
      </section>

      <section className="ds-container" style={{ paddingBottom: 24 }}>
        <CtaBottom title="Единая разметка для команды" body="Закрепите UTM-шаблоны в рабочем пространстве RevRoute Links. Создавайте короткие ссылки с общей схемой именования и смотрите статистику переходов." primary={{ label: 'Открыть RevRoute Links', href: 'https://app.revroute.ru/register' }} secondary={{ label: 'Возможности продукта', href: '/links' }} />
      </section>
    </>
  )
}

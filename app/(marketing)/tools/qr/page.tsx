import type { Metadata } from 'next'
import { QrBuilder } from '@/components/marketing/tools/QrBuilder'
import { PageHero } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, howTo, webApplication } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'QR-код — бесплатный генератор Revroute',
  description:
    'Генерируйте QR-коды для ссылок, визиток и промо-материалов. Настраиваемый размер, PNG/SVG, без регистрации.',
  alternates: { canonical: '/tools/qr' },
  openGraph: { url: '/tools/qr' },
}

const howToSteps = [
  {
    name: 'Вставьте URL',
    text: 'Скопируйте ссылку из адресной строки и вставьте в поле ввода. Подойдёт любой http(s)-адрес — короткая ссылка, посадочная страница, профиль в соцсети, форма обратной связи.',
  },
  {
    name: 'Выберите формат и размер',
    text: 'PNG для соцсетей и презентаций, SVG — для печати, визиток, упаковки и баннеров. Размер задаётся в пикселях; для печати ориентируйтесь на ≥300 пикселей на 2 см изображения.',
  },
  {
    name: 'Скачайте и используйте',
    text: 'Файл загружается в один клик. Проверьте сканирование с расстояния, на котором его будут видеть пользователи, прежде чем отправлять в печать или публикацию.',
  },
]

const useCases = [
  {
    title: 'Визитки и нетворкинг',
    desc: 'Контакт, портфолио, Telegram-канал или LinkedIn — без перепечатывания. На визитке QR работает как «один клик» вместо ввода адреса вручную.',
  },
  {
    title: 'Упаковка и POS-материалы',
    desc: 'QR на коробке, ценнике или флаере ведёт на инструкцию, акцию или каталог. Удобнее для покупателя, чем длинный URL.',
  },
  {
    title: 'Постеры и наружная реклама',
    desc: 'Билборды, лифты, кофейни — QR превращает оффлайн-показ в измеримый источник трафика. С UTM-меткой кампания попадает в аналитику.',
  },
  {
    title: 'Меню и буклеты ресторанов',
    desc: 'QR на столе ведёт на цифровое меню — экономия на печати при смене блюд и цен. Динамический QR в Revroute позволяет менять целевой URL без перепечатки.',
  },
  {
    title: 'Telegram-каналы и сообщества',
    desc: 'QR с прямой ссылкой на канал в карточке мероприятия, на стенде или в презентации. Один QR — и аудитория за вашим контентом.',
  },
  {
    title: 'Платежи и формы',
    desc: 'QR с предзаполненной формой оплаты, заявкой или анкетой ускоряет конверсию: пользователь не вводит данные вручную, а сразу попадает на нужный шаг.',
  },
]

const faqItems = [
  {
    q: 'Что такое QR-код и как он работает?',
    a: 'QR-код (Quick Response code) — двумерный штрихкод, кодирующий текст, URL, номер телефона или другую короткую строку. Камера смартфона сканирует код и предлагает открыть зашитую в нём ссылку или скопировать данные. Современные iOS и Android распознают QR без отдельного приложения — через стандартную камеру.',
  },
  {
    q: 'Какой формат выбрать: PNG или SVG?',
    a: 'PNG — растровая графика, подходит для соцсетей, презентаций, сайтов и e-mail рассылок. SVG — векторная графика, масштабируется без потери качества: используйте для печати визиток, упаковки, постеров и баннеров любого размера. Если планируете печать — выбирайте SVG.',
  },
  {
    q: 'Есть ли ограничение на длину ссылки внутри QR?',
    a: 'Теоретический предел QR — около 4 296 символов алфавита и цифр, но на практике чем длиннее данные, тем плотнее «узор» и тем хуже QR считывается с расстояния. Для печати рекомендуем держать URL до 50–80 символов. Если ссылка длинная — сократите её через бесплатный сокращатель Revroute и закодируйте короткий URL.',
  },
  {
    q: 'Можно ли менять целевую ссылку после печати QR-кода?',
    a: 'У статического QR (как в этом генераторе) — нет: целевой URL зашит внутрь изображения. Чтобы менять назначение без перепечатки QR, нужен динамический QR: код ведёт на короткую ссылку Revroute, а вы меняете её целевой URL в кабинете. Динамические QR подключаются на тарифах Revroute Links и подходят для печатных материалов, упаковки и наружной рекламы.',
  },
  {
    q: 'Какой минимальный размер QR для печати?',
    a: 'Эмпирическое правило — сторона QR должна быть не меньше 1/10 расстояния, с которого его будут сканировать. Для визитки (с расстояния 30 см) хватает 2–3 см. Для постера на стене (с 2 м) нужно 20+ см. Для билборда — от 50 см. Всегда тестируйте на реальном расстоянии и при разном освещении.',
  },
  {
    q: 'Какие цвета и контрастность допустимы?',
    a: 'Камера читает QR через контраст между «модулями» (тёмными квадратами) и фоном. Тёмный QR на светлом фоне работает лучше всего; обратный (светлый на тёмном) — иногда не распознаётся старыми сканерами. Не используйте близкие по тону цвета (например, серый на белом). Минимальный контраст по WCAG для AA — 4.5:1; для QR лучше брать с запасом 7:1.',
  },
  {
    q: 'Что делать, если QR не сканируется?',
    a: 'Четыре частые причины: (1) слишком маленький размер для расстояния сканирования; (2) низкий контраст между QR и фоном; (3) очень длинная ссылка — плотный «узор» теряет читаемость; (4) повреждение или замятие на печати. Решения: увеличить размер, повысить контраст, сократить URL, перепечатать на бумаге без бликов.',
  },
  {
    q: 'Можно ли добавить логотип в центр QR-кода?',
    a: 'Да, QR-стандарт позволяет до 30% «потерянных» данных за счёт встроенной коррекции ошибок (уровень H). Логотип в центре занимает 10–15% площади и обычно безопасен. В этом бесплатном генераторе логотип не вшивается — для брендированного QR с логотипом и фирменным цветом используйте Revroute Links: динамический QR с лого подключается даже на тарифе Free.',
  },
  {
    q: 'Есть ли статистика сканов в этом инструменте?',
    a: 'В бесплатном статическом QR-генераторе — нет: код хранит URL внутри себя, и сервер Revroute не участвует в каждом сканировании. Чтобы видеть, кто, когда и откуда сканирует QR-код, используйте динамический QR: код ведёт на короткую ссылку Revroute, а Revroute Analytics фиксирует все клики с разрезом по гео, устройству и реферу.',
  },
  {
    q: 'Безопасно ли передавать через QR конфиденциальные данные?',
    a: 'Нет — QR-код легко скопировать и распечатать, поэтому он не подходит для паролей, токенов, медицинских данных. Безопасно: ссылка на публичную страницу, контакты, номер телефона, ссылка на форму с собственной авторизацией. Если нужна приватная информация — отдавайте через персональную ссылку с авторизацией, а QR — только как «навигатор» к ней.',
  },
]

export default function QrToolPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Инструменты' },
            { name: 'QR-генератор' },
          ]),
          webApplication({
            name: 'QR-генератор Revroute',
            url: '/tools/qr',
            description:
              'Бесплатный онлайн-генератор QR-кодов для ссылок, визиток и промо-материалов. Настраиваемый размер, экспорт в PNG и SVG, без регистрации.',
          }),
          howTo({
            name: 'Как создать QR-код для ссылки',
            description:
              'Пошаговая инструкция по созданию QR-кода в бесплатном генераторе Revroute: вставьте URL, выберите формат и размер, скачайте файл.',
            totalTime: 'PT30S',
            steps: howToSteps.map((s) => ({ ...s, url: '/tools/qr' })),
          }),
          faqPage(faqItems),
        ]}
      />

      <PageHero
        eyebrow="Бесплатный инструмент"
        eyebrowColor="green"
        title={
          <>
            QR-<em style={{ fontStyle: 'italic' }}>генератор</em>
          </>
        }
        desc="Создайте QR-код под любую ссылку за пару секунд. Скачайте PNG или SVG и используйте в промо-материалах, визитках, упаковке и наружной рекламе."
      />

      <section style={{ padding: '20px 0 60px' }}>
        <div className="mx-auto max-w-[860px] px-6">
          <QrBuilder />
        </div>
      </section>

      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Как это работает</Eyebrow>
            <SectionHeading className="mt-5">
              Три шага — <em style={{ fontStyle: 'italic' }}>и QR готов</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Никаких регистраций и форм. Вставьте ссылку, выберите формат и сохраните файл — за полминуты.
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
            <Eyebrow color="orange">Когда используют QR</Eyebrow>
            <SectionHeading className="mt-5">
              Шесть популярных <em style={{ fontStyle: 'italic' }}>сценариев</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              QR-код превращает любой оффлайн-носитель в измеримую точку входа: на визитке, упаковке,
              билборде, в меню или презентации. С UTM-меткой каждое сканирование попадает в аналитику.
            </SectionDesc>
          </div>
          <FeatureGrid cards={useCases} cols={3} />
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
            Динамические <em style={{ fontStyle: 'italic' }}>QR</em>
          </>
        }
        desc="В Revroute Links QR крепится к короткой ссылке — меняйте целевой URL без перепечатки баннеров. Брендированный QR с логотипом и фирменным цветом подключается даже на тарифе Free."
        primary={{ href: '/links', label: 'Подробнее о /links' }}
        secondary={{ href: 'https://app.revroute.ru/', label: 'Создать аккаунт' }}
      />
    </>
  )
}

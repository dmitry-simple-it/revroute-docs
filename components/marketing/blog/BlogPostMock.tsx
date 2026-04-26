import type { ReactNode } from 'react'

export type BlogMockVariant =
  | 'social-bounty'
  | 'bounties-program'
  | 'email-campaigns'
  | 'utm-sheet'
  | 'utm-inspector'
  | 'links-routing'
  | 'events-stream'
  | 'webhook-setup'
  | 'report-bonus-vs-core'
  | 'bounty-review-queue'
  | 'partner-week-launch'
  | 'safari-tracking-split'
  | 'campaign-link-checklist'
  | 'customer-profile-card'

const shellClass =
  'overflow-hidden border shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] max-md:text-[13px]'

export function BlogPostMock({ variant }: { variant: BlogMockVariant }) {
  return (
    <figure className="my-10 not-prose">
      <div
        className={shellClass}
        style={{
          borderRadius: 'var(--radius-xl)',
          borderColor: 'var(--border)',
          background: 'var(--bg-white)',
        }}
      >
        <div
          className="flex items-center gap-2 border-b px-4 py-2.5"
          style={{ borderColor: 'var(--border-light, #f5f5f4)', background: '#fafaf9' }}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-[11px] font-medium" style={{ color: 'var(--text-dim)' }}>
            app.revroute.ru — предпросмотр
          </span>
        </div>
        <div className="p-4 md:p-5">{renderBody(variant)}</div>
      </div>
      <figcaption className="mt-2 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        {captionFor(variant)}
      </figcaption>
    </figure>
  )
}

function captionFor(v: BlogMockVariant): string {
  switch (v) {
    case 'social-bounty':
      return 'Схема настройки бонуса за охват в соцсетях (иллюстрация, не реальный интерфейс).'
    case 'bounties-program':
      return 'Типы вознаграждений за задания в партнёрской программе (иллюстрация).'
    case 'email-campaigns':
      return 'Цепочка писем для партнёров: от первого входа до напоминаний (иллюстрация).'
    case 'utm-sheet':
      return 'Единый шаблон меток кампании (UTM) для команды (иллюстрация).'
    case 'links-routing':
      return 'Правила маршрутизации короткой ссылки (иллюстрация).'
    case 'events-stream':
      return 'Поток событий в реальном времени (иллюстрация).'
    case 'webhook-setup':
      return 'Подключение исходящего уведомления по HTTP (иллюстрация).'
    case 'utm-inspector':
      return 'Проверка ссылки перед запуском: параметры и предпросмотр (иллюстрация).'
    case 'report-bonus-vs-core':
      return 'Раздельный учёт бонусов и основной комиссии в отчёте (иллюстрация).'
    case 'bounty-review-queue':
      return 'Очередь заявок на вознаграждение за задание (иллюстрация).'
    case 'partner-week-launch':
      return 'План запуска партнёрской программы по дням (иллюстрация).'
    case 'safari-tracking-split':
      return 'Клиентский и серверный контур атрибуции (иллюстрация).'
    case 'campaign-link-checklist':
      return 'Чек-лист перед запуском короткой ссылки (иллюстрация).'
    case 'customer-profile-card':
      return 'Карточка клиента: сводка и таймлайн (иллюстрация).'
    default:
      return ''
  }
}

function renderBody(v: BlogMockVariant) {
  switch (v) {
    case 'social-bounty':
      return (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Партнёрская программа · Бонусы
          </div>
          <div className="text-base font-semibold">Бонус за охват в соцсетях</div>
          <div className="grid gap-2 md:grid-cols-2">
            <Field label="Порог просмотров" value="250 000" />
            <Field label="Лимит выплат в месяц" value="150 000 ₽" />
            <Field label="Платформа" value="YouTube, Telegram, VK" />
            <Field label="Доказательство" value="Ссылка на пост + скрин статистики" />
          </div>
          <div className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            Подсказка: бонус сочетайте с основной комиссией за продажу, чтобы не платить дважды за один и тот же результат.
          </div>
        </div>
      )
    case 'bounties-program':
      return (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Программа · Задания
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ color: 'var(--text-dim)' }}>
                <th className="pb-2 font-medium">Тип</th>
                <th className="pb-2 font-medium">Условие</th>
                <th className="pb-2 font-medium text-right">Вознаграждение</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-light, #f5f5f4)' }}>
              <Row type="За результат" cond="100 регистраций за 14 дней" reward="80 000 ₽" />
              <Row type="За материал" cond="Обзор + публикация" reward="25 000 ₽" />
              <Row type="Смешанный" cond="Пост + 50 000 просмотров" reward="40 000 ₽" />
            </tbody>
          </table>
        </div>
      )
    case 'email-campaigns':
      return (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Рассылки · Цепочка
          </div>
          <ol className="space-y-2 text-sm">
            <Step n={1} title="Добро пожаловать" desc="Ссылки, комиссии, первые шаги" active />
            <Step n={2} title="Напоминание" desc="Если нет кликов за 5 дней" />
            <Step n={3} title="Еженедельная сводка" desc="Клики, конверсии, начисления" />
            <Step n={4} title="Новый оффер" desc="Повышенная ставка на неделю" />
          </ol>
        </div>
      )
    case 'utm-sheet':
      return (
        <div className="space-y-3 font-mono text-[13px] leading-relaxed">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Шаблон меток (UTM)
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border)', background: '#fafaf9' }}>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>utm_source=</span>telegram
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>utm_medium=</span>partner
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>utm_campaign=</span>spring_2026
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>utm_content=</span>post_video_01
            </div>
          </div>
        </div>
      )
    case 'links-routing':
      return (
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Короткая ссылка · Правила
          </div>
          <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="font-medium">revroute.ru/go/demo</div>
            <ul className="mt-2 space-y-1.5" style={{ color: 'var(--text-muted)' }}>
              <li>· По умолчанию → посадочная A</li>
              <li>· Мобильные устройства → посадочная B</li>
              <li>· Из РФ → версия на русском</li>
            </ul>
          </div>
        </div>
      )
    case 'events-stream':
      return (
        <div className="space-y-2 font-mono text-[12px] md:text-[13px]">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            События · сейчас
          </div>
          <StreamLine time="14:02:11" kind="click" detail="revroute.ru/go/camp1 · RU · Safari" />
          <StreamLine time="14:02:09" kind="conv" detail="Регистрация · партнёр #4821" />
          <StreamLine time="14:02:04" kind="click" detail="revroute.ru/go/camp1 · DE · Chrome" />
          <StreamLine time="14:01:58" kind="warn" detail="Всплеск кликов +340% к среднему" />
        </div>
      )
    case 'webhook-setup':
      return (
        <div className="space-y-3 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Интеграции · Исходящий запрос
          </div>
          <Field label="Адрес получателя" value="https://api.example.com/revroute/events" />
          <Field label="События" value="клик, конверсия, выплата" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge>Подпись запроса</Badge>
            <Badge>Повтор при ошибке</Badge>
            <Badge>Журнал доставки</Badge>
          </div>
        </div>
      )
    case 'utm-inspector':
      return (
        <div className="space-y-3 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Ссылки · Инспектор
          </div>
          <div className="rounded-lg border px-3 py-2 font-mono text-[12px] break-all" style={{ borderColor: 'var(--border)', background: '#fafaf9' }}>
            https://revroute.ru/go/sale?utm_source=telegram&utm_medium=partner&utm_campaign=vesna_2026
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <MiniStat label="utm_source" value="telegram ✓" ok />
            <MiniStat label="utm_medium" value="partner ✓" ok />
            <MiniStat label="utm_campaign" value="vesna_2026 ✓" ok />
            <MiniStat label="Кодирование" value="без пробелов ✓" ok />
          </div>
        </div>
      )
    case 'report-bonus-vs-core':
      return (
        <div className="space-y-3 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Отчёт · Экономика канала
          </div>
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-3 gap-2 border-b bg-stone-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
              <span>Статья</span>
              <span className="text-right">Май</span>
              <span className="text-right">Июнь</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b px-3 py-2.5" style={{ borderColor: 'var(--border-light, #f5f5f4)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Бонусы за охват</span>
              <span className="text-right font-medium">420 000 ₽</span>
              <span className="text-right font-medium">380 000 ₽</span>
            </div>
            <div className="grid grid-cols-3 gap-2 px-3 py-2.5" style={{ color: 'var(--text-secondary)' }}>
              <span>Комиссия с продаж</span>
              <span className="text-right font-medium">1,2 млн ₽</span>
              <span className="text-right font-medium">1,4 млн ₽</span>
            </div>
          </div>
        </div>
      )
    case 'bounty-review-queue':
      return (
        <div className="space-y-2 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Задания · Очередь проверки
          </div>
          <QueueRow who="ИП Смирнов" what="Обзор на YouTube" status="На проверке" />
          <QueueRow who="ООО «Пиксель»" what="Лидоген: 120 рег." status="Ожидает чек" />
          <QueueRow who="Самозанятый Ким" what="Пост в Telegram" status="Выплачено" done />
        </div>
      )
    case 'partner-week-launch':
      return (
        <div className="space-y-2 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Запуск · 7 дней
          </div>
          <WeekRow day="Пн" task="Модель вознаграждения и лимиты" />
          <WeekRow day="Вт" task="Оффер, правила, запреты в тексте программы" />
          <WeekRow day="Ср" task="Ссылки, домен, превью, тестовый клик" />
          <WeekRow day="Чт" task="Публикация в маркетплейсе + письмо 20 партнёрам" />
          <WeekRow day="Пт" task="Разбор первых заявок и ответы в течение 24 ч" />
          <WeekRow day="Сб" task="Сводка по воронке и правки ставок" />
          <WeekRow day="Вс" task="План на вторую неделю: масштаб или стоп" />
        </div>
      )
    case 'safari-tracking-split':
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
              Только браузер
            </div>
            <ul className="mt-2 space-y-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li>· Короткая память о визите</li>
              <li>· Риск потери цепочки касаний</li>
              <li>· Сложнее оценить полную ценность клиента по рекламе</li>
            </ul>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: '#0ea5e9', background: 'rgba(14,165,233,0.06)' }}>
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#0369a1' }}>
              Сервер + ваш домен
            </div>
            <ul className="mt-2 space-y-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>· События фиксируются устойчиво</li>
              <li>· Единая картина по каналам</li>
              <li>· Партнёрка и маркетинг сходятся</li>
            </ul>
          </div>
        </div>
      )
    case 'campaign-link-checklist':
      return (
        <div className="space-y-2 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
            Кампания · Перед стартом
          </div>
          <CheckRow ok label="Домен и SSL" />
          <CheckRow ok label="Метки кампании (UTM) по шаблону" />
          <CheckRow ok label="Превью для соцсетей и мессенджеров" />
          <CheckRow ok label="Тестовый клик с телефона и ПК" />
          <CheckRow label="Запасной URL при недоступности основного" warn />
        </div>
      )
    case 'customer-profile-card':
      return (
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
                Клиент
              </div>
              <div className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Анна В. · сегмент «Подписка»
              </div>
            </div>
            <div className="rounded-lg border px-3 py-1.5 text-right" style={{ borderColor: 'var(--border)' }}>
              <div className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
                Пожизн. ценность
              </div>
              <div className="text-base font-bold">84 200 ₽</div>
            </div>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border)', background: '#fafaf9' }}>
            <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
              Таймлайн
            </div>
            <div className="mt-2 space-y-2 font-mono text-[12px]" style={{ color: 'var(--text-muted)' }}>
              <div>12 апр. · клик · партнёрская ссылка</div>
              <div>13 апр. · регистрация · пробный период</div>
              <div>27 апр. · оплата · тариф «Про»</div>
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}

function MiniStat({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="rounded-lg border p-2.5" style={{ borderColor: ok ? '#86efac' : 'var(--border)' }}>
      <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
        {label}
      </div>
      <div className="mt-0.5 font-mono text-[13px] font-medium" style={{ color: ok ? '#166534' : 'var(--text-secondary)' }}>
        {value}
      </div>
    </div>
  )
}

function QueueRow({ who, what, status, done }: { who: string; what: string; status: string; done?: boolean }) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
      style={{ borderColor: 'var(--border)', background: done ? 'rgba(34,197,94,0.06)' : 'transparent' }}
    >
      <div>
        <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>
          {who}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {what}
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color: done ? '#166534' : 'var(--text-muted)' }}>
        {status}
      </span>
    </div>
  )
}

function WeekRow({ day, task }: { day: string; task: string }) {
  return (
    <div className="flex gap-3 rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border)' }}>
      <span className="w-8 shrink-0 font-bold" style={{ color: 'var(--text-dim)' }}>
        {day}
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>{task}</span>
    </div>
  )
}

function CheckRow({ label, ok, warn }: { label: string; ok?: boolean; warn?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border)' }}>
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          background: ok ? '#dcfce7' : warn ? '#fef3c7' : '#f5f5f4',
          color: ok ? '#166534' : warn ? '#92400e' : 'var(--text-dim)',
        }}
      >
        {ok ? '✓' : warn ? '!' : '○'}
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border)' }}>
      <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
        {label}
      </div>
      <div className="mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
        {value}
      </div>
    </div>
  )
}

function Row({ type, cond, reward }: { type: string; cond: string; reward: string }) {
  return (
    <tr>
      <td className="py-2 pr-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
        {type}
      </td>
      <td className="py-2 pr-2" style={{ color: 'var(--text-muted)' }}>
        {cond}
      </td>
      <td className="py-2 text-right font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {reward}
      </td>
    </tr>
  )
}

function Step({ n, title, desc, active }: { n: number; title: string; desc: string; active?: boolean }) {
  return (
    <li
      className="flex gap-3 rounded-lg border p-3"
      style={{
        borderColor: active ? '#0ea5e9' : 'var(--border)',
        background: active ? 'rgba(14,165,233,0.06)' : 'transparent',
      }}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ background: '#e7e5e4', color: 'var(--text-muted)' }}
      >
        {n}
      </span>
      <div>
        <div className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {desc}
        </div>
      </div>
    </li>
  )
}

function StreamLine({ time, kind, detail }: { time: string; kind: string; detail: string }) {
  const kindRu =
    kind === 'click'
      ? 'клик'
      : kind === 'conv'
        ? 'конверсия'
        : kind === 'warn'
          ? 'сигнал'
          : kind
  return (
    <div className="flex flex-col gap-0.5 border-b pb-2 last:border-0" style={{ borderColor: 'var(--border-light, #f5f5f4)' }}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
        <span style={{ color: 'var(--text-dim)' }}>{time}</span>
        <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {kindRu}
        </span>
      </div>
      <div style={{ color: 'var(--text-muted)' }}>{detail}</div>
    </div>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      {children}
    </span>
  )
}

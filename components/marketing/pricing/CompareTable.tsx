import { Fragment } from 'react'

const Check = () => (
  <span
    className="inline-block w-5 h-5 rounded-full bg-[var(--green)]"
    style={{
      WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E") center/12px no-repeat`,
      mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'/%3E%3C/svg%3E") center/12px no-repeat`,
    }}
  />
)

const Dash = () => (
  <span className="inline-block w-4 h-0.5 rounded-sm bg-[var(--text-dim)]" />
)

type CellValue = 'check' | 'dash' | string

interface Row {
  label: string
  cols: CellValue[]
  bold?: boolean[]
}

interface Section {
  title: string
  rows: Row[]
}

interface Schema {
  headers: { title: string; subtitle: string; featured?: boolean }[]
  sections: Section[]
}

const partnerSchema: Schema = {
  headers: [
    { title: 'Business', subtitle: '2\u00a0450\u00a0\u20BD/мес' },
    { title: 'Advanced', subtitle: '9\u00a0999\u00a0\u20BD/мес', featured: true },
    { title: 'Enterprise', subtitle: 'Индивидуально' },
  ],
  sections: [
    {
      title: 'Партнёры',
      rows: [
        { label: 'Количество партнёров', cols: ['Безлимит', 'Безлимит', 'Безлимит'] },
        { label: 'Автоматические выплаты', cols: ['check', 'check', 'check'] },
        { label: 'Лимит выплат / мес', cols: ['250 000 ₽', '1 500 000 ₽', 'Безлимит'], bold: [true, true, true] },
        { label: 'Комиссия за выплаты', cols: ['5%', '5%', '3%'] },
        { label: 'Налоговый комплаенс', cols: ['check', 'check', 'check'] },
        { label: 'Структуры вознаграждений', cols: ['Базовые', 'Расширенные', 'Расширенные'], bold: [false, true, true] },
        { label: 'Двусторонние стимулы', cols: ['check', 'check', 'check'] },
        { label: 'AI-генератор лендингов', cols: ['check', 'check', 'check'] },
        { label: 'Группы партнёров', cols: ['3', 'Безлимит', 'Безлимит'], bold: [true, true, true] },
        { label: 'Встроенный реферальный дашборд', cols: ['dash', 'check', 'check'] },
        { label: 'Partners API', cols: ['dash', 'check', 'check'] },
        { label: 'Центр сообщений', cols: ['dash', 'check', 'check'] },
        { label: 'Email-кампании', cols: ['dash', 'check', 'check'] },
        { label: 'Защита от фрода', cols: ['dash', 'check', 'check'] },
        { label: 'Доступ к Partner Network', cols: ['dash', 'dash', 'check'] },
      ],
    },
    {
      title: 'Аналитика',
      rows: [
        { label: 'Расширенная аналитика', cols: ['check', 'check', 'check'] },
        { label: 'Отслеживаемые события / мес', cols: ['250K', '1M', 'Безлимит'], bold: [true, true, true] },
        { label: 'Хранение данных', cols: ['3 года', '5 лет', 'Безлимит'] },
        { label: 'Отслеживание конверсий', cols: ['check', 'check', 'check'] },
      ],
    },
    {
      title: 'Домены',
      rows: [
        { label: 'Кастомные домены', cols: ['100', '250', 'Безлимит'], bold: [true, true, true] },
        { label: 'SSL-сертификаты', cols: ['check', 'check', 'check'] },
      ],
    },
    {
      title: 'API',
      rows: [
        { label: 'Доступ к API', cols: ['check', 'check', 'check'] },
        { label: 'Нативные SDK', cols: ['check', 'check', 'check'] },
        { label: 'Rate limit', cols: ['1,200/мин', '3,000/мин', 'Индивидуально'] },
        { label: 'Вебхуки событий', cols: ['check', 'check', 'check'] },
      ],
    },
    {
      title: 'Рабочее пространство',
      rows: [
        { label: 'Пользователи', cols: ['10', '20', 'Безлимит'], bold: [true, true, true] },
        { label: 'Ролевой доступ (RBAC)', cols: ['check', 'check', 'check'] },
        { label: 'SAML / SSO', cols: ['dash', 'dash', 'check'] },
        { label: 'Аудит-логи', cols: ['dash', 'dash', 'check'] },
      ],
    },
    {
      title: 'Поддержка',
      rows: [
        { label: 'Уровень поддержки', cols: ['Приоритетная', 'Slack', 'SLA'], bold: [false, true, true] },
        { label: 'Выделенный менеджер', cols: ['dash', 'dash', 'check'] },
      ],
    },
  ],
}

const linksSchema: Schema = {
  headers: [
    { title: 'Free', subtitle: '0 \u20BD' },
    { title: 'Pro', subtitle: '299\u00a0\u20BD/мес', featured: true },
    { title: 'Business', subtitle: '999\u00a0\u20BD/мес' },
    { title: 'Enterprise', subtitle: 'Индивидуально' },
  ],
  sections: [
    {
      title: 'Ссылки',
      rows: [
        { label: 'Количество ссылок', cols: ['1\u00a0000', '50\u00a0000', '500\u00a0000', 'Безлимит'], bold: [true, true, true, true] },
        { label: 'Кликов / мес', cols: ['50\u00a0000', '1\u00a0млн', '10\u00a0млн', 'Безлимит'], bold: [true, true, true, true] },
        { label: 'Кастомные домены', cols: ['1', '10', '50', 'Безлимит'] },
        { label: 'Брендированные QR-коды', cols: ['check', 'check', 'check', 'check'] },
        { label: 'Кастомные превью (OG)', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'UTM-шаблоны', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'Папки и теги', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'Гео / устройство-таргетинг', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'A/B-тесты', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'Диплинки (iOS / Android)', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'Парольная защита', cols: ['dash', 'dash', 'check', 'check'] },
        { label: 'Клоакинг', cols: ['dash', 'dash', 'check', 'check'] },
      ],
    },
    {
      title: 'Аналитика',
      rows: [
        { label: 'Real-time события', cols: ['check', 'check', 'check', 'check'] },
        { label: 'Хранение данных', cols: ['30 дней', '1 год', '3 года', 'Безлимит'] },
        { label: 'Отслеживание конверсий', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'Customer Insights', cols: ['dash', 'dash', 'check', 'check'] },
      ],
    },
    {
      title: 'API',
      rows: [
        { label: 'Доступ к API', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'SDK', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'Вебхуки', cols: ['dash', 'check', 'check', 'check'] },
        { label: 'Rate limit', cols: ['—', '600/мин', '3\u00a0000/мин', 'Индивидуально'] },
      ],
    },
    {
      title: 'Команда',
      rows: [
        { label: 'Пользователи', cols: ['1', '3', '10', 'Безлимит'], bold: [true, true, true, true] },
        { label: 'RBAC', cols: ['dash', 'dash', 'check', 'check'] },
        { label: 'SAML / SSO', cols: ['dash', 'dash', 'dash', 'check'] },
        { label: 'Аудит-логи', cols: ['dash', 'dash', 'dash', 'check'] },
      ],
    },
  ],
}

function CellContent({ value, bold }: { value: CellValue; bold?: boolean }) {
  if (value === 'check') return <Check />
  if (value === 'dash') return <Dash />
  return bold ? <strong className="font-bold text-[var(--text)]">{value}</strong> : <>{value}</>
}

export default function CompareTable({ variant = 'partners' }: { variant?: 'partners' | 'links' }) {
  const schema = variant === 'links' ? linksSchema : partnerSchema
  const colCount = schema.headers.length + 1

  return (
    <section className="py-10 pb-20">
      <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,44px)] font-normal text-center mb-12">
        Сравнение тарифов
      </h2>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse bg-[var(--bg-white)] rounded-3xl overflow-hidden border border-[var(--border)]"
          style={{ minWidth: `${colCount * 160}px` }}
        >
          <thead>
            <tr>
              <th className="p-5 text-sm font-bold text-[var(--text)] text-left w-[30%] border-b-2 border-[var(--border)] bg-[var(--bg-muted)]" />
              {schema.headers.map((h, i) => (
                <th
                  key={h.title + i}
                  className={`p-5 text-sm font-bold text-center border-b-2 border-[var(--border)] ${
                    h.featured ? 'bg-[var(--bg-dark)] text-white' : 'bg-[var(--bg-muted)] text-[var(--text)]'
                  }`}
                >
                  {h.title}
                  <br />
                  <span className={`font-normal ${h.featured ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>
                    {h.subtitle}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schema.sections.map((section) => (
              <Fragment key={section.title}>
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-6 py-3.5 text-[13px] font-bold text-[var(--text-muted)] uppercase tracking-wide bg-[var(--bg-muted)] border-b border-[var(--border)]"
                  >
                    {section.title}
                  </td>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-6 py-3.5 text-sm text-[var(--text)] font-medium text-left border-b border-[var(--border-light)]">
                      {row.label}
                    </td>
                    {row.cols.map((c, i) => (
                      <td
                        key={i}
                        className="px-6 py-3.5 text-sm text-[var(--text-secondary)] text-center border-b border-[var(--border-light)]"
                      >
                        <CellContent value={c} bold={row.bold?.[i]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

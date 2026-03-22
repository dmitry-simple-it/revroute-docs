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
  business: CellValue
  advanced: CellValue
  enterprise: CellValue
  bold?: boolean[]
}

interface Section {
  title: string
  rows: Row[]
}

const sections: Section[] = [
  {
    title: 'Партнёры',
    rows: [
      { label: 'Количество партнёров', business: 'Безлимит', advanced: 'Безлимит', enterprise: 'Безлимит' },
      { label: 'Автоматические выплаты', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'Лимит выплат / мес', business: '125 000 \u20BD', advanced: '750 000 \u20BD', enterprise: 'Безлимит', bold: [true, true, true] },
      { label: 'Комиссия за выплаты', business: '5%', advanced: '5%', enterprise: '3%' },
      { label: 'Налоговый комплаенс', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'Структуры вознаграждений', business: 'Базовые', advanced: 'Расширенные', enterprise: 'Расширенные', bold: [false, true, true] },
      { label: 'Двусторонние стимулы', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'AI-генератор лендингов', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'Группы партнёров', business: '3', advanced: 'Безлимит', enterprise: 'Безлимит', bold: [true, true, true] },
      { label: 'Встроенный реферальный дашборд', business: 'dash', advanced: 'check', enterprise: 'check' },
      { label: 'Partners API', business: 'dash', advanced: 'check', enterprise: 'check' },
      { label: 'Центр сообщений', business: 'dash', advanced: 'check', enterprise: 'check' },
      { label: 'Email-кампании', business: 'dash', advanced: 'check', enterprise: 'check' },
      { label: 'Защита от фрода', business: 'dash', advanced: 'check', enterprise: 'check' },
      { label: 'Доступ к Partner Network', business: 'dash', advanced: 'dash', enterprise: 'check' },
    ],
  },
  {
    title: 'Аналитика',
    rows: [
      { label: 'Расширенная аналитика', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'Отслеживаемые события / мес', business: '250K', advanced: '1M', enterprise: 'Безлимит', bold: [true, true, true] },
      { label: 'Хранение данных', business: '3 года', advanced: '5 лет', enterprise: 'Безлимит' },
      { label: 'Отслеживание конверсий', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'Поток событий в реальном времени', business: 'check', advanced: 'check', enterprise: 'check' },
    ],
  },
  {
    title: 'Домены',
    rows: [
      { label: 'Кастомные домены', business: '100', advanced: '250', enterprise: 'Безлимит', bold: [true, true, true] },
      { label: 'SSL-сертификаты', business: 'check', advanced: 'check', enterprise: 'check' },
    ],
  },
  {
    title: 'API',
    rows: [
      { label: 'Доступ к API', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'Нативные SDK', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'Rate limit', business: '1,200/мин', advanced: '3,000/мин', enterprise: 'Индивидуально' },
      { label: 'Вебхуки событий', business: 'check', advanced: 'check', enterprise: 'check' },
    ],
  },
  {
    title: 'Рабочее пространство',
    rows: [
      { label: 'Пользователи', business: '10', advanced: '20', enterprise: 'Безлимит', bold: [true, true, true] },
      { label: 'Ролевой доступ (RBAC)', business: 'check', advanced: 'check', enterprise: 'check' },
      { label: 'SAML / SSO', business: 'dash', advanced: 'dash', enterprise: 'check' },
      { label: 'Аудит-логи', business: 'dash', advanced: 'dash', enterprise: 'check' },
    ],
  },
  {
    title: 'Поддержка',
    rows: [
      { label: 'Уровень поддержки', business: 'Приоритетная', advanced: 'Slack', enterprise: 'SLA', bold: [false, true, true] },
      { label: 'Выделенный менеджер', business: 'dash', advanced: 'dash', enterprise: 'check' },
    ],
  },
]

function CellContent({ value, bold }: { value: CellValue; bold?: boolean }) {
  if (value === 'check') return <Check />
  if (value === 'dash') return <Dash />
  return bold ? <strong className="font-bold text-[var(--text)]">{value}</strong> : <>{value}</>
}

export default function CompareTable() {
  return (
    <section className="py-10 pb-20">
      <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,44px)] font-normal text-center mb-12">
        Сравнение тарифов
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-[var(--bg-white)] rounded-3xl overflow-hidden border border-[var(--border)] min-w-[640px]">
          <thead>
            <tr>
              <th className="p-5 text-sm font-bold text-[var(--text)] text-left w-[35%] border-b-2 border-[var(--border)] bg-[var(--bg-muted)]" />
              <th className="p-5 text-sm font-bold text-[var(--text)] text-center border-b-2 border-[var(--border)] bg-[var(--bg-muted)]">
                Business<br />
                <span className="font-normal text-[var(--text-muted)]">2 450 {'\u20BD'}/мес</span>
              </th>
              <th className="p-5 text-sm font-bold text-white text-center border-b-2 border-[var(--border)] bg-[var(--bg-dark)]">
                Advanced<br />
                <span className="font-normal text-white/60">12 450 {'\u20BD'}/мес</span>
              </th>
              <th className="p-5 text-sm font-bold text-[var(--text)] text-center border-b-2 border-[var(--border)] bg-[var(--bg-muted)]">
                Enterprise<br />
                <span className="font-normal text-[var(--text-muted)]">Индивидуально</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <>
                <tr key={`section-${section.title}`}>
                  <td
                    colSpan={4}
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
                    <td className="px-6 py-3.5 text-sm text-[var(--text-secondary)] text-center border-b border-[var(--border-light)]">
                      <CellContent value={row.business} bold={row.bold?.[0]} />
                    </td>
                    <td className="px-6 py-3.5 text-sm text-[var(--text-secondary)] text-center border-b border-[var(--border-light)]">
                      <CellContent value={row.advanced} bold={row.bold?.[1]} />
                    </td>
                    <td className="px-6 py-3.5 text-sm text-[var(--text-secondary)] text-center border-b border-[var(--border-light)]">
                      <CellContent value={row.enterprise} bold={row.bold?.[2]} />
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

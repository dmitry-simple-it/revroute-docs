import type { ReactNode } from 'react'

const Check = () => (
  <span className="inline-block h-5 w-5 rounded-full" style={{ background: 'var(--green)' }} />
)
const Dash = () => (
  <span className="inline-block h-0.5 w-4 rounded-sm" style={{ background: 'var(--text-dim)' }} />
)

export type CompareValue = true | false | string | ReactNode

export type CompareRow = {
  label: string
  us: CompareValue
  them: CompareValue
}

function Cell({ v }: { v: CompareValue }) {
  if (v === true) return <Check />
  if (v === false) return <Dash />
  return <span>{v}</span>
}

export function ComparisonTable({
  competitor,
  rows,
}: {
  competitor: string
  rows: CompareRow[]
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full min-w-[560px] border-collapse overflow-hidden border"
        style={{
          background: 'var(--bg-white)',
          borderColor: 'var(--border)',
          borderRadius: 'var(--radius-2xl)',
        }}
      >
        <thead>
          <tr>
            <th
              className="border-b-2 p-5 text-left text-sm font-bold"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)', width: '44%' }}
            />
            <th
              className="border-b-2 p-5 text-center text-sm font-bold text-white"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-dark)' }}
            >
              Revroute
            </th>
            <th
              className="border-b-2 p-5 text-center text-sm font-bold"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)', color: 'var(--text)' }}
            >
              {competitor}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td
                className="border-b px-6 py-3.5 text-sm font-medium"
                style={{ borderColor: 'var(--border-light)', color: 'var(--text)' }}
              >
                {r.label}
              </td>
              <td
                className="border-b px-6 py-3.5 text-center text-sm"
                style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
              >
                <Cell v={r.us} />
              </td>
              <td
                className="border-b px-6 py-3.5 text-center text-sm"
                style={{ borderColor: 'var(--border-light)', color: 'var(--text-secondary)' }}
              >
                <Cell v={r.them} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

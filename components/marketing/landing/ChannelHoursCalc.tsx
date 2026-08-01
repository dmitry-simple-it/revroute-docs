'use client'

/**
 * ChannelHoursCalc — интерактивная таблица «сколько канал стоит в часах»
 * (страница /partner-channel). Ключевые процессы ручного партнёрского канала —
 * по списку из КП (30-gtm/proposals/marquiz-popov/kp-draft.md, раздел «Что
 * текущая схема стоит вам уже сейчас») в обобщённой форме. Оценки типовые,
 * значения редактируются — итог человеко-часов пересчитывается на лету.
 */
import { useState } from 'react'

const PROCESSES: { label: string; hours: number }[] = [
  { label: 'Поиск и переговоры с новыми партнёрами', hours: 6 },
  { label: 'Онбординг и ответы на вопросы партнёров', hours: 4 },
  { label: 'Сверка сделок и атрибуции: «кто кого привёл»', hours: 3 },
  { label: 'Проверка заявок партнёров на выплату', hours: 2 },
  { label: 'Расчёт вознаграждений и реестр выплат', hours: 3 },
  { label: 'Проведение выплат: реквизиты, платежи, отметки в системах', hours: 3 },
  { label: 'Счета, акты и закрывающие документы для бухгалтерии', hours: 2 },
  { label: 'Чеки самозанятых: сбор и контроль', hours: 1 },
  { label: 'Поддержка самодельного контура: таблицы, формы, скрипты', hours: 2 },
  { label: 'Разбор споров и сверки при ошибках учёта', hours: 2 },
  { label: 'Обновление материалов и условий программы', hours: 1 },
]

export function ChannelHoursCalc() {
  const [hours, setHours] = useState<number[]>(PROCESSES.map((p) => p.hours))
  const total = hours.reduce((s, h) => s + (Number.isFinite(h) ? h : 0), 0)

  function setRow(i: number, raw: string) {
    const v = Math.max(0, Math.min(200, Number(raw)))
    setHours((prev) => prev.map((h, j) => (j === i ? (Number.isFinite(v) ? v : 0) : h)))
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 24px', background: 'var(--bg-sunken)', borderBottom: '1px solid var(--line)' }}>
        <span className="rr-caption">Процесс</span>
        <span className="rr-caption" style={{ flexShrink: 0 }}>ч/мес</span>
      </div>
      {PROCESSES.map((p, i) => (
        <div key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 24px', borderTop: i === 0 ? 'none' : '1px solid var(--line-2)' }}>
          <label className="rr-small" htmlFor={`hc-${i}`} style={{ color: 'var(--ink-2)' }}>{p.label}</label>
          <input
            id={`hc-${i}`}
            type="number"
            inputMode="numeric"
            min={0}
            max={200}
            value={hours[i]}
            onChange={(e) => setRow(i, e.target.value)}
            aria-label={`Часов в месяц: ${p.label}`}
            style={{
              width: 76,
              flexShrink: 0,
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 15,
              color: 'var(--ink)',
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: '8px 6px',
              outline: 'none',
            }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '17px 24px', borderTop: '1px solid var(--line)', background: 'var(--bg-sunken)' }}>
        <span className="rr-body" style={{ fontWeight: 600, color: 'var(--ink)' }}>Итого — человеко-часов</span>
        <span className="rr-body" style={{ fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>≈{total} ч/мес</span>
      </div>
    </div>
  )
}

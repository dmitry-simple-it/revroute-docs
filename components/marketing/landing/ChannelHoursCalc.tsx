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
  { label: 'Поддержка и доработка «ручного» контура: таблицы, формы, скрипты и интеграции', hours: 2 },
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

/* Упущенная выгода: партнёры, которые так и не продали, — её в часах не измерить. */
const LOSSES: { label: string; count: number }[] = [
  { label: 'Не разобрались в условиях и экономике программы — не начали продавать', count: 3 },
  { label: 'Не хватило материалов и инструментов продаж, чтобы закрыть сделку', count: 2 },
  { label: 'Остыли без онбординга, квалификации и сопровождения', count: 2 },
]

export function ChannelLostCalc() {
  const [counts, setCounts] = useState<number[]>(LOSSES.map((l) => l.count))
  const total = counts.reduce((s, c) => s + (Number.isFinite(c) ? c : 0), 0)

  function setRow(i: number, raw: string) {
    const v = Math.max(0, Math.min(100, Number(raw)))
    setCounts((prev) => prev.map((c, j) => (j === i ? (Number.isFinite(v) ? v : 0) : c)))
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 24px', background: 'var(--bg-sunken)', borderBottom: '1px solid var(--line)' }}>
        <span className="rr-caption">Упущенная выгода — партнёры, которые не продали</span>
        <span className="rr-caption" style={{ flexShrink: 0 }}>в месяц</span>
      </div>
      {LOSSES.map((l, i) => (
        <div key={l.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 24px', borderTop: i === 0 ? 'none' : '1px solid var(--line-2)' }}>
          <label className="rr-small" htmlFor={`lc-${i}`} style={{ color: 'var(--ink-2)' }}>{l.label}</label>
          <input
            id={`lc-${i}`}
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={counts[i]}
            onChange={(e) => setRow(i, e.target.value)}
            aria-label={`Партнёров в месяц: ${l.label}`}
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
      <div style={{ padding: '17px 24px', borderTop: '1px solid var(--line)', background: 'var(--bg-sunken)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <span className="rr-body" style={{ fontWeight: 600, color: 'var(--ink)' }}>Итого — партнёров теряется</span>
          <span className="rr-body" style={{ fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>≈{total} в месяц</span>
        </div>
        <p className="rr-small" style={{ margin: '8px 0 0', color: 'var(--ink-3)' }}>
          Каждый — несостоявшиеся сделки. Умножьте на ваш средний чек — это цена ручного канала в деньгах.
        </p>
      </div>
    </div>
  )
}

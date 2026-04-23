'use client'

import { useState } from 'react'
import { AreaChart } from './AreaChart'
import { Sparkline } from './Sparkline'
import { metricTrends } from '../../../content/mock-metrics'

const defaultChart = [
  8, 10, 14, 12, 18, 22, 20, 26, 32, 30, 38, 44, 42, 48, 56, 54, 62, 70, 66, 74, 82, 88, 94, 102, 98,
  108, 118, 126, 134, 142,
]

type Stat = {
  label: string
  value: string
  short?: string
  delta?: string
  color?: string
  trend?: number[]
}

export function StatsCard({
  stats,
  chartData = defaultChart,
  chartColor = 'var(--blue)',
}: {
  stats?: Stat[]
  chartData?: number[]
  chartColor?: string
}) {
  const s: Stat[] = stats ?? [
    { label: 'Клики', value: '114\u00a0054', short: '114.1K', delta: '+18.4%', color: 'var(--blue)', trend: [...metricTrends.clicks] },
    { label: 'Лиды', value: '2\u00a0250', short: '2.3K', delta: '+12.1%', color: 'var(--purple)', trend: [...metricTrends.leads] },
    { label: 'Продажи', value: '8\u00a0713\u00a0₽', short: '8.7K\u00a0₽', delta: '+42.3%', color: 'var(--green)', trend: [...metricTrends.sales] },
  ]
  return (
    <div
      className="relative overflow-hidden border"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots bg-fade-mask opacity-50" />

      <div
        className="relative mb-7 grid gap-6 border-b pb-5 max-md:!grid-cols-1 max-md:gap-3"
        style={{
          gridTemplateColumns: `repeat(${s.length}, minmax(0, 1fr))`,
          borderColor: 'var(--border-light, #f5f5f4)',
        }}
      >
        {s.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-3">
            <div>
              <div
                className="text-[11px] font-semibold uppercase"
                style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}
              >
                {stat.label}
              </div>
              <div className="mt-1 whitespace-nowrap text-[28px] font-extrabold leading-none max-md:text-[24px]" style={{ letterSpacing: '-1px' }}>
                {stat.short ?? stat.value}
              </div>
              {stat.delta && (
                <div className="mt-1.5 inline-flex items-center gap-1">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                  >
                    {stat.delta}
                  </span>
                  {stat.short && (
                    <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                      {stat.value}
                    </span>
                  )}
                </div>
              )}
            </div>
            {stat.trend && (
              <Sparkline
                data={stat.trend}
                width={70}
                height={36}
                stroke={stat.color ?? chartColor}
                fill="rgba(37, 99, 235, 0.08)"
              />
            )}
          </div>
        ))}
      </div>
      <div className="relative">
        <AreaChart
          data={chartData}
          height={200}
          stroke={chartColor}
          fillTop="rgba(37, 99, 235, 0.22)"
          fillBottom="rgba(37, 99, 235, 0)"
        />
      </div>
    </div>
  )
}

export type PartnerMock = {
  initials: string
  name: string
  country: string
  revenue: string
  payout: string
  color: string
}

export function PartnerList({ partners }: { partners: PartnerMock[] }) {
  return (
    <div
      className="border"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="flex items-center justify-between pb-4">
        <div className="text-[15px] font-bold">Партнёры</div>
        <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
          Апрель 2026
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {partners.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between border"
            style={{
              padding: '12px 16px',
              background: 'var(--bg)',
              borderColor: 'var(--border-light, #f5f5f4)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: p.color }}
              >
                {p.initials}
              </div>
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-px text-xs" style={{ color: 'var(--text-dim)' }}>
                  {p.country}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 max-md:hidden">
              <div className="text-right">
                <div className="text-[13px] font-bold">{p.revenue}</div>
                <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                  Выручка
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold" style={{ color: 'var(--green)' }}>
                  {p.payout}
                </div>
                <div className="text-[10px] uppercase" style={{ color: 'var(--text-dim)' }}>
                  Выплата
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export type EventRow = {
  type: string
  link: string
  customer: string
  country: string
  amount: string
  time: string
}

export function EventsStream({ events }: { events: EventRow[] }) {
  return (
    <div
      className="overflow-hidden border"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <div
        className="grid grid-cols-[1fr_1fr_1fr_0.7fr_0.7fr_0.7fr] gap-4 border-b px-6 py-3 text-[11px] font-semibold uppercase max-md:hidden"
        style={{ borderColor: 'var(--border)', color: 'var(--text-dim)', letterSpacing: '0.08em' }}
      >
        <div>Событие</div>
        <div>Ссылка</div>
        <div>Клиент</div>
        <div>Страна</div>
        <div className="text-right">Сумма</div>
        <div className="text-right">Время</div>
      </div>
      <div className="max-h-[380px] overflow-hidden">
        {events.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr_0.7fr_0.7fr_0.7fr] items-center gap-4 border-b px-6 py-3 text-sm max-md:grid-cols-2 max-md:text-xs"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center gap-2 font-medium">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    e.type === 'Продажа'
                      ? 'var(--green)'
                      : e.type === 'Лид'
                      ? 'var(--blue)'
                      : 'var(--text-dim)',
                }}
              />
              {e.type}
            </div>
            <div className="truncate font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              {e.link}
            </div>
            <div className="truncate max-md:hidden" style={{ color: 'var(--text-secondary)' }}>
              {e.customer}
            </div>
            <div className="text-xs max-md:hidden" style={{ color: 'var(--text-muted)' }}>
              {e.country}
            </div>
            <div className="text-right font-semibold max-md:col-start-2">{e.amount}</div>
            <div className="text-right text-xs max-md:hidden" style={{ color: 'var(--text-dim)' }}>
              {e.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FilterChips({
  chips = [
    { k: 'Ссылка', v: 'go.revroute.ru' },
    { k: 'Тег', v: 'Маркетинг' },
    { k: 'Страна', v: 'Россия' },
    { k: 'Город', v: 'Москва' },
    { k: 'Устройство', v: 'Desktop' },
    { k: 'Браузер', v: 'Chrome' },
    { k: 'UTM Source', v: 'google' },
    { k: 'UTM Campaign', v: 'summer sale' },
  ],
}: {
  chips?: { k: string; v: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <span
          key={c.k + c.v}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
          style={{ background: 'var(--bg-white)', borderColor: 'var(--border)' }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{c.k}</span>
          <span style={{ color: 'var(--text-dim)' }}>=</span>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>
            {c.v}
          </span>
        </span>
      ))}
    </div>
  )
}

export function LinkBuilderMock() {
  const [tab, setTab] = useState<'url' | 'preview' | 'utm' | 'qr'>('url')
  return (
    <div
      className="border"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="mb-5 flex gap-1 rounded-lg p-[3px]" style={{ background: 'var(--bg-muted)', width: 'fit-content' }}>
        {(['url', 'preview', 'utm', 'qr'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="cursor-pointer rounded-md px-3 py-1 text-[13px] font-medium capitalize"
            style={{
              background: tab === t ? 'var(--bg-white)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--text-dim)',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {t === 'url' ? 'URL' : t === 'preview' ? 'Превью' : t === 'utm' ? 'UTM' : 'QR'}
          </button>
        ))}
      </div>

      {tab === 'url' && (
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            Целевой URL
          </label>
          <div
            className="rounded-lg border px-3 py-2 text-sm font-mono"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            https://revroute.ru/pricing?utm_source=blog
          </div>
          <label className="mt-3 text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            Короткая ссылка
          </label>
          <div
            className="rounded-lg border px-3 py-2 text-sm font-mono"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <span style={{ color: 'var(--text-dim)' }}>go.revroute.ru/</span>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              promo
            </span>
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div
          className="rounded-lg border"
          style={{ borderColor: 'var(--border)', padding: '12px', background: 'var(--bg)' }}
        >
          <div
            className="mb-2 h-28 rounded"
            style={{
              background:
                'linear-gradient(135deg, #0c0a09 0%, #44403c 40%, #78716c 100%)',
            }}
          />
          <div className="text-[11px] uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            revroute.ru
          </div>
          <div className="mt-1 text-sm font-semibold">Revroute — превращайте клики в выручку</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Короткие ссылки, аналитика конверсий и партнёрские программы.
          </div>
        </div>
      )}

      {tab === 'utm' && (
        <div className="flex flex-col gap-2">
          {[
            ['utm_source', 'google'],
            ['utm_medium', 'cpc'],
            ['utm_campaign', 'summer_sale'],
            ['utm_content', 'hero_cta'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 text-sm">
              <span className="w-32 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                {k}
              </span>
              <span className="flex-1 rounded-md border px-2 py-1 font-mono text-xs" style={{ borderColor: 'var(--border)' }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'qr' && (
        <div className="flex items-center justify-center py-4" aria-hidden>
          <div
            role="presentation"
            className="grid gap-0.5 rounded-lg p-3"
            style={{
              gridTemplateColumns: 'repeat(12, 8px)',
              background: 'var(--bg-white)',
              border: '1px solid var(--border)',
            }}
          >
            {Array.from({ length: 144 }).map((_, i) => {
              const on = (i * 37 + (i % 7) * 13) % 3 !== 0
              return (
                <div
                  key={i}
                  className="h-2 w-2 rounded-[2px]"
                  style={{ background: on ? 'var(--text)' : 'transparent' }}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

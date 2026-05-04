'use client'

import { useState } from 'react'
import { BrowserMockup } from '../shared/BrowserMockup'
import { WorldMap } from '../shared/WorldMap'

const tabs = [
  {
    id: 'links',
    label: 'Короткие ссылки',
    dotColor: '#ef4444',
    title: 'Короткие ссылки',
    desc: 'Создавайте и управляйте ссылками в масштабе. Кастомные домены, папки, таргетинг по устройствам и гео, A/B-тесты и командный доступ.',
    linkHref: '/links',
    linkText: 'Подробнее про ссылки',
  },
  {
    id: 'analytics',
    label: 'Аналитика конверсий',
    dotColor: '#22c55e',
    title: 'Аналитика конверсий',
    desc: 'Отслеживайте полный путь от клика до покупки. Атрибуция в реальном времени покажет, какой канал приносит деньги, а какой — только трафик.',
    linkHref: '/analytics',
    linkText: 'Подробнее про аналитику',
  },
  {
    id: 'partners',
    label: 'Партнёрские программы',
    dotColor: '#a855f7',
    title: 'Партнёрские программы',
    desc: 'Запускайте реферальные и аффилиатные программы без сложных интеграций. Автоматический расчёт выплат, дашборд для партнёров, выплаты в рублях.',
    linkHref: '/partners',
    linkText: 'Подробнее про партнёров',
  },
]

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState('links')
  const current = tabs.find((t) => t.id === activeTab)!

  return (
    <section id="product" className="relative" style={{ padding: '60px 0 100px', animation: 'fadeUp 0.8s ease 0.45s both' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots bg-fade-mask opacity-60" />
      <div className="relative mx-auto max-w-[1200px] px-6">
        {/* Tab nav */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex cursor-pointer items-center gap-2 rounded-full border text-sm font-semibold transition-all"
              style={{
                padding: '10px 20px',
                fontFamily: 'var(--font-body)',
                color: activeTab === tab.id ? 'var(--text)' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'var(--bg-white)' : 'transparent',
                borderColor: activeTab === tab.id ? 'var(--border)' : 'transparent',
                boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: tab.dotColor }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div
          key={activeTab}
          className="mx-auto grid grid-cols-[1fr_1.2fr] gap-10 items-center max-lg:grid-cols-1"
          style={{ animation: 'fadeIn 0.3s ease' }}
        >
          <div>
            <div className="mb-2 text-[26px] font-bold" style={{ letterSpacing: '-0.5px' }}>
              {current.title}
            </div>
            <div className="mb-5 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {current.desc}
            </div>
            <a
              href={current.linkHref}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-all"
              style={{ color: 'var(--text)' }}
            >
              {current.linkText} <span className="transition-all group-hover:ml-1">&rarr;</span>
            </a>

            <div className="mt-6 grid max-w-sm grid-cols-3 gap-2 text-sm">
              {activeTab === 'links' && (
                <>
                  <MiniStat label="Создано" value="200K+" />
                  <MiniStat label="Домены" value={'1\u00a0200'} />
                  <MiniStat label="QR-кодов" value="54K" />
                </>
              )}
              {activeTab === 'analytics' && (
                <>
                  <MiniStat label="Событий" value="7M+" />
                  <MiniStat label="Конверсий" value="84K" />
                  <MiniStat label="Выручка" value={'24M\u00a0₽'} />
                </>
              )}
              {activeTab === 'partners' && (
                <>
                  <MiniStat label="Партнёров" value={'3\u00a0400+'} />
                  <MiniStat label="Выплачено" value={'12M\u00a0₽'} />
                  <MiniStat label="Страны" value="28" />
                </>
              )}
            </div>
          </div>

          <div className="relative">
            {activeTab !== 'links' && (
              <div
                aria-hidden
                className="glow-radial"
                style={{
                  inset: '-40px',
                  width: 'auto',
                  height: 'auto',
                  background:
                    activeTab === 'analytics'
                      ? 'radial-gradient(ellipse at 70% 40%, rgba(34, 197, 94, 0.18), transparent 60%)'
                      : 'radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.22), transparent 60%)',
                }}
              />
            )}

            {activeTab === 'links' && (
              <BrowserMockup
                src="/images/screenshots/create-links.png"
                alt="Конструктор брендированных ссылок Revroute: домен, slug, теги, QR и превью"
                width={2048}
                height={1180}
                glow="orange"
                chrome="none"
                maxWidth={700}
              />
            )}

            {activeTab === 'analytics' && (
              <BrowserMockup
                src="/images/screenshots/analytics-conversions.png"
                alt="Аналитика конверсий в Revroute: клики → лиды → продажи по сегментам"
                url="app.revroute.ru/analytics/conversions"
                width={2048}
                height={1180}
                glow="green"
                maxWidth={700}
              />
            )}

            {activeTab === 'partners' && <WorldMap height={260} showLabels={false} />}
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg border px-3 py-2"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }}
    >
      <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div className="mt-0.5 whitespace-nowrap text-[14px] font-bold">{value}</div>
    </div>
  )
}

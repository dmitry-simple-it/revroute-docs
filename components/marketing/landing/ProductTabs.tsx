'use client'

import { useState } from 'react'

const tabs = [
  {
    id: 'links',
    label: 'Короткие ссылки',
    dotColor: '#ef4444',
    title: 'Короткие ссылки',
    desc: 'Создавайте и управляйте ссылками в масштабе. Кастомные домены, папки, таргетинг по устройствам и гео, A/B-тесты и командный доступ.',
    linkHref: '#features',
    linkText: 'Подробнее',
  },
  {
    id: 'analytics',
    label: 'Аналитика конверсий',
    dotColor: '#22c55e',
    title: 'Аналитика конверсий',
    desc: 'Отслеживайте полный путь от клика до покупки. Атрибуция в реальном времени покажет, какой канал приносит деньги, а какой — только трафик.',
    linkHref: '#analytics',
    linkText: 'Подробнее',
  },
  {
    id: 'partners',
    label: 'Партнёрские программы',
    dotColor: '#a855f7',
    title: 'Партнёрские программы',
    desc: 'Запускайте реферальные и аффилиатные программы без сложных интеграций. Автоматический расчёт выплат, дашборд для партнёров, выплаты в рублях.',
    linkHref: '#partners',
    linkText: 'Подробнее',
  },
]

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState('links')
  const current = tabs.find((t) => t.id === activeTab)!

  return (
    <section id="product" style={{ padding: '20px 0 80px', animation: 'fadeUp 0.8s ease 0.45s both' }}>
      <div className="mx-auto max-w-[1200px] px-6">
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
                background:
                  activeTab === tab.id ? 'var(--bg-white)' : 'transparent',
                borderColor:
                  activeTab === tab.id ? 'var(--border)' : 'transparent',
                boxShadow:
                  activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: tab.dotColor }}
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div
          key={activeTab}
          className="mx-auto max-w-[800px] border"
          style={{
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding: '40px',
            boxShadow: 'var(--shadow)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div className="mb-2 text-[22px] font-bold">{current.title}</div>
          <div
            className="mb-5 text-base leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {current.desc}
          </div>
          <a
            href={current.linkHref}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold no-underline transition-all"
            style={{ color: 'var(--text)' }}
          >
            {current.linkText}{' '}
            <span className="transition-all group-hover:ml-1">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}

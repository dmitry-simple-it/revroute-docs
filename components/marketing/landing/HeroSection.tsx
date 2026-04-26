import { AreaChart } from '../shared/AreaChart'
import { Sparkline } from '../shared/Sparkline'

const heroChart = [
  12, 14, 18, 16, 22, 28, 26, 32, 30, 38, 42, 48, 46, 52, 58, 54, 62, 68, 64, 72, 78, 82, 88, 92,
  90, 96, 104, 112, 118, 124,
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden text-center max-md:!py-12" style={{ padding: '100px 0 60px' }}>
      {/* Grid background with radial mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid bg-fade-mask"
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="glow-radial"
        style={{
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 900,
          height: 500,
          background:
            'radial-gradient(ellipse at center, rgba(37,99,235,0.14) 0%, rgba(124,58,237,0.09) 40%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6">
        {/* Live badge */}
        <div
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold"
          style={{
            background: 'var(--bg-white)',
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
            animation: 'fadeUp 0.6s ease both',
          }}
        >
          <span className="pulse-dot" aria-hidden />
          <span>
            Live · <span style={{ color: 'var(--text)' }}>12 482</span> кликов за последние 60 сек
          </span>
        </div>

        <h1
          className="relative mb-7"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 9vw, 88px)',
            fontWeight: 400,
            letterSpacing: '-1.5px',
            lineHeight: 1.0,
            animation: 'fadeUp 0.8s ease both',
          }}
        >
          Превращайте клики
          <br />в{' '}
          <em
            className="italic"
            style={{
              background:
                'linear-gradient(135deg, #0c0a09 0%, #2563eb 40%, #7c3aed 70%, #0c0a09 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 6s ease-in-out infinite',
            }}
          >
            выручку
          </em>
        </h1>
        <p
          className="relative mx-auto"
          style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            marginBottom: '44px',
            lineHeight: 1.6,
            animation: 'fadeUp 0.8s ease 0.15s both',
          }}
        >
          Revroute — платформа партнёрского маркетинга. Сокращение ссылок,
          аналитика конверсий и партнёрские программы в одном сервисе.
        </p>
        <div
          className="relative flex items-center justify-center gap-4 max-md:flex-col"
          style={{ animation: 'fadeUp 0.8s ease 0.3s both' }}
        >
          <a
            href="https://app.revroute.ru/"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl text-base font-semibold no-underline transition-all hover:-translate-y-px"
            style={{
              padding: '14px 32px',
              background: 'var(--accent)',
              color: '#fff',
              boxShadow:
                '0 10px 30px rgba(12,10,9,0.22), 0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <span className="relative z-10">Начать бесплатно</span>
            <span
              aria-hidden
              className="shimmer-sheen pointer-events-none absolute inset-0"
              style={{ mixBlendMode: 'overlay' }}
            />
          </a>
          <a
            href="https://partners.revroute.ru/"
            className="inline-flex items-center justify-center rounded-xl text-base font-semibold no-underline border transition-all"
            style={{
              padding: '14px 32px',
              background: 'var(--bg-white)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          >
            Стать партнёром
          </a>
        </div>

        {/* Hero visual: floating dashboard */}
        <div
          className="relative mx-auto mt-20 max-w-[1040px]"
          style={{ animation: 'fadeUp 0.9s ease 0.45s both' }}
        >
          {/* Halo behind */}
          <div
            aria-hidden
            className="glow-radial"
            style={{
              left: '10%',
              right: '10%',
              top: '-80px',
              bottom: '-40px',
              width: 'auto',
              height: 'auto',
              background:
                'radial-gradient(50% 60% at 30% 30%, rgba(37,99,235,0.22), transparent 70%),' +
                'radial-gradient(60% 60% at 80% 80%, rgba(22,163,74,0.18), transparent 70%)',
            }}
          />

          <div
            className="relative overflow-hidden border"
            style={{
              background: 'var(--bg-white)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '8px',
              boxShadow: '0 50px 100px -30px rgba(12,10,9,0.20), 0 10px 30px rgba(12,10,9,0.06)',
            }}
          >
            <span aria-hidden className="halo-ring" />
            {/* Fake browser chrome */}
            <div
              className="flex items-center gap-2 border-b px-4 py-2.5 text-[11px]"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dim)' }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#fbbf24' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e' }} />
              <div
                className="mx-auto inline-flex items-center gap-2 rounded-md border px-3 py-1 font-mono"
                style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
              >
                <span>🔒</span>
                <span style={{ color: 'var(--text-muted)' }}>app.revroute.ru</span>
                <span>/analytics</span>
              </div>
              <div style={{ width: 36 }} />
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-0 max-md:grid-cols-1">
              {/* Sidebar */}
              <aside
                className="border-r p-4 text-sm max-md:hidden"
                style={{ borderColor: 'var(--border-light)', background: 'var(--bg)' }}
              >
                <div className="mb-3 text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                  Workspace
                </div>
                {[
                  { label: 'Обзор', active: true },
                  { label: 'Ссылки', active: false },
                  { label: 'Аналитика', active: false },
                  { label: 'Партнёры', active: false },
                  { label: 'Кампании', active: false },
                  { label: 'API', active: false },
                ].map((i) => (
                  <div
                    key={i.label}
                    className="mb-0.5 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px]"
                    style={{
                      background: i.active ? 'var(--bg-white)' : 'transparent',
                      color: i.active ? 'var(--text)' : 'var(--text-muted)',
                      boxShadow: i.active ? 'var(--shadow-sm)' : 'none',
                      fontWeight: i.active ? 600 : 400,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: i.active ? 'var(--blue)' : 'var(--text-dim)' }}
                    />
                    {i.label}
                  </div>
                ))}
              </aside>

              {/* Main */}
              <div className="p-6 text-left">
                <div className="mb-5 flex items-end justify-between max-md:flex-col max-md:items-start max-md:gap-3">
                  <div>
                    <div className="text-[13px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                      Конверсии · 30 дней
                    </div>
                    <div className="mt-1 text-[34px] font-extrabold" style={{ letterSpacing: '-1px' }}>
                      1&nbsp;284&nbsp;₽{' '}
                      <span
                        className="ml-2 rounded-full px-2 py-1 text-[12px] font-semibold align-middle"
                        style={{ background: 'var(--green-bg)', color: 'var(--green)' }}
                      >
                        +42.3%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm max-md:w-full">
                    {[
                      { k: 'Клики', v: '114K', color: 'var(--blue)' },
                      { k: 'Лиды', v: '2\u00a0250', color: 'var(--purple)' },
                      { k: 'Продажи', v: '8,7K\u00a0₽', color: 'var(--green)' },
                    ].map((s) => (
                      <div
                        key={s.k}
                        className="rounded-lg border px-3 py-2 max-md:px-2 max-md:py-1.5"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                      >
                        <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                          {s.k}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
                          <span className="whitespace-nowrap text-[13px] font-bold max-md:text-[12px]">{s.v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <AreaChart
                  data={heroChart}
                  height={200}
                  stroke="var(--blue)"
                  fillTop="rgba(37, 99, 235, 0.28)"
                  fillBottom="rgba(37, 99, 235, 0)"
                />

                <div className="mt-4 grid grid-cols-3 gap-3 max-md:grid-cols-1">
                  {[
                    { title: 'Top ссылка', sub: 'go.revroute.ru/promo', v: '38.2K', data: [4, 8, 7, 12, 10, 16, 18, 22, 28, 32] },
                    { title: 'Канал', sub: 'Telegram Ads', v: '12.8K', data: [2, 3, 5, 4, 7, 9, 12, 15, 18, 20] },
                    { title: 'Гео', sub: 'Москва · Россия', v: '24.6K', data: [6, 9, 8, 11, 14, 13, 18, 21, 25, 28] },
                  ].map((c) => (
                    <div
                      key={c.title}
                      className="rounded-lg border p-3"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                            {c.title}
                          </div>
                          <div className="mt-0.5 text-[13px] font-bold">{c.sub}</div>
                        </div>
                        <div className="text-[13px] font-bold" style={{ color: 'var(--blue)' }}>
                          {c.v}
                        </div>
                      </div>
                      <Sparkline
                        data={c.data}
                        height={28}
                        stroke="var(--blue)"
                        fill="rgba(37, 99, 235, 0.12)"
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

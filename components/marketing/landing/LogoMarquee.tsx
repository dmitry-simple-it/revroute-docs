'use client'

const logos = [
  'Яндекс Маркет',
  'Skillbox',
  'Тинькофф',
  'VK',
  'Ozon',
  'HeadHunter',
  'Lamoda',
  'Skyeng',
  'Авито',
  'Сбер',
  'Wildberries',
  'МТС',
]

export function LogoMarquee() {
  // Duplicate for seamless scroll
  const allLogos = [...logos, ...logos]

  return (
    <section
      className="overflow-hidden border-y"
      style={{ padding: '60px 0', borderColor: 'var(--border)' }}
    >
      <div className="relative">
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-10"
          style={{
            width: '120px',
            background: 'linear-gradient(90deg, var(--bg), transparent)',
          }}
        />
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-0 z-10"
          style={{
            width: '120px',
            background: 'linear-gradient(270deg, var(--bg), transparent)',
          }}
        />

        <div
          className="flex w-max items-center gap-14 hover:[animation-play-state:paused]"
          style={{ animation: 'scroll-left 30s linear infinite' }}
        >
          {allLogos.map((name, i) => (
            <span
              key={i}
              className="shrink-0 whitespace-nowrap text-lg font-bold transition-opacity hover:opacity-60"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text)',
                opacity: 0.25,
                letterSpacing: '-0.3px',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

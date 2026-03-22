export function HeroSection() {
  return (
    <section className="relative text-center" style={{ padding: '100px 0 80px' }}>
      {/* Radial gradient background */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          top: '-200px',
          width: '1000px',
          height: '600px',
          background:
            'radial-gradient(ellipse at center, rgba(231, 229, 228, 0.6) 0%, transparent 70%)',
        }}
      />
      <div className="mx-auto max-w-[1200px] px-6">
        <h1
          className="relative mb-7"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(52px, 8vw, 88px)',
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
              background: 'linear-gradient(135deg, #0c0a09 20%, #78716c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            выручку
          </em>
        </h1>
        <p
          className="relative mx-auto"
          style={{
            fontSize: '20px',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            marginBottom: '44px',
            lineHeight: 1.6,
            animation: 'fadeUp 0.8s ease 0.15s both',
          }}
        >
          Revroute — платформа для управления ссылками нового поколения. Короткие ссылки,
          аналитика конверсий и партнерские программы в одном сервисе.
        </p>
        <div
          className="relative flex items-center justify-center gap-4 max-md:flex-col"
          style={{ animation: 'fadeUp 0.8s ease 0.3s both' }}
        >
          <a
            href="https://app.revroute.ru/"
            className="inline-flex items-center justify-center rounded-xl text-base font-semibold no-underline transition-all hover:-translate-y-px"
            style={{
              padding: '14px 32px',
              background: 'var(--accent)',
              color: '#fff',
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            Начать бесплатно
          </a>
          <a
            href="https://app.revroute.ru/"
            className="inline-flex items-center justify-center rounded-xl text-base font-semibold no-underline border transition-all"
            style={{
              padding: '14px 32px',
              background: 'var(--bg-white)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          >
            Запросить демо
          </a>
        </div>
      </div>
    </section>
  )
}

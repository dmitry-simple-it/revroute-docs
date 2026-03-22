export function CTASection() {
  return (
    <section className="relative text-center" style={{ padding: '140px 0' }}>
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center bottom, rgba(231, 229, 228, 0.5) 0%, transparent 60%)',
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6">
        <h2
          className="relative mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.5px',
          }}
        >
          Усильте ваш
          <br />
          <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            маркетинг
          </em>
        </h2>
        <p
          className="relative mx-auto mb-10 text-lg"
          style={{ color: 'var(--text-muted)', maxWidth: '480px' }}
        >
          Узнайте, почему Revroute — платформа выбора для современных маркетинговых
          команд.
        </p>

        <div className="relative flex items-center justify-center gap-4 max-md:flex-col">
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
            className="inline-flex items-center justify-center rounded-xl border text-base font-semibold no-underline transition-all"
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

        <div className="relative mt-8 flex items-center justify-center gap-6 max-md:flex-col max-md:gap-3">
          {['G2', 'Product Hunt', 'Trustpilot'].map((platform) => (
            <span
              key={platform}
              className="flex items-center gap-1.5 text-[13px] font-medium"
              style={{ color: 'var(--text-dim)' }}
            >
              <span className="text-xs" style={{ color: '#fbbf24' }}>
                {'\u2605\u2605\u2605\u2605\u2605'}
              </span>{' '}
              {platform}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

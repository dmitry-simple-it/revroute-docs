export default function PricingTestimonial() {
  return (
    <section className="py-20">
      <div className="max-w-[720px] mx-auto text-center px-12 relative">
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 font-[family-name:var(--font-display)] text-[120px] text-[var(--border)] leading-none pointer-events-none select-none"
          aria-hidden="true"
        >
          {'\u201C'}
        </span>
        <blockquote className="relative">
          <p className="text-xl leading-relaxed text-[var(--text-secondary)] mb-7 italic font-[family-name:var(--font-display)]">
            Revroute Partners гибкий и мощный, без лишней сложности. Партнёры видят лиды, конверсии и
            выплаты в реальном времени, а мы получаем удобную партнёрскую программу, которая{' '}
            <strong className="font-semibold text-[var(--text)] not-italic font-[family-name:var(--font-body)]">
              реально генерирует продажи
            </strong>
            .
          </p>
          <footer className="flex items-center justify-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[var(--bg-muted)] border-2 border-[var(--border)] flex items-center justify-center text-sm font-bold text-[var(--text-muted)]">
              AP
            </div>
            <div className="text-left">
              <div className="text-[15px] font-bold text-[var(--text)]">Alex Persson</div>
              <div className="text-[13px] text-[var(--text-muted)]">CEO, Privy</div>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}

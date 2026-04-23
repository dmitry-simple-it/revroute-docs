type Step = { label: string; value: string; share: number; color?: string }

export function ConversionFunnel({
  steps,
  title = 'Воронка',
}: {
  steps: Step[]
  title?: string
}) {
  return (
    <div
      className="border"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[15px] font-bold">{title}</div>
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}
        >
          30 дней
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3 text-sm">
            <div className="w-32 shrink-0 font-medium">{s.label}</div>
            <div
              className="relative flex-1 overflow-hidden rounded-md"
              style={{ background: 'var(--bg-muted)', height: 28 }}
            >
              <div
                className="absolute inset-y-0 left-0 flex items-center px-3 text-xs font-semibold text-white"
                style={{
                  width: `${s.share}%`,
                  background: s.color ?? 'var(--text)',
                  transformOrigin: 'left center',
                  animation: `growX 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s both`,
                }}
              >
                {s.share}%
              </div>
            </div>
            <div className="w-20 shrink-0 text-right font-bold">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

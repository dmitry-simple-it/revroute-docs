export function AnnouncementBar() {
  return (
    <div
      className="mt-16 text-center border-b px-4 py-3"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
      }}
    >
      <a
        href="#"
        className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm font-medium no-underline transition-opacity hover:opacity-70"
        style={{ color: 'var(--text)' }}
      >
        <span
          className="shrink-0 text-[11px] font-bold uppercase tracking-wide rounded-full"
          style={{
            background: 'var(--blue)',
            color: '#fff',
            padding: '3px 10px',
            letterSpacing: '0.5px',
          }}
        >
          Новое
        </span>
        <span className="hidden sm:inline">Партнёрские программы — создавайте реферальные сети за минуты</span>
        <span className="sm:hidden">Партнёрские программы — за минуты</span>
        <span className="shrink-0" style={{ color: 'var(--text-dim)' }}>&rarr;</span>
      </a>
    </div>
  )
}

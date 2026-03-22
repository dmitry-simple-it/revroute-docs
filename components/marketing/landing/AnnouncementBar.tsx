export function AnnouncementBar() {
  return (
    <div
      className="mt-16 text-center border-b"
      style={{
        padding: '12px 0',
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
      }}
    >
      <a
        href="#"
        className="inline-flex items-center gap-2.5 text-sm font-medium no-underline transition-opacity hover:opacity-70"
        style={{ color: 'var(--text)' }}
      >
        <span
          className="text-[11px] font-bold uppercase tracking-wide rounded-full"
          style={{
            background: 'var(--blue)',
            color: '#fff',
            padding: '3px 10px',
            letterSpacing: '0.5px',
          }}
        >
          Новое
        </span>
        Партнерские программы — создавайте реферальные сети за минуты
        <span style={{ color: 'var(--text-dim)' }}>&rarr;</span>
      </a>
    </div>
  )
}

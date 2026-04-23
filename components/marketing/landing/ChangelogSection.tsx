import { AnimateOnScroll } from './AnimateOnScroll'

const changelogItems = [
  { date: '18 мар 2026', title: 'Выплаты в стейблкоинах' },
  { date: '5 мар 2026', title: 'Каскадные длительности вознаграждений' },
  { date: '4 мар 2026', title: 'Групповые правила перемещения' },
  { date: '3 мар 2026', title: 'Баунти по социальным метрикам' },
  { date: '2 мар 2026', title: 'Массовое приглашение партнёров' },
]

export function ChangelogSection() {
  return (
    <AnimateOnScroll>
      <section
        className="border-t text-center"
        style={{ padding: '100px 0', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 400,
            }}
          >
            Релизим{' '}
            <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              каждую неделю
            </em>
          </h2>
          <p className="mb-12 text-base" style={{ color: 'var(--text-muted)' }}>
            Постоянные улучшения, новые функции и возможности.
          </p>

          <div className="mx-auto max-w-[600px] text-left">
            {changelogItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 py-4"
                style={{
                  borderBottom:
                    i < changelogItems.length - 1
                      ? '1px solid var(--border-light, #f5f5f4)'
                      : 'none',
                }}
              >
                <span
                  className="shrink-0 pt-0.5 text-[13px] font-medium"
                  style={{
                    color: 'var(--text-dim)',
                    whiteSpace: 'nowrap',
                    minWidth: '90px',
                  }}
                >
                  {item.date}
                </span>
                <span className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          <a
            href="#"
            className="mt-6 inline-block border-b pb-0.5 text-sm font-semibold no-underline transition-colors"
            style={{
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          >
            Полный changelog &rarr;
          </a>
        </div>
      </section>
    </AnimateOnScroll>
  )
}

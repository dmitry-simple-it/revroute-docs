import { AnimateOnScroll } from './AnimateOnScroll'

const cards = [
  {
    title: 'Метрики, которые приносят деньги',
    desc: 'Лиды, оплаты и LTV вместо CTR, показов и кликов — считаем то, что доходит до выручки.',
  },
  {
    title: 'Атрибуция от первого касания',
    desc: 'Каждое событие в одной цепочке: канал → клик → оплата. Без догадок и ручных таблиц.',
  },
  {
    title: 'Ясность вместо дашбордов',
    desc: 'Простой ответ на главный вопрос — какой канал приносит деньги, а какой только трафик.',
  },
]

export function ManifestoSection() {
  return (
    <AnimateOnScroll>
      <section className="text-center" style={{ padding: '120px 0 80px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              marginBottom: '24px',
            }}
          >
            Маркетинг — это не про клики.
            <br />
            Это про{' '}
            <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              результат.
            </em>
          </h2>

          <p
            className="mx-auto"
            style={{
              fontSize: '19px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '640px',
              marginBottom: '56px',
            }}
          >
            Revroute объединяет короткие ссылки, сквозную аналитику и партнёрские
            программы — чтобы вы видели, какой канал реально приносит деньги.
          </p>

          <div className="mx-auto grid max-w-[1080px] grid-cols-3 gap-4 text-left max-md:grid-cols-1">
            {cards.map((card) => (
              <div
                key={card.title}
                className="border transition-all hover:-translate-y-0.5"
                style={{
                  background: 'var(--bg-white)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                }}
              >
                <h4 className="mb-2 text-base font-bold">{card.title}</h4>
                <p className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  )
}

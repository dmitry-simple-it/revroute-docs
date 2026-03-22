import { AnimateOnScroll } from './AnimateOnScroll'

export function ManifestoSection() {
  return (
    <AnimateOnScroll>
      <section className="text-center" style={{ padding: '140px 0' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 400,
                letterSpacing: '-0.5px',
                lineHeight: 1.15,
                marginBottom: '40px',
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
                lineHeight: 1.8,
                maxWidth: '680px',
                marginBottom: '24px',
              }}
            >
              Годами маркетологи жили в мире метрик тщеславия: клики, показы, CTR. Но
              бизнесу нужен ответ на один вопрос —{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>
                какой канал приносит деньги?
              </strong>
            </p>
            <p
              className="mx-auto"
              style={{
                fontSize: '19px',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                maxWidth: '680px',
                marginBottom: '24px',
              }}
            >
              Revroute объединяет короткие ссылки, сквозную аналитику и партнёрские
              программы в одной платформе.{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>
                Быстрая. Надёжная. Красивая.
              </strong>{' '}
              И масштабируется вместе с вами.
            </p>
            <p
              className="mx-auto"
              style={{
                fontSize: '19px',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                maxWidth: '680px',
                marginBottom: '24px',
              }}
            >
              Потому что вы заслуживаете не дашборд с графиками, а{' '}
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>ясность</strong>.
            </p>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  )
}

import { AnimateOnScroll } from './AnimateOnScroll'

const testimonials = [
  {
    featured: true,
    company: 'Framer',
    text: (
      <>
        Revroute — это просто{' '}
        <strong>лучший способ отслеживать ссылки и измерять атрибуцию</strong>. Просто,
        чисто и работает — в то время как все альтернативы выглядят раздутыми, сложными и
        устаревшими.
      </>
    ),
    initials: 'JD',
    name: 'Jorn van Dijk',
    role: 'CEO, Framer',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        То, что вы создали — просто <strong>невероятно</strong>. Я пользовался Bitly и
        другими сервисами годами, но Revroute — лучший инструмент для работы со ссылками.
      </>
    ),
    initials: 'АК',
    name: 'Алексей Козлов',
    role: 'Head of Growth, MediaTech',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        Revroute стал <strong>настоящим прорывом</strong> для наших маркетинговых кампаний.
        Наши ссылки получают десятки миллионов кликов ежемесячно.
      </>
    ),
    initials: 'JH',
    name: 'Johnny Ho',
    role: 'Co-founder, Perplexity',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        Мы активные пользователи Revroute с первого дня! Продукт невероятно полезен, и
        создан с <strong>одержимым вниманием к UX</strong>.
      </>
    ),
    initials: 'PR',
    name: 'Peer Richelsen',
    role: 'Co-founder, Cal.com',
  },
  {
    featured: true,
    company: 'Vercel',
    text: (
      <>
        Stripe для платежей, Vercel для деплоев,{' '}
        <strong>Revroute для ссылок</strong>. По мере развития облака мы выделяем общие
        потребности в переиспользуемую, высокопроизводительную инфраструктуру. Рад, что
        Revroute заполняет этот фундаментальный пробел.
      </>
    ),
    initials: 'GR',
    name: 'Guillermo Rauch',
    role: 'CEO, Vercel',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        Инфраструктура ссылок Revroute невероятно надёжна — мы используем её в продакшене,
        создавая тысячи ссылок в месяц с{' '}
        <strong>латентностью менее 150мс</strong>.
      </>
    ),
    initials: 'JS',
    name: 'Jack Sharkey',
    role: 'CTO, Whop',
  },
]

export function TestimonialsSection() {
  return (
    <AnimateOnScroll>
      <section
        className="border-t"
        style={{ padding: '120px 0', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <h2
            className="mb-3 text-center"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 400,
              letterSpacing: '-0.5px',
            }}
          >
            Нам доверяют{' '}
            <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              лидеры
            </em>
          </h2>
          <p
            className="mx-auto mb-16 text-center text-lg"
            style={{ color: 'var(--text-muted)', maxWidth: '560px' }}
          >
            Присоединяйтесь к 100 000+ клиентов, которые используют нашу платформу для
            роста бизнеса.
          </p>

          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`flex flex-col border transition-all hover:-translate-y-0.5 ${
                  t.featured ? 'col-span-2 max-lg:col-span-1' : ''
                }`}
                style={{
                  background: t.featured ? 'var(--bg-dark)' : 'var(--bg-white)',
                  color: t.featured ? '#fff' : undefined,
                  borderColor: t.featured ? 'transparent' : 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                }}
              >
                {t.company && (
                  <div
                    className="mb-4 text-[13px] font-semibold"
                    style={{
                      color: t.featured
                        ? 'rgba(255,255,255,0.6)'
                        : 'var(--text-muted)',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {t.company}
                  </div>
                )}
                {t.stars && (
                  <div
                    className="mb-4 text-sm"
                    style={{ color: '#fbbf24', letterSpacing: '2px' }}
                  >
                    {'\u2605\u2605\u2605\u2605\u2605'}
                  </div>
                )}
                <div
                  className="mb-6 flex-grow text-[15px] leading-relaxed"
                  style={{
                    color: t.featured
                      ? 'rgba(255,255,255,0.85)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {t.text}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: t.featured
                        ? 'rgba(255,255,255,0.12)'
                        : 'var(--bg-muted)',
                      color: t.featured
                        ? 'rgba(255,255,255,0.7)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div
                      className="text-xs"
                      style={{
                        color: t.featured
                          ? 'rgba(255,255,255,0.45)'
                          : 'var(--text-dim)',
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  )
}

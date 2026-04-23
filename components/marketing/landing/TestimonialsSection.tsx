import { AnimateOnScroll } from './AnimateOnScroll'

const testimonials = [
  {
    featured: true,
    company: 'TapFlow',
    text: (
      <>
        Раньше партнёрская программа у нас жила в таблицах и ручных выплатах. С Revroute
        мы <strong>запустили её по-взрослому за один день</strong>: автоматические
        комиссии, прозрачный кабинет для партнёров, выплаты в рублях без плясок с
        бухгалтерией.
      </>
    ),
    initials: 'АС',
    name: 'Артём Соколов',
    role: 'CEO, TapFlow',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        Как автор работаю сразу с тремя партнёрскими программами через Revroute. Все
        комиссии и выплаты <strong>в одном кабинете</strong> — намного удобнее, чем
        вести свои таблицы по каждому бренду.
      </>
    ),
    initials: 'ЕН',
    name: 'Екатерина Новикова',
    role: 'Автор канала «Рост в цифре»',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        Впервые увидели конверсию до рубля по каждому блогеру. Раньше гадали, кто реально
        приводит платящих учеников — теперь <strong>видим цифры в реальном времени</strong>{' '}
        и перераспределяем бюджеты осознанно.
      </>
    ),
    initials: 'ДВ',
    name: 'Дмитрий Волков',
    role: 'Head of Marketing, Smart English Academy',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        За месяц <strong>подключили 40 новых партнёров через маркетплейс</strong>. На
        холодные рассылки и поиск контактов раньше уходили месяцы — теперь партнёры
        находят нас сами.
      </>
    ),
    initials: 'ОВ',
    name: 'Ольга Ветрова',
    role: 'CMO, «Мой Маркет»',
  },
  {
    featured: true,
    company: 'Paycore',
    text: (
      <>
        У нас B2B с длинным циклом продажи, и точная атрибуция критична. Revroute даёт{' '}
        <strong>сквозную картину от клика до сделки</strong>, а SDK и API встали без
        сюрпризов — команда интегрировала за пару спринтов и спит спокойно.
      </>
    ),
    initials: 'ИМ',
    name: 'Илья Миронов',
    role: 'CTO, Paycore',
  },
  {
    featured: false,
    stars: true,
    text: (
      <>
        Ведём партнёрские программы для <strong>15+ клиентов агентства</strong>.
        Revroute закрыл потребность в нормальном дашборде и автоматических выплатах —
        ушли от самописных решений и освободили разработчиков.
      </>
    ),
    initials: 'РЗ',
    name: 'Роман Захаров',
    role: 'Head of Growth, Digital Partners',
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
            Маркетологи, основатели и агентства, которые используют Revroute, чтобы
            превращать клики в выручку и запускать партнёрские программы без костылей.
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

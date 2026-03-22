import { AnimateOnScroll } from './AnimateOnScroll'

const tickerItems = [
  { type: 'click', text: 'Новый клик \u00b7 Москва', amount: null },
  { type: 'sale', text: 'Новая продажа', amount: '$1.44' },
  { type: 'lead', text: 'Новый лид \u00b7 СПб', amount: null },
  { type: 'click', text: 'Новый клик \u00b7 Казань', amount: null },
  { type: 'sale', text: 'Новая продажа', amount: '$0.45' },
  { type: 'lead', text: 'Новый лид \u00b7 Новосибирск', amount: null },
  { type: 'sale', text: 'Новая продажа', amount: '$0.12' },
  { type: 'click', text: 'Новый клик \u00b7 Екатеринбург', amount: null },
]

const dotColors: Record<string, string> = {
  click: '#60a5fa',
  lead: '#34d399',
  sale: '#fbbf24',
}

const apiFeatureCards = [
  { title: 'Вебхуки', desc: 'Уведомления о событиях в реальном времени.' },
  { title: 'Диплинки', desc: 'Отправляйте пользователей в нужное место в приложении.' },
  { title: 'SDK', desc: 'TypeScript, Python, Go, PHP, Ruby.' },
]

export function EnterpriseSection() {
  // Duplicate ticker items for seamless loop
  const allTickerItems = [...tickerItems, ...tickerItems]

  return (
    <>
      {/* Scale Section */}
      <AnimateOnScroll>
        <section
          id="enterprise"
          className="border-t text-center"
          style={{ padding: '120px 0', borderColor: 'var(--border)' }}
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 400,
                letterSpacing: '-0.5px',
              }}
            >
              Создан для{' '}
              <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                масштаба
              </em>
            </h2>
            <p
              className="mx-auto mb-16 text-lg"
              style={{ color: 'var(--text-muted)', maxWidth: '600px' }}
            >
              Надёжная инфраструктура обрабатывает сотни миллионов ссылок и событий
              ежемесячно и масштабируется вместе с вашим бизнесом.
            </p>

            <div className="mx-auto mb-12 grid max-w-[800px] grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-4">
              {[
                { value: '150M+', label: 'Ссылок создано' },
                { value: '1B+', label: 'Событий отслежено' },
                { value: '$2M+', label: 'Выручки отслежено' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border"
                  style={{
                    padding: '32px 24px',
                    background: 'var(--bg-white)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    className="mb-2 leading-none"
                    style={{
                      fontSize: '42px',
                      fontWeight: 800,
                      letterSpacing: '-2px',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Live ticker */}
            <div
              className="relative mx-auto overflow-hidden"
              style={{
                background: 'var(--bg-dark)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                maxWidth: '400px',
                height: '200px',
              }}
            >
              <div
                className="pointer-events-none absolute right-0 bottom-0 left-0 z-10"
                style={{
                  height: '60px',
                  background: 'linear-gradient(transparent, var(--bg-dark))',
                }}
              />
              <div style={{ animation: 'ticker 8s linear infinite' }}>
                {allTickerItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: dotColors[item.type] }}
                    />
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {item.text}
                    </span>
                    {item.amount && (
                      <span
                        className="ml-auto text-[13px] font-bold"
                        style={{ color: '#34d399' }}
                      >
                        {item.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* API Section */}
      <section
        className="border-t"
        style={{ padding: '120px 0', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1">
            <div>
              <span
                className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase"
                style={{ color: 'var(--blue)', letterSpacing: '1.5px' }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: 'currentColor' }}
                />
                API
              </span>
              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 400,
                  letterSpacing: '-0.5px',
                  lineHeight: 1.15,
                }}
              >
                Инфраструктура
                <br />
                <em style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                  enterprise-класса
                </em>
              </h2>
              <p
                className="mb-8 text-lg leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                Программно создавайте миллионы коротких ссылок с диплинками и вебхуками
                реального времени.
              </p>
              <a
                href="https://revroute.ru/ru/docs"
                className="inline-flex items-center justify-center rounded-[10px] border text-sm font-semibold no-underline transition-all"
                style={{
                  padding: '10px 20px',
                  background: 'var(--bg-white)',
                  color: 'var(--text)',
                  borderColor: 'var(--border)',
                }}
              >
                Документация API
              </a>

              <div className="mt-8 grid grid-cols-3 gap-4 max-md:grid-cols-1">
                {apiFeatureCards.map((card) => (
                  <div
                    key={card.title}
                    className="border transition-all hover:-translate-y-0.5"
                    style={{
                      padding: '28px',
                      background: 'var(--bg-white)',
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <h4 className="mb-1.5 text-base font-bold">{card.title}</h4>
                    <p
                      className="text-sm leading-snug"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Code block */}
            <div>
              <div
                className="relative overflow-x-auto"
                style={{
                  background: 'var(--bg-dark)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  fontFamily:
                    "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
                  fontSize: '13px',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                {/* Window dots */}
                <div
                  className="absolute top-4 left-4 h-3 w-3 rounded-full"
                  style={{
                    background: '#ef4444',
                    boxShadow: '18px 0 0 #fbbf24, 36px 0 0 #22c55e',
                  }}
                />
                <pre className="mt-5 whitespace-pre">
                  <span style={{ color: '#c084fc' }}>import</span>
                  {' { Revroute } '}
                  <span style={{ color: '#c084fc' }}>from</span>{' '}
                  <span style={{ color: '#34d399' }}>&quot;revroute&quot;</span>;
                  {'\n\n'}
                  <span style={{ color: '#c084fc' }}>const</span> revroute ={' '}
                  <span style={{ color: '#c084fc' }}>new</span> Revroute({'{'}
                  {'\n  '}
                  <span style={{ color: '#60a5fa' }}>token</span>:{' '}
                  <span style={{ color: '#34d399' }}>&quot;REVROUTE_API_KEY&quot;</span>,
                  {'\n})'};{'\n\n'}
                  <span style={{ color: '#c084fc' }}>const</span> {'{ shortLink }'} ={' '}
                  <span style={{ color: '#c084fc' }}>await</span> revroute.links.create({'{'}
                  {'\n  '}
                  <span style={{ color: '#60a5fa' }}>url</span>:{' '}
                  <span style={{ color: '#34d399' }}>&quot;https://example.com&quot;</span>,
                  {'\n  '}
                  <span style={{ color: '#60a5fa' }}>domain</span>:{' '}
                  <span style={{ color: '#34d399' }}>&quot;go.revroute.ru&quot;</span>,
                  {'\n})'};{'\n\n'}
                  console.log(shortLink);{'\n'}
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {'// \u2192 https://go.revroute.ru/abc123'}
                  </span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { CodeBlock, Comment, Ident, Keyword, StringLit } from '@/components/marketing/shared/CodeBlock'

export const metadata: Metadata = {
  title: 'API — REST, SDK и вебхуки Revroute',
  description:
    'REST API, SDK для TypeScript, Python, Go, PHP, Ruby и вебхуки Revroute для программного управления ссылками, аналитикой и партнёрскими программами.',
  alternates: { canonical: '/api' },
}

const endpoints = [
  { method: 'POST', path: '/v1/links', desc: 'Создать короткую ссылку' },
  { method: 'GET', path: '/v1/links/:id', desc: 'Получить ссылку и её статистику' },
  { method: 'PATCH', path: '/v1/links/:id', desc: 'Обновить назначение или настройки' },
  { method: 'GET', path: '/v1/analytics', desc: 'Клики, лиды, продажи с группировкой' },
  { method: 'POST', path: '/v1/events/track', desc: 'Серверный трекинг конверсий' },
  { method: 'GET', path: '/v1/partners', desc: 'Список партнёров и их метрик' },
  { method: 'POST', path: '/v1/payouts', desc: 'Запустить выплату партнёрам' },
  { method: 'POST', path: '/v1/webhooks', desc: 'Подписка на события' },
]

const methodColor: Record<string, string> = {
  GET: 'var(--blue)',
  POST: 'var(--green)',
  PATCH: 'var(--orange)',
  DELETE: 'var(--red, #ef4444)',
}

export default function ApiPage() {
  return (
    <>
      <PageHero
        eyebrow="Revroute API"
        eyebrowColor="blue"
        title={
          <>
            API для ваших
            <br />
            <em style={{ fontStyle: 'italic' }}>интеграций</em>
          </>
        }
        desc="REST API, нативные SDK и вебхуки для TypeScript, Python, Go, PHP и Ruby. Встраивайте ссылки, аналитику и партнёрские программы прямо в ваш продукт."
        actions={
          <>
            <PrimaryButton href="/ru/docs">Открыть документацию</PrimaryButton>
            <SecondaryButton href="https://app.revroute.ru/">Получить API-ключ</SecondaryButton>
          </>
        }
      />

      {/* SDK snippets */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Нативные SDK</Eyebrow>
            <SectionHeading className="mt-5">
              Пишите на своём
              <br />
              <em style={{ fontStyle: 'italic' }}>языке</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              SDK покрывают все эндпоинты API и включают типы, ретраи, пагинацию и подписание вебхуков.
            </SectionDesc>
          </div>

          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
            <CodeBlock label="TypeScript">
              <Keyword>import</Keyword> {'{ Revroute }'} <Keyword>from</Keyword>{' '}
              <StringLit>&quot;revroute&quot;</StringLit>;
              {'\n\n'}
              <Keyword>const</Keyword> rv = <Keyword>new</Keyword> Revroute({'{'}
              {'\n  '}
              <Ident>token</Ident>: process.env.REVROUTE_KEY,
              {'\n})'};{'\n\n'}
              <Keyword>const</Keyword> {'{ shortLink }'} ={' '}
              <Keyword>await</Keyword> rv.links.create({'{'}
              {'\n  '}
              <Ident>url</Ident>:{' '}
              <StringLit>&quot;https://example.com&quot;</StringLit>,
              {'\n  '}
              <Ident>domain</Ident>:{' '}
              <StringLit>&quot;go.revroute.ru&quot;</StringLit>,
              {'\n})'};{'\n'}
              <Comment>{'// → https://go.revroute.ru/abc'}</Comment>
            </CodeBlock>
            <CodeBlock label="Python">
              <Keyword>from</Keyword> revroute{' '}
              <Keyword>import</Keyword> Revroute{'\n\n'}
              rv = Revroute(token=<StringLit>&quot;REV_KEY&quot;</StringLit>){'\n\n'}
              link = rv.links.create({'\n  '}
              url=<StringLit>&quot;https://example.com&quot;</StringLit>,
              {'\n  '}domain=<StringLit>&quot;go.revroute.ru&quot;</StringLit>,
              {'\n  '}tags=[<StringLit>&quot;promo&quot;</StringLit>],
              {'\n)'}{'\n'}
              <Keyword>print</Keyword>(link.short_link){'\n'}
              <Comment>{'# → https://go.revroute.ru/abc'}</Comment>
            </CodeBlock>
            <CodeBlock label="Go">
              <Keyword>package</Keyword> main{'\n\n'}
              <Keyword>import</Keyword> <StringLit>&quot;github.com/revroute/revroute-go&quot;</StringLit>
              {'\n\n'}
              rv := revroute.New(<StringLit>&quot;REV_KEY&quot;</StringLit>){'\n'}
              link, _ := rv.Links.Create(ctx, revroute.CreateLinkParams{'{'}
              {'\n  '}
              <Ident>URL</Ident>: <StringLit>&quot;https://example.com&quot;</StringLit>,
              {'\n  '}
              <Ident>Domain</Ident>: <StringLit>&quot;go.revroute.ru&quot;</StringLit>,
              {'\n})'}{'\n'}
              fmt.Println(link.ShortLink){'\n'}
              <Comment>{'// → https://go.revroute.ru/abc'}</Comment>
            </CodeBlock>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { l: 'TypeScript / Node.js', href: '/ru/docs/sdks/typescript' },
              { l: 'Python', href: '/ru/docs/sdks/python' },
              { l: 'Go', href: '/ru/docs/sdks/go' },
              { l: 'PHP', href: '/ru/docs/sdks/php' },
              { l: 'Ruby', href: '/ru/docs/sdks/ruby' },
            ].map((s) => (
              <a
                key={s.l}
                href={s.href}
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium"
                style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Документация {s.l} →
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints list */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="orange">Endpoints</Eyebrow>
            <SectionHeading className="mt-5">
              Ключевые <em style={{ fontStyle: 'italic' }}>эндпоинты</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Полный REST-интерфейс платформы. Аутентификация по Bearer-токену, пагинация и стандартные коды
              ошибок HTTP.
            </SectionDesc>
          </div>

          <div
            className="overflow-hidden border"
            style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', borderRadius: 'var(--radius-xl)' }}
          >
            {endpoints.map((e) => (
              <div
                key={e.method + e.path}
                className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b px-5 py-4 text-sm max-md:grid-cols-1"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <span
                  className="inline-flex w-fit items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase text-white"
                  style={{ background: methodColor[e.method] || 'var(--text)', letterSpacing: '0.08em' }}
                >
                  {e.method}
                </span>
                <span className="font-mono text-[13px]" style={{ color: 'var(--text)' }}>
                  {e.path}
                </span>
                <span className="text-right text-sm max-md:text-left" style={{ color: 'var(--text-muted)' }}>
                  {e.desc}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/ru/docs"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              Полная справка API
            </a>
            <a
              href="/ru/docs/integrations"
              className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Вебхуки и события
            </a>
          </div>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Встройте <em style={{ fontStyle: 'italic' }}>Revroute</em>
            <br />в свой продукт
          </>
        }
        desc="Получите API-ключ и начните — free-tier даёт всё, что нужно для первой интеграции."
        primary={{ href: 'https://app.revroute.ru/', label: 'Получить API-ключ' }}
        secondary={{ href: '/ru/docs', label: 'Документация' }}
      />
    </>
  )
}

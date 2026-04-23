import type { Metadata } from 'next'
import { PageHero, PrimaryButton, SecondaryButton } from '@/components/marketing/shared/PageHero'
import { PageCTA } from '@/components/marketing/shared/PageCTA'
import { Eyebrow, SectionDesc, SectionHeading } from '@/components/marketing/shared/Typography'
import { FeatureGrid } from '@/components/marketing/shared/FeatureGrid'
import { StatsRow } from '@/components/marketing/shared/StatsRow'
import { AnimateOnScroll } from '@/components/marketing/landing/AnimateOnScroll'

export const metadata: Metadata = {
  title: 'Enterprise — платформа ссылок и партнёрок для крупного бизнеса',
  description:
    'Revroute Enterprise — SOC 2, SAML/SSO, аудит-логи, SLA 99.99%, выделенный менеджер успеха и приватная инсталляция для корпоративных команд.',
  alternates: { canonical: '/enterprise' },
}

const supportCards = [
  {
    title: 'Выделенный менеджер',
    desc: 'Персональный CSM, помогающий со стратегией и запуском ключевых кампаний.',
  },
  {
    title: 'Slack-канал',
    desc: 'Приоритетная поддержка в общем канале с командой инженеров и продукта.',
  },
  {
    title: 'SLA 99.99%',
    desc: 'Финансовые гарантии доступности на ядро платформы и API.',
  },
]

const securityCards = [
  { title: 'SAML / SSO', desc: 'Okta, Azure AD, Google Workspace, Keycloak и любые OIDC-провайдеры.' },
  { title: 'SCIM', desc: 'Автоматическое подключение и отключение сотрудников.' },
  { title: 'Аудит-логи', desc: 'Полная история действий пользователей с экспортом в ваш SIEM.' },
  { title: 'RBAC', desc: 'Гранулярные роли для команд продукта, маркетинга и бухгалтерии.' },
  { title: 'Encrypted at rest', desc: 'AES-256 для данных на диске и TLS 1.3 в транзите.' },
  { title: 'Хранение в РФ', desc: 'Опция размещения данных в ЦОД на территории РФ (152-ФЗ).' },
]

export default function EnterprisePage() {
  return (
    <>
      <PageHero
        eyebrow="Revroute Enterprise"
        eyebrowColor="blue"
        title={
          <>
            Корпоративная
            <br />
            <em style={{ fontStyle: 'italic' }}>атрибуция ссылок</em>
          </>
        }
        desc="Масштабная инфраструктура для банков, ритейла, телекома и SaaS-лидеров: безопасность, управление доступом и поддержка уровня SLA."
        actions={
          <>
            <PrimaryButton href="/contact/support">Запросить демо</PrimaryButton>
            <SecondaryButton href="https://app.revroute.ru/">Попробовать самостоятельно</SecondaryButton>
          </>
        }
      />

      {/* Scalability stats */}
      <section style={{ padding: '80px 0' }}>
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <SectionHeading align="center">
            Масштабируется вместе
            <br />с <em style={{ fontStyle: 'italic' }}>вашим бизнесом</em>
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-[640px] text-base" style={{ color: 'var(--text-muted)' }}>
            Мы спроектированы под миллиардные объёмы кликов и событий — без переписываний и миграций при росте.
          </p>
          <div className="mt-12">
            <StatsRow
              stats={[
                { value: '7.5 млрд', label: 'Кликов обработано за год' },
                { value: '99.99%', label: 'Аптайм на API и редиректах' },
                { value: '<70 мс', label: 'Средняя задержка редиректа' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Enterprise support */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="green">Корпоративная поддержка</Eyebrow>
            <SectionHeading className="mt-5">
              Команда поддержки —
              <br />
              <em style={{ fontStyle: 'italic' }}>часть вашего успеха</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Мы сопровождаем внедрение от kick-off до первых продакшн-кампаний и дальше — быстрые каналы,
              прозрачный SLA и выделенный CSM.
            </SectionDesc>
          </div>
          <FeatureGrid cards={supportCards} cols={3} />
        </div>
      </section>

      {/* Data / account security */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10">
            <Eyebrow color="blue">Безопасность</Eyebrow>
            <SectionHeading className="mt-5">
              Контроль аккаунтов
              <br />
              и <em style={{ fontStyle: 'italic' }}>данных</em>
            </SectionHeading>
            <SectionDesc className="mt-6">
              Управление доступом корпоративного уровня и обработка данных по лучшим практикам индустрии.
            </SectionDesc>
          </div>
          <FeatureGrid cards={securityCards} cols={3} />
        </div>
      </section>

      {/* Compliance / open source */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-2 items-center gap-12 max-lg:grid-cols-1">
            <div>
              <Eyebrow color="purple">Соответствие</Eyebrow>
              <SectionHeading className="mt-5">
                Требования безопасности —
                <br />
                <em style={{ fontStyle: 'italic' }}>из коробки</em>
              </SectionHeading>
              <SectionDesc className="mt-6">
                Revroute соответствует корпоративным политикам по безопасности и обработке персональных данных.
              </SectionDesc>
              <div className="mt-8 flex flex-wrap gap-3">
                {['SOC 2 Type II', 'ISO 27001', 'GDPR', '152-ФЗ', 'OWASP'].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold"
                    style={{ background: 'var(--bg-white)', borderColor: 'var(--border)' }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: 'var(--green)' }} />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <AnimateOnScroll>
              <div
                className="border"
                style={{
                  background: 'var(--bg-dark)',
                  color: '#fff',
                  borderColor: 'transparent',
                  borderRadius: 'var(--radius-xl)',
                  padding: '32px',
                }}
              >
                <div className="text-xs uppercase" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
                  Полный контроль
                </div>
                <div className="mt-3 text-2xl font-bold">Приватная инсталляция</div>
                <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Разверните Revroute в вашем облаке или on-prem. Мы помогаем с инфраструктурой,
                  apply-ом безопасности и обновлениями.
                </p>
                <div className="mt-6 flex flex-col gap-2 text-sm">
                  {[
                    'Ваш домен · ваша инфраструктура',
                    'Подключение к вашему IdP',
                    'Интеграции с вашим SIEM / DLP',
                    'Хранение логов в вашем хранилище',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: '#34d399' }}
                      />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Demo form */}
      <section className="border-t" style={{ padding: '80px 0', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[720px] px-6">
          <div className="text-center">
            <SectionHeading align="center" size="md">
              Готовы поговорить?
            </SectionHeading>
            <p className="mx-auto mt-4 max-w-[520px] text-base" style={{ color: 'var(--text-muted)' }}>
              Покажем платформу на примере ваших данных за 30 минут и подготовим цифры под ваш объём.
            </p>
          </div>
          <form
            action="mailto:sales@revroute.ru"
            method="post"
            encType="text/plain"
            className="mt-10 grid grid-cols-2 gap-4 max-md:grid-cols-1"
          >
            {[
              { name: 'name', label: 'Имя', type: 'text' },
              { name: 'company', label: 'Компания', type: 'text' },
              { name: 'email', label: 'Рабочая почта', type: 'email' },
              { name: 'phone', label: 'Телефон (опционально)', type: 'tel' },
            ].map((f) => (
              <label key={f.name} className="flex flex-col gap-1.5 text-sm">
                <span style={{ color: 'var(--text-muted)' }}>{f.label}</span>
                <input
                  name={f.name}
                  type={f.type}
                  className="rounded-lg border px-3 py-2.5 text-sm"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }}
                />
              </label>
            ))}
            <label className="col-span-2 flex flex-col gap-1.5 text-sm max-md:col-span-1">
              <span style={{ color: 'var(--text-muted)' }}>Расскажите о задаче</span>
              <textarea
                name="message"
                rows={4}
                className="rounded-lg border px-3 py-2.5 text-sm"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-white)' }}
              />
            </label>
            <button
              type="submit"
              className="col-span-2 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white max-md:col-span-1"
              style={{ background: 'var(--accent)' }}
            >
              Запросить демо
            </button>
          </form>
        </div>
      </section>

      <PageCTA
        title={
          <>
            Корпоративная платформа
            <br />
            атрибуции <em style={{ fontStyle: 'italic' }}>под ключ</em>
          </>
        }
        desc="Покажем, как Revroute встраивается в ваш стек и закрывает требования безопасности за одно внедрение."
        primary={{ href: '/contact/support', label: 'Запросить демо' }}
        secondary={{ href: '/pricing', label: 'Смотреть тарифы' }}
      />
    </>
  )
}

/**
 * Site footer — DS v2 design: a frosted, rounded-top inset panel. Brand column
 * (wordmark + blurb + round social buttons) beside four link columns (Продукт
 * with product-color squares, Решения, Ресурсы, Компания, Правовое), over a
 * status / made-in / copyright row. Links are honest: only real destinations.
 */
import type { ReactNode } from 'react'
import { Wordmark, Icon } from './primitives'

type FootLink = { label: string; href: string; external?: boolean; square?: string }

const SOCIALS: { name: string; icon: string; href: string }[] = [
  { name: 'Telegram', icon: 'send', href: 'https://t.me/revroute_bot' },
  { name: 'MAX', icon: 'message-circle', href: 'https://max.ru/id7606127150_bot' },
]

const PRODUCT: FootLink[] = [{ label: 'PRM-платформа', href: '/prm', square: 'var(--accent)' }]
const SOLUTIONS: FootLink[] = [{ label: 'Для SaaS', href: '/solutions/saas' }]
const RESOURCES: FootLink[] = [
  { label: 'Тарифы', href: '/pricing' },
  { label: 'Документация', href: '/ru/docs' },
]
const COMPANY: FootLink[] = [
  { label: 'Создать программу', href: 'https://app.revroute.ru/register', external: true },
  { label: 'Войти', href: 'https://app.revroute.ru/login', external: true },
  { label: 'Партнёрам', href: 'https://partners.revroute.ru/', external: true },
  { label: 'Поддержка', href: '/contact/support' },
]
const LEGAL: FootLink[] = [
  { label: 'Оферта', href: '/ru/legal/saas-license' },
  { label: 'Конфиденциальность', href: '/ru/legal/privacy' },
  { label: 'Условия', href: '/ru/legal/terms' },
]

function Item({ link }: { link: FootLink }) {
  const extra = link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <li>
      <a href={link.href} className="rr-foot-link" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }} {...extra}>
        {link.square !== undefined && <span style={{ width: 13, height: 13, borderRadius: 4, background: link.square, flexShrink: 0 }} />}
        {link.label}
      </a>
    </li>
  )
}

function Col({ title, links }: { title: string; links: FootLink[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', margin: 0 }}>{title}</h3>
      <ul style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
        {links.map((l) => <Item key={l.label} link={l} />)}
      </ul>
    </div>
  )
}

export function Footer({
  blurb = 'PRM-платформа: запуск и ведение партнёрской программы. CRM — про клиентов, PRM — про партнёров.',
  copyright = '© 2026 RevRoute. Все права защищены.',
  status = 'Все системы работают',
  madeIn = 'Сделано в России',
}: {
  blurb?: ReactNode
  copyright?: string
  status?: string
  madeIn?: string
}) {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <footer style={{ maxWidth: 'var(--content)', margin: '96px auto 0', borderRadius: '20px 20px 0 0', borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)', borderRight: '1px solid var(--line)', background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '64px 40px' }}>
        <div className="rr-footer">
          {/* brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Wordmark size={26} />
            <p className="rr-small" style={{ maxWidth: '30ch', margin: 0 }}>{blurb}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="rr-foot-social" aria-label={s.name}>
                  <Icon name={s.icon} size={16} />
                </a>
              ))}
            </div>
          </div>
          {/* link columns */}
          <div className="rr-footer-links">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <Col title="Продукт" links={PRODUCT} />
              <Col title="Решения" links={SOLUTIONS} />
            </div>
            <Col title="Ресурсы" links={RESOURCES} />
            <Col title="Компания" links={COMPANY} />
            <Col title="Правовое" links={LEGAL} />
          </div>
        </div>

        {/* bottom row */}
        <div className="rr-footer-bottom" style={{ marginTop: 48 }}>
          <span className="rr-small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span className="rr-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green)', opacity: 0.75 }} />
              <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
            </span>
            {status}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--ink-3)', justifySelf: 'center' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />{madeIn}
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)', justifySelf: 'end' }}>{copyright}</span>
        </div>
      </footer>
    </div>
  )
}

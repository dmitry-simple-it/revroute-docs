'use client'

/**
 * Marketing top nav — DS v2 design: transparent → scroll-blur, three hover
 * mega-menus (Продукт / Решения / Ресурсы), primary CTA + login, burger under
 * 820px. Honest: live items link to real pages; not-yet-built products show a
 * muted "Скоро" roadmap card (no broken links). Menus grow as pages ship.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Wordmark, Button, Icon } from './primitives'

const APP_LOGIN = 'https://app.revroute.ru/login'
const APP_REGISTER = 'https://app.revroute.ru/register'
const PARTNERS = 'https://partners.revroute.ru/'

const Caret = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.278 3.389 4.5 6.167 1.722 3.389" /></svg>
)

type Menu = 'product' | 'solutions' | 'resources' | null

/** Mega card: a live product (href) or a muted "Скоро" roadmap item (no href). */
function MegaCard({
  icon, tint, ink, title, body, href, soon,
}: { icon: string; tint: string; ink: string; title: string; body: string; href?: string; soon?: boolean }) {
  const inner = (
    <>
      <span className="glow" />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: 7, background: tint, alignItems: 'center', justifyContent: 'center', color: ink }}><Icon name={icon} size={14} strokeWidth={2.2} /></span>
          {soon && <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)', border: '1px solid var(--line)', borderRadius: 999, padding: '2px 8px' }}>Скоро</span>}
        </div>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: soon ? 'var(--ink-3)' : 'var(--ink)', marginTop: 12 }}>{title}</span>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: '5px 0 0', lineHeight: 1.4 }}>{body}</p>
      </div>
    </>
  )
  const base: CSSProperties = { position: 'relative', overflow: 'hidden', display: 'block', border: '1px solid var(--line-2)', background: 'var(--bg)', borderRadius: 12, padding: 16, textDecoration: 'none' }
  if (href) return <a href={href} className="glow-card" style={soon ? { ...base, opacity: 0.9 } : base}>{inner}</a>
  return <div style={{ ...base, opacity: 0.85 }}>{inner}</div>
}

/** Large "explore" card — taller tile; same violet hover-glow as the product cards. */
function BigResCard({ icon, title, body, href }: { icon: string; title: string; body: string; href: string }) {
  return (
    <a href={href} className="glow-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150, border: '1px solid var(--line-2)', background: 'var(--bg)', borderRadius: 12, padding: 16, textDecoration: 'none' }}>
      <span className="glow" />
      <span style={{ position: 'relative', display: 'inline-flex', width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid var(--line)', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><Icon name={icon} size={19} /></span>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{body}</div>
      </div>
    </a>
  )
}

/** Small resource row — same violet hover-glow as the cards. */
function ResRow({ icon, title, body, href }: { icon: string; title: string; body: string; href: string }) {
  return (
    <a href={href} className="glow-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 10, textDecoration: 'none' }}>
      <span className="glow" />
      <span style={{ position: 'relative', display: 'inline-flex', width: 32, height: 32, borderRadius: 9, border: '1px solid var(--line)', background: '#fff', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--ink-2)' }}><Icon name={icon} size={16} /></span>
      <div style={{ position: 'relative' }}><div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{title}</div><div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{body}</div></div>
    </a>
  )
}

export function Nav({
  cta,
  login = { label: 'Войти', href: APP_LOGIN },
}: {
  cta?: { label: string; href: string }
  login?: { label: string; href: string }
}) {
  const [menu, setMenu] = useState<Menu>(null)
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  // On the partner page the header speaks the partner's verb, not the vendor's
  const resolvedCta = cta ?? (pathname?.startsWith('/partners')
    ? { label: 'Стать партнёром', href: PARTNERS }
    : { label: 'Создать программу', href: APP_REGISTER })

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const open = (m: Menu) => { if (t.current) clearTimeout(t.current); setMenu(m) }
  const close = () => { if (t.current) clearTimeout(t.current); t.current = setTimeout(() => setMenu(null), 140) }
  const keep = () => { if (t.current) clearTimeout(t.current) }
  const toggle = (m: Menu) => { if (t.current) clearTimeout(t.current); setMenu((cur) => (cur === m ? null : m)) }

  const trig = (m: Exclude<Menu, null>, label: string) => (
    <button
      onMouseEnter={() => open(m)} onFocus={() => open(m)} onClick={() => toggle(m)}
      aria-haspopup="true" aria-expanded={menu === m}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 9, fontSize: 14, fontWeight: 500, color: menu === m ? 'var(--ink)' : 'var(--ink-2)', background: menu === m ? 'rgba(23,23,23,.05)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all .15s' }}
    >
      {label} <Caret />
    </button>
  )

  const panelWrap: CSSProperties = { position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 60, display: 'flex', justifyContent: 'center', padding: '8px 16px 0' }
  const panel: CSSProperties = { background: '#fff', border: '1px solid var(--line)', borderRadius: 18, boxShadow: 'var(--shadow-lg)', padding: 14 }

  return (
    <header
      onMouseLeave={close}
      onKeyDown={(e) => { if (e.key === 'Escape') setMenu(null) }}
      style={{ position: 'sticky', top: 0, zIndex: 50, fontFamily: 'var(--font-sans)', background: scrolled ? 'rgba(255,255,255,.78)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: `1px solid ${scrolled ? '#efefef' : 'transparent'}`, transition: 'background .2s ease, border-color .2s ease' }}
    >
      <nav className="rr-nav-inner" style={{ maxWidth: 'var(--content)', margin: '0 auto', height: 62, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <a href="/" style={{ display: 'flex', flex: '1 1 0', alignItems: 'center', padding: '10px 0', textDecoration: 'none' }} aria-label="RevRoute"><Wordmark size={26} /></a>
        <div className="rr-nav-links" style={{ alignItems: 'center', gap: 2 }}>
          {trig('product', 'Продукт')}
          {trig('solutions', 'Решения')}
          {trig('resources', 'Ресурсы')}
          <a href="/pricing" onMouseEnter={() => open(null)} style={{ padding: '7px 13px', borderRadius: 9, fontSize: 14, fontWeight: 500, color: 'var(--ink-2)', textDecoration: 'none' }}>Тарифы</a>
          <a href="/partners" onMouseEnter={() => open(null)} style={{ padding: '7px 13px', borderRadius: 9, fontSize: 14, fontWeight: 500, color: 'var(--ink-2)', textDecoration: 'none' }}>Партнёрам</a>
        </div>
        <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
          <a href={login.href} className="rr-nav-login" data-ym-goal="landing_login_click" style={{ alignItems: 'center', height: 34, padding: '0 15px', borderRadius: 9, border: '1px solid var(--line)', background: '#fff', color: 'var(--ink)', fontSize: 14, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex' }}>{login.label}</a>
          <span className="rr-nav-cta"><Button variant="primary" size="sm" href={resolvedCta.href} data-ym-goal="landing_signup_click">{resolvedCta.label}</Button></span>
          <button className="rr-burger" onClick={() => setMobile((v) => !v)} aria-label="Меню" aria-expanded={mobile} style={{ alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 10, border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', color: 'var(--ink)', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobile ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
            </svg>
          </button>
        </div>
      </nav>

      {mobile && (
        <div style={{ borderBottom: '1px solid #ececec', background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
          <div style={{ maxWidth: 'var(--content)', margin: '0 auto', padding: '6px 18px 18px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[{ l: 'Платформа PRM', h: '/prm' }, { l: 'Упаковка программы', h: '/packaging' }, { l: 'Аудит программы', h: '/audit' }, { l: 'Для SaaS', h: '/solutions/saas' }, { l: 'Тарифы', h: '/pricing' }, { l: 'Партнёрам', h: '/partners' }].map((i) => (
              <a key={i.h} href={i.h} onClick={() => setMobile(false)} style={{ padding: '12px 10px', borderRadius: 9, fontSize: 16, fontWeight: 500, color: 'var(--ink)', textDecoration: 'none' }}>{i.l}</a>
            ))}
            <a href={login.href} onClick={() => setMobile(false)} data-ym-goal="landing_login_click" style={{ marginTop: 8, textAlign: 'center', padding: 13, background: '#fff', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 11, fontWeight: 500, fontSize: 16, textDecoration: 'none' }}>{login.label}</a>
            <a href={resolvedCta.href} onClick={() => setMobile(false)} data-ym-goal="landing_signup_click" style={{ textAlign: 'center', padding: 13, background: 'var(--action)', color: '#fff', borderRadius: 11, fontWeight: 500, fontSize: 16, textDecoration: 'none' }}>{resolvedCta.label}</a>
          </div>
        </div>
      )}

      {menu === 'product' && (
        <div style={panelWrap} onMouseEnter={keep} onMouseLeave={close}>
          <div style={{ ...panel, width: 'min(900px, calc(100vw - 40px))' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <MegaCard icon="users" tint="#a78bfa" ink="#4c1d95" title="PRM-платформа" body="Запуск и ведение партнёрской программы — атрибуция и расчёты под ключ." href="/prm" />
              <MegaCard icon="link" tint="#fed7aa" ink="#7c2d12" title="Ссылки и трекинг" body="Брендированные ссылки, QR и аналитика конверсий «клик → оплата»." soon />
              <MegaCard icon="globe" tint="#bbf7d0" ink="#065f46" title="Партнёрская сеть" body="Готовая сеть партнёров, которые уже готовы продвигать ваш продукт. Подключайтесь к каналу, а не стройте его с нуля." soon />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 12 }}>
              <MegaCard icon="rocket" tint="#c7d2fe" ink="#3730a3" title="Упаковка партнёрского оффера" body="Оффер, условия, посадочная и материалы — соберём и запустим программу за вас." href="/packaging" />
              <MegaCard icon="list-checks" tint="#fde68a" ink="#854d0e" title="Аудит партнёрской программы" body="Разбор работающей программы: экономика, УТП, структура вознаграждений — что чинить." href="/audit" />
              <MegaCard icon="code" tint="#e5e5e5" ink="#404040" title="API" body="Partners API и вебхуки — встройте партнёрскую программу прямо в свой продукт." soon />
            </div>
          </div>
        </div>
      )}

      {menu === 'solutions' && (
        <div style={panelWrap} onMouseEnter={keep} onMouseLeave={close}>
          <div style={{ ...panel, width: 'min(880px, calc(100vw - 40px))' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              <MegaCard icon="bar-chart-3" tint="#a78bfa" ink="#4c1d95" title="Для SaaS" body="Атрибуция реферального трафика до оплаты и расчёты с партнёрами." href="/solutions/saas" />
              <MegaCard icon="message-circle" tint="#fbcfe8" ink="#9d174d" title="Для авторов контента" body="Монетизируйте аудиторию: партнёрские ссылки, прозрачная статистика и выплаты в любом статусе." soon />
              <MegaCard icon="briefcase" tint="#bfdbfe" ink="#1e40af" title="Для агентств" body="Ведите партнёрские программы клиентов в одном кабинете — с расчётами под ключ." soon />
            </div>
          </div>
        </div>
      )}

      {menu === 'resources' && (
        <div style={panelWrap} onMouseEnter={keep} onMouseLeave={close}>
          <div style={{ ...panel, width: 'min(760px, calc(100vw - 40px))', padding: 14, display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 18 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink-3)', margin: '2px 0 12px 4px' }}>Помощь</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <BigResCard icon="message-circle" title="Поддержка" body="Ответим на ваши вопросы" href="/contact/support" />
                <BigResCard icon="file-text" title="Документация" body="Гайды и справочник" href="/ru/docs" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--ink-3)', margin: '2px 0 8px 4px' }}>Справочник</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ResRow icon="info" title="Глоссарий PRM" body="Термины простыми словами" href="/glossary" />
                <ResRow icon="split" title="Сравнения" body="RevRoute и другие PRM" href="/compare" />
                <ResRow icon="qr-code" title="Бесплатные инструменты" body="UTM, QR, сокращатель" href="/tools/utm" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

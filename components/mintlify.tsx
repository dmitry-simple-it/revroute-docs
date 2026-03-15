'use client'

import React, { type ReactNode, useState, Children } from 'react'

// --- Callouts (dark-mode compatible via CSS vars from Nextra) ---

function Callout({ children, type, title }: { children: ReactNode; type: string; title?: string }) {
  const styles: Record<string, { border: string; icon: string }> = {
    info: { border: '#3b82f6', icon: 'ℹ️' },
    tip: { border: '#22c55e', icon: '💡' },
    warning: { border: '#eab308', icon: '⚠️' },
    note: { border: '#6b7280', icon: '📝' },
  }
  const s = styles[type] || styles.note
  return (
    <div style={{
      margin: '1rem 0', padding: '1rem', borderRadius: '0.5rem',
      borderLeft: `4px solid ${s.border}`,
      background: 'var(--nextra-bg, #f9fafb)',
    }}>
      {title && <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{s.icon} {title}</p>}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
        {!title && <span style={{ flexShrink: 0 }}>{s.icon}</span>}
        <div>{children}</div>
      </div>
    </div>
  )
}

export function Info({ children, title }: { children: ReactNode; title?: string }) {
  return <Callout type="info" title={title}>{children}</Callout>
}
export function Tip({ children, title }: { children: ReactNode; title?: string }) {
  return <Callout type="tip" title={title}>{children}</Callout>
}
export function Warning({ children, title }: { children: ReactNode; title?: string }) {
  return <Callout type="warning" title={title}>{children}</Callout>
}
export function Note({ children, title }: { children: ReactNode; title?: string }) {
  return <Callout type="note" title={title}>{children}</Callout>
}

// --- Frame ---
export function Frame({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure style={{ margin: '1rem 0' }}>
      <div style={{ overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)' }}>{children}</div>
      {caption && <figcaption style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>{caption}</figcaption>}
    </figure>
  )
}

// --- Icon map ---
const iconMap: Record<string, string> = {
  'users': '👥', 'money-bill': '💰', 'link': '🔗', 'building': '🏢',
  'books': '📚', 'life-ring': '🛟', 'chart-line': '📈', 'code': '💻',
  'webhook': '🔌', 'arrow-progress': '➡️', 'gear': '⚙️', 'shield': '🛡️',
  'globe': '🌐', 'envelope': '✉️', 'bolt': '⚡', 'rocket': '🚀',
  'star': '⭐', 'check': '✅', 'circle-info': 'ℹ️', 'magnifying-glass': '🔍',
  'key': '🔑', 'clock': '🕒', 'tag': '🏷️', 'folder': '📁',
  'file': '📄', 'credit-card': '💳', 'chart-bar': '📊',
  'arrow-right': '➡️', 'arrow-left': '⬅️', 'download': '⬇️',
  'upload': '⬆️', 'trash': '🗑️', 'pen': '✏️', 'plus': '➕',
  'minus': '➖', 'xmark': '❌', 'react': '⚛️', 'npm': '📦',
  'stripe': '💳', 'shopify': '🛒',
}

function resolveIcon(icon: ReactNode | string): ReactNode {
  if (typeof icon !== 'string') return icon
  return iconMap[icon] || icon
}

// --- Card & CardGroup ---
export function Card({ title, icon, href, children, horizontal, arrow }: {
  title: string; icon?: ReactNode | string; href?: string; children?: ReactNode; horizontal?: boolean; arrow?: boolean
}) {
  const resolvedIcon = icon ? resolveIcon(icon) : null
  const inner = (
    <div style={{
      borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)', padding: '1rem',
      display: horizontal ? 'flex' : 'block', gap: horizontal ? '0.75rem' : undefined,
    }}>
      {resolvedIcon && <div style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{resolvedIcon}</div>}
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{title}</h3>
        {children && <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', opacity: 0.7 }}>{children}</div>}
      </div>
    </div>
  )
  return href ? <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a> : inner
}

export function CardGroup({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  return (
    <div style={{ margin: '1rem 0', display: 'grid', gap: '1rem', gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {children}
    </div>
  )
}

// --- Steps (numbered) ---
export function Steps({ children }: { children: ReactNode }) {
  // Inject step numbers into children
  let stepNum = 0
  const numbered = Children.map(children, (child) => {
    if (React.isValidElement(child) && (child.type as any)?.displayName === 'Step') {
      stepNum++
      return React.cloneElement(child as React.ReactElement<any>, { stepNumber: stepNum })
    }
    return child
  })
  return <div style={{ margin: '1.5rem 0', marginLeft: '1rem', borderLeft: '2px solid var(--nextra-border, #e5e7eb)', paddingLeft: '1.5rem' }}>{numbered}</div>
}

export function Step({ title, children, stepNumber }: { title: string; children?: ReactNode; stepNumber?: number }) {
  return (
    <div style={{ position: 'relative', marginBottom: '2rem' }}>
      <div style={{
        position: 'absolute', left: '-2.1rem', top: '0.15rem',
        width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: '#2563eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '0.75rem', fontWeight: 700,
      }}>{stepNumber || '•'}</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: 0 }}>{title}</h3>
      <div>{children}</div>
    </div>
  )
}
Step.displayName = 'Step'

// --- Accordion ---
export function AccordionGroup({ children }: { children: ReactNode }) {
  return <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{children}</div>
}

export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem', textAlign: 'left', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit',
      }}>
        {title}
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : '' }}>▼</span>
      </button>
      {open && <div style={{ borderTop: '1px solid var(--nextra-border, #e5e7eb)', padding: '1rem' }}>{children}</div>}
    </div>
  )
}

// --- Tabs ---
export function Tabs({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(
    (c): c is React.ReactElement => React.isValidElement(c)
  )
  const [active, setActive] = useState(0)
  return (
    <div style={{ margin: '1rem 0' }}>
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--nextra-border, #e5e7eb)' }}>
        {items.map((item, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit',
            borderBottom: active === i ? '2px solid #2563eb' : '2px solid transparent',
            opacity: active === i ? 1 : 0.6,
          }}>
            {(item.props as any).title || `Tab ${i + 1}`}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem' }}>{items[active]}</div>
    </div>
  )
}

export function Tab({ children }: { children: ReactNode; title?: string }) {
  return <div>{children}</div>
}

export function CodeGroup({ children }: { children: ReactNode }) {
  return <Tabs>{children}</Tabs>
}

// --- API Docs ---
export function ParamField({ body, query, path: p, header, children, type, required, default: def }: {
  body?: string; query?: string; path?: string; header?: string; children?: ReactNode; type?: string; required?: boolean; default?: string
}) {
  const name = body || query || p || header || ''
  const loc = body ? 'body' : query ? 'query' : p ? 'path' : header ? 'header' : ''
  return (
    <div style={{ margin: '0.75rem 0', borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)', padding: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <code style={{ fontSize: '0.875rem', fontWeight: 600 }}>{name}</code>
        {type && <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{type}</span>}
        {required && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#ef4444' }}>required</span>}
        {loc && <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>({loc})</span>}
        {def && <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>default: {def}</span>}
      </div>
      {children && <div style={{ marginTop: '0.25rem', opacity: 0.7 }}>{children}</div>}
    </div>
  )
}

export function ResponseField({ name, type, required, children }: {
  name: string; type?: string; required?: boolean; children?: ReactNode
}) {
  return (
    <div style={{ margin: '0.5rem 0', marginLeft: '1rem', borderLeft: '2px solid var(--nextra-border, #e5e7eb)', paddingLeft: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <code style={{ fontSize: '0.875rem', fontWeight: 600 }}>{name}</code>
        {type && <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{type}</span>}
        {required && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#ef4444' }}>required</span>}
      </div>
      {children && <div style={{ marginTop: '0.25rem', opacity: 0.7 }}>{children}</div>}
    </div>
  )
}

export function Expandable({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ margin: '0.25rem 0' }}>
      <button onClick={() => setOpen(!open)} style={{
        fontSize: '0.875rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      }}>
        {open ? '▼' : '▶'} {title}
      </button>
      {open && <div style={{ marginLeft: '0.5rem', marginTop: '0.25rem' }}>{children}</div>}
    </div>
  )
}

// --- Checklist ---
export function CheckList({ children }: { children: ReactNode }) {
  return <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{children}</div>
}

export function CheckListItem({ title, href, children }: {
  title: string; href?: string; children?: ReactNode
}) {
  const inner = (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)', padding: '0.75rem' }}>
      <span style={{ color: '#22c55e', marginTop: '0.125rem' }}>✓</span>
      <div>
        <span style={{ fontWeight: 500 }}>{title}</span>
        {children && <div style={{ marginTop: '0.25rem', opacity: 0.7 }}>{children}</div>}
      </div>
    </div>
  )
  return href ? <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</a> : inner
}

// --- Stub components for custom Mintlify snippets ---

export function ImageCtaCard({ src, alt, href, cta, children }: {
  src?: string; alt?: string; href?: string; cta?: string; children?: ReactNode
}) {
  return (
    <a href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block', margin: '1rem 0' }}>
      <div style={{ borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)', overflow: 'hidden' }}>
        {src && <img src={src} alt={alt || ''} style={{ width: '100%', display: 'block' }} />}
        {children && <div style={{ padding: '1rem' }}>{children}</div>}
        {cta && <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--nextra-border, #e5e7eb)', color: '#2563eb', fontWeight: 500 }}>{cta}</div>}
      </div>
    </a>
  )
}

export function ImageLink({ src, alt, href, cta }: {
  src?: string; alt?: string; href?: string; cta?: string
}) {
  return <ImageCtaCard src={src} alt={alt} href={href} cta={cta} />
}

export function PayoutSupportedCountries() {
  return <div style={{ margin: '1rem 0', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)', opacity: 0.7 }}>Supported countries list available in the Dub dashboard.</div>
}

export function DefaultDomainsSlider() {
  return <div style={{ margin: '1rem 0', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--nextra-border, #e5e7eb)', opacity: 0.7 }}>Default domains available in settings.</div>
}

export function NpmPackage({ name }: { name?: string }) {
  return name ? <code style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{name}</code> : null
}

export function VideoPlayer({ src }: { src?: string; children?: ReactNode }) {
  return src ? <video src={src} controls style={{ width: '100%', borderRadius: '0.5rem', margin: '1rem 0' }} /> : null
}

export function ImageCarousel({ children }: { children?: ReactNode }) {
  return <div style={{ margin: '1rem 0' }}>{children}</div>
}

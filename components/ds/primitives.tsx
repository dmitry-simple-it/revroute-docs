/**
 * RevRoute Design System v2 — core primitives (native TSX port).
 * Server-compatible (no hooks). Render inside a .ds-scope container.
 * Visual language ported verbatim from "RevRoute Design System v2"/components/core.
 */
import type { CSSProperties, ReactNode } from 'react'
import {
  ArrowRight, ArrowUpRight, Check, X, ChevronDown, ChevronRight, Plus, Minus,
  Link as LinkIcon, Link2, BarChart3, Users, UserPlus, Wallet, Banknote, CreditCard,
  Receipt, Percent, Globe, Zap, ShieldCheck, Lock, Rocket, Send, Sparkles, Settings,
  Sliders, Smartphone, MapPin, FileText, FileCheck, Clock, TrendingUp, Star, Code, Code2,
  MessageCircle, Info, Layers, Briefcase, Bot, Calendar, QrCode, Plug,
  Repeat, RefreshCw, Building2, BadgeCheck, ListChecks, Target, Gauge, Scale, Split,
  Webhook, KeyRound, Database, Eye, EyeOff, Network, Workflow, MousePointerClick,
  type LucideIcon,
} from 'lucide-react'

/* ───────── Icon — curated Lucide glyphs keyed by DS kebab name ───────── */
const ICONS: Record<string, LucideIcon> = {
  'arrow-right': ArrowRight, 'arrow-up-right': ArrowUpRight, check: Check, x: X,
  'chevron-down': ChevronDown, 'chevron-right': ChevronRight, plus: Plus, minus: Minus,
  link: LinkIcon, 'link-2': Link2, 'bar-chart-3': BarChart3, users: Users, 'user-plus': UserPlus,
  wallet: Wallet, banknote: Banknote, 'credit-card': CreditCard, receipt: Receipt, percent: Percent,
  globe: Globe, zap: Zap, 'shield-check': ShieldCheck, lock: Lock, rocket: Rocket, send: Send,
  sparkles: Sparkles, settings: Settings, sliders: Sliders, smartphone: Smartphone, 'map-pin': MapPin,
  'file-text': FileText, 'file-check': FileCheck, clock: Clock, 'trending-up': TrendingUp, star: Star,
  code: Code, 'code-2': Code2, 'message-circle': MessageCircle, info: Info, layers: Layers,
  briefcase: Briefcase, bot: Bot, calendar: Calendar, 'qr-code': QrCode,
  plug: Plug, repeat: Repeat, 'refresh-cw': RefreshCw, 'building-2': Building2, 'badge-check': BadgeCheck,
  'list-checks': ListChecks, target: Target, gauge: Gauge, scale: Scale, split: Split, webhook: Webhook,
  'key-round': KeyRound, database: Database, eye: Eye, 'eye-off': EyeOff, network: Network,
  workflow: Workflow, 'mouse-pointer-click': MousePointerClick,
}

export type IconName = keyof typeof ICONS

export function Icon({
  name, size = 20, color = 'currentColor', strokeWidth = 1.8, className, style, title,
}: {
  name: string; size?: number; color?: string; strokeWidth?: number
  className?: string; style?: CSSProperties; title?: string
}) {
  const Glyph = ICONS[name]
  if (!Glyph) {
    if (typeof console !== 'undefined') console.warn('[RevRoute Icon] unknown icon: ' + name)
    return null
  }
  return (
    <Glyph
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    />
  )
}

/* ───────── Logo — inline R-mark (rounded tile + white route path + violet dot) ───────── */
export function Logo({
  size = 28, tone = 'dark', dot = true, dotColor = '#855afc', style,
}: {
  size?: number; tone?: 'dark' | 'light' | 'mono'; dot?: boolean; dotColor?: string; style?: CSSProperties
}) {
  const tile = tone === 'light' ? '#ffffff' : tone === 'mono' ? 'transparent' : '#0a0a0a'
  const stroke = tone === 'dark' ? '#ffffff' : tone === 'mono' ? 'currentColor' : '#0a0a0a'
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0, ...style }}>
      <rect width="48" height="48" rx="11" fill={tile} />
      <g stroke={stroke} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 11 V37" />
        <path d="M14 11 H25 a6 6 0 0 1 0 12 H14" />
        <path d="M20 24 L33 37" />
        <path d="M29 37 L33 37 L33 33" />
      </g>
      {dot && <circle cx="37" cy="41" r="3" fill={dotColor} />}
    </svg>
  )
}

export function Wordmark({
  size = 26, color = 'var(--ink)', style,
}: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
      <Logo size={size} />
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: size * 0.66, letterSpacing: '-0.03em', color }}>
        RevRoute
      </span>
    </span>
  )
}

/* ───────── Term — inline abbreviation with a hover/focus tooltip (CSS-only) ───────── */
export function Term({ children, hint }: { children: ReactNode; hint: string }) {
  return (
    <span className="rr-term" tabIndex={0}>
      {children}
      <span className="rr-term-hint" role="tooltip">{hint}</span>
    </span>
  )
}

/* ───────── Eyebrow — section micro-label with violet brand dot ───────── */
export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <span className="rr-eyebrow" style={style}>{children}</span>
}

/* ───────── Button — primary (black) / ghost / accent (violet). One primary per view. ───────── */
type ButtonVariant = 'primary' | 'ghost' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

export function Button({
  children, variant = 'primary', size = 'md', icon, iconRight, href, onClick, disabled = false,
  type = 'button', style, target, rel, 'aria-label': ariaLabel, 'data-ym-goal': ymGoal,
}: {
  children?: ReactNode; variant?: ButtonVariant; size?: ButtonSize
  icon?: string; iconRight?: string; href?: string; onClick?: () => void; disabled?: boolean
  type?: 'button' | 'submit' | 'reset'; style?: CSSProperties; target?: string; rel?: string
  'aria-label'?: string; 'data-ym-goal'?: string
}) {
  const pad = size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 24px' : '11px 18px'
  const fs = size === 'sm' ? 14 : size === 'lg' ? 17 : 15
  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 18 : 17

  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { background: 'var(--action)', color: '#fff', borderColor: 'var(--action)', boxShadow: '0 1px 0 rgba(255,255,255,.15) inset, 0 1px 2px rgba(0,0,0,.1)' },
    ghost: { background: '#fff', color: 'var(--ink)', borderColor: 'var(--line)' },
    accent: { background: 'var(--brand-ramp)', color: '#fff', borderColor: 'transparent' },
  }
  const iconColor = variant === 'ghost' ? 'var(--ink)' : '#fff'

  const styles: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: pad, borderRadius: 10, fontSize: fs, fontWeight: 500, letterSpacing: '-0.01em',
    cursor: disabled ? 'not-allowed' : 'pointer', border: '1px solid', fontFamily: 'var(--font-sans)',
    whiteSpace: 'nowrap', textDecoration: 'none', transition: 'all .15s', opacity: disabled ? 0.45 : 1,
    ...variants[variant], ...style,
  }

  const inner = (
    <>
      {icon && <Icon name={icon} size={iconSize} color={iconColor} strokeWidth={2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} color={iconColor} strokeWidth={2} />}
    </>
  )

  if (href && !disabled) {
    return <a href={href} onClick={onClick} style={styles} target={target} rel={rel} aria-label={ariaLabel} data-ym-goal={ymGoal}>{inner}</a>
  }
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} style={styles} aria-label={ariaLabel} data-ym-goal={ymGoal}>
      {inner}
    </button>
  )
}

/* ───────── Pill — status only (live / pending / paid) ───────── */
export function Pill({
  children, tone = 'neutral', dot = false, style,
}: {
  children: ReactNode; tone?: 'neutral' | 'green' | 'blue' | 'amber' | 'violet'; dot?: boolean; style?: CSSProperties
}) {
  const cls = tone === 'neutral' || tone === 'violet' ? 'pill' : `pill ${tone}`
  const dotColor = tone === 'green' ? 'var(--green)' : tone === 'amber' ? 'var(--amber)' : tone === 'blue' ? 'var(--blue)' : tone === 'violet' ? 'var(--accent)' : 'var(--ink-3)'
  return (
    <span className={cls} style={tone === 'violet' ? { background: 'var(--accent-bg)', color: 'var(--accent-strong)', borderColor: 'var(--accent-line)', ...style } : style}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />}
      {children}
    </span>
  )
}

/* ───────── Chip — taxonomy / filter token ───────── */
export function Chip({
  children, active = false, style,
}: { children: ReactNode; active?: boolean; style?: CSSProperties }) {
  return (
    <span className="chip" style={active ? { background: 'var(--action)', color: '#fff', borderColor: 'var(--action)', ...style } : style}>
      {children}
    </span>
  )
}

/* ───────── Card — floating "paper" surface ───────── */
export function Card({
  children, variant = 'elevated', as: Tag = 'div', padding, glow = false, className = '', style,
}: {
  children: ReactNode; variant?: 'elevated' | 'flat' | 'sunken'
  as?: 'div' | 'article' | 'section' | 'li'; padding?: number; glow?: boolean; className?: string; style?: CSSProperties
}) {
  const base: CSSProperties =
    variant === 'flat'
      ? { background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }
      : variant === 'sunken'
        ? { background: 'var(--bg-sunken)', border: '1px solid var(--line)', borderRadius: 'var(--radius)' }
        : { background: 'var(--bg-elev)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)' }
  return (
    <Tag
      className={`${glow ? 'card-glow ' : ''}${className}`}
      style={{ position: glow ? 'relative' : undefined, padding: padding ?? (variant === 'flat' ? 24 : 28), ...base, ...style }}
    >
      {children}
    </Tag>
  )
}

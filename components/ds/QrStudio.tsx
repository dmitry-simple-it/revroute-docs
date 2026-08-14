'use client'

/**
 * RevRoute Design System v2 — QrStudio.
 * Генератор QR-кодов целиком в браузере: пакет `qrcode` считает матрицу
 * (QRCode.create → modules), рендер свой — и в <canvas> (PNG), и в SVG-строку.
 * Никаких внешних API: ссылка и логотип не покидают браузер.
 * Использовать внутри .ds-scope.
 */
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Button, Icon } from './primitives'
import { trackGoal } from '@/lib/analytics/yandex-metrika'
import { useGoalOnVisible } from '@/lib/analytics/use-goal-on-visible'
import { useExperimentVariant } from '@/lib/analytics/experiment'
import { UpgradeStatTeaser } from './UpgradeStatTeaser'
import { ToolOfferPopups } from './ToolOfferPopups'

const APP_REGISTER = 'https://app.revroute.ru/register'
/**
 * «Мне хватит»: человек с разовой задачей отказался от предложения аккаунта —
 * больше не показываем его ни здесь, ни в сокращателе (ключ общий на все
 * инструменты). Уважение к разовым пользователям — требование ТЗ моста №4.
 */
const OFFER_DISMISS_KEY = 'rr_tools_offer_dismissed'

const QUIET = 4 // квиет-зона, модулей с каждой стороны — всегда
const FRAME_PAD = 2 // доп. поле между квиет-зоной и рамкой, модулей
const CAPTION_H = 7 // высота полосы подписи внутри рамки, модулей
const DEFAULT_CAPTION = 'Наведите камеру'

type Matrix = { size: number; data: Uint8Array }

/* ── чистые помощники ── */

function normalizeUrl(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return t
  if (/^[^\s]+\.[^\s]{2,}/.test(t)) return `https://${t}`
  return t
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/* ── рендер в canvas (PNG до ~1024px) ── */

function drawCanvas(
  canvas: HTMLCanvasElement,
  matrix: Matrix,
  opts: { fg: string; bg: string; logo: HTMLImageElement | null; frame: boolean; caption: string },
) {
  const { size } = matrix
  const frame = opts.frame
  const padU = frame ? FRAME_PAD : 0
  const capU = frame ? CAPTION_H : 0
  const wU = size + QUIET * 2 + padU * 2
  const hU = wU + capU
  const scale = Math.max(3, Math.floor(1024 / wU))
  const W = wU * scale
  const H = hU * scale
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = opts.bg
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = opts.fg
  const off = (padU + QUIET) * scale
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix.data[r * size + c]) ctx.fillRect(off + c * scale, off + r * scale, scale, scale)
    }
  }

  if (opts.logo) {
    const codePx = size * scale
    // Подложка 0.30 стороны (площадь ~9%). НЕ увеличивать: замер jsQR-декодером
    // показал, что на коротких URL (версия 2–3) отказ начинается с 0.32–0.36
    // стороны, хотя уровень H формально обещает восстановление 30% кодовых слов —
    // повреждение сосредоточено в центре, и практический предел ниже теории.
    const plate = Math.round(codePx * 0.3)
    const logoBox = Math.round(codePx * 0.24)
    const cx = (padU + QUIET) * scale + codePx / 2
    const cy = (padU + QUIET) * scale + codePx / 2
    ctx.fillStyle = '#ffffff' // белая подложка — иначе код не сканируется
    roundRectPath(ctx, cx - plate / 2, cy - plate / 2, plate, plate, scale * 1.5)
    ctx.fill()
    const k = Math.min(logoBox / opts.logo.width, logoBox / opts.logo.height)
    const lw = opts.logo.width * k
    const lh = opts.logo.height * k
    ctx.drawImage(opts.logo, cx - lw / 2, cy - lh / 2, lw, lh)
  }

  if (frame) {
    ctx.strokeStyle = opts.fg
    ctx.lineWidth = Math.max(2, scale * 0.9)
    const inset = ctx.lineWidth / 2 + scale * 0.4
    roundRectPath(ctx, inset, inset, W - inset * 2, H - inset * 2, scale * 2.6)
    ctx.stroke()
    ctx.fillStyle = opts.fg
    ctx.font = `600 ${Math.round(scale * 3.4)}px system-ui, -apple-system, 'Segoe UI', sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(opts.caption, W / 2, (padU + QUIET * 2 + size + capU / 2 - 0.5) * scale)
  }
}

/* ── рендер в SVG-строку (векторный экспорт) ── */

function buildSvg(
  matrix: Matrix,
  opts: { fg: string; bg: string; logoDataUrl: string | null; frame: boolean; caption: string },
): string {
  const { size } = matrix
  const frame = opts.frame
  const padU = frame ? FRAME_PAD : 0
  const capU = frame ? CAPTION_H : 0
  const W = size + QUIET * 2 + padU * 2
  const H = W + capU

  let d = ''
  const off = padU + QUIET
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix.data[r * size + c]) d += `M${off + c} ${off + r}h1v1h-1z`
    }
  }

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * 12}" height="${H * 12}">`,
    `<rect width="${W}" height="${H}" fill="${opts.bg}"/>`,
    `<path d="${d}" fill="${opts.fg}" shape-rendering="crispEdges"/>`,
  ]

  if (opts.logoDataUrl) {
    // Те же 0.30/0.24, что в drawCanvas, — см. комментарий там про замер декодером.
    const plate = size * 0.3
    const logoBox = size * 0.24
    const cx = off + size / 2
    const cy = off + size / 2
    parts.push(
      `<rect x="${(cx - plate / 2).toFixed(2)}" y="${(cy - plate / 2).toFixed(2)}" width="${plate.toFixed(2)}" height="${plate.toFixed(2)}" rx="1.4" fill="#ffffff"/>`,
      `<image href="${opts.logoDataUrl}" x="${(cx - logoBox / 2).toFixed(2)}" y="${(cy - logoBox / 2).toFixed(2)}" width="${logoBox.toFixed(2)}" height="${logoBox.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`,
    )
  }

  if (frame) {
    parts.push(
      `<rect x="0.85" y="0.85" width="${W - 1.7}" height="${H - 1.7}" rx="2.6" fill="none" stroke="${opts.fg}" stroke-width="0.9"/>`,
      `<text x="${W / 2}" y="${(padU + QUIET * 2 + size + capU / 2).toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="600" font-size="3.4" fill="${opts.fg}">${escapeXml(opts.caption)}</text>`,
    )
  }

  parts.push('</svg>')
  return parts.join('')
}

/* ── компонент ── */

export function QrStudio() {
  const [url, setUrl] = useState('')
  const [created, setCreated] = useState<string | null>(null)
  const [fg, setFg] = useState('#171717')
  const [bg, setBg] = useState('#ffffff')
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null)
  const [frame, setFrame] = useState(false)
  const [caption, setCaption] = useState(DEFAULT_CAPTION)
  const [error, setError] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)
  const [offerDismissed, setOfferDismissed] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<string>('')
  const createdOnce = useRef<Set<string>>(new Set())
  const customizedOnce = useRef<Set<string>>(new Set())

  /* A/B: 'a' — текстовый оффер, 'b' — скелетон статистики (приём Bitly).
     Вариант уезжает параметром во все цели моста — анализ фильтром в Метрике. */
  const variant = useExperimentVariant('tools_bridge_offer')

  /* tool_upgrade_view — только когда оффер РЕАЛЬНО видим (≥60% площади ≥1с),
     не по факту рендера: см. комментарий в use-goal-on-visible.ts. Триггер в
     параметрах различает inline-оффер под кодом и блок после скачивания. */
  const offerViewRef = useGoalOnVisible(
    'tool_upgrade_view',
    { tool: 'qr', trigger: downloaded ? 'after_download' : 'inline', variant },
    !!created && !offerDismissed,
  )

  /* отказ, сохранённый в прошлые визиты */
  useEffect(() => {
    try {
      if (localStorage.getItem(OFFER_DISMISS_KEY)) setOfferDismissed(true)
    } catch { /* приватный режим — показываем как всем */ }
  }, [])

  function dismissOffer() {
    setOfferDismissed(true)
    try { localStorage.setItem(OFFER_DISMISS_KEY, '1') } catch { /* noop */ }
  }

  /* автофокус — только на устройствах с точным указателем (на мобиле клавиатура прыгает) */
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
      inputRef.current?.focus()
    }
  }, [])

  /* логотип: dataURL → HTMLImageElement для canvas */
  useEffect(() => {
    if (!logoDataUrl) {
      setLogoImg(null)
      return
    }
    const img = new Image()
    img.onload = () => setLogoImg(img)
    img.src = logoDataUrl
  }, [logoDataUrl])

  /* перерисовка при каждом изменении настроек, если код уже создан */
  useEffect(() => {
    if (!created) return
    try {
      const qr = QRCode.create(created, { errorCorrectionLevel: logoDataUrl ? 'H' : 'M' })
      const matrix: Matrix = { size: qr.modules.size, data: qr.modules.data }
      const canvas = canvasRef.current
      if (canvas) drawCanvas(canvas, matrix, { fg, bg, logo: logoImg, frame, caption })
      svgRef.current = buildSvg(matrix, { fg, bg, logoDataUrl, frame, caption })
      setError(null)
    } catch {
      setError('Не получилось закодировать это значение — попробуйте короче.')
    }
  }, [created, fg, bg, logoDataUrl, logoImg, frame, caption])

  function trackCustomized(setting: string) {
    if (customizedOnce.current.has(setting)) return
    customizedOnce.current.add(setting)
    trackGoal('qr_customized', { setting })
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const value = normalizeUrl(url)
    if (!value) return
    setCreated(value)
    if (!createdOnce.current.has(value)) {
      createdOnce.current.add(value)
      trackGoal('qr_created')
    }
  }

  /* Автоскролл к результату. Замер 11.08: без него после «Создать код» на
     375×812 виден только верх кода, кнопки скачивания — на 291px ниже фолда,
     оффер — на 497px; страдала и конверсия в скачивание (33%). Именно эффект,
     не вызов из handleCreate: при первом создании блок результата попадает в
     DOM только после коммита рендера, и ref в обработчике ещё пуст —
     проверено, rAF+таймаут из обработчика скролл не давал. */
  useEffect(() => {
    if (!created) return
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [created])

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoDataUrl(reader.result)
        trackCustomized('logo')
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function downloadPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'qr-revroute.png'
      a.click()
      URL.revokeObjectURL(a.href)
    }, 'image/png')
    trackGoal('qr_downloaded', { format: 'png' })
    setDownloaded(true)
  }

  function downloadSvg() {
    if (!svgRef.current) return
    const blob = new Blob([svgRef.current], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'qr-revroute.svg'
    a.click()
    URL.revokeObjectURL(a.href)
    trackGoal('qr_downloaded', { format: 'svg' })
    setDownloaded(true)
  }

  const ratio = contrastRatio(fg, bg)
  const inverted = luminance(fg) > luminance(bg)
  const contrastWarning =
    ratio < 2.5
      ? 'Контраст цветов слишком низкий — часть камер не прочитает код. Затемните код или осветлите фон.'
      : inverted
        ? 'Код светлее фона — такая инверсия ломает многие сканеры. Обычно тёмный код на светлом фоне.'
        : null

  const pickerStyle: React.CSSProperties = {
    width: 44,
    height: 32,
    padding: 2,
    border: '1px solid var(--line)',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer',
  }

  return (
    <div className="card" style={{ background: '#fff', boxShadow: 'var(--shadow-md)' }}>
      {/* Попапы по модели Bitly: после скачивания / exit-intent (двухфазный),
          максимум один за сессию — вся политика в ToolOfferPopups. */}
      <ToolOfferPopups tool="qr" variant={variant} created={!!created && !error} completed={downloaded} />
      {/* ── ввод ── */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="rr-caption">Вставьте ссылку</span>
          <input
            ref={inputRef}
            className="rr-input"
            type="text"
            inputMode="url"
            placeholder="https://example.com/page"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </label>
        <Button type="submit" variant="accent" size="lg" disabled={!url.trim()} iconRight="qr-code">
          Создать код
        </Button>
      </form>

      {error && (
        <p className="rr-small" role="alert" style={{ margin: '14px 0 0', padding: '10px 14px', borderRadius: 10, background: 'var(--amber-bg)', border: '1px solid var(--amber-line)', color: 'var(--amber-fg)' }}>
          {error}
        </p>
      )}

      {created && !error && (
        <>
          {/* ── превью; ref — якорь автоскролла, scrollMarginTop под шапку ── */}
          <div ref={resultRef} style={{ display: 'flex', justifyContent: 'center', marginTop: 24, scrollMarginTop: 84 }}>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`QR-код для ${created}`}
              style={{ width: 'min(100%, 300px)', height: 'auto', borderRadius: 14, border: '1px solid var(--line)' }}
            />
          </div>
          <p className="rr-small" style={{ margin: '10px 0 0', textAlign: 'center', color: 'var(--ink-4)', wordBreak: 'break-all' }}>
            {created}
          </p>

          {/* ── настройки: применяются сразу ── */}
          <div style={{ display: 'flex', gap: '14px 22px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 20, padding: '16px 18px', borderRadius: 12, background: 'var(--bg-sunken)', border: '1px solid var(--line)' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span className="rr-small" style={{ color: 'var(--ink-2)' }}>Цвет кода</span>
              <input
                type="color"
                value={fg}
                onChange={(e) => { setFg(e.target.value); trackCustomized('color') }}
                style={pickerStyle}
                aria-label="Цвет кода"
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span className="rr-small" style={{ color: 'var(--ink-2)' }}>Цвет фона</span>
              <input
                type="color"
                value={bg}
                onChange={(e) => { setBg(e.target.value); trackCustomized('background') }}
                style={pickerStyle}
                aria-label="Цвет фона"
              />
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span className="rr-small" style={{ color: 'var(--ink-2)' }}>{logoDataUrl ? 'Заменить логотип' : 'Логотип в центр'}</span>
              <input type="file" accept="image/*" onChange={handleLogoFile} style={{ display: 'none' }} />
              <span className="chip" style={{ padding: '6px 12px' }}>
                <Icon name="sparkles" size={15} />
                Выбрать файл
              </span>
            </label>
            {logoDataUrl && (
              <button
                type="button"
                onClick={() => setLogoDataUrl(null)}
                className="rr-small"
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--ink-3)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                Убрать логотип
              </button>
            )}
            <label className="rr-check" style={{ alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={frame}
                onChange={(e) => { setFrame(e.target.checked); trackCustomized('frame') }}
              />
              <span className="rr-check-text">Рамка с подписью</span>
            </label>
            {frame && (
              <input
                className="rr-input"
                type="text"
                value={caption}
                maxLength={28}
                onChange={(e) => { setCaption(e.target.value); trackCustomized('frame') }}
                aria-label="Подпись под кодом"
                placeholder={DEFAULT_CAPTION}
                style={{ width: 220, flex: '0 1 auto' }}
              />
            )}
          </div>

          {contrastWarning && (
            <p className="rr-small" style={{ margin: '12px 0 0', padding: '10px 14px', borderRadius: 10, background: 'var(--amber-bg)', border: '1px solid var(--amber-line)', color: 'var(--amber-fg)' }}>
              {contrastWarning}
            </p>
          )}

          {/* ── скачивание: третье действие — мост в продукт, в самой горячей
                 точке (момент выбора формата). Ghost, не primary: скачивание
                 остаётся главным действием — охранная метрика. ── */}
          <div className="rr-cta-row" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <Button variant="primary" onClick={downloadPng}>Скачать PNG</Button>
            <Button variant="ghost" onClick={downloadSvg}>Скачать SVG для печати</Button>
            {!offerDismissed && (
              <Button
                variant="ghost"
                href={APP_REGISTER}
                iconRight="arrow-right"
                onClick={() => trackGoal('tool_signup_click', { tool: 'qr', trigger: 'download_row', variant })}
              >
                Сделать код изменяемым
              </Button>
            )}
          </div>

          <p className="rr-small" style={{ margin: '14px 0 0', textAlign: 'center', color: 'var(--ink-3)' }}>
            Код создаётся прямо в браузере: ссылка и логотип никуда не отправляются.
          </p>

          {/* ── момент успеха получает концовку. Два состояния:
                 до скачивания — inline-оффер (он же точка контакта для тех,
                 кто сканирует код с экрана и не скачивает — 7 из 16 в данных);
                 после скачивания — «Файл у вас» с честным выбором, включая
                 «Мне хватит» (localStorage, больше не покажем нигде).
                 Показ меряет tool_upgrade_view только по реальной видимости. ── */}
          {!offerDismissed && variant === 'b' && (
            /* Вариант B: пустой мини-дашборд вместо текстового блока — обе
               фазы (до/после скачивания) различаются заголовком и CTA. */
            <div ref={offerViewRef}>
              <UpgradeStatTeaser
                title={downloaded ? 'Файл у вас. А статистика?' : 'Что покажет изменяемый код'}
                rows={[
                  { label: 'Сканирования', barWidth: 56 },
                  { label: 'География', barWidth: 88 },
                  { label: 'Устройства', barWidth: 40 },
                ]}
                note={
                  downloaded
                    ? 'Этот код статический — статистики у него не будет, а адрес внутри уже не поменять. Изменяемый код умеет и то и другое.'
                    : 'Статистика появляется у изменяемого кода: адрес можно менять после печати, переходы видны.'
                }
                ctaLabel={downloaded ? 'Сделать изменяемый код' : 'Сохранить код в аккаунте'}
                ctaHref={APP_REGISTER}
                onCtaClick={() => trackGoal('tool_signup_click', { tool: 'qr', trigger: downloaded ? 'after_download' : 'inline', variant })}
                onDismiss={downloaded ? dismissOffer : undefined}
              />
            </div>
          )}
          {!offerDismissed && variant === 'a' && (
            <div ref={offerViewRef} style={{ marginTop: 24, padding: '20px 22px', borderRadius: 14, background: 'var(--accent-bg)', border: '1px solid var(--accent-line)' }}>
              {!downloaded ? (
                <>
                  <h3 className="rr-h3" style={{ margin: 0 }}>Ссылка внутри кода может меняться</h3>
                  <p className="rr-small" style={{ margin: '8px 0 0', color: 'var(--ink-2)' }}>
                    Тираж напечатан, а страница переехала — поменяйте адрес, код на макете останется прежним.
                    Плюс статистика: сколько переходов, откуда и с каких устройств.
                  </p>
                  <div style={{ marginTop: 14 }}>
                    <Button
                      variant="accent"
                      size="sm"
                      href={APP_REGISTER}
                      iconRight="arrow-right"
                      onClick={() => trackGoal('tool_signup_click', { tool: 'qr', trigger: 'inline', variant })}
                    >
                      Сохранить код в аккаунте
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="rr-h3" style={{ margin: 0 }}>Файл у вас. Один момент про печать</h3>
                  <p className="rr-small" style={{ margin: '8px 0 0', color: 'var(--ink-2)' }}>
                    Этот код статический: адрес внутри уже не поменять. Если тираж пойдёт в печать —
                    сделайте изменяемый код в аккаунте: адрес можно менять после печати, переходы видны.
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 14 }}>
                    <Button
                      variant="accent"
                      size="sm"
                      href={APP_REGISTER}
                      iconRight="arrow-right"
                      onClick={() => trackGoal('tool_signup_click', { tool: 'qr', trigger: 'after_download', variant })}
                    >
                      Сделать изменяемый код
                    </Button>
                    <button
                      type="button"
                      onClick={dismissOffer}
                      className="rr-small"
                      style={{ background: 'none', border: 'none', padding: '6px 4px', color: 'var(--ink-3)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                    >
                      Мне хватит
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

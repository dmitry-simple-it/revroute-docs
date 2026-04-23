'use client'

import { useMemo, useState } from 'react'

export function QrBuilder() {
  const [url, setUrl] = useState('https://revroute.ru')
  const [size, setSize] = useState(320)
  const [dark, setDark] = useState('000000')
  const [light, setLight] = useState('FFFFFF')

  const pngSrc = useMemo(() => {
    const base = 'https://api.qrserver.com/v1/create-qr-code/'
    const params = new URLSearchParams({
      data: url || ' ',
      size: `${size}x${size}`,
      color: dark,
      bgcolor: light,
      format: 'png',
      margin: '4',
    })
    return `${base}?${params.toString()}`
  }, [url, size, dark, light])

  const svgSrc = useMemo(() => {
    const base = 'https://api.qrserver.com/v1/create-qr-code/'
    const params = new URLSearchParams({
      data: url || ' ',
      size: `${size}x${size}`,
      color: dark,
      bgcolor: light,
      format: 'svg',
      margin: '4',
    })
    return `${base}?${params.toString()}`
  }, [url, size, dark, light])

  return (
    <div
      className="border grid grid-cols-[1fr_320px] gap-8 max-md:grid-cols-1"
      style={{
        background: 'var(--bg-white)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            URL или текст
          </span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg border px-3 py-2.5 text-sm"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
            Размер: {size}px
          </span>
          <input
            type="range"
            min={128}
            max={600}
            step={16}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
              Цвет QR
            </span>
            <input
              value={dark}
              onChange={(e) => setDark(e.target.value.replace(/^#/, '').toUpperCase())}
              maxLength={6}
              className="rounded-lg border px-3 py-2.5 text-sm font-mono"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-[11px] font-semibold uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
              Фон
            </span>
            <input
              value={light}
              onChange={(e) => setLight(e.target.value.replace(/^#/, '').toUpperCase())}
              maxLength={6}
              className="rounded-lg border px-3 py-2.5 text-sm font-mono"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            />
          </label>
        </div>

        <div className="mt-2 flex gap-2">
          <a
            href={pngSrc}
            download="revroute-qr.png"
            className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Скачать PNG
          </a>
          <a
            href={svgSrc}
            download="revroute-qr.svg"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold"
            style={{ background: 'var(--bg-white)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Скачать SVG
          </a>
        </div>
      </div>

      <div
        className="flex items-center justify-center rounded-xl"
        style={{ background: `#${light}`, border: '1px solid var(--border)', padding: '16px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pngSrc}
          alt="QR-код"
          width={size}
          height={size}
          style={{ width: '100%', height: 'auto', maxWidth: 288 }}
        />
      </div>
    </div>
  )
}

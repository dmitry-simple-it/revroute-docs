// One-shot script to rasterize brand SVGs into needed PNG sizes.
// Run after updating SVG masters in public/brand/ or app/icon.svg.
// Usage: node scripts/rasterize-brand.mjs

import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const iconSvgPath = path.join(root, 'app', 'icon.svg')
const wordmarkLightSvgPath = path.join(root, 'public', 'brand', 'wordmark-light.svg')
const wordmarkDarkSvgPath = path.join(root, 'public', 'brand', 'wordmark-dark.svg')
const lockupSvgPath = path.join(root, 'public', 'brand', 'lockup.svg')

const DARK = '#0c0a09'
const WHITE = '#ffffff'

async function readSvg(p) {
  return await readFile(p, 'utf8')
}

// Make an icon-only PNG with R centered on coloured background.
// Strategy: replace `viewBox="0 0 24 24"` with a larger one so R becomes proportionally smaller,
// then add a background rect. We render the SVG with a wider canvas via Sharp composite.
async function makeIconPng({ size, bg, fg, padRatio = 0.18, outPath }) {
  // Generate an inline SVG with bg + icon centered
  const inner = await readSvg(iconSvgPath)
  // strip top-level <svg ...> wrapper to get inner path
  const pathMatch = inner.match(/<path[^>]*\/>/)
  if (!pathMatch) throw new Error('icon.svg has no <path>')
  const innerPath = pathMatch[0].replace(/fill="[^"]*"/, `fill="${fg}"`)

  const innerBoxSize = 24
  const pad = size * padRatio
  const iconArea = size - pad * 2
  const scale = iconArea / innerBoxSize

  const composedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g transform="translate(${pad}, ${pad}) scale(${scale})">${innerPath}</g>
</svg>`

  await sharp(Buffer.from(composedSvg)).png().toFile(outPath)
  console.log(`✓ ${outPath} (${size}×${size}, bg=${bg})`)
}

// Make wordmark PNG (preserves SVG ratio at scale)
async function makeWordmarkPng({ svgPath, scale, outPath }) {
  await sharp(svgPath, { density: 72 * scale }).png().toFile(outPath)
  console.log(`✓ ${outPath} (scale ${scale}×)`)
}

// OG-default 1200×630 — dark bg with lockup top-left and big title
async function makeOgDefault() {
  const lockupDark = await readSvg(path.join(root, 'public', 'brand', 'wordmark-dark.svg'))
  const iconInner = (await readSvg(iconSvgPath)).match(/<path[^>]*\/>/)[0].replace(/fill="[^"]*"/, 'fill="#ffffff"')

  // Lockup at top-left: icon 60px wide + 12px gap + wordmark
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0c0a09"/>
  <g transform="translate(80, 70) scale(2.4)">${iconInner}</g>
  <g transform="translate(160, 70)">
    ${lockupDark
      .replace(/^<\?xml[^?]*\?>\s*/, '')
      .replace(/<svg[^>]*>/, '<g transform="scale(2.2)">')
      .replace(/<\/svg>\s*$/, '</g>')}
  </g>
  <text x="80" y="320" font-family="'DM Sans', Inter, sans-serif" font-weight="700" font-size="96" fill="#ffffff" letter-spacing="-4">Превращайте клики</text>
  <text x="80" y="430" font-family="'DM Sans', Inter, sans-serif" font-weight="700" font-size="96" fill="#ffffff" letter-spacing="-4">в выручку</text>
  <text x="80" y="540" font-family="'DM Sans', Inter, sans-serif" font-weight="400" font-size="28" fill="#a8a29e">Платформа атрибуции маркетинговых ссылок и партнёрского маркетинга</text>
</svg>`

  await sharp(Buffer.from(svg)).png().toFile(path.join(root, 'public', 'brand', 'og-default.png'))
  console.log('✓ og-default.png (1200×630)')
}

// Run
await makeIconPng({ size: 512, bg: DARK, fg: WHITE, outPath: path.join(root, 'public', 'brand', 'icons', 'icon-512.png') })
await makeIconPng({ size: 1024, bg: WHITE, fg: DARK, padRatio: 0.18, outPath: path.join(root, 'public', 'brand', 'logo-1024.png') })

// Wordmark raster versions
await makeWordmarkPng({ svgPath: wordmarkLightSvgPath, scale: 3, outPath: path.join(root, 'public', 'brand', 'wordmark-light.png') })
await makeWordmarkPng({ svgPath: wordmarkDarkSvgPath, scale: 3, outPath: path.join(root, 'public', 'brand', 'wordmark-dark.png') })

// OG default
await makeOgDefault()

console.log('Done.')

/**
 * Собственные размеры продуктовых скриншотов из public/images/screenshots/**.
 *
 * Зачем: `next/image` требует width/height (или fill), иначе не сможет
 * зарезервировать место под картинку и посчитать srcset. Пути к скриншотам
 * приходят в DS-компоненты строкой (`shot="/images/screenshots/..."`), поэтому
 * статический импорт с автоматическими размерами тут не работает — держим
 * реестр.
 *
 * Значения — реальные пиксели файлов (читаются из заголовков PNG).
 * Перепроверить/обновить после замены скриншота:
 *
 *   node -e "const fs=require('node:fs');const b=fs.readFileSync(process.argv[1]);console.log(b.readUInt32BE(16)+'x'+b.readUInt32BE(20))" public/images/screenshots/ru/overview.png
 *
 * Если пути в реестре нет, компоненты откатываются на обычный <img> —
 * вёрстка не ломается, теряется только оптимизация.
 */
export type ShotSize = { width: number; height: number }

export const SHOT_SIZES: Record<string, ShotSize> = {
  '/images/screenshots/analytics-conversions.png': { width: 1731, height: 909 },
  '/images/screenshots/analytics.png': { width: 1731, height: 909 },
  '/images/screenshots/create-links.png': { width: 1735, height: 906 },
  '/images/screenshots/events.png': { width: 1731, height: 909 },
  '/images/screenshots/list-links-zoom.png': { width: 1730, height: 909 },
  '/images/screenshots/list-links.png': { width: 1731, height: 909 },
  '/images/screenshots/ltv-customer.png': { width: 1731, height: 909 },
  '/images/screenshots/marketplace.png': { width: 1834, height: 880 },
  '/images/screenshots/partner-program.png': { width: 1731, height: 909 },
  '/images/screenshots/partners-offers.png': { width: 1848, height: 894 },
  '/images/screenshots/payouts.png': { width: 1731, height: 909 },
  '/images/screenshots/reward.png': { width: 1426, height: 746 },
  '/images/screenshots/ru/analytics.png': { width: 1894, height: 1080 },
  '/images/screenshots/ru/branding.png': { width: 1896, height: 1080 },
  '/images/screenshots/ru/create-link.png': { width: 1054, height: 812 },
  '/images/screenshots/ru/links-analytics.png': { width: 1920, height: 932 },
  '/images/screenshots/ru/links-list.png': { width: 1764, height: 940 },
  '/images/screenshots/ru/marketplace.png': { width: 1880, height: 1080 },
  '/images/screenshots/ru/overview.png': { width: 1892, height: 1080 },
  '/images/screenshots/ru/partner-overview.png': { width: 1884, height: 1080 },
  '/images/screenshots/ru/payouts.png': { width: 1920, height: 1080 },
  '/images/screenshots/ru/rewards.png': { width: 1920, height: 1080 },
}

export function shotSize(src: string): ShotSize | undefined {
  return SHOT_SIZES[src]
}

import { Onest, Playfair_Display } from 'next/font/google'

/**
 * Гарнитуры сайта. Требование №1 — кириллица: контент лендинга и доков русский.
 *
 * До этого здесь стояли DM Sans и Instrument Serif. В каталоге Google Fonts у обеих
 * есть только latin и latin-ext (проверяется по
 * node_modules/next/dist/compiled/@next/font/dist/google/font-data.json), поэтому весь
 * русский текст доставался метрическим фолбэкам, которые генерит next/font, — в собранном
 * CSS это @font-face "DM Sans Fallback": local("Arial") + size-adjust 104.53% и
 * "Instrument Serif Fallback": local("Times New Roman") + size-adjust 83.94%.
 * Латинские woff2 (37,0 + 18,2 КБ DM Sans и 15,0 + 15,7 КБ Instrument Serif — размеры
 * сняты с собранных файлов) грузились ради горстки глифов вроде «Revroute» и «PRM».
 *
 * Замена подобрана по метрикам из next/dist/server/capsize-font-metrics.json,
 * чтобы вёрстка, рассчитанная на прежние гарнитуры, не поехала:
 *   DM Sans          cap .700  xH .504  xWidthAvg .466  desc −.310
 *   Onest            cap .707  xH .527  xWidthAvg .469  desc −.305   ← ближайший гротеск с кириллицей
 *   Instrument Serif cap .720  xH .510
 *   Playfair Display cap .708  xH .514                               ← ближайший display-серив с кириллицей и настоящим италиком
 *
 * Модуль общий: корневых layout теперь три — по одному на группу маршрутов
 * ((landing), (marketing), (docs)). Объявление шрифта живёт в одном месте,
 * поэтому next/font выдаёт один и тот же набор woff2 и одни и те же имена
 * CSS-переменных на все три ветки, без дублей в бандле.
 */
export const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
})

// Все потребители --font-display задают fontWeight: 400 / font-normal, поэтому берём
// статическое начертание 400 (не variable) — это два файла на сабсет вместо переменного.
// Италик нужен: им набраны акценты <em> в заголовках секций.
//
// preload: false — сознательно. Гарнитуры объявлены в корневых layout, значит preload
// уходил бы на каждом маршруте, а --font-display читают только легаси-страницы
// (blog, glossary, compare, customers, integrations, analytics, …). На /, /prm, /pricing
// и в 322 страницах доков он не используется вообще: там DS-скоуп со своим Geist.
// Замеряно на /prm: с preload все 6 woff2 (111,7 КБ) качались вхолостую.
// Текст не пропадёт — display: swap плюс метрический фолбэк от next/font
// (@font-face "Playfair Display Fallback": local("Times New Roman") + size-adjust).
export const playfairDisplay = Playfair_Display({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
})

/** Классы CSS-переменных для <html>. */
export const fontVariables = `${onest.variable} ${playfairDisplay.variable}`

'use client'

/**
 * Отказ от офферов аккаунта в бесплатных инструментах («Мне хватит»).
 *
 * Действует 5 минут (решение владельца 15.08.2026; до этого было 7 дней).
 * Смысл сжался до «не дёргать в рамках текущей задачи»: пока человек
 * донастраивает и скачивает варианты кода, офферы молчат, а уже следующий
 * заход — снова с предложением. Защита от спама внутри задачи остаётся,
 * потерянных навсегда показов нет вовсе.
 *
 * Формат хранения — timestamp в миллисекундах. Старое значение '1' от
 * ранней версии парсится в Number(1) → давность заведомо больше TTL →
 * отказ считается истёкшим; на прод ранняя версия не выкатывалась.
 */
const KEY = 'rr_tools_offer_dismissed'
const TTL_MS = 5 * 60 * 1000

export function isOfferDismissed(): boolean {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return false
    const at = Number(raw)
    if (!Number.isFinite(at)) return false
    return Date.now() - at < TTL_MS
  } catch {
    // приватный режим: считаем, что отказа не было
    return false
  }
}

export function dismissOffers(): void {
  try { localStorage.setItem(KEY, String(Date.now())) } catch { /* noop */ }
}

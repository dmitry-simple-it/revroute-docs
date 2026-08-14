'use client'

/**
 * Отказ от офферов аккаунта в бесплатных инструментах («Мне хватит»).
 *
 * НЕ навсегда, а на 7 дней (решение 15.08.2026 по вопросу владельца).
 * Обоснование: разовый пользователь, отказавшийся сегодня, через неделю
 * приходит с новой задачей — новый тираж, другая кампания — и контекст
 * отказа устарел; вечный бан на первой итерации лишал бы нас показов
 * навсегда при крошечном трафике (60–95 визитов/нед). Внутри недели отказ
 * уважается железно: ни inline-офферов, ни попапов — это защита от спама,
 * а не от пользователя.
 *
 * Формат хранения — timestamp в миллисекундах. Старое значение '1' от
 * ранней версии парсится в Number(1) → давность заведомо больше недели →
 * отказ считается истёкшим; на прод ранняя версия не выкатывалась.
 */
const KEY = 'rr_tools_offer_dismissed'
const TTL_MS = 7 * 24 * 60 * 60 * 1000

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

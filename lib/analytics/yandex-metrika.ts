const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

export const YANDEX_METRIKA_ID = METRIKA_ID;

/**
 * Wrapper over window.ym — no-op if metrika is not loaded
 */
export function ym(...args: any[]) {
  if (typeof window !== "undefined" && window.ym && METRIKA_ID) {
    window.ym(Number(METRIKA_ID), ...args);
  }
}

export function trackGoal(goal: string, params?: Record<string, any>) {
  ym("reachGoal", goal, params);
}

/**
 * Параметр `page` для целей демо-воронки: '/prm' → 'prm'.
 *
 * Считается из адреса, а не из пропа `page` лид-формы: тот проп — метка для
 * Telegram-уведомления и лога заявки, и на /prm он равен 'prm-demo'. Если
 * demo_cta_click брал бы 'prm', а demo_form_start — 'prm-demo', воронка
 * «клик → начало → заявка» не сошлась бы по сегменту. Один источник на все
 * три цели снимает вопрос.
 *
 * Только клиент: на сервере window нет, поэтому зовётся из обработчиков.
 */
export function pageFromPath(pathname?: string): string {
  const path =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  return path.replace(/^\/+|\/+$/g, "") || "home";
}

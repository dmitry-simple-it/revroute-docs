const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

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

export const YANDEX_METRIKA_ID = METRIKA_ID;

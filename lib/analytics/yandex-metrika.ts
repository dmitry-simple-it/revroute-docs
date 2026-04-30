const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "108559142";

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

export const YANDEX_METRIKA_ID = METRIKA_ID;

export function ym(...args: any[]) {
  if (typeof window !== "undefined" && window.ym && YANDEX_METRIKA_ID) {
    window.ym(Number(YANDEX_METRIKA_ID), ...args);
  }
}

export function trackGoal(goal: string, params?: Record<string, any>) {
  ym("reachGoal", goal, params);
}


"use client";

import {
  decorateAppUrl,
  getLandingAttribution,
  getOrCreateLandingSessionId,
  readLandingAttributionFromUrl,
  upsertLandingAttribution,
} from "@/lib/analytics/attribution";
import { trackGoal, ym, YANDEX_METRIKA_ID } from "@/lib/analytics/yandex-metrika";
import { useCookieConsent } from "@/lib/hooks/use-cookie-consent";
import { useEffect, useRef } from "react";

export function LandingAnalytics() {
  const { consent } = useCookieConsent();
  const ymFlushedRef = useRef(false);

  // Session, UTM, link decoration, event listeners — не зависит от YM
  useEffect(() => {
    getOrCreateLandingSessionId();
    upsertLandingAttribution(readLandingAttributionFromUrl(window.location.href));

    const rewriteAppLinks = () => {
      const anchors = Array.from(document.querySelectorAll("a[href]")) as HTMLAnchorElement[];
      for (const a of anchors) {
        try {
          const url = new URL(a.href);
          if (url.host === "app.revroute.ru" && !url.searchParams.has("landing_session_id")) {
            a.href = decorateAppUrl(a.href);
          }
        } catch {}
      }
    };

    rewriteAppLinks();

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;

      const goal = a.dataset.ymGoal;
      if (goal) {
        trackGoal(goal, { href: a.href });
      }

      try {
        const url = new URL(a.href);
        const shouldDecorate =
          a.dataset.rrDecorateApp === "1" || url.host === "app.revroute.ru";
        if (shouldDecorate) {
          a.href = decorateAppUrl(a.href);
        }
      } catch {}
    };

    const onSubmit = (e: SubmitEvent) => {
      const target = e.target as HTMLElement | null;
      const form = target?.closest?.("form") as HTMLFormElement | null;
      if (!form) return;

      const goal = (form as any).dataset?.ymGoal as string | undefined;
      if (goal) {
        trackGoal(goal);
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);

    const mo = new MutationObserver(() => rewriteAppLinks());
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });

    return () => {
      mo.disconnect();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  // YM-зависимые вызовы — ждём пока consent станет accepted и window.ym загрузится
  useEffect(() => {
    if (consent !== "accepted") return;
    if (ymFlushedRef.current) return;

    const tryFlush = (): boolean => {
      if (!YANDEX_METRIKA_ID || !window.ym) return false;

      const sessionId = getOrCreateLandingSessionId();

      if (sessionId) {
        ym("params", { landing_session_id: sessionId });
      }

      const viewKey = `rr_landing_view_sent_${sessionId}`;
      try {
        if (!sessionStorage.getItem(viewKey)) {
          trackGoal("landing_view");
          sessionStorage.setItem(viewKey, "1");
        }
      } catch {}

      const stored = getLandingAttribution();
      if (!stored.ym_client_id) {
        ym("getClientID", (clientID: string) => {
          if (!clientID) return;
          upsertLandingAttribution({ ym_client_id: clientID });
          ym("params", { ym_client_id: clientID });
        });
      }

      ymFlushedRef.current = true;
      return true;
    };

    if (tryFlush()) return;

    // window.ym ещё не загружен — поллим каждые 200ms, максимум 10s
    const interval = setInterval(() => {
      if (tryFlush()) clearInterval(interval);
    }, 200);
    const timeout = setTimeout(() => clearInterval(interval), 10_000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [consent]);

  return null;
}

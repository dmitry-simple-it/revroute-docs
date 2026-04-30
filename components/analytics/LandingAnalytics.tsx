"use client";

import {
  decorateAppUrl,
  getLandingAttribution,
  getOrCreateLandingSessionId,
  readLandingAttributionFromUrl,
  upsertLandingAttribution,
} from "@/lib/analytics/attribution";
import { trackGoal, ym, YANDEX_METRIKA_ID } from "@/lib/analytics/yandex-metrika";
import { useEffect } from "react";

export function LandingAnalytics() {
  useEffect(() => {
    const sessionId = getOrCreateLandingSessionId();
    upsertLandingAttribution(readLandingAttributionFromUrl(window.location.href));

    if (YANDEX_METRIKA_ID && sessionId) {
      ym("params", { landing_session_id: sessionId });
    }

    const viewKey = `rr_landing_view_sent_${sessionId}`;
    try {
      if (!sessionStorage.getItem(viewKey)) {
        trackGoal("landing_view");
        sessionStorage.setItem(viewKey, "1");
      }
    } catch {}

    const rewriteAppLinks = () => {
      const anchors = Array.from(document.querySelectorAll("a[href]")) as HTMLAnchorElement[];
      for (const a of anchors) {
        try {
          const url = new URL(a.href);
          if (url.host === "app.revroute.ru") {
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

    const tryGetClientId = () => {
      if (!YANDEX_METRIKA_ID) return;
      const stored = getLandingAttribution();
      if (stored.ym_client_id) return;

      ym("getClientID", (clientID: string) => {
        if (!clientID) return;
        upsertLandingAttribution({ ym_client_id: clientID });
        ym("params", { ym_client_id: clientID });
      });
    };

    const t = window.setTimeout(tryGetClientId, 1500);
    const mo = new MutationObserver(() => rewriteAppLinks());
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });

    return () => {
      window.clearTimeout(t);
      mo.disconnect();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}

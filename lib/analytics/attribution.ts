import { normalizeArticleContext, parseAppAttributionUrl, type ArticleContext } from "./article-cta";
export { normalizeArticleContext } from "./article-cta";
export type { ArticleContext, ArticleCtaSlot } from "./article-cta";

export type LandingAttribution = {
  landing_session_id?: string;
  ym_client_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const STORAGE_KEY = "rr_landing_attribution";
const PAGE_SESSION_IDS = new WeakMap<Window, string>();

const ATTRIBUTION_KEYS: readonly (keyof LandingAttribution)[] = [
  "landing_session_id",
  "ym_client_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];


export function getOrCreateLandingSessionId(): string {
  if (typeof window === "undefined") return "";
  const pageWindow = window;
  try {
    const existing = pageWindow.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      const parsed = JSON.parse(existing) as LandingAttribution;
      if (parsed?.landing_session_id) {
        PAGE_SESSION_IDS.set(pageWindow, parsed.landing_session_id);
        return parsed.landing_session_id;
      }
    }
  } catch {}

  // Storage may be blocked or full. Rewrites in this page must keep the same ID.
  const pageSessionId = PAGE_SESSION_IDS.get(pageWindow);
  if (pageSessionId) return pageSessionId;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  PAGE_SESSION_IDS.set(pageWindow, id);
  upsertLandingAttribution({ landing_session_id: id });
  return id;
}

export function readLandingAttributionFromUrl(url: string): LandingAttribution {
  const u = new URL(url);
  const sp = u.searchParams;
  const pick = (k: string) => sp.get(k) || undefined;

  return {
    landing_session_id: pick("landing_session_id"),
    ym_client_id: pick("ym_client_id"),
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
  };
}

export function getLandingAttribution(): LandingAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LandingAttribution;
  } catch {
    return {};
  }
}

export function upsertLandingAttribution(update: LandingAttribution) {
  if (typeof window === "undefined") return;
  try {
    const current = getLandingAttribution();
    const merged: LandingAttribution = {
      ...current,
      ...Object.fromEntries(Object.entries(update).filter(([, v]) => v != null && v !== "")),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}
}

export function decorateAppUrl(href: string, articleContext?: ArticleContext | null): string {
  if (typeof window === "undefined") return href;

  const url = parseAppAttributionUrl(href);
  if (!url) return href;

  // These fields describe this page and CTA, never a persistent acquisition source.
  url.searchParams.delete("article_slug");
  url.searchParams.delete("article_cta_slot");
  const context = normalizeArticleContext(articleContext);

  const sessionId = getOrCreateLandingSessionId();
  const stored = getLandingAttribution();

  if (sessionId) url.searchParams.set("landing_session_id", sessionId);
  for (const key of ATTRIBUTION_KEYS) {
    const value = stored[key];
    if (!value) continue;
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }

  if (context) {
    url.searchParams.set("article_slug", context.article_slug);
    url.searchParams.set("article_cta_slot", context.article_cta_slot);
  }

  return url.toString();
}

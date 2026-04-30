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

export function getOrCreateLandingSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      const parsed = JSON.parse(existing) as LandingAttribution;
      if (parsed?.landing_session_id) return parsed.landing_session_id;
    }
  } catch {}

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

export function decorateAppUrl(href: string): string {
  if (typeof window === "undefined") return href;

  const sessionId = getOrCreateLandingSessionId();
  const stored = getLandingAttribution();

  try {
    const url = new URL(href);
    if (url.host !== "app.revroute.ru") return href;

    if (sessionId) url.searchParams.set("landing_session_id", sessionId);
    for (const [k, v] of Object.entries(stored)) {
      if (!v) continue;
      if (!url.searchParams.has(k)) url.searchParams.set(k, v);
    }

    return url.toString();
  } catch {
    return href;
  }
}


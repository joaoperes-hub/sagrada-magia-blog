"use client";

const SID_KEY = "gv_sid";
const SRC_KEY = "gv_src";

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function store(key: string, value?: string) {
  try {
    if (value !== undefined) sessionStorage.setItem(key, value);
    return sessionStorage.getItem(key);
  } catch {
    return value ?? null;
  }
}

let memorySid: string | null = null;

export function getSid() {
  const existing = store(SID_KEY) ?? memorySid;
  if (existing) return existing;
  memorySid = randomId();
  return store(SID_KEY, memorySid) ?? memorySid;
}

// Origem da visita: Meta (anúncio ou link do Instagram/Facebook), utm_source ou direto.
export function getSource() {
  const saved = store(SRC_KEY);
  if (saved) return saved;
  let src = "direto";
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source");
    const ref = document.referrer;
    if (utm) src = utm.toLowerCase();
    else if (params.get("fbclid")) src = "meta";
    else if (/instagram|facebook|fb\.com/i.test(ref)) src = "meta";
    else if (/whatsapp/i.test(ref)) src = "whatsapp";
    else if (ref) src = new URL(ref).hostname.replace(/^www\./, "");
  } catch {}
  return store(SRC_KEY, src) ?? src;
}

export function track(event: "visit" | "click") {
  const payload = JSON.stringify({ event, sid: getSid(), source: getSource() });
  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon("/api/grupovip/track", new Blob([payload], { type: "application/json" }));
      if (ok) return;
    }
  } catch {}
  fetch("/api/grupovip/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

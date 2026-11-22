"use client";

/**
 * Count one step on the way to a request (browser side). Private: no cookie,
 * no personal details, nothing sent to anyone but our own server, and nothing
 * at all when the visitor has Do Not Track or Global Privacy Control on.
 */
import type { FunnelEvent } from "./rules";

const KEY = "vibha-visit";

function optedOut(): boolean {
  if (typeof navigator === "undefined") return true;
  const n = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const w = typeof window !== "undefined" ? (window as Window & { doNotTrack?: string }) : undefined;
  return n.doNotTrack === "1" || n.doNotTrack === "yes" || n.msDoNotTrack === "1" || w?.doNotTrack === "1" || n.globalPrivacyControl === true;
}

let memoryVisit: string | null = null;

/** A random id for this tab session only. Never stored beyond the session. */
export function visitId(): string {
  try {
    const have = window.sessionStorage.getItem(KEY);
    if (have && /^[a-z0-9]{8,32}$/.test(have)) return have;
  } catch {
    /* storage blocked: keep one in memory */
  }
  if (!memoryVisit) {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    memoryVisit = Array.from(bytes, (b) => (b % 36).toString(36)).join("");
  }
  try {
    window.sessionStorage.setItem(KEY, memoryVisit);
  } catch {
    /* fine */
  }
  return memoryVisit;
}

/** Send one step. Never throws, never waits, never blocks a click. */
export function countStep(event: FunnelEvent, detail?: string, path?: string): void {
  try {
    if (typeof window === "undefined" || optedOut()) return;
    const body = JSON.stringify({
      visit: visitId(),
      event,
      path: path ?? window.location.pathname,
      detail: detail ?? null,
      ref: event === "view" ? document.referrer || null : null,
    });
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon && navigator.sendBeacon("/api/funnel", blob)) return;
    void fetch("/api/funnel", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
  } catch {
    /* counting must never break the page */
  }
}

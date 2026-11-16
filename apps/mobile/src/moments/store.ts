import { Platform } from "react-native";

import type { Credential } from "@/api/contract";
import { config } from "@/lib/config";
import { prefs } from "@/lib/storage";
import { createStore } from "@/lib/store";

/**
 * The full-screen moments (certificate earned, streak kept): what is showing
 * now. One at a time; a certificate waits behind a streak panel.
 */
export type Moment = { kind: "cert"; cert: Credential } | { kind: "streak"; days: number };

export const moments = createStore<{ now: Moment | null; queue: Moment[] }>({ now: null, queue: [] });

export function showMoment(m: Moment): void {
  const s = moments.get();
  if (s.now) moments.set({ queue: [...s.queue, m] });
  else moments.set({ now: m });
}

export function closeMoment(): void {
  const [next, ...rest] = moments.get().queue;
  moments.set({ now: next ?? null, queue: rest });
}

/** Local day, "2026-11-16". */
export function today(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Certificates already shown on this phone. The first look only remembers
 * what is there (a fresh install never replays old certificates); after
 * that, each new issued certificate is returned once.
 */
const CERT_KEY = "vibha.moments.certs";
export async function freshCertificates(certs: Credential[]): Promise<Credential[]> {
  const raw = await prefs.get(CERT_KEY).catch(() => null);
  const ids = certs.map((c) => c.credentialId);
  if (raw === null) {
    await prefs.set(CERT_KEY, JSON.stringify(ids)).catch(() => undefined);
    return [];
  }
  let seen: string[] = [];
  try {
    const v: unknown = JSON.parse(raw);
    if (Array.isArray(v)) seen = v.filter((x): x is string => typeof x === "string");
  } catch {
    seen = [];
  }
  const fresh = certs.filter((c) => !seen.includes(c.credentialId));
  if (fresh.length) await prefs.set(CERT_KEY, JSON.stringify([...seen, ...fresh.map((c) => c.credentialId)])).catch(() => undefined);
  return fresh;
}

/** Web mock builds only (screenshots): `?moment=cert|streak` plays a moment. */
export function devMoment(): string | null {
  if (Platform.OS !== "web" || config.apiMode !== "mock" || typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("moment");
}

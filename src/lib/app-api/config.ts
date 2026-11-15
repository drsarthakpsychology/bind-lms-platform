import { LEGAL, policyVersion } from "@/lib/legal-constants";
import { appUrl } from "@/lib/app-url";
import { CONTENT_SCHEMA_VERSION, type AppConfig } from "./contract";

/**
 * Every app rule that can change without a release, in one place.
 * Environment values (optional) let the owner change the two versions and the
 * notice from Vercel without a deploy of new code.
 */
export const APP_RULES = {
  /** Oldest app version the server still talks to (APP_MIN_VERSION overrides). */
  minSupportedVersion: "1.0.0",
  /** Newest released version (APP_LATEST_VERSION overrides). */
  latestVersion: "1.0.0",
  androidPackage: "com.vibhapsychology.app",
  pinLength: 4,
  pinMaxTries: 5,
  lockAfterBackgroundSeconds: 5 * 60,
  blockScreenCapture: true,
  refuseVideoOnRootedDevice: true,
  /** One active phone per student; a new phone signs the old one out. */
  onePhoneAtATime: true,
  /** Phone changes allowed in any DEVICE_WINDOW_DAYS. */
  deviceChangesPerMonth: 2,
  deviceWindowDays: 30,
  /** Roles the phone rules do not apply to. */
  deviceExemptRoles: ["admin", "view_admin"] as readonly string[],
  /** Seconds between lecture progress saves. */
  progressEverySeconds: 10,
  /** App video token: lecture length x factor + margin, clamped. */
  streamTtl: { factor: 1.5, marginSeconds: 600, minSeconds: 30 * 60, maxSeconds: 6 * 60 * 60 },
  /** How often the stream proxy re-checks the account and phone for a playing app. */
  streamRecheckSeconds: 60,
  /** The Welcome screen's cohort line (APP_COHORT_LINE overrides; "none" hides it). */
  cohortLine: "Cohort Two · by invitation · starts December 2026",
} as const;

/** "1.2.3" compared number by number; anything unreadable counts as 0. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
}

const VERSION_RE = /^\d+(\.\d+){0,3}$/;

export function minSupportedVersion(env: Record<string, string | undefined> = process.env): string {
  const v = (env.APP_MIN_VERSION ?? "").trim();
  return VERSION_RE.test(v) ? v : APP_RULES.minSupportedVersion;
}

export function latestVersion(env: Record<string, string | undefined> = process.env): string {
  const v = (env.APP_LATEST_VERSION ?? "").trim();
  const latest = VERSION_RE.test(v) ? v : APP_RULES.latestVersion;
  const min = minSupportedVersion(env);
  return compareVersions(latest, min) < 0 ? min : latest;
}

/** True when this app version may not talk to the server any more. A missing header passes (older builds, tools). */
export function tooOld(appVersion: string | null | undefined, env: Record<string, string | undefined> = process.env): boolean {
  const v = (appVersion ?? "").trim();
  if (!v || !VERSION_RE.test(v)) return false;
  return compareVersions(v, minSupportedVersion(env)) < 0;
}

export function storeUrls() {
  return { android: `https://play.google.com/store/apps/details?id=${APP_RULES.androidPackage}`, ios: null as string | null };
}

export function supportContacts() {
  return { whatsapp: `https://wa.me/${LEGAL.phone.replace(/[^\d]/g, "")}`, email: LEGAL.contactEmail };
}

/** The Welcome screen's cohort line, or null when switched off. */
export function cohortLine(env: Record<string, string | undefined> = process.env): string | null {
  const v = (env.APP_COHORT_LINE ?? "").trim();
  if (v.toLowerCase() === "none") return null;
  return (v || APP_RULES.cohortLine).slice(0, 120);
}

export function buildConfig(now = new Date(), env: Record<string, string | undefined> = process.env): AppConfig {
  const site = appUrl();
  const notice = (env.APP_NOTICE ?? "").trim().slice(0, 200);
  return {
    apiVersion: "v1",
    minSupportedVersion: minSupportedVersion(env),
    latestVersion: latestVersion(env),
    storeUrl: storeUrls(),
    notice: notice || null,
    security: {
      pinLength: APP_RULES.pinLength,
      pinMaxTries: APP_RULES.pinMaxTries,
      lockAfterBackgroundSeconds: APP_RULES.lockAfterBackgroundSeconds,
      blockScreenCapture: APP_RULES.blockScreenCapture,
      refuseVideoOnRootedDevice: APP_RULES.refuseVideoOnRootedDevice,
    },
    device: { onePhoneAtATime: APP_RULES.onePhoneAtATime, changesPerMonth: APP_RULES.deviceChangesPerMonth },
    support: supportContacts(),
    legal: { termsUrl: `${site}/policies/terms`, privacyUrl: `${site}/policies/privacy`, policyVersion: policyVersion() },
    contentSchemaVersion: CONTENT_SCHEMA_VERSION,
    now: now.toISOString(),
    cohortLine: cohortLine(env),
  };
}

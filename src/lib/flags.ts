/**
 * Feature flags (v5.1 A2) — per-tool go-live control for the admin.
 *
 * Each feature has a three-state `status`:
 *   - "off"      → hidden entirely. No card on the practice hub, and the
 *                  route shows the "not available" screen.
 *   - "live"     → students SEE the section exists (card on the hub with a
 *                  locked "yet to be live" state) but the content is locked.
 *   - "unlocked" → full content access.
 */

import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

export type FeatureKey =
  | "consulting_room"
  | "decoder"
  | "mse"
  | "judgment"
  | "rounds"
  | "journal"
  | "formulation"
  | "osce"
  | "ethics"
  | "case_library"
  | "landmark"
  | "peer_roleplay"
  | "two_minute_clinic"
  | "supervision"
  | "skills_passport"
  | "weak_spots"
  | "checkin"
  | "modules"
  | "knowledge_tutor";

export type FlagStatus = "off" | "live" | "unlocked";

const CACHE_TTL_MS = 30_000;
let cache: { at: number; flags: Record<string, FlagStatus> } | null = null;

/** Read all flags (cached briefly so a page doesn't hammer the DB). */
export async function readFlags(): Promise<Record<string, FlagStatus>> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.flags;
  const admin = createAdminClient();
  const { data } = await admin.from("feature_flags").select("key, status");
  const flags: Record<string, FlagStatus> = {};
  for (const f of data ?? []) flags[String(f.key)] = (f.status as FlagStatus) ?? "unlocked";
  cache = { at: Date.now(), flags };
  return flags;
}

/** Full content access? ("unlocked" only.) */
export async function isFeatureEnabled(key: FeatureKey): Promise<boolean> {
  return (await readFlags())[key] === "unlocked";
}

/** Is the section VISIBLE to students at all? (live or unlocked.) */
export async function isFeatureLive(key: FeatureKey): Promise<boolean> {
  const s = (await readFlags())[key];
  return s === "live" || s === "unlocked";
}

/** The raw three-state value for a feature. */
export async function getFeatureStatus(key: FeatureKey): Promise<FlagStatus> {
  return (await readFlags())[key] ?? "off";
}

/**
 * Server-side feature gate for CONTENT routes. Pages call this in their server
 * component:
 *   - unlocked → render.
 *   - live     → redirect to the "yet to be live" locked screen.
 *   - off      → redirect to the "not available" screen.
 * This is the route-level enforcement: the admin toggle is real, not just a
 * hidden card.
 */
import { redirect } from "next/navigation";

export async function requireFeature(key: FeatureKey): Promise<boolean> {
  const s = (await readFlags())[key];
  if (s === "unlocked") return true;
  if (s === "live") {
    redirect(`/practice/not-available?feature=${encodeURIComponent(key)}&state=live`);
  }
  redirect(`/practice/not-available?feature=${encodeURIComponent(key)}`);
}

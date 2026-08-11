/**
 * Feature flags (v5.1 A2) — scope cut for Cohort One: build everything,
 * ship six, hide nine behind a per-flag switch the admin flips at /admin/flags.
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
  | "checkin";

const CACHE_TTL_MS = 30_000;
let cache: { at: number; flags: Record<string, boolean> } | null = null;

/** Read all flags (cached briefly so a page doesn't hammer the DB). */
export async function readFlags(): Promise<Record<string, boolean>> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.flags;
  const admin = createAdminClient();
  const { data } = await admin.from("feature_flags").select("key, enabled");
  const flags: Record<string, boolean> = {};
  for (const f of data ?? []) flags[String(f.key)] = f.enabled as boolean;
  cache = { at: Date.now(), flags };
  return flags;
}

/** Is a feature enabled for the cohort? */
export async function isFeatureEnabled(key: FeatureKey): Promise<boolean> {
  const flags = await readFlags();
  return flags[key] === true;
}

/**
 * A2 — server-side feature gate. Pages call this in their server component;
 * when the flag is off it returns a "not yet available" page instead of
 * rendering the tool. This is the route-group-level enforcement the brief
 * requires (flag checked server-side, not just hidden in the UI).
 */
import { redirect } from "next/navigation";

export async function requireFeature(key: FeatureKey): Promise<boolean> {
  const flags = await readFlags();
  if (flags[key] === true) return true;
  // Honest gate: a proper "not yet available" experience, not a 404.
  redirect(`/practice/not-available?feature=${encodeURIComponent(key)}`);
}

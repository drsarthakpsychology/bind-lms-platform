import "server-only";
import { getSession } from "@/lib/auth/session";
import { gamesAllowed } from "@/lib/auth/scope";
import { createAdminClient } from "@/lib/supabase/server";

/** Shared server helpers for the games. */

export type Player = { id: string; admin: boolean; name: string | null; email: string };

/** The signed-in player, or null. Admins can play (to preview). */
export async function currentPlayer(): Promise<Player | null> {
  const s = await getSession();
  if (s.status !== "ok" || !gamesAllowed(s.profile)) return null;
  const p = s.profile;
  return { id: p.id, admin: p.role === "admin" || p.role === "view_admin", name: null, email: p.email ?? "" };
}

type PgError = { code?: string; message?: string } | null | undefined;

/** True when the error means the table (or column) hasn't been created yet. */
export function isMissing(e: PgError): boolean {
  if (!e) return false;
  return e.code === "42P01" || e.code === "PGRST205" || e.code === "42703" || /does not exist|could not find the table/i.test(e.message ?? "");
}

export function admin() {
  return createAdminClient();
}

/**
 * The people a player is compared with: everyone in their cohort(s). If the
 * player has no cohort (or the cohort tables are missing), null.
 */
export async function cohortPeers(userId: string): Promise<string[] | null> {
  try {
    const db = admin();
    const { data: mine, error } = await db.from("cohort_members").select("cohort_id").eq("user_id", userId);
    if (error || !mine?.length) return null;
    const ids = mine.map((m) => m.cohort_id as string);
    const { data: peers } = await db.from("cohort_members").select("user_id").in("cohort_id", ids).limit(5000);
    return [...new Set((peers ?? []).map((p) => p.user_id as string))];
  } catch {
    return null;
  }
}

/** Lifetime XP from the Learn engine's saved row (0 if missing). */
export async function learnXp(userId: string): Promise<number> {
  try {
    const { data } = await admin().from("learn_progress").select("xp").eq("user_id", userId).maybeSingle();
    return typeof data?.xp === "number" ? data.xp : 0;
  } catch {
    return 0;
  }
}

/** Short public name: "Aanya S." (never the full email). */
export function shortName(name: string | null | undefined, email: string | null | undefined): string {
  const n = (name ?? "").trim();
  if (n) {
    const [first, ...rest] = n.split(/\s+/);
    return rest.length ? `${first} ${rest[rest.length - 1][0].toUpperCase()}.` : first;
  }
  const base = String(email ?? "").split("@")[0].replace(/[._-]+/g, " ").replace(/\d+/g, "").trim();
  return base ? base.replace(/\b\w/g, (m) => m.toUpperCase()).split(" ")[0] : "Student";
}

export async function namesFor(ids: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!ids.length) return out;
  try {
    const { data } = await admin().from("profiles").select("id, name, email").in("id", ids);
    for (const p of data ?? []) out.set(p.id as string, shortName(p.name as string | null, p.email as string | null));
  } catch {
    /* names are decoration */
  }
  return out;
}

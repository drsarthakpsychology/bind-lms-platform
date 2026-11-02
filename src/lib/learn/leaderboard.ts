import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { addDays, istToday, levelFor, liveStreak, normalise } from "./engine";
import { domainMastery } from "./adaptive";

export type BoardRow = {
  userId: string;
  name: string;
  email: string;
  xp: number;
  weekXp: number;
  level: number;
  levelTitle: string;
  streak: number;
  accuracy: number | null;
  answered: number;
  mastery: number;
  lastDay: string | null;
};

/** Short display name: "Aanya S." from a name, or the email's first part. */
export function displayName(name: string | null | undefined, email: string): string {
  const n = (name ?? "").trim();
  if (n) {
    const [first, ...rest] = n.split(/\s+/);
    return rest.length ? `${first} ${rest[rest.length - 1][0].toUpperCase()}.` : first;
  }
  const base = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  return base.replace(/\b\w/g, (m) => m.toUpperCase()) || "Student";
}

/** Everyone's Learn progress, ranked by this week's XP, then total XP. */
export async function loadBoard(): Promise<BoardRow[]> {
  const admin = createAdminClient();
  const [{ data: rows }, { data: profiles }] = await Promise.all([
    admin.from("learn_progress").select("user_id, xp, state").limit(2000),
    admin.from("profiles").select("id, name, email, role, is_test").eq("role", "student").limit(5000),
  ]);
  const today = istToday();
  const weekStart = addDays(today, -6);
  const prof = new Map((profiles ?? []).filter((p) => !p.is_test).map((p) => [p.id as string, p]));
  return (rows ?? [])
    .filter((r) => prof.has(r.user_id as string))
    .map((r) => {
      const st = normalise(r.state);
      const p = prof.get(r.user_id as string)!;
      const weekXp = Object.entries(st.history).reduce((a, [d, x]) => (d >= weekStart ? a + x : a), 0);
      const lvl = levelFor(st.xp);
      return {
        userId: r.user_id as string,
        name: displayName(p.name as string | null, String(p.email ?? "")),
        email: String(p.email ?? ""),
        xp: st.xp,
        weekXp,
        level: lvl.level,
        levelTitle: lvl.title,
        streak: liveStreak(st.streak, today),
        accuracy: st.answered ? Math.round((st.correct / st.answered) * 100) : null,
        answered: st.answered,
        mastery: domainMastery(st.coach, "all").pct,
        lastDay: st.streak.lastDay,
      };
    })
    .sort((a, b) => b.weekXp - a.weekXp || b.xp - a.xp);
}

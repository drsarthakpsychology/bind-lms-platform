import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalise } from "@/lib/learn/engine";
import { evaluate, type EvalCtx } from "./engine";
import { moduleFacets, type AchievementRequirement } from "./rules";
import { newCredentialId } from "./storage";
import { notifyCredential } from "./notify";
import { displayName } from "@/lib/learn/leaderboard";

/**
 * Server-side evaluation + awarding. Reads the student's verified records once,
 * evaluates every enabled badge achievement, and awards any that are newly
 * satisfied — idempotently (a second run is a no-op).
 */

export async function loadEvalCtx(admin: SupabaseClient, userId: string): Promise<EvalCtx> {
  const [{ data: learn }, { data: progress }, { data: lessons }] = await Promise.all([
    admin.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(),
    admin.from("progress").select("lesson_id, watched_seconds, is_completed").eq("user_id", userId),
    admin.from("lessons").select("id, course_id"),
  ]);

  const state = normalise(learn?.state ?? null);
  const watchSeconds = (progress ?? []).reduce((a, p) => a + (Number(p.watched_seconds) || 0), 0);
  const completedLessons = new Set((progress ?? []).filter((p) => p.is_completed).map((p) => p.lesson_id as string));
  const courseLessons = new Map<string, string[]>();
  for (const l of lessons ?? []) {
    const c = l.course_id as string;
    courseLessons.set(c, [...(courseLessons.get(c) ?? []), l.id as string]);
  }

  return {
    study: state.study,
    xp: state.xp,
    watchSeconds,
    modules: moduleFacets(),
    courseLessons,
    completedLessons,
  };
}

/** Award any newly-satisfied enabled badge achievements for one student. */
export async function awardEligibleBadges(admin: SupabaseClient, userId: string, actorId: string | null): Promise<{ awarded: number; skipped: number }> {
  const [{ data: profile }, { data: achievements }, ctx] = await Promise.all([
    admin.from("profiles").select("name, email").eq("id", userId).maybeSingle(),
    admin.from("achievements").select("id, slug, title, type, requirements, icon, tone").eq("type", "badge").eq("enabled", true),
    loadEvalCtx(admin, userId),
  ]);

  const name = displayName(profile?.name as string | null, String(profile?.email ?? "")) || String(profile?.email ?? "Student");
  let awarded = 0;
  let skipped = 0;

  for (const a of achievements ?? []) {
    const result = evaluate((a.requirements ?? {}) as never, ctx);
    if (!result.ok) {
      skipped++;
      continue;
    }
    const { data: existing } = await admin
      .from("credentials")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", a.id)
      .eq("type", "badge")
      .maybeSingle();
    if (existing) {
      skipped++;
      continue;
    }
    const credentialId = newCredentialId();
    const { error } = await admin.from("credentials").insert({
      credential_id: credentialId,
      user_id: userId,
      achievement_id: a.id,
      type: "badge",
      status: "issued",
      student_name: name,
      issued_at: new Date().toISOString(),
      issued_by: actorId,
      reason: result.reason,
    });
    if (error && (error as { code?: string }).code === "23505") skipped++;
    else if (!error) {
      awarded++;
      // Notify only on a genuinely NEW award (never on recalculation).
      const moduleName = moduleTitle(a.requirements as AchievementRequirement, ctx);
      await notifyCredential({
        userId,
        email: profile?.email ? String(profile.email) : null,
        name,
        type: "badge",
        title: String(a.title),
        credentialId,
        moduleName,
      }).catch(() => {});
    }
  }

  return { awarded, skipped };
}

function moduleTitle(req: AchievementRequirement, ctx: EvalCtx): string | undefined {
  const mod = (req as { module?: string }).module;
  return mod ? ctx.modules.find((m) => m.id === mod)?.title : undefined;
}

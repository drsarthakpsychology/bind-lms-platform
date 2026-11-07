import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalise } from "@/lib/learn/engine";
import { evaluate, type EvalCtx } from "./engine";
import { moduleFacets, type AchievementRequirement } from "./rules";
import { MILESTONES, SECRET_TEXT } from "./milestones";
import { newCredentialId } from "./storage";
import { notifyCredential } from "./notify";
import { displayName } from "@/lib/learn/leaderboard";

/**
 * Server-side evaluation + awarding. Reads the student's verified records once,
 * evaluates every enabled badge achievement, and awards any that are newly
 * satisfied: idempotently (a second run is a no-op).
 */

/** League + ledger facts for milestones (zeros if those tables aren't there yet). */
export async function loadCompetitionFacts(admin: SupabaseClient, userId: string): Promise<Pick<EvalCtx, "promotions" | "bestTier" | "duelsWon" | "dailyCasesSolved" | "ledgerXp">> {
  const [weeks, ledger] = await Promise.all([
    Promise.resolve(admin.from("league_weeks").select("tier, result").eq("user_id", userId).limit(2000)).catch(() => ({ data: null, error: true })),
    Promise.resolve(admin.from("xp_ledger").select("source, amount").eq("user_id", userId).limit(20000)).catch(() => ({ data: null, error: true })),
  ]);
  const w = (weeks.error ? [] : (weeks.data ?? [])) as { tier: number; result: string | null }[];
  const l = (ledger.error ? [] : (ledger.data ?? [])) as { source: string; amount: number }[];
  const promotions = w.filter((r) => r.result === "promoted").length;
  // The tier reached: the highest tier played, or one above a promotion out of it.
  const bestTier = w.reduce((a, r) => Math.max(a, Math.min(5, (Number(r.tier) || 1) + (r.result === "promoted" ? 1 : 0))), 1);
  return {
    promotions,
    bestTier,
    duelsWon: l.filter((r) => r.source === "duel:win").length,
    dailyCasesSolved: l.filter((r) => r.source === "daily_case:solved").length,
    ledgerXp: l.reduce((a, r) => (r.amount > 0 && !r.source.startsWith("shop:") && !r.source.startsWith("refund") ? a + r.amount : a), 0),
  };
}

export async function loadEvalCtx(admin: SupabaseClient, userId: string): Promise<EvalCtx> {
  const [{ data: learn }, { data: progress }, { data: lessons }, facts] = await Promise.all([
    admin.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(),
    admin.from("progress").select("lesson_id, watched_seconds, is_completed").eq("user_id", userId),
    admin.from("lessons").select("id, course_id"),
    loadCompetitionFacts(admin, userId),
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
    streakBest: Math.max(state.streak.best, state.streak.count),
    ...facts,
  };
}

/**
 * Add any missing milestone and module badges to the achievements table.
 * Idempotent (matched by slug, and a module that already has a "complete a
 * module" badge gets no second one). Safe to call from the weekly job.
 */
export async function ensureBadgeCatalog(admin: SupabaseClient): Promise<{ added: number; error: string | null }> {
  const { data, error } = await admin.from("achievements").select("slug, requirements").limit(5000);
  if (error) return { added: 0, error: error.message };
  const slugs = new Set((data ?? []).map((a) => a.slug as string));
  const moduleBadges = new Set(
    (data ?? [])
      .map((a) => a.requirements as { kind?: string; module?: string } | null)
      .filter((r) => r?.kind === "module_complete" && r.module)
      .map((r) => r!.module as string),
  );
  const rows: Record<string, unknown>[] = [];
  for (const m of MILESTONES) {
    if (slugs.has(m.slug)) continue;
    const secret = Boolean(m.requirements.secret);
    rows.push({ slug: m.slug, type: "badge", title: m.title, description: secret ? SECRET_TEXT : m.description, icon: m.icon, tone: m.tone, requirements: m.requirements, enabled: true });
  }
  for (const f of moduleFacets()) {
    const slug = `module-${f.id}`;
    if (slugs.has(slug) || moduleBadges.has(f.id)) continue;
    rows.push({ slug, type: "badge", title: `Completed ${f.title}`, description: `Finished every part of ${f.title}.`, module_id: f.id, icon: "✓", tone: "lime", requirements: { kind: "module_complete", module: f.id }, enabled: true });
  }
  if (!rows.length) return { added: 0, error: null };
  const ins = await admin.from("achievements").upsert(rows, { onConflict: "slug", ignoreDuplicates: true });
  return { added: ins.error ? 0 : rows.length, error: ins.error?.message ?? null };
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
    const secret = MILESTONES.find((m) => m.slug === a.slug && m.requirements.secret);
    const { error } = await admin.from("credentials").insert({
      credential_id: credentialId,
      user_id: userId,
      achievement_id: a.id,
      type: "badge",
      status: "issued",
      student_name: name,
      issued_at: new Date().toISOString(),
      issued_by: actorId,
      reason: secret ? secret.description : result.reason,
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

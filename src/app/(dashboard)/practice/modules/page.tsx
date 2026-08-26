import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { Lock, Clock3, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/modules — the student view of the module system (v5 §8).
 * Locked modules are VISIBLE and greyed with an honest reason ("opens
 * 2 Sept" / "finish Module 3 first"), never silently hidden. The module
 * progression gate itself stays server-enforced in the pages it covers.
 */
export default async function ModulesPage() {
  await requireFeature("modules");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();

  // All modules (published + scheduled + draft-with-release), admin reads all.
  const { data: modules } = await admin
    .from("modules")
    .select("id, title, order_index, state, release_at")
    .order("order_index");

  // The student's grants.
  const { data: access } = await supabase
    .from("module_access")
    .select("module_id, scope")
    .or(`student_id.eq.${user.id},scope.eq.cohort`);

  const granted = new Set((access ?? []).map((a) => a.module_id));

  const now = new Date();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Modules</p>
      <h1 className="mt-1 text-h1">What&apos;s in your course, in order</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Modules unlock as your faculty releases them. Locked ones are listed with the reason —
        nothing is hidden from you.
      </p>

      <ul className="mt-6 space-y-3">
        {(modules ?? []).map((m, i) => {
          const state = String(m.state);
          const releaseAt = m.release_at ? new Date(m.release_at) : null;
          const isReleased = state === "published" && (!releaseAt || releaseAt <= now);
          const isScheduled = state === "scheduled" || (state === "published" && releaseAt && releaseAt > now);
          const locked = !isReleased && !granted.has(m.id);
          const unlockedByGrant = !isReleased && granted.has(m.id);

          let reason: string | null = null;
          if (isScheduled && releaseAt) {
            const d = releaseAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            reason = `Opens ${d}`;
          } else if (state === "draft") {
            reason = "Being finalised — your faculty will release it closer to the time";
          } else if (state === "archived") {
            reason = "Archived for this cohort";
          }

          return (
            <li
              key={m.id}
              className={cn(
                "rounded-md border-2 border-border bg-card p-4",
                locked && "opacity-60",
                unlockedByGrant && "border-primary",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-muted-foreground">
                  {locked ? (
                    <Lock className="size-4" aria-hidden />
                  ) : isScheduled ? (
                    <Clock3 className="size-4" aria-hidden />
                  ) : (
                    <CheckCircle2 className="size-4 text-green-600" aria-hidden />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-small font-semibold">
                    {i + 1}. {m.title}
                  </p>
                  {locked && reason ? (
                    <p className="mt-0.5 text-caption text-muted-foreground">
                      Locked — {reason}
                    </p>
                  ) : unlockedByGrant ? (
                    <p className="mt-0.5 text-caption text-link">Unlocked for you (special grant)</p>
                  ) : (
                    <p className="mt-0.5 text-caption text-muted-foreground">
                      {isScheduled ? "Scheduled — coming soon" : "Open — dive in"}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        {(modules ?? []).length === 0 ? (
          <li className="rounded-md border-2 border-dashed border-border bg-card p-6 text-center">
            <p className="text-small text-muted-foreground">
              No modules published yet — check back after your course begins.
            </p>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
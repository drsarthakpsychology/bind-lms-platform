import { createClient } from "@/lib/supabase/server";
import { CheckinForm } from "./checkin-form";

export const dynamic = "force-dynamic";

/**
 * /practice/check-in — weekly, non-clinical, 30 seconds.
 * Aggregate-only for admin (checkins_aggregate view, no identifiers).
 */
export default async function CheckinPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Monday of the current week — one check-in per week.
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Mon=0
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  const weekLabel = monday.toISOString().slice(0, 10);

  // Has this week been answered already?
  const { data: existing } = await supabase
    .from("checkins")
    .select("workload, energy, preparedness, free_line")
    .eq("user_id", user.id)
    .eq("week_label", weekLabel)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Weekly check-in</p>
      <h1 className="mt-1 text-h1">How&apos;s the week, really?</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Thirty seconds. Not clinical, not graded — just a read on the cohort so faculty
        can adjust. Faculty see trends only, never who said what.
      </p>

      <div className="mt-6">
        <CheckinForm
          weekLabel={weekLabel}
          initial={
            existing
              ? {
                  workload: existing.workload as number,
                  energy: existing.energy as number,
                  preparedness: existing.preparedness as number,
                  freeLine: (existing.free_line as string | null) ?? undefined,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

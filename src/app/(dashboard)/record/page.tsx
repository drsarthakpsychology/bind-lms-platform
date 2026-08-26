import { createClient } from "@/lib/supabase/server";
import { SupervisionLog, type SupervisionEntry } from "@/app/(dashboard)/practice/supervision/supervision-log";
import { CheckinForm } from "@/app/(dashboard)/practice/check-in/checkin-form";
import { readFlags } from "@/lib/flags";
import { redirect } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { RecordTabs } from "./record-tabs";

export const dynamic = "force-dynamic";

/**
 * /record — the admin-you-file home (casebook Finding 4).
 * Supervision contact hours + the weekly check-in live together here, out of
 * the /practice drill grid: both are records about your training, not things
 * you do. Tagged supervision hours feed the Skills Passport.
 *
 * Supervision and check-in are INDEPENDENTLY toggleable features — only
 * redirect when BOTH are off; otherwise show just the enabled tab(s).
 */
export default async function RecordPage() {
  const flags = await readFlags();
  const supervisionEnabled = flags["supervision"] === true;
  const checkinEnabled = flags["checkin"] === true;
  if (!supervisionEnabled && !checkinEnabled) {
    redirect("/practice/not-available");
  }
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

  const [{ data: entries }, { data: competencies }, { data: compRows }, { data: checkin }] = await Promise.all([
    // Explicit columns (egress: supervision_entries carries more than the log shows).
    supabase.from("supervision_entries").select("id, activity, hours, date, supervisor_name, supervisor_email, competency_id, signoff_status").eq("user_id", user.id).order("date", { ascending: false }),
    supabase.from("competencies").select("key, name").order("display_order"),
    supabase.from("competencies").select("id, key, name"),
    supabase
      .from("checkins")
      .select("workload, energy, preparedness, free_line")
      .eq("user_id", user.id)
      .eq("week_label", weekLabel)
      .maybeSingle(),
  ]);

  // competency_id → name, for the list display.
  const nameById = new Map((compRows ?? []).map((c) => [c.id, c.name]));

  const list: SupervisionEntry[] = (entries ?? []).map((e) => ({
    id: e.id,
    activity: String(e.activity),
    hours: Number(e.hours),
    date: e.date as string,
    supervisorName: (e.supervisor_name as string | null) ?? undefined,
    supervisorEmail: (e.supervisor_email as string | null) ?? undefined,
    competencyName: e.competency_id ? nameById.get(e.competency_id) : undefined,
    signoffStatus: e.signoff_status as SupervisionEntry["signoffStatus"],
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6">
      <Reveal delay={0.05}>
        <header>
          <p className="text-eyebrow text-muted-foreground">Your record</p>
          <h1 className="mt-1 text-h1">The paper trail of your training</h1>
          <p className="mt-1 text-small text-muted-foreground">
            Supervision hours and the weekly check-in — records about your training,
            not drills. Your Skills Passport reads from the same evidence.
          </p>
        </header>
      </Reveal>

      <Reveal delay={0.15}>
        <RecordTabs
          supervisionEnabled={supervisionEnabled}
          checkinEnabled={checkinEnabled}
          supervision={
            <SupervisionLog
              entries={list}
              competencies={(competencies ?? []).map((c) => ({ key: c.key as string, name: c.name as string }))}
            />
          }
          checkin={
            <CheckinForm
              weekLabel={weekLabel}
              initial={
                checkin
                  ? {
                      workload: checkin.workload as number,
                      energy: checkin.energy as number,
                      preparedness: checkin.preparedness as number,
                      freeLine: (checkin.free_line as string | null) ?? undefined,
                    }
                  : undefined
              }
            />
          }
        />
      </Reveal>
    </div>
  );
}

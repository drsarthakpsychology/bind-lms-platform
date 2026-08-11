import { createClient } from "@/lib/supabase/server";
import { SupervisionLog, type SupervisionEntry } from "./supervision-log";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/supervision — log RCI-track supervision contact hours.
 * Owner + admin RLS. Tagged hours feed the Skills Passport (competency_events).
 */
export default async function SupervisionPage() {

  await requireFeature("supervision");  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: entries }, { data: competencies }, { data: compRows }] = await Promise.all([
    supabase.from("supervision_entries").select("*").eq("user_id", user.id).order("date", { ascending: false }),
    supabase.from("competencies").select("key, name").order("display_order"),
    supabase.from("competencies").select("id, key, name"),
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Supervision</p>
      <h1 className="mt-1 text-h1">Your supervision log</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Log real-world contact hours with your supervisor. Tag a competency and the hour
        feeds your Skills Passport; ask for sign-off when ready.
      </p>

      <div className="mt-6">
        <SupervisionLog entries={list} competencies={(competencies ?? []).map((c) => ({ key: c.key as string, name: c.name as string }))} />
      </div>
    </div>
  );
}

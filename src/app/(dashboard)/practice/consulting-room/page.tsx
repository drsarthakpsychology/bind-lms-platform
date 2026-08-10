import { createAdminClient } from "@/lib/supabase/server";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";
import { CasePicker } from "./case-picker";
import { SimulationBadge } from "./simulation-badge";

export const dynamic = "force-dynamic";

/**
 * /practice/consulting-room — pick a case and start a session.
 * The flagship tool. Lists published sim cases (hand-built seed first).
 */
export default async function ConsultingRoomPage() {
  const admin = createAdminClient();
  const { data: published } = await admin
    .from("sim_cases")
    .select("id, title, difficulty, case_data")
    .eq("status", "published")
    .eq("approved", true)
    .order("created_at", { ascending: true });

  const dbCases = published ?? [];
  // Merge seed cases (always available) with any DB cases.
  const merged = [
    ...SEED_CASES.map((c) => ({
      id: "",
      title: c.title,
      difficulty: c.difficulty,
      summary: c.presentation,
      source: "hand_built" as const,
    })),
    ...dbCases
      .map((c) => ({
        id: c.id,
        title: c.title,
        difficulty: (c.case_data as { difficulty?: string })?.difficulty ?? "cooperative",
        summary: (c.case_data as { presentation?: string })?.presentation ?? "",
        source: ((c.case_data as { source?: string })?.source ?? "corpus") === "hand_built" ? ("hand_built" as const) : ("corpus" as const),
      })),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-eyebrow text-muted-foreground">Consulting Room</p>
          <h1 className="mt-1 text-h1">Choose your patient</h1>
          <p className="mt-1 text-small text-muted-foreground">
            Real presentations, real language, realistic help-seeking delay. Your debrief will
            show you what you missed.
          </p>
          <p className="mt-1 text-small text-muted-foreground">
            Everything here is a simulation. Sessions are private to you and your faculty.
          </p>
        </div>
        <SimulationBadge />
      </div>

      <CasePicker cases={merged} />

      <div className="mt-8 rounded-md border-2 border-border bg-card p-4">
        <h2 className="text-base font-semibold">Safety first</h2>
        <ul className="mt-2 space-y-1 text-small text-muted-foreground">
          <li>• Everything here is a <strong>simulation</strong>. The patient is not real.</li>
          <li>• If you&apos;re struggling yourself, this is not the place — reach out to your faculty or a helpline.</li>
          <li>• Your sessions are private to you and your faculty, and are used only for your debrief.</li>
        </ul>
      </div>
    </div>
  );
}

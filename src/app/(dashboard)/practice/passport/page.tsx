import { createClient } from "@/lib/supabase/server";
import { Download } from "lucide-react";
import { Passport, type PassportRow } from "./passport";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/passport — Skills Passport (Part 6.9).
 * Student-facing progress across the competency framework, built from
 * competency_events (fed by supervision tagging today; sim/SCT/etc. wiring
 * to come). The PDF certificate appendix is the deferred big item.
 */
export default async function PassportPage() {

  await requireFeature("skills_passport");  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: competencies }, { data: events }] = await Promise.all([
    supabase.from("competencies").select("id, key, name, description").order("display_order"),
    supabase
      .from("competency_events")
      .select("id, competency_id, source, evidence, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const byComp = new Map<string, PassportRow["events"]>();
  for (const e of events ?? []) {
    const list = byComp.get(e.competency_id) ?? [];
    list.push({
      id: e.id,
      source: String(e.source),
      evidence: (e.evidence as Record<string, unknown>) ?? {},
      createdAt: e.created_at,
    });
    byComp.set(e.competency_id, list);
  }

  const rows: PassportRow[] = (competencies ?? []).map((c) => ({
    key: c.key as string,
    name: c.name as string,
    description: (c.description as string | null) ?? undefined,
    events: byComp.get(c.id) ?? [],
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Skills passport</p>
      <h1 className="mt-1 text-h1">Your competencies, evidenced</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Eleven competencies across the RCI-track framework. Every tagged supervision hour and
        practice tool adds evidence. Signed-off hours here underpin your certificate.
      </p>

      <div className="mt-4">
        <a
          href="/api/practice/passport/pdf"
          className="inline-flex items-center gap-2 rounded-md border-2 border-border bg-card px-4 py-2 text-small font-semibold hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
        >
          <Download className="size-4" aria-hidden />
          Download passport PDF
        </a>
      </div>

      <div className="mt-6">
        <Passport rows={rows} />
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { DictateForm } from "./dictate-form";

export const dynamic = "force-dynamic";

/**
 * /admin/corpus/dictate — Dr. Sarthak records anonymised composite cases
 * from his own practice (Part 4.3: the highest-value corpus source).
 * Each is saved as a sim_case draft (source='faculty_dictated',
 * approved=false) for review, then publish.
 */
export default async function DictatePage() {
  const supabase = await createClient();

  // Recently dictated (unpublished) cases for the admin's own continuity.
  const { data: recent } = await supabase
    .from("sim_cases")
    .select("id, title, status, difficulty, created_at")
    .eq("source", "faculty_dictated")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Corpus · Dictate</p>
      <h1 className="mt-1 text-h1">Dictate a case from practice</h1>
      <p className="mt-2 text-small text-muted-foreground">
        Twenty real presentations from your practice beat ten thousand scraped pages.
        Anonymise — no names, no identifying details. Each saves as a draft for review.
      </p>

      <div className="mt-6">
        <DictateForm />
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold">Recently dictated</h2>
        {(recent ?? []).length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">
            Nothing yet. Your first case is the most valuable one.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(recent ?? []).map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-md border-2 border-border bg-card p-3">
                <div>
                  <p className="text-small font-medium">{c.title}</p>
                  <p className="text-caption text-muted-foreground">
                    {c.difficulty} · {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 text-caption text-muted-foreground">
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

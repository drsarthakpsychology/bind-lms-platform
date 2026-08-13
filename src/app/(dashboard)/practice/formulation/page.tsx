import { createClient } from "@/lib/supabase/server";
import { FormulationForge } from "./forge";
import { PeerWall } from "./peer-wall";
import { requireFeature } from "@/lib/flags";
import type { FormulationFactor } from "@/lib/practice/formulation";

export const dynamic = "force-dynamic";

interface FormulationCaseRow {
  slug: string;
  title: string;
  prompt: string;
  factors: unknown;
  model_answer: unknown;
}

/**
 * /practice/formulation — Formulation Forge (Part 6.2).
 * Stage 1: sort factor cards into the 5P grid (with distractors).
 * Stage 2: write the narrative. Stage 3: diff against the model — a diff, not a grade.
 * Stage 4: formulate from your own Consulting Room transcript.
 * Plus the anonymised peer-critique wall (IDEAS: Formulation Wall).
 *
 * The scaffolded case is read from the live formulation_cases table (content
 * wiring); SEED_FORMULATION is the fallback when the DB is empty.
 */
export default async function FormulationPage() {
  await requireFeature("formulation");
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from("formulation_cases")
    .select("slug, title, prompt, factors, model_answer")
    .eq("status", "published")
    .limit(1);

  const row = (cases?.[0] ?? null) as FormulationCaseRow | null;
  const seed = row
    ? {
        id: row.slug,
        title: row.title,
        prompt: row.prompt,
        factors: (Array.isArray(row.factors) ? row.factors : []) as FormulationFactor[],
        modelNarrative:
          (row.model_answer as { narrative?: string } | null)?.narrative ?? "",
      }
    : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Formulation Forge</p>
      <h1 className="mt-1 text-h1">Build the formulation</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Sort the 5P factors, write the narrative, then diff against the model. It&apos;s a diff,
        not a grade — you&apos;re learning the structure.
      </p>

      <div className="mt-6">
        <FormulationForge seed={seed} />
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold">The peer wall — anonymised critiques</h2>
        <p className="mt-1 text-small text-muted-foreground">
          Formulations the cohort has shared. The structure is the lesson; nobody&apos;s name
          is attached.
        </p>
        <div className="mt-3">
          <PeerWall />
        </div>
      </div>
    </div>
  );
}

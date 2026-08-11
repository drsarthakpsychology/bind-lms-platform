import { FormulationForge } from "./forge";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/formulation — Formulation Forge (Part 6.2).
 * Stage 1: sort factor cards into the 5P grid (with distractors).
 * Stage 2: write the narrative. Stage 3: diff against the model — a diff, not a grade.
 */
export default async function FormulationPage() {
  await requireFeature("formulation");
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Formulation Forge</p>
      <h1 className="mt-1 text-h1">Build the formulation</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Sort the 5P factors, write the narrative, then diff against the model. It&apos;s a diff,
        not a grade — you&apos;re learning the structure.
      </p>

      <div className="mt-6">
        <FormulationForge />
      </div>
    </div>
  );
}

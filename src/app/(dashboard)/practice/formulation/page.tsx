import { FormulationForge } from "./forge";
import { PeerWall } from "./peer-wall";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/formulation — Formulation Forge (Part 6.2).
 * Stage 1: sort factor cards into the 5P grid (with distractors).
 * Stage 2: write the narrative. Stage 3: diff against the model — a diff, not a grade.
 * Plus the anonymised peer-critique wall (IDEAS: Formulation Wall).
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

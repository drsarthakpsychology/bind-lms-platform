import { ToolHeader } from "@/components/help/tool-header";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FormulationForge } from "./forge";
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";
import { PeerWall } from "./peer-wall";
import { requireFeature } from "@/lib/flags";
import { orderForViewer } from "@/lib/history/viewer";
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
 * /practice/formulation: Formulation Forge (Part 6.2).
 * Stage 1: sort factor cards into the 5P grid (with distractors).
 * Stage 2: write the narrative. Stage 3: diff against the model, a diff, not a grade.
 * Stage 4: formulate from your own Consulting Room transcript.
 * Plus the anonymised peer-critique wall (IDEAS: Formulation Wall).
 *
 * The scaffolded case is read from the live formulation_cases table (content
 * wiring); SEED_FORMULATION is the fallback when the DB is empty.
 */
export default async function FormulationPage({ searchParams }: { searchParams: Promise<{ case?: string }> }) {
  await requireFeature("formulation");
  const { case: pick } = await searchParams;
  const supabase = await createClient();
  const { data: cases } = await supabase
    .from("formulation_cases")
    .select("slug, title, prompt, factors, model_answer")
    .eq("status", "published")
    .limit(50);

  // Cases written in the database (with real factor cards) join the built-in set.
  const fromDb = ((cases ?? []) as FormulationCaseRow[])
    .filter((r) => Array.isArray(r.factors) && r.factors.length >= 6 && !FORMULATION_CASES.some((c) => c.id === r.slug))
    .map((r) => ({
      id: r.slug,
      title: r.title,
      prompt: r.prompt,
      hint: "",
      factors: r.factors as FormulationFactor[],
      modelNarrative: (r.model_answer as { narrative?: string } | null)?.narrative ?? "",
    }));
  const all = [...FORMULATION_CASES, ...fromDb];
  // No case asked for: the first case not done yet, then a weak one, then the oldest (src/lib/history).
  const firstId = pick && all.some((c) => c.id === pick) ? pick : (await orderForViewer("formulation", all.map((c) => c.id)))[0];
  const seed = all.find((c) => c.id === firstId) ?? all[0];

  return (
    <div className="mx-auto max-w-4xl">
      <ToolHeader title="Build the formulation" tip={{ id: "formulation", steps: ["Sort the factors into the 5 Ps.", "Write the story in your own words.", "Compare with the answer."] }} />

      <nav aria-label="Cases" className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {all.map((c, i) => (
          <Link
            key={c.id}
            href={`/practice/formulation?case=${c.id}`}
            aria-current={c.id === seed.id ? "page" : undefined}
            title={c.hint || c.title}
            className={`shrink-0 rounded-full border-2 border-foreground px-3.5 py-1.5 text-sm font-semibold ${c.id === seed.id ? "bg-foreground text-background" : "bg-card"}`}
          >
            Case {i + 1}: {c.title.split(":")[0]}
          </Link>
        ))}
      </nav>
      <p className="mt-2 text-sm font-semibold">{seed.title}</p>

      <div className="mt-4">
        <FormulationForge key={seed.id} seed={seed} />
      </div>

      <div className="mt-10">
        <h2 className="text-base font-semibold">Shared by classmates, without names</h2>
        <div className="mt-3">
          <PeerWall />
        </div>
      </div>
    </div>
  );
}

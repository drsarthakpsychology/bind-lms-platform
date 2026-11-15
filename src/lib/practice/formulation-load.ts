import "server-only";
import { createClient } from "@/lib/supabase/server";
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";
import type { FormulationFactor } from "@/lib/practice/formulation";
import { caseContext } from "@/lib/cases/server";
import { arrangeCases } from "@/lib/cases/fresh";
import { mergeProgress, startedIds } from "@/lib/cases/progress";
import { fromRows } from "@/lib/history/order";

/*
 * Formulation's case library (moved out of src/app/(dashboard)/practice/formulation/page.tsx
 * so the mobile app gets the same cases): the built-in cases plus the
 * published ones from the database, in fresh-case order for the viewer.
 */

interface FormulationCaseRow {
  slug: string;
  title: string;
  prompt: string;
  factors: unknown;
  model_answer: unknown;
}

export async function loadFormulationCases() {
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
  // Fresh-case order (src/lib/cases/fresh.ts): half done, new this week, new, done last.
  const ctx = await caseContext("formulation", all.map((c) => c.id), "formulation");
  const arranged = arrangeCases(all, (c) => c.id, { history: fromRows(ctx.history), now: ctx.now, student: ctx.student, started: startedIds(mergeProgress(ctx.progress.rows, [])) });
  return { all, ctx, arranged };
}

import { GameFrame } from "@/components/play/game-frame";
import { uiV2 } from "@/lib/ui/v2-server";
import { PlayStack } from "@/components/play/parts";
import { Section } from "@/components/ds";
import { ToolHeader } from "@/components/help/tool-header";
import { HowToStart } from "@/components/help/how-to";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FormulationForge } from "./forge";
import { FORMULATION_CASES } from "@/lib/practice/formulation-cases";
import { PeerWall } from "./peer-wall";
import { requireFeature } from "@/lib/flags";
import { caseContext } from "@/lib/cases/server";
import { arrangeCases } from "@/lib/cases/fresh";
import { mergeProgress, startedIds } from "@/lib/cases/progress";
import { fromRows } from "@/lib/history/order";
import { CaseMarkTag, RecycleNote } from "@/components/cases/case-mark";
import type { FormulationFactor } from "@/lib/practice/formulation";
import { BackPill } from "@/components/study/back";

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
  // Fresh-case order (src/lib/cases/fresh.ts): half done, new this week, new, done last.
  const ctx = await caseContext("formulation", all.map((c) => c.id), "formulation");
  const arranged = arrangeCases(all, (c) => c.id, { history: fromRows(ctx.history), now: ctx.now, student: ctx.student, started: startedIds(mergeProgress(ctx.progress.rows, [])) });
  // No case asked for: the first one not done (a half-done one first).
  const firstId = pick && all.some((c) => c.id === pick) ? pick : arranged.list[0]?.id;
  const seed = all.find((c) => c.id === firstId) ?? all[0];
  const number = new Map(all.map((c, i) => [c.id, i + 1]));
  const next = arranged.list.find((x) => x.id !== seed.id && x.mark !== "done") ?? arranged.list.find((x) => x.id !== seed.id);

  if (await uiV2()) {
    return (
      <GameFrame title="Build the formulation" tip={{ id: "formulation", label: "How it works", steps: ["Sort the factors into the 5 Ps.", "Write the story in your own words.", "Compare with the answer."] }}>
        <PlayStack>
          <div className="flex min-w-0 flex-col gap-3">
            {arranged.recycled ? <RecycleNote /> : null}
            {/* The cases: one row of chips that scrolls sideways. */}
            <nav aria-label="Cases" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {arranged.list.map(({ item: c, mark }) => (
                <Link
                  key={c.id}
                  href={`/practice/formulation?case=${c.id}`}
                  aria-current={c.id === seed.id ? "page" : undefined}
                  title={c.hint || c.title}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 type-small font-semibold whitespace-nowrap ${c.id === seed.id ? "border-foreground bg-foreground text-background" : mark === "done" ? "border-[var(--ds-card-line)] text-muted-foreground" : "border-[var(--ds-card-line)] hover:border-foreground"}`}
                >
                  {mark !== "done" || c.id === seed.id ? <CaseMarkTag mark={mark} /> : null}
                  <span>
                    Case {number.get(c.id)}: {c.title.split(":")[0]}
                  </span>
                  {mark === "done" && c.id !== seed.id ? <CaseMarkTag mark="done" /> : null}
                </Link>
              ))}
            </nav>
            <h2 className="type-h3 [overflow-wrap:anywhere]">{seed.title}</h2>
            <HowToStart id="formulation">
              <FormulationForge key={seed.id} seed={seed} progress={ctx.progress} nextHref={next ? `/practice/formulation?case=${next.id}` : null} />
            </HowToStart>
          </div>
          <Section title="Shared by classmates, without names">
            <PeerWall />
          </Section>
        </PlayStack>
      </GameFrame>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <BackPill className="mb-4" />
      <ToolHeader title="Build the formulation" tip={{ id: "formulation", steps: ["Sort the factors into the 5 Ps.", "Write the story in your own words.", "Compare with the answer."] }} />

      {arranged.recycled ? <RecycleNote className="mt-5" /> : null}
      <nav aria-label="Cases" className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {arranged.list.map(({ item: c, mark }) => (
          <Link
            key={c.id}
            href={`/practice/formulation?case=${c.id}`}
            aria-current={c.id === seed.id ? "page" : undefined}
            title={c.hint || c.title}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold ${c.id === seed.id ? "border-foreground bg-foreground text-background" : mark === "done" ? "border-foreground/40 bg-card text-muted-foreground" : "border-foreground bg-card"}`}
          >
            {mark !== "done" || c.id === seed.id ? <CaseMarkTag mark={mark} /> : null}
            <span>
              Case {number.get(c.id)}: {c.title.split(":")[0]}
            </span>
            {mark === "done" && c.id !== seed.id ? <CaseMarkTag mark="done" /> : null}
          </Link>
        ))}
      </nav>
      <p className="mt-2 text-sm font-semibold">{seed.title}</p>

      <div className="mt-4">
        <HowToStart id="formulation">
          <FormulationForge key={seed.id} seed={seed} progress={ctx.progress} nextHref={next ? `/practice/formulation?case=${next.id}` : null} />
        </HowToStart>
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

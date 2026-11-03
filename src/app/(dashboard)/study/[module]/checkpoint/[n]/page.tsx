import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { moduleById } from "@/lib/study";
import { checkpointQuestions, checkpoints } from "@/lib/study/checkpoints";
import { CheckpointView } from "@/components/study/checkpoint";
import { loadLearnState, saveLearnState } from "../../../actions";

export const metadata: Metadata = { title: "Checkpoint" };

/** /study/[module]/checkpoint/[n]: a quiz on a block of sections, taken after moving on. */
export default async function CheckpointPage({ params, searchParams }: { params: Promise<{ module: string; n: string }>; searchParams: Promise<{ then?: string }> }) {
  await requireFeature("learn");
  const { module, n } = await params;
  const { then } = await searchParams;
  const m = moduleById(module);
  const cp = m ? checkpoints(m).find((c) => String(c.n) === n) : undefined;
  if (!m || !cp) notFound();
  const q = checkpointQuestions(m, cp);
  const covers = cp.sectionIds.map((id) => m.sections.find((s) => s.id === id)).map((s) => (s ? `${s.num} ${s.title}` : ""));
  // Only follow links back into Notes.
  const back = then && /^\/study\//.test(then) ? then : `/study/${m.id}`;
  return (
    <CheckpointView
      moduleId={m.id}
      moduleNum={m.num}
      moduleTitle={m.title}
      n={cp.n}
      cpKey={cp.key}
      covers={covers}
      mcq={q.mcq}
      recall={q.recall}
      then={back}
      serverState={await loadLearnState()}
      save={saveLearnState}
    />
  );
}

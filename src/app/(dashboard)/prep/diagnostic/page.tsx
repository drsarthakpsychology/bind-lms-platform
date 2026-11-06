import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { makeRng } from "@/lib/learn/model/picker";
import { BANK } from "@/lib/prep/bank";
import { goalLabel } from "@/lib/prep/catalog";
import { requestSeed } from "@/lib/prep/path";
import { sampleDiagnostic } from "@/lib/prep/sampling";
import { loadSeen } from "@/lib/prep/server";
import { toView } from "@/lib/prep/view";
import { BackToPrep, PrepFrame } from "../ui";
import { currentGoal, prepViewer } from "../viewer";
import { DiagnosticRunner } from "./runner";

export const metadata: Metadata = { title: "Starting check" };

/** /prep/diagnostic: 25 questions across the goal's syllabus. Graded on the server; answers never reach the browser. */
export default async function DiagnosticPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const goal = await currentGoal(me.id);
  if (!goal) redirect("/prep");
  const seen = me.learner ? await loadSeen(me.id) : new Map<string, number>();
  const questions = sampleDiagnostic(BANK, goal, makeRng(requestSeed(me.id)), seen).map(toView);
  return (
    <PrepFrame>
      <BackToPrep />
      <DiagnosticRunner goal={goal} goalName={goalLabel(goal)} questions={questions} saving={me.learner} />
    </PrepFrame>
  );
}

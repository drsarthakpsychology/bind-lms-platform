import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { makeRng } from "@/lib/learn/model/picker";
import { BANK } from "@/lib/prep/bank";
import { EXAM_TRACKS_ENABLED, goalLabel } from "@/lib/prep/catalog";
import { requestSeed } from "@/lib/prep/path";
import { sampleDiagnostic } from "@/lib/prep/sampling";
import { loadSeen } from "@/lib/prep/server";
import { toView } from "@/lib/prep/view";
import { BackToPrep, PrepFrame } from "../ui";
import { currentGoal, prepViewer } from "../viewer";
import { DiagnosticRunner } from "./runner";

export const metadata: Metadata = { title: "Starting check" };

/**
 * /prep/diagnostic: the starting check. About 30 questions across every
 * subject of the shared course (25 across one exam's syllabus with exam
 * tracks on), easier first. Graded on the server; answers never reach the
 * browser.
 */
export default async function DiagnosticPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const goal = await currentGoal(me.id);
  if (EXAM_TRACKS_ENABLED && !goal) redirect("/prep");
  const seen = me.learner ? await loadSeen(me.id) : new Map<string, number>();
  const questions = sampleDiagnostic(BANK, goal, makeRng(requestSeed(me.id)), seen).map(toView);
  return (
    <PrepFrame>
      <BackToPrep />
      <DiagnosticRunner goal={goal} goalName={goal ? goalLabel(goal) : "All subjects"} questions={questions} saving={me.learner} />
    </PrepFrame>
  );
}

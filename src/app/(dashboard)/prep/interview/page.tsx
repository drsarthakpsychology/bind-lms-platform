import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { makeRng } from "@/lib/learn/model/picker";
import { INTERVIEWS } from "@/lib/prep/bank";
import { CATEGORY_LABEL, pickPanel } from "@/lib/prep/interview";
import { requestSeed } from "@/lib/prep/path";
import { loadInterviewHistory } from "@/lib/prep/server";
import { BackToPrep, PrepFrame } from "../ui";
import { currentGoal, prepViewer } from "../viewer";
import { InterviewPanel, type PanelQ } from "./panel";

export const metadata: Metadata = { title: "Mock interview" };

/**
 * /prep/interview: a five-question panel drawn by category, with follow-ups.
 * The rubric and model answer only come from the server after you answer.
 */
export default async function InterviewPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const [goal, history] = await Promise.all([currentGoal(me.id), loadInterviewHistory(me.id)]);
  const panel: PanelQ[] = pickPanel(INTERVIEWS, goal, makeRng(requestSeed(me.id)), history.seen).map((q) => ({
    id: q.id,
    category: CATEGORY_LABEL[q.category],
    question: q.question,
    followUp: q.followUps[0] ?? null,
  }));
  return (
    <PrepFrame>
      <BackToPrep />
      <InterviewPanel key={panel.map((p) => p.id).join(",")} questions={panel} saving={me.learner} />
    </PrepFrame>
  );
}

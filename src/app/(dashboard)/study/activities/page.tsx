import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { UNITS } from "@/lib/learn/content";
import { NOTES } from "@/lib/learn/notes";
import { LearnHome, type PlanNote } from "@/components/learn/learn-home";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "Learn" };

/** /study/activities — the gamified learning path with Chai. */
export default async function LearnPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  const notes: PlanNote[] = NOTES.map((n) => ({
    id: n.id,
    title: n.title,
    emoji: n.emoji,
    quizHref: n.quiz.lessonId ? `/study/play?lesson=${n.quiz.lessonId}` : `/study/coach?domain=${n.quiz.domain}`,
  }));
  return <LearnHome units={UNITS} notes={notes} serverState={serverState} save={saveLearnState} />;
}

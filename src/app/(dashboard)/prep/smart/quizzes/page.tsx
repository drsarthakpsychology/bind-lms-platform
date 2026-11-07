import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { UNITS } from "@/lib/learn/content";
import { QuizPath } from "@/components/learn/learn-home";
import { loadLearnState, saveLearnState } from "@/app/(dashboard)/study/actions";

export const metadata: Metadata = { title: "Quiz path" };

/** /prep/smart/quizzes: the quiz path, badges and daily goal. */
export default async function QuizzesPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  return <QuizPath units={UNITS} serverState={serverState} save={saveLearnState} />;
}

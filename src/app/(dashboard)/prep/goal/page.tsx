import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { EXAM_TRACKS_ENABLED } from "@/lib/prep/catalog";
import { GoalPicker } from "../goal-picker";
import { BackToPrep, PrepFrame } from "../ui";
import { currentGoal, prepViewer } from "../viewer";

export const metadata: Metadata = { title: "Change exam" };

/** /prep/goal: the small settings screen for changing the exam. Exam tracks only; otherwise back to the one course. */
export default async function GoalPage() {
  await requireFeature("learn");
  if (!EXAM_TRACKS_ENABLED) redirect("/prep");
  const me = await prepViewer();
  const goal = await currentGoal(me.id);
  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Settings</p>
        <h1 className="text-h1">Your exam</h1>
        <p className="text-muted-foreground">Your plan and mocks follow this. What you&apos;ve practised is kept.</p>
      </header>
      <GoalPicker current={goal} />
    </PrepFrame>
  );
}

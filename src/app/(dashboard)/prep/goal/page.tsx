import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { GoalPicker } from "../goal-picker";
import { BackToPrep, PrepFrame } from "../ui";
import { currentGoal, prepViewer } from "../viewer";

export const metadata: Metadata = { title: "Change exam" };

/** /prep/goal: the small settings screen for changing the exam. */
export default async function GoalPage() {
  await requireFeature("learn");
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

import { ToolHeader } from "@/components/help/tool-header";
import { OsceStationView } from "./osce-station";
import { QuizCheck } from "@/components/practice/quiz-check";
import { QUIZ_BANK } from "@/lib/quiz/quiz-bank";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/osce: OSCE Station Mode (Part 6.12).
 * Timed single-station assessment, 7 minutes, one task. Voice strongly
 * preferred (the delivery matters as much as the content).
 */
export default async function OscePage() {
  await requireFeature("osce");
  return (
    <div className="mx-auto max-w-3xl">
      <ToolHeader title="OSCE stations" tip={{ id: "osce", steps: ["One task against the clock, like the real exam.", "Voice works best."] }} />

      <div className="mt-6">
        <OsceStationView />
      </div>

<details className="group mt-8 rounded-md border-2 border-border bg-card">
        <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold">Quick check</summary>
        <div className="px-4 pb-4">
          <QuizCheck items={QUIZ_BANK.slice(6, 12)} />
        </div>
      </details>
    </div>
  );
}

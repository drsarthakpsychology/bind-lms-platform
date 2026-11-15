import { GameFrame } from "@/components/play/game-frame";
import { uiV2 } from "@/lib/ui/v2-server";
import { Fold, Row, RowList } from "@/components/ds";
import { PlayStack } from "@/components/play/parts";
import { ToolHeader } from "@/components/help/tool-header";
import Link from "next/link";
import { todaysDilemmas } from "@/lib/practice/ethics";
import { DilemmaFlow } from "./dilemmas";
import { QuizCheck } from "@/components/practice/quiz-check";
import { ETHICS_QUIZ } from "@/lib/practice/ethics-quiz";
import { requireFeature } from "@/lib/flags";
import { BackPill } from "@/components/study/back";

/** Quiz-after-ethics (v5 §4.1): checks, not tests. Every item sourced. */

/**
 * /practice/ethics: Ethics & Law dilemmas (Part 6.5).
 * Consequence-first: commit to an action, then see what the law (MHA 2017,
 * POCSO, RCI scope) and best practice require. The consequence comes first.
 */
export default async function EthicsPage() {
  await requireFeature("ethics");
  // Deterministic daily set: the day's three dilemmas are stable for everyone.
  const daySeed = new Date().getTime();
  const dilemmas = todaysDilemmas(daySeed, 3);

  if (await uiV2()) {
    return (
      <GameFrame title="Ethics, law & referral" width="reading" tip={{ id: "ethics", label: "How it works", steps: ["Read the dilemma and decide.", "Then see what happens and what the law says."] }}>
        <PlayStack>
          <DilemmaFlow dilemmas={dilemmas} />
          <div>
            <Fold title="Quick check">
              <QuizCheck items={ETHICS_QUIZ} />
            </Fold>
            <RowList className="border-t-0">
              <Row href="/practice/out-of-depth" title="Out of depth" meta="When to refer, escalate or stop" />
            </RowList>
          </div>
        </PlayStack>
      </GameFrame>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackPill className="mb-4" />
      <ToolHeader title="Ethics, law & referral" tip={{ id: "ethics", steps: ["Read the dilemma and decide.", "Then see what happens and what the law says."] }} />

      <div className="mt-6">
        <DilemmaFlow dilemmas={dilemmas} />
      </div>

<details className="group mt-8 rounded-md border-2 border-border bg-card">
        <summary className="flex min-h-11 cursor-pointer items-center px-4 font-semibold">Quick check</summary>
        <div className="px-4 pb-4">
          <QuizCheck items={ETHICS_QUIZ} />
        </div>
      </details>

      <Link href="/practice/out-of-depth" className="mt-4 flex min-h-11 items-center text-sm font-semibold text-link underline-offset-4 hover:underline">
        Out of depth: when to refer, escalate or stop
      </Link>
    </div>
  );
}

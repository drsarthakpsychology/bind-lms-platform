import { GameFrame } from "@/components/play/game-frame";
import { uiV2 } from "@/lib/ui/v2-server";
import { Fold } from "@/components/ds";
import { PlayStack } from "@/components/play/parts";
import { ToolHeader } from "@/components/help/tool-header";
import { OsceStationView } from "./osce-station";
import { QuizCheck } from "@/components/practice/quiz-check";
import { QUIZ_BANK } from "@/lib/quiz/quiz-bank";
import { requireFeature } from "@/lib/flags";
import { BackPill } from "@/components/study/back";
import { SEED_OSCE_STATIONS } from "@/lib/practice/osce";
import { caseContext } from "@/lib/cases/server";
import { toCards } from "@/lib/practice/osce-cards";

export const dynamic = "force-dynamic";

/**
 * /practice/osce: OSCE Station Mode (Part 6.12).
 * Timed single-station assessment, 7 minutes, one task. Voice strongly
 * preferred (the delivery matters as much as the content).
 */
export default async function OscePage() {
  await requireFeature("osce");
  const cases = await caseContext("osce", SEED_OSCE_STATIONS.map((s) => s.id), "osce");
  // Titles and tasks only: each station's checklist is fetched when it is opened.
  const cards = toCards(SEED_OSCE_STATIONS);
  if (await uiV2()) {
    return (
      <GameFrame title="OSCE stations" width="reading" tip={{ id: "osce", label: "How it works", steps: ["One task against the clock, like the real exam.", "Voice works best."] }}>
        <PlayStack>
          <OsceStationView cards={cards} cases={cases} />
          <Fold title="Quick check">
            <QuizCheck items={QUIZ_BANK.slice(6, 12)} />
          </Fold>
        </PlayStack>
      </GameFrame>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackPill className="mb-4" />
      <ToolHeader title="OSCE stations" tip={{ id: "osce", steps: ["One task against the clock, like the real exam.", "Voice works best."] }} />

      <div className="mt-6">
        <OsceStationView cards={cards} cases={cases} />
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

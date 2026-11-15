import { GameFrame } from "@/components/play/game-frame";
import { playV2 } from "@/components/play/v2";
import { ToolHeader } from "@/components/help/tool-header";
import { HowToStart } from "@/components/help/how-to";
import { MseLadder } from "./mse-ladder";
import { loadMseLadderContent } from "@/lib/practice/mse-content";
import { requireFeature } from "@/lib/flags";
import { BackPill } from "@/components/study/back";

export const dynamic = "force-dynamic";

/**
 * /practice/mse: MSE Trainer rebuilt (v5 Part 2).
 * A ladder of five levels, unlocked in order:
 *   1 Observe → 2 Domain by domain → 3 Confusable pairs → 4 Full MSE
 *   under time → 5 MSE from live interview (your own Consulting Room).
 * Levels 1/2/4 read their stimuli from the live mse_stimuli table (content
 * wiring); the static banks are the fallback when the DB is empty.
 */
export default async function MsePage() {
  await requireFeature("mse");
  const content = await loadMseLadderContent();

  if (await playV2()) {
    return (
      <GameFrame title="Mental state exam" width="reading" tip={{ id: "mse-trainer", label: "How it works", steps: ["Write what you can see and hear, not what you conclude."] }}>
        <HowToStart id="mse-trainer">
          <MseLadder content={content} />
        </HowToStart>
      </GameFrame>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackPill className="mb-4" />
      <ToolHeader title="Mental state exam" tip={{ id: "mse-trainer", steps: ["Write what you can see and hear, not what you conclude."] }} />
      <div className="mt-6">
        <HowToStart id="mse-trainer">
          <MseLadder content={content} />
        </HowToStart>
      </div>
    </div>
  );
}

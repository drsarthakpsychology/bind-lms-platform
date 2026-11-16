import { GameFrame } from "@/components/play/game-frame";
import { uiV2 } from "@/lib/ui/v2-server";
import { PlayStack } from "@/components/play/parts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolHeader } from "@/components/help/tool-header";
import { HowToStart } from "@/components/help/how-to";
import { WeakSpotsView } from "./weak-spots-view";
import { WeakSpotsDrill } from "./weak-spots-drill";
import { requireFeature } from "@/lib/flags";
import { loadWeakSpots } from "@/lib/practice/weak-spots-load";

export const dynamic = "force-dynamic";

/**
 * /practice/weak-spots: the student's consistent gaps across sim debriefs,
 * with a 10-item drill generated ON THE SPOT from the actual weak skills
 * (v5 §4: "Weak Spots must GENERATE a drill, not just report").
 */
export default async function WeakSpotsPage() {
  await requireFeature("weak_spots");
  const loaded = await loadWeakSpots();
  if (!loaded) return null;
  const { spots, drill, sessions } = loaded;

  if (await uiV2()) {
    return (
      <GameFrame title="Weak spots" width="reading" back={{ href: "/practice/consulting-room", label: "Back to AI patient interview" }} tip={{ id: "weak-spots", label: "How it works", steps: ["The skills you miss most, with a drill made from them."] }}>
        <PlayStack>
          <WeakSpotsView spots={spots} sessions={sessions} />
          {drill.length > 0 ? (
            <HowToStart id="weak-spots">
              <WeakSpotsDrill items={drill} />
            </HowToStart>
          ) : null}
        </PlayStack>
      </GameFrame>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/practice/consulting-room" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-link hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Back to AI patient interview
      </Link>
      <ToolHeader title="Weak spots" tip={{ id: "weak-spots", steps: ["The skills you miss most, with a drill made from them."] }} />

      <div className="mt-6">
        <WeakSpotsView spots={spots} sessions={sessions} />
      </div>

      {drill.length > 0 ? (
        <div className="mt-8">
          <HowToStart id="weak-spots">
            <WeakSpotsDrill items={drill} />
          </HowToStart>
        </div>
      ) : null}
    </div>
  );
}

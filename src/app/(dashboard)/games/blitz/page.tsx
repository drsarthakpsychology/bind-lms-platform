import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { currentPlayer } from "@/lib/games/server";
import { loadBests } from "@/lib/games/blitz/server";
import { BlitzGame } from "./blitz-game";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Blitz" };
export const dynamic = "force-dynamic";

/** /games/blitz: 60 seconds of fast facts. The only timed game. */
export default async function BlitzPage() {
  await requireFeature("learn");
  const me = await currentPlayer();
  if (!me) redirect("/login");
  const [bests, serverState] = await Promise.all([loadBests(me.id), loadLearnState()]);
  return (
    <ActivityFrame
      title="Blitz"
      purpose="60 seconds of fast facts."
      how={["Answer as many as you can before the clock runs out.", "3 right in a row doubles your points, 6 triples them, 10 gives four times.", "A wrong answer resets the combo.", "Keys: 1 to 4 to answer, T or F for true or false."]}
      fallback="/games"
    >
      <BlitzGame bests={bests} serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}

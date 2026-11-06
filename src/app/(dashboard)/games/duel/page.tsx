import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { currentPlayer } from "@/lib/games/server";
import { offlineRounds, profile } from "@/lib/games/duel/server";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { DuelGame } from "./duel-game";

export const metadata: Metadata = { title: "Differential duel" };
export const dynamic = "force-dynamic";

/** /games/duel: ranked live 1v1 on look-alike diagnoses. */
export default async function DuelPage() {
  await requireFeature("learn");
  const me = await currentPlayer();
  if (!me) redirect("/login");
  const [serverState, prof] = await Promise.all([loadLearnState(), profile(me.id)]);
  // Only when the duel tables are missing: five rounds for a practice match run in the browser.
  const offline = prof.available ? null : offlineRounds();
  return (
    <ActivityFrame
      title="Differential duel"
      purpose="Live 1v1 against someone at your level. Five look-alike patients: name the diagnosis, then what tells it apart."
      how={["Find a ranked match (or practise against the bot).", "Each round: pick the diagnosis, then the deciding feature, then lock in.", "100 for the diagnosis, 50 more for the feature.", "Level on points? The faster player wins.", "Leaving or quitting counts as a loss."]}
      fallback="/games"
    >
      <DuelGame serverState={serverState} save={saveLearnState} profile={prof} offlineItems={offline} />
    </ActivityFrame>
  );
}

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
      purpose="Beat the bot or a classmate on look-alike patients."
      how={["Each round shows one patient. Pick the diagnosis: +100.", "Then pick what tells it apart from its look-alike: +50.", "5 rounds, 20 seconds each. Same points? The faster player wins.", "The bot is practice. Matches with classmates move your rating."]}
      fallback="/games"
    >
      <DuelGame serverState={serverState} save={saveLearnState} profile={prof} offlineItems={offline} />
    </ActivityFrame>
  );
}

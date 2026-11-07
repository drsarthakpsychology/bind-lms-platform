import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { requireFeature } from "@/lib/flags";
import { DOMAINS, type Domain } from "@/lib/learn/concepts";
import { Coach } from "@/components/learn/coach";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Coach" };

/** /games/coach?domain=…: adaptive teaching with Chai. */
export default async function CoachPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  await requireFeature("learn");
  const { domain } = await searchParams;
  const d: Domain | "all" = DOMAINS.some((x) => x.id === domain) ? (domain as Domain) : "all";
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      title="Coach"
      tipLabel="How it works"
      how={["Read the teach card, then answer.", "Mix-ups come back later in the same session.", "The end report shows what you confuse most."]}
    >
      <Coach key={d} domain={d} serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}

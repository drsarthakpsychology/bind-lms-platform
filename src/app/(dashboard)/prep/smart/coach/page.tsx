import type { Metadata } from "next";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { requireFeature } from "@/lib/flags";
import { DOMAINS, type Domain } from "@/lib/learn/concepts";
import { Coach } from "@/components/learn/coach";
import { loadLearnState, saveLearnState } from "@/app/(dashboard)/study/actions";

export const metadata: Metadata = { title: "Coach" };

/** /prep/smart/coach?domain=…: adaptive teaching with Chai. */
export default async function CoachPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  await requireFeature("learn");
  const { domain } = await searchParams;
  const d: Domain | "all" = DOMAINS.some((x) => x.id === domain) ? (domain as Domain) : "all";
  const serverState = await loadLearnState();
  return (
    <ActivityFrame
      title="Coach"
    >
      <ActivityTip id="coach" label="How it works" steps={["Read the card, then answer.", "Mix-ups come back later."]} />
      <Coach key={d} domain={d} serverState={serverState} save={saveLearnState} />
    </ActivityFrame>
  );
}

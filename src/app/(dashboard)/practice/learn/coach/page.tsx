import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { DOMAINS, type Domain } from "@/lib/learn/concepts";
import { Coach } from "@/components/learn/coach";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "Coach" };

/** /practice/learn/coach?domain=… — adaptive teaching with Chai. */
export default async function CoachPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  await requireFeature("learn");
  const { domain } = await searchParams;
  const d: Domain | "all" = DOMAINS.some((x) => x.id === domain) ? (domain as Domain) : "all";
  const serverState = await loadLearnState();
  return <Coach key={d} domain={d} serverState={serverState} save={saveLearnState} />;
}

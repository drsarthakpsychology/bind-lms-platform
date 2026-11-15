import "server-only";
import { loadLearnState } from "@/app/(dashboard)/study/actions";
import { normalise, type LearnState as WebLearnState } from "@/lib/learn/engine";
import type { LearnState } from "./contract";
import { ApiFail } from "./respond";

/** The student's stored learn state (the website's loadLearnState), without the browser-only owner tag. */
export async function myLearnState(): Promise<WebLearnState> {
  const s = await loadLearnState();
  if (!s) throw new ApiFail("server_error", "Couldn't load your progress. Try again.");
  const { owner: _owner, ...rest } = s;
  void _owner;
  return normalise(rest);
}

export const asContractState = (s: WebLearnState): LearnState => s as unknown as LearnState;

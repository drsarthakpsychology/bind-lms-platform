"use client";

import { initLearnStore } from "@/lib/learn/store";
import type { LearnState } from "@/lib/learn/engine";

/** Loads the learn copy on pages whose game pays XP on the server, so the goal and streak can still move. */
export function LearnStoreInit({ serverState, save }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  return null;
}

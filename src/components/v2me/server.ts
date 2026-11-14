import "server-only";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";

/** Is the new design on for this role? One question for every personal screen. */
export async function pageV2(role: string | null | undefined): Promise<boolean> {
  return uiV2For(await readFlags(), role);
}

import "server-only";
import { getSession } from "@/lib/auth/session";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";

/**
 * Is the new design on for this account? The same question the shell asks
 * (lib/ui/v2), for the Practise and Library pages. False when signed out.
 */
export async function playV2(): Promise<boolean> {
  const session = await getSession();
  if (session.status !== "ok") return false;
  return uiV2For(await readFlags(), session.profile.role);
}

import "server-only";
import { getSession } from "@/lib/auth/session";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "./v2";

/**
 * Is the new design (ui_v2) on for the person opening this page? The one
 * question every student page asks; the shell asks the same (lib/ui/v2).
 * False when signed out.
 */
export async function uiV2(): Promise<boolean> {
  const session = await getSession();
  if (session.status !== "ok") return false;
  return uiV2For(await readFlags(), session.profile.role);
}

/** The same question when the page already holds the role. */
export async function uiV2Role(role: string | null | undefined): Promise<boolean> {
  return uiV2For(await readFlags(), role);
}

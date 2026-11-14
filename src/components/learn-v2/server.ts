import "server-only";
import { getSession } from "@/lib/auth/session";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";

/** Is the new design on for the person opening this Learn screen? (ui_v2) */
export async function learnV2(): Promise<boolean> {
  const session = await getSession();
  if (session.status !== "ok") return false;
  return uiV2For(await readFlags(), session.profile.role);
}

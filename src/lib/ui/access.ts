import "server-only";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { readFlags } from "@/lib/flags";
import { loadMyBlocks } from "@/lib/access/blocks";
import { VIEW_MODE_COOKIE } from "@/app/(dashboard)/view-mode-constants";
import { uiV2For } from "./v2";

/**
 * What the signed-in account may open, for the v2 hub screens (Learn,
 * Practise, Me): the same inputs the layout gives the menu. Null when there is
 * no session (the layout has already redirected).
 */
export async function loadNavAccess() {
  const session = await getSession();
  if (session.status !== "ok") return null;
  const { profile } = session;
  const flags = await readFlags();
  const preview = profile.role === "admin" && (await cookies()).get(VIEW_MODE_COOKIE)?.value === "student";
  const blocked = profile.role === "student" ? await loadMyBlocks(profile.id) : [];
  return {
    profile,
    preview,
    v2: uiV2For(flags, profile.role),
    access: {
      scope: (preview || profile.role === "admin" ? "full" : profile.scope) as "full" | "lectures_only",
      showStudy: flags.learn === "unlocked",
      blocked,
      flags: flags as Record<string, string>,
    },
  };
}

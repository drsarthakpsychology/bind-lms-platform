import "server-only";
import { readFlags } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";
import { moduleById } from "@/lib/study";
import { studyModuleFor } from "./study-link";

/**
 * The Study module that teaches this medicine, when Study is open for this
 * person (switch on, a full account, Study not switched off for them).
 * Shared by the website's medicine page and the app's medicine page.
 */
export async function medicineStudyLink(med: Parameters<typeof studyModuleFor>[0]): Promise<{ href: string; title: string; moduleId: string } | null> {
  const [flags, session] = await Promise.all([readFlags(), getSession()]);
  if (flags.learn !== "unlocked" || session.status !== "ok" || session.profile.scope === "lectures_only") return null;
  const m = moduleById(studyModuleFor(med)) ?? moduleById("medicine-profiles");
  if (!m) return null;
  const blocked = session.profile.role === "student" ? await loadMyBlocks(session.profile.id) : [];
  return blockedBy(`/study/${m.id}`, blocked) ? null : { href: `/study/${m.id}`, title: m.title, moduleId: m.id };
}

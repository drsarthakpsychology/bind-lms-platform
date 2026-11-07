"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { setAiCaseStatus } from "@/lib/ai-cases";
import type { AiCaseStatus } from "@/lib/ai-cases/types";

const STATUSES: AiCaseStatus[] = ["live", "flagged", "removed"];

/** Keep, hide or restore an AI case. Super Admin only (View Admins can read the page). */
export async function setAiCaseStatusAction(id: string, status: AiCaseStatus): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Only the Super Admin can change AI cases." };
  if (typeof id !== "string" || !/^ai-[a-z0-9-]{2,80}$/.test(id) || !STATUSES.includes(status)) return { error: "That change isn't allowed." };
  const ok = await setAiCaseStatus(id, status, me.id);
  if (!ok) return { error: "Couldn't save. The AI cases table may not exist yet." };
  revalidatePath("/admin/ai-cases");
  return { error: null };
}

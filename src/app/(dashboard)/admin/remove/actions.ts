"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { declineDeletionRequest, deleteAccount, loadRemovalData, removeAccess, restoreAccess, type Outcome, type RemovalData, type RemovalDb } from "@/lib/people/removal";

/**
 * Remove people from VIBHA (website admin). Each action checks the Super
 * Admin here, and the rules again inside src/lib/people/removal.ts, so a call
 * made around the page is refused the same way. View admins can read only.
 */

const db = () => createAdminClient() as unknown as RemovalDb;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOT_ALLOWED: Outcome = { error: "Only a Super Admin can do this." };

function refresh() {
  for (const p of ["/admin/remove", "/admin/students", "/admin/management", "/admin"]) revalidatePath(p);
}

async function guarded(id: string, run: (me: NonNullable<Awaited<ReturnType<typeof requireSuperAdmin>>>) => Promise<Outcome>): Promise<Outcome> {
  const me = await requireSuperAdmin();
  if (!me) return NOT_ALLOWED;
  if (!UUID.test(id)) return { error: "That person could not be found." };
  try {
    const r = await run(me);
    if (!r.error) refresh();
    return r;
  } catch (e) {
    console.error("remove action failed:", e instanceof Error ? e.message : e);
    return { error: "Something went wrong. Nothing was changed. Try again." };
  }
}

export async function loadRemoval(): Promise<RemovalData | null> {
  const me = await requireAdmin();
  if (!me) return null;
  return loadRemovalData(db(), me);
}

export async function removePersonAccess(userId: string, note?: string): Promise<Outcome> {
  return guarded(userId, (me) => removeAccess(db(), me, userId, typeof note === "string" ? note : null));
}

export async function restorePersonAccess(userId: string): Promise<Outcome> {
  return guarded(userId, (me) => restoreAccess(db(), me, userId));
}

export async function deletePersonAccount(userId: string, typedName: string, requestId?: string | null): Promise<Outcome> {
  return guarded(userId, (me) => deleteAccount(db(), me, userId, String(typedName ?? "").slice(0, 300), { requestId: requestId && UUID.test(requestId) ? requestId : null }));
}

export async function declineDeletion(requestId: string): Promise<Outcome> {
  return guarded(requestId, (me) => declineDeletionRequest(db(), me, requestId));
}

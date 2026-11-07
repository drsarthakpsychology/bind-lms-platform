import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalise } from "@/lib/learn/engine";
import { createAdminClient } from "@/lib/supabase/server";
import { certificateFromStudy, type CertificateStatus } from "./certificate";

/**
 * certificateStatus(userId): which module tests the student has passed at 80
 * percent or more, which remain, and whether the course certificate can be
 * issued. Reads the stored Learn state with the service role (never browser
 * state). If the record cannot be read, it degrades quietly to "nothing
 * passed yet" with `available: false`, so nothing can be issued early.
 */
export async function certificateStatus(userId: string, admin?: SupabaseClient): Promise<CertificateStatus & { available: boolean }> {
  try {
    const db = admin ?? createAdminClient();
    const { data, error } = await db.from("learn_progress").select("state").eq("user_id", userId).maybeSingle();
    if (error) throw new Error(error.message);
    return { ...certificateFromStudy(normalise(data?.state ?? null).study), available: true };
  } catch (e) {
    console.warn("certificateStatus: learn_progress read failed:", e instanceof Error ? e.message : e);
    return { ...certificateFromStudy(null), eligible: false, available: false };
  }
}

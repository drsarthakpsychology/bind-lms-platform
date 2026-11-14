"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

/** Mark the student's own unread achievement/certificate notifications read. */
export async function markAllNotificationsRead(): Promise<void> {
  const me = await requireSession();
  if (!me) return;
  await createAdminClient()
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", me.id)
    .is("read_at", null);
  // "layout": the bell count lives in the shared layout, not on this page.
  revalidatePath("/", "layout");
}

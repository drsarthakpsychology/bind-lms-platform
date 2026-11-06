"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { sendNotifications, type NotifyReport } from "@/lib/notify/send";

/** Messages → Notifications: send an in-app notification (and, if ticked, an email copy). */
export async function sendNotificationAction(input: {
  recipientEmails?: string[];
  userIds?: string[];
  title: string;
  html: string;
  alsoEmail: boolean;
}): Promise<NotifyReport> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Only the Super Admin can send notifications.", created: 0, emailed: 0, emailFailed: 0, batchId: null };
  let ids = input.userIds ?? [];
  const emails = (input.recipientEmails ?? []).map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (emails.length) {
    const admin = createAdminClient();
    for (let i = 0; i < emails.length; i += 300) {
      const { data } = await admin.from("profiles").select("id").in("email", emails.slice(i, i + 300));
      ids = ids.concat((data ?? []).map((d) => d.id as string));
    }
  }
  const res = await sendNotifications({ userIds: ids, title: input.title, html: input.html, sentBy: me.id, alsoEmail: input.alsoEmail });
  revalidatePath("/admin/emails");
  return res;
}

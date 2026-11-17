import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { queuePush } from "@/lib/app-api/push";
import { sandboxRecipients } from "@/lib/test-mode/server";

/**
 * Bell notices (and phone push) for the clinic: leave decisions, sessions
 * added, moved or cancelled, OPD days published, case log reminders. Same
 * rows as every other notice (src/lib/notify/doubts.ts): each opens at
 * /notifications/<id> with a link to the schedule. Never blocks or fails the
 * action that sent it.
 */
export const CLINIC_LINK = "/clinic";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function notifyClinic(input: { userIds: readonly string[]; title: string; text: string; sentBy: string | null; link?: string }): Promise<number> {
  // Test mode: only the test student; real notices never reach a test account.
  const ids = await sandboxRecipients([...new Set(input.userIds)].slice(0, 2000)).catch(() => [] as string[]);
  if (!ids.length) return 0;
  const link = input.link ?? CLINIC_LINK;
  const rows = ids.map((userId) => {
    const id = crypto.randomUUID();
    return {
      id,
      user_id: userId,
      type: "message" as const,
      credential_id: null,
      title: input.title.slice(0, 140),
      body: input.text.slice(0, 500),
      body_html: `<p>${esc(input.text.slice(0, 1000))}</p><p><a href="${link}">Open your schedule</a></p>`,
      href: `/notifications/${id}`,
      sent_by: input.sentBy,
    };
  });
  try {
    const db = createAdminClient();
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await db.from("notifications").insert(rows.slice(i, i + 500));
      if (error) return i;
    }
    queuePush(rows, "messages");
    return rows.length;
  } catch {
    return 0;
  }
}

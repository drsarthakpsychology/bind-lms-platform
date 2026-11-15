import { isSuperAdmin } from "@/lib/auth/guards";
import { loadInbox } from "@/app/(dashboard)/admin/inbox/data";
import { appRoute } from "@/lib/app-api/route";
import type { AdminInbox } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/inbox: doubts and private concerns waiting on a reply, then unread email replies (the website's loadInbox). */
export const GET = appRoute({ auth: "admin" }, async ({ user }): Promise<AdminInbox> => {
  const { ready, threads, emails } = await loadInbox();
  return { v: 1, ready, threads: threads.map((t) => ({ ...t, reason: t.need.reason })), emails, canWrite: isSuperAdmin(user.profile) };
});

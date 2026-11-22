import { z } from "zod";
import { retryFailedEmails, type RetryReport } from "@/app/(dashboard)/admin/emails/retry-actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

const schema = z.object({ ids: z.array(z.string().uuid()).min(1).max(500).nullable() });

/** POST /api/app/v1/admin/emails/failed/retry: send one, some, or all (ids null) again, with the website's safeguards (retryFailedEmails). */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<RetryReport> => {
  const { ids } = await body(schema, 32 * 1024);
  await limitWrite(`app:mail-retry:${user.profile.id}`, 10);
  const r = await retryFailedEmails(ids);
  if (r.error) throw new ApiFail(r.error.startsWith("Only") ? "forbidden" : "server_error", r.error);
  return r;
});

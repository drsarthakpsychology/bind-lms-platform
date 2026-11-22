import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { clearFailedEmails } from "@/lib/app-api/admin-r2b";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

const schema = z.object({ ids: z.array(z.string().uuid()).min(1).max(500).nullable() });

/** POST /api/app/v1/admin/emails/failed/clear: take one, some, or all (ids null) off the Failed list. Nothing is deleted: the send history keeps them. */
export const POST = appRoute({ auth: "superAdmin" }, async ({ user, body, limitWrite }): Promise<{ cleared: number }> => {
  const { ids } = await body(schema, 32 * 1024);
  await limitWrite(`app:mail-clear:${user.profile.id}`, 30);
  const r = await clearFailedEmails(createAdminClient(), ids);
  if (r.error) throw new ApiFail("conflict", r.error);
  return { cleared: r.cleared };
});

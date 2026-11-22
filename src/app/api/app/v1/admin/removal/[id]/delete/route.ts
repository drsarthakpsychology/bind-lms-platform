import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import { deleteAccount, type RemovalDb } from "@/lib/people/removal";
import { answer } from "../../outcome";

export const runtime = "nodejs";

const schema = z.object({ confirmName: z.string().min(1).max(300), requestId: uuid.nullable().optional() });

/** POST /api/app/v1/admin/removal/:id/delete: Delete account for good (Super Admin only, typed name). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }) => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { confirmName, requestId } = await body(schema, 2048);
  await limitWrite(`app:remove:${user.profile.id}`, 10);
  return answer(await deleteAccount(createAdminClient() as unknown as RemovalDb, user.profile, params.id, confirmName, { requestId: requestId ?? null }), { deleted: true });
});

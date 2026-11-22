import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import { removeAccess, type RemovalDb } from "@/lib/people/removal";
import { answer } from "../../outcome";

export const runtime = "nodejs";

const schema = z.object({ note: z.string().max(200).optional() });

/** POST /api/app/v1/admin/removal/:id/remove: Remove access (reversible; Super Admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }) => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { note } = await body(schema, 2048);
  await limitWrite(`app:remove:${user.profile.id}`, 30);
  return answer(await removeAccess(createAdminClient() as unknown as RemovalDb, user.profile, params.id, note ?? null), { removed: true });
});

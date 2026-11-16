import { createAdminClient } from "@/lib/supabase/server";
import { studentMessages } from "@/lib/app-api/admin-round2";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { StudentMessages } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/students/:id/messages: emails to them, their replies, and bell notifications (the student page's Messages tab). */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ params }): Promise<StudentMessages> => {
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw new ApiFail("not_found");
  return studentMessages(createAdminClient(), params.id);
});

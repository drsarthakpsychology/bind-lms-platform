import { z } from "zod";
import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { formAnswers, startOf } from "@/lib/app-api/admin-extras";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { AdminFormAnswers } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/forms/:id?q=&emailed=yes|no: one form's answers, with who was emailed and today's allowance. */
export const GET = appRoute<{ id: string }>({ auth: "admin" }, async ({ user, params, query }): Promise<AdminFormAnswers> => {
  if (!z.string().uuid().safeParse(params.id).success) throw new ApiFail("not_found");
  const { limit, cursor } = pageParams(query, 50, 500);
  const q = query.get("q");
  const emailed = query.get("emailed");
  return formAnswers(
    createAdminClient(),
    params.id,
    { q: q && q.length <= 200 ? q : null, emailed: emailed === "yes" || emailed === "no" ? emailed : null },
    { limit, start: startOf(cursor) },
    isSuperAdmin(user.profile),
  );
});

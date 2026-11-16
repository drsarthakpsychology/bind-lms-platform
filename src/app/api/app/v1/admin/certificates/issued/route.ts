import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { issuedList, startOf } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { IssuedCertificates } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const short = (v: string | null, n = 120) => (v && v.length <= n ? v : null);

/** GET /api/app/v1/admin/certificates/issued: every certificate and badge in one list (the website's Issued page, loadIssued and filterIssued). */
export const GET = appRoute({ auth: "admin" }, async ({ user, query }): Promise<IssuedCertificates> => {
  const { limit, cursor } = pageParams(query, 50, 200);
  return issuedList(
    createAdminClient(),
    { q: short(query.get("q") ?? query.get("search"), 200), type: short(query.get("type") ?? query.get("kind"), 20), status: short(query.get("status"), 20), cohort: short(query.get("cohort"), 40), student: short(query.get("student"), 40) },
    { limit, start: startOf(cursor) },
    isSuperAdmin(user.profile),
  );
});

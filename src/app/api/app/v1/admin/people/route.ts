import { isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { peopleList, startOf } from "@/lib/app-api/admin-extras";
import { appRoute } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { AdminPeople } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const short = (v: string | null, n = 80) => (v && v.length <= n ? v : null);

/** GET /api/app/v1/admin/people: the website's Pipeline (enquiries=1: Enquiries) with its quick views and filters (loadPipeline, filterPipeline, viewCounts). */
export const GET = appRoute({ auth: "admin" }, async ({ user, query }): Promise<AdminPeople> => {
  const { limit, cursor } = pageParams(query, 50, 500);
  return peopleList(
    createAdminClient(),
    {
      view: short(query.get("view"), 20),
      quiet: short(query.get("quiet"), 4),
      q: short(query.get("q") ?? query.get("search"), 200),
      stage: short(query.get("stage"), 30),
      cohort: short(query.get("cohort"), 40),
      source: short(query.get("source"), 80),
      from: short(query.get("from"), 10),
      to: short(query.get("to"), 10),
      last: short(query.get("last"), 10),
      enquiries: query.get("enquiries") === "1",
    },
    { limit, start: startOf(cursor) },
    isSuperAdmin(user.profile),
  );
});

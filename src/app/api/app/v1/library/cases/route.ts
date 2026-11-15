import { caseDocs } from "@/lib/app-api/library";
import { appRoute } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** GET /api/app/v1/library/cases?q=&tag=&limit&cursor : the case library (flag case_library, off on the website today). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/practice/library", flag: "case_library" } }, async ({ query }) => {
  const { limit, cursor } = pageParams(query, 30, 100);
  const start = cursor && /^\d{1,6}$/.test(cursor) ? Number(cursor) : 0;
  return caseDocs(query.get("q") ?? "", query.get("tag") ?? "", start, limit);
});

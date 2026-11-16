import { doubtsReady, loadDoubts } from "@/lib/doubts/data";
import { appRoute } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { DoubtList } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const uuid = (v: string | null) => (v && /^[0-9a-f-]{36}$/i.test(v) ? v : null);

/** GET /api/app/v1/admin/doubts?cohort=&kind=&student=: every doubt and complaint for review (the website's loadDoubts as admin). */
export const GET = appRoute({ auth: "admin" }, async ({ user, query }): Promise<DoubtList> => {
  const ready = await doubtsReady();
  const all = ready ? await loadDoubts({ userId: user.profile.id, isAdmin: true, cohortIds: [], cohortFilter: query.get("cohort"), authorFilter: uuid(query.get("student")) }) : [];
  const kind = query.get("kind");
  const rows = kind === "doubt" || kind === "complaint" ? all.filter((d) => d.kind === kind) : all;
  const { limit, cursor } = pageParams(query);
  const start = cursor && /^\d{1,5}$/.test(cursor) ? Number(cursor) : 0;
  return { items: rows.slice(start, start + limit), nextCursor: start + limit < rows.length ? String(start + limit) : null, cohorts: [], ready };
});

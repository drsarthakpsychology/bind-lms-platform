import { z } from "zod";
import { askDoubt } from "@/app/(dashboard)/doubts/actions";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { doubtsReady, loadDoubts } from "@/lib/doubts/data";
import { doubtError } from "@/lib/app-api/doubts";
import { evaluate } from "@/lib/auth/api-guard";
import { appRoute, GATES } from "@/lib/app-api/route";
import { pageParams } from "@/lib/app-api/schemas";
import type { AskDoubtResult, DoubtList } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/doubts?cohort=&mine=1: the cohort board, the website's loadDoubts (paged). */
export const GET = appRoute({ auth: "bearer", gates: GATES.doubts }, async ({ user, query }): Promise<DoubtList> => {
  const isAdmin = user.profile.role === "admin";
  const [cohorts, ready, wall] = await Promise.all([loadMyCohorts(user.profile.id), doubtsReady(), isAdmin ? Promise.resolve(false) : evaluate(user.profile, [GATES.wall]).then((d) => d.ok)]);
  const all = ready ? await loadDoubts({ userId: user.profile.id, isAdmin, cohortIds: cohorts.map((c) => c.id), cohortFilter: isAdmin ? query.get("cohort") : null }) : [];
  const rows = query.get("mine") === "1" ? all.filter((d) => d.mine) : all;
  const { limit, cursor } = pageParams(query);
  const start = cursor && /^\d{1,5}$/.test(cursor) ? Number(cursor) : 0;
  return { items: rows.slice(start, start + limit), nextCursor: start + limit < rows.length ? String(start + limit) : null, cohorts, ready, wall };
});

const askSchema = z.object({
  title: z.string().min(1).max(400),
  body: z.string().max(10_000),
  topic: z.string().max(120).optional(),
  cohortId: z.string().uuid().nullable().optional(),
  markAs: z.enum(["doubt", "complaint"]).optional(),
});

/** POST /api/app/v1/doubts: the website's askDoubt (it rate limits and files complaints privately). */
export const POST = appRoute({ auth: "bearer", gates: GATES.doubts }, async ({ body }): Promise<AskDoubtResult> => {
  const input = await body(askSchema, 32_000);
  const r = await askDoubt(input);
  if (r.error || !r.id) throw doubtError(r.error ?? "Couldn't post it. Try again.");
  return { id: r.id };
});

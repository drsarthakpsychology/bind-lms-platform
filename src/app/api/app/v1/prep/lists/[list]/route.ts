import { prepList } from "@/lib/app-api/prep";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PrepSet } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/lists/:list?page=N (saved, wrong): questions to look at again, ten a page. */
export const GET = appRoute<{ list: string }>({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user, params, query }): Promise<PrepSet> => {
  if (params.list !== "saved" && params.list !== "wrong") throw new ApiFail("not_found");
  const n = Number(query.get("page"));
  return prepList(user.profile, params.list, Number.isInteger(n) && n > 0 ? n : 1);
});

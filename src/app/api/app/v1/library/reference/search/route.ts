import { referenceSearch } from "@/lib/app-api/library";
import { appRoute } from "@/lib/app-api/route";
import type { ReferenceSearch } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/library/reference/search?q= : name, brand or alias, with "did you mean" (the website's searchDrugs). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/tools/psychopharm" } }, async ({ query, user, limitFast }): Promise<ReferenceSearch> => {
  limitFast(`app:refsearch:${user.profile.id}`, 120);
  return referenceSearch(query.get("q") ?? "");
});

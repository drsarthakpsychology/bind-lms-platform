import { appRoute, GATES } from "@/lib/app-api/route";
import { searchQuick } from "@/lib/quick-notes/library";
import type { QuickSearch } from "@/lib/quick-notes/view-types";

export const runtime = "nodejs";

/** GET /api/app/v1/study/quick-notes/search?q= : search the text inside every Quick Note. */
export const GET = appRoute({ auth: "bearer", gates: GATES.study }, async ({ query, user, limitFast }): Promise<QuickSearch> => {
  limitFast(`app:qnsearch:${user.profile.id}`, 120);
  return searchQuick(query.get("q") ?? "");
});

import { appRoute } from "@/lib/app-api/route";
import { parseTypes, searchEverything, type SearchAnswer } from "@/lib/search/everything";

export const runtime = "nodejs";

/**
 * GET /api/app/v1/search?q=&types=lecture,module&perType=6 : one search over
 * everything this account can open (lectures, course files, modules, topics,
 * notes, medicines, Quick Reference, cases; students for admins). Typo
 * tolerant. Each result carries `app`, the screen to open.
 */
export const GET = appRoute({ auth: "bearer" }, async ({ query, user, limitFast }): Promise<SearchAnswer> => {
  limitFast(`app:search:${user.profile.id}`, 120);
  const perType = Number(query.get("perType") ?? "") || undefined;
  return searchEverything(user.profile, query.get("q") ?? "", { types: parseTypes(query.get("types")), perType });
});

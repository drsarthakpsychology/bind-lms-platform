import { termIndex } from "@/lib/app-api/library";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/library/terms?q= : the Quick reference index (disorders, medicines, terms), as the website's /study/reference. */
export const GET = appRoute({ auth: "bearer", gates: { path: "/study/reference", flag: "learn" } }, async ({ query }) => termIndex(query.get("q")));

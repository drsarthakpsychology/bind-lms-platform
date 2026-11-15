import { termPage } from "@/lib/app-api/library";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/library/terms/:slug : one Quick reference entry (the website's referenceBySlug). */
export const GET = appRoute<{ slug: string }>({ auth: "bearer", gates: { path: "/study/reference", flag: "learn" } }, async ({ params }) => {
  const r = termPage(params.slug);
  if (!r) throw new ApiFail("not_found");
  return r;
});

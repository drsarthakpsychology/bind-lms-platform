import { referenceDrug } from "@/lib/app-api/library";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { ReferenceDrug } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/library/reference/:slug : one medicine of the reference (the reviewed document when published, else the curated view). */
export const GET = appRoute<{ slug: string }>({ auth: "bearer", gates: { path: "/tools/psychopharm" } }, async ({ params }): Promise<ReferenceDrug> => {
  const drug = await referenceDrug(params.slug);
  if (!drug) throw new ApiFail("not_found");
  return drug;
});

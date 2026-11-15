import { referenceCompare } from "@/lib/app-api/library";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { ReferenceCompare } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/library/reference/compare?drugs=a,b,c : 2 to 5 medicines side by side (the website's compareDrugs). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/tools/psychopharm" } }, async ({ query }): Promise<ReferenceCompare> => {
  const slugs = (query.get("drugs") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (slugs.length < 2) throw new ApiFail("bad_request", "Pick two to five medicines.", { fields: ["drugs"] });
  return referenceCompare(slugs);
});

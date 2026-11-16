import { caseDoc } from "@/lib/app-api/library";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/library/cases/:id : one case of the library. */
export const GET = appRoute<{ id: string }>({ auth: "bearer", gates: { path: "/practice/library", flag: "case_library" } }, async ({ params }) => {
  const r = await caseDoc(params.id.slice(0, 128));
  if (!r) throw new ApiFail("not_found");
  return r;
});

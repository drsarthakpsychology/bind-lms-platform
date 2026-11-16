import { medicinePage } from "@/lib/app-api/library";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { MedicinePage } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/library/medicines/:medId : the whole medicine page as data, in the website's order (facts first, How it works last). */
export const GET = appRoute<{ medId: string }>({ auth: "bearer", gates: { path: "/practice/medicines" } }, async ({ params }): Promise<MedicinePage> => {
  const page = await medicinePage(params.medId);
  if (!page) throw new ApiFail("not_found");
  return page;
});

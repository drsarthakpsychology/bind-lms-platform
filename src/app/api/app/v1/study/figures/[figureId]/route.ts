import { figureData } from "@/lib/app-api/figure-svg";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { Figure } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/figures/:figureId: a labelled drawing as data plus standalone SVG (light and dark). */
export const GET = appRoute<{ figureId: string }>({ auth: "bearer", gates: GATES.study }, async ({ params }): Promise<Figure> => {
  if (!/^[a-z0-9-]{1,80}$/.test(params.figureId)) throw new ApiFail("not_found");
  const f = await figureData(params.figureId);
  if (!f) throw new ApiFail("not_found");
  return f;
});

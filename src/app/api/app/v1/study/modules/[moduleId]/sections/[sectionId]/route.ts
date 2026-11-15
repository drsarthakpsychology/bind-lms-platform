import { myLearnState } from "@/lib/app-api/learn-state";
import { findModule, findSection, sectionContent } from "@/lib/app-api/study";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { SectionContent } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/modules/:moduleId/sections/:sectionId: the section as blocks (never HTML). */
export const GET = appRoute<{ moduleId: string; sectionId: string }>({ auth: "bearer", gates: GATES.study }, async ({ params }): Promise<SectionContent> => {
  const m = findModule(params.moduleId);
  const s = m && findSection(m, params.sectionId);
  if (!m || !s) throw new ApiFail("not_found");
  return sectionContent(m, s, await myLearnState());
});

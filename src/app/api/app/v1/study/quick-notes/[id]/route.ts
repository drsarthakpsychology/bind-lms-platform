import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import { quickNoteById } from "@/lib/quick-notes";
import { quickNoteView } from "@/lib/quick-notes/view";
import type { QuickNoteView } from "@/lib/quick-notes/view-types";

export const runtime = "nodejs";

/** GET /api/app/v1/study/quick-notes/{id} : one typed Quick Note, ready to draw. */
export const GET = appRoute<{ id: string }>({ auth: "bearer", gates: GATES.study }, async ({ params }): Promise<QuickNoteView> => {
  const n = quickNoteById(params.id);
  if (!n) throw new ApiFail("not_found");
  return quickNoteView(n);
});

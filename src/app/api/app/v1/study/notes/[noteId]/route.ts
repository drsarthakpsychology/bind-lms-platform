import { myLearnState } from "@/lib/app-api/learn-state";
import { noteDetail } from "@/lib/app-api/notes";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { RevisionNote } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/notes/:noteId */
export const GET = appRoute<{ noteId: string }>({ auth: "bearer", gates: GATES.study }, async ({ params }): Promise<RevisionNote> => {
  const n = noteDetail(params.noteId, await myLearnState());
  if (!n) throw new ApiFail("not_found");
  return n;
});

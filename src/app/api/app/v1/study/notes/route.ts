import { myLearnState } from "@/lib/app-api/learn-state";
import { noteList } from "@/lib/app-api/notes";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { RevisionNoteList } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/notes: the one-page revision notes, by block. */
export const GET = appRoute({ auth: "bearer", gates: GATES.study }, async (): Promise<RevisionNoteList> => noteList(await myLearnState()));

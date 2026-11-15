import { z } from "zod";
import { pullMarks, pushMarks } from "@/lib/study/marks-actions";
import { emptyMarks, type Marks } from "@/lib/study/marks";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { MarksResult, SaveMarksResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/marks: bookmarks and personal notes (the website's pullMarks). */
export const GET = appRoute({ auth: "bearer", gates: GATES.study }, async (): Promise<MarksResult> => {
  const r = await pullMarks();
  if (r.ok) return { marks: r.marks, synced: true };
  if (r.off) return { marks: emptyMarks(), synced: false };
  throw new ApiFail("server_error");
});

const schema = z.object({ changes: z.object({ v: z.literal(1).optional(), bookmarks: z.record(z.string(), z.unknown()).optional(), notes: z.record(z.string(), z.unknown()).optional() }) });

/** PUT /api/app/v1/study/marks: send what changed; newest change wins field by field (the website's pushMarks). */
export const PUT = appRoute({ auth: "bearer", gates: GATES.study }, async ({ user, body, limitWrite }): Promise<SaveMarksResult> => {
  const { changes } = await body(schema, 7_000_000);
  await limitWrite(`app:marks:${user.profile.id}`, 60);
  const r = await pushMarks({ v: 1, bookmarks: changes.bookmarks ?? {}, notes: changes.notes ?? {} } as Marks);
  if (!r.ok && !r.off) throw new ApiFail("server_error", "Couldn't save. It will be sent again.");
  const pulled = await pullMarks();
  return pulled.ok ? { marks: pulled.marks, synced: true } : { marks: emptyMarks(), synced: false };
});

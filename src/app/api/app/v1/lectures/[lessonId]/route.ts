import { loadLecture } from "@/lib/course/lecture";
import { lectureOut } from "@/lib/app-api/views/courses";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { LectureDetail } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/lectures/:lessonId: the lecture page as data (no video address: see /stream). */
export const GET = appRoute<{ lessonId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params }): Promise<LectureDetail> => {
  const r = await loadLecture(user.profile, params.lessonId);
  if (!r.ok) {
    if (r.reason === "locked") throw new ApiFail("feature_locked", "This lecture isn't live yet.");
    throw new ApiFail(r.reason === "forbidden" ? "forbidden" : "not_found", r.reason === "forbidden" ? "This lecture isn't part of your access." : undefined);
  }
  return lectureOut(r.lecture);
});

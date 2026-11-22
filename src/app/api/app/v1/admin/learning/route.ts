import { adminLearning, type AdminLearning } from "@/lib/app-api/admin-r2b";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/learning: every student's learning in one list (lectures, modules, checkpoint and practice scores, weak topics, last active), and the class view. Read only. */
export const GET = appRoute({ auth: "admin" }, async (): Promise<AdminLearning> => adminLearning());

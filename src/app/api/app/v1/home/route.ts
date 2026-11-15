import { loadHomeModel } from "@/lib/home/model";
import { courseSummary, stepOut, strengthsOut, upNextOut } from "@/lib/app-api/views/courses";
import { unreadCount } from "@/lib/app-api/me";
import { supportContacts } from "@/lib/app-api/config";
import { appRoute } from "@/lib/app-api/route";
import type { Home } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/home: the same model as the website's Home (src/lib/home/model.ts). */
export const GET = appRoute({ auth: "bearer" }, async ({ user }): Promise<Home> => {
  const [m, unread] = await Promise.all([loadHomeModel(user.profile, { preview: false }), unreadCount(user.profile.id)]);
  return {
    dateLine: m.dateLine,
    welcomeBack: m.welcomeBack,
    step: stepOut(m.step),
    progress: m.progress,
    allDone: m.allDone,
    goal: m.goal,
    upNext: m.upNext.map(upNextOut),
    strengths: m.studyOpen ? strengthsOut(m.strengths) : null,
    courses: m.models.map(courseSummary),
    unreadNotifications: unread,
    supportWhatsapp: supportContacts().whatsapp,
  };
});

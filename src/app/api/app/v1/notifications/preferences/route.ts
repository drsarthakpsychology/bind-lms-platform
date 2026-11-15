import { z } from "zod";
import { loadPrefs, savePrefs } from "@/lib/app-api/prefs";
import { appRoute } from "@/lib/app-api/route";
import type { NotificationPrefs } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z
  .object({
    push: z.boolean(),
    messages: z.boolean(),
    doubtReplies: z.boolean(),
    achievements: z.boolean(),
    studyReminder: z.boolean(),
    studyReminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  })
  .partial()
  .strict();

/** GET /api/app/v1/notifications/preferences */
export const GET = appRoute({ auth: "bearer" }, async ({ user }): Promise<NotificationPrefs> => loadPrefs(user.profile.id));

/** PUT /api/app/v1/notifications/preferences: any subset. */
export const PUT = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<NotificationPrefs> => {
  const patch = await body(schema, 2048);
  await limitWrite(`app:prefs:${user.profile.id}`, 30);
  return savePrefs(user.profile.id, patch);
});

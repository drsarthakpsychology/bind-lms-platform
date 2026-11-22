"use server";

import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import type { ReminderPrefs } from "@/lib/app-api/contract";
import { rateLimitWrite } from "@/lib/rate-limit";
import { saveReminderPrefs } from "@/lib/reminders/prefs";

const schema = z.object({ opdDay: z.boolean(), sessionSoon: z.boolean(), scanOut: z.boolean(), caseLog: z.boolean(), leaveLow: z.boolean() }).partial().strict();

/** Turn one or more clinic reminders on or off, for the signed-in person only. */
export async function saveReminders(patch: Partial<ReminderPrefs>): Promise<{ ok: true; prefs: ReminderPrefs; synced: boolean } | { ok: false; error: string }> {
  const p = await requireSession();
  if (!p) return { ok: false, error: "Sign in again." };
  const parsed = schema.safeParse(patch);
  if (!parsed.success) return { ok: false, error: "That did not save. Try again." };
  if (!(await rateLimitWrite(`web:reminder-prefs:${p.id}`, 30))) return { ok: false, error: "Too many changes. Wait a minute." };
  const r = await saveReminderPrefs(p.id, parsed.data);
  return { ok: true, ...r };
}

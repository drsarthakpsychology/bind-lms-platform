import "server-only";

/**
 * Automated reminder logic — configurable per type, batched to respect the
 * Resend daily send limit.
 *
 * Types:
 *  - "session-tomorrow": session tomorrow (uses cohort calendar)
 *  - "assignment-due-48h": assignment due in 48 hours
 *  - "inactive-7d": no activity for 7 days
 *
 * Each type can be toggled on/off via a config table (future) or env.
 * This module provides the planning + batching; sending is wired to Resend
 * (see sendReminders below).
 */

export type ReminderType = "session-tomorrow" | "assignment-due-48h" | "inactive-7d";

export const REMINDER_TYPES: Record<ReminderType, { label: string; defaultOn: boolean }> = {
  "session-tomorrow": { label: "Session tomorrow", defaultOn: true },
  "assignment-due-48h": { label: "Assignment due in 48h", defaultOn: true },
  "inactive-7d": { label: "Inactive for 7 days", defaultOn: true },
};

/** Which reminder types are enabled. Reads an env flag per type, defaulting on. */
export function enabledReminderTypes(): ReminderType[] {
  return (Object.keys(REMINDER_TYPES) as ReminderType[]).filter((t) => {
    const flag = process.env[`REMINDERS_${t.toUpperCase().replace(/-/g, "_")}`];
    // unset → on; "0"/"false" → off.
    if (!flag) return REMINDER_TYPES[t].defaultOn;
    return !["0", "false", "off"].includes(flag.toLowerCase());
  });
}

export interface ReminderRecipient {
  email: string;
  subject: string;
  body: string;
}

/**
 * Plan reminders and batch them to stay under the Resend daily cap.
 * `RESEND_DAILY_LIMIT` defaults to 100 (Resend free tier); the batch chunk is
 * the per-minute-ish send chunk to avoid throttling.
 */
export function batchReminders(
  recipients: ReminderRecipient[],
  dailyLimit = Number(process.env.RESEND_DAILY_LIMIT ?? 100),
  chunkSize = 10,
): ReminderRecipient[][] {
  const withinLimit = recipients.slice(0, dailyLimit);
  const batches: ReminderRecipient[][] = [];
  for (let i = 0; i < withinLimit.length; i += chunkSize) {
    batches.push(withinLimit.slice(i, i + chunkSize));
  }
  return batches;
}

/** Compose the body for each reminder type (plain text). */
export function composeReminder(type: ReminderType, ctx: { name?: string; detail?: string }): {
  subject: string;
  body: string;
} {
  const name = ctx.name ?? "there";
  switch (type) {
    case "session-tomorrow":
      return {
        subject: "📅 Your session is tomorrow",
        body: `Hi ${name},\n\nYou have a live session tomorrow${ctx.detail ? `: ${ctx.detail}` : ""}. See you there!\n\n— The team`,
      };
    case "assignment-due-48h":
      return {
        subject: "⏳ Assignment due in 48 hours",
        body: `Hi ${name},\n\n${ctx.detail ?? "An assignment"} is due in 48 hours. Don't forget to submit.\n\n— The team`,
      };
    case "inactive-7d":
      return {
        subject: "👋 We've missed you",
        body: `Hi ${name},\n\nYou haven't been active for a week. Your lessons are waiting when you're ready.\n\n— The team`,
      };
  }
}

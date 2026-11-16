import { z } from "zod";
import { CODE_ALPHABET } from "./qr";
import { isDate, TIME_RE } from "./time";

/** Request checks for the clinic routes and server actions. */
const uuid = z.string().uuid();
const date = z.string().refine(isDate, "date");
const time = z.string().regex(TIME_RE);
const kind = z.enum(["opd_morning", "opd_evening", "class", "online_class", "early_class", "other"]);
const batch = z.enum(["morning", "evening"]);
const text = (max: number) => z.string().trim().max(max);
const link = z
  .string()
  .trim()
  .max(500)
  .refine((s) => !s || /^https?:\/\//i.test(s), "link");

export const scanSchema = z
  .object({
    token: z.string().trim().min(10).max(200).optional(),
    code: z
      .string()
      .trim()
      .max(12)
      .refine((s) => [...s.toUpperCase().replace(/[\s-]/g, "")].every((c) => CODE_ALPHABET.includes(c)), "code")
      .optional(),
    direction: z.enum(["in", "out"]).optional(),
  })
  .refine((b) => Boolean(b.token) !== Boolean(b.code), { message: "token or code", path: ["token"] });

export const leaveSchema = z.object({ sessionIds: z.array(uuid).min(1).max(60), reason: text(500).min(2), cohortId: uuid.optional() });
export const earlyLeaveSchema = z.object({ sessionId: uuid, leaveAt: time, reason: text(500).min(2), cohortId: uuid.optional() });
export const batchSchema = z.object({ batch, cohortId: uuid.optional() });
export const caseLogSchema = z.object({ assignmentId: uuid, cases: z.number().int().min(0).max(50), absent: z.boolean().optional(), note: text(200).optional() });

export const slotSchema = z.object({
  cohortIds: z.array(uuid).min(1).max(20),
  weekday: z.number().int().min(0).max(6),
  start: time,
  end: time,
  kind,
  title: text(120).min(1),
  place: text(200).nullable().optional(),
  onlineLink: link.nullable().optional(),
  compulsory: z.boolean(),
  validFrom: date.nullable().optional(),
  validTo: date.nullable().optional(),
  active: z.boolean().optional(),
});
export const applySchema = z.object({ cohortId: uuid, from: date, to: date });

export const sessionSchema = z.object({
  cohortIds: z.array(uuid).min(1).max(20),
  date,
  start: time,
  end: time,
  kind,
  title: text(120).min(1),
  place: text(200).nullable().optional(),
  onlineLink: link.nullable().optional(),
  compulsory: z.boolean().optional(),
  note: text(500).nullable().optional(),
  notify: z.boolean().optional(),
});
export const sessionPatchSchema = z.object({
  date: date.optional(),
  start: time.optional(),
  end: time.optional(),
  kind: kind.optional(),
  title: text(120).min(1).optional(),
  place: text(200).nullable().optional(),
  onlineLink: link.nullable().optional(),
  compulsory: z.boolean().optional(),
  note: text(500).nullable().optional(),
  status: z.enum(["scheduled", "cancelled"]).optional(),
  notify: z.boolean().optional(),
});
export const dayNoteSchema = z.object({ cohortId: uuid, date, note: text(500) });
export const manualMarkSchema = z.object({ userId: uuid, direction: z.enum(["in", "out", "clear"]), at: z.string().datetime({ offset: true }).optional(), note: text(300).optional() });
export const decisionSchema = z.object({ decision: z.enum(["approve", "reject"]), note: text(300).optional() });
export const allowanceSchema = z.object({
  cohortId: uuid,
  userIds: z.array(uuid).min(1).max(2000).optional(),
  set: z.number().int().min(0).max(1000).optional(),
  add: z.number().int().min(-1000).max(1000).optional(),
  note: text(300).optional(),
});

const seatsPerBatch = z.object({ morning: z.number().int().min(0).max(100).optional(), evening: z.number().int().min(0).max(100).optional() });
export const settingsSchema = z.object({
  cohortId: uuid,
  seats: z.record(z.string().regex(/^[0-6]$/), seatsPerBatch),
  casesPerVisit: z.number().int().min(1).max(20),
  startDate: date.nullable(),
  endDate: date.nullable(),
  lateMinutes: z.number().int().min(0).max(180),
  holidays: z.array(date).max(400),
  freezeDays: z.number().int().min(0).max(60),
});
export const quotaSchema = z.object({ cohortId: uuid, userIds: z.array(uuid).min(1).max(2000).optional(), base: z.number().int().min(0).max(500) });
export const extraSchema = z.object({
  cohortId: uuid,
  userId: uuid,
  count: z
    .number()
    .int()
    .min(-100)
    .max(100)
    .refine((n) => n !== 0, "count"),
  note: text(300).optional(),
});
export const adminBatchSchema = z.object({ cohortId: uuid, userId: uuid, batch });
export const cohortBodySchema = z.object({ cohortId: uuid });
export const moveSchema = z.object({ assignmentId: uuid, date, batch, force: z.boolean().optional() });
export const publishSchema = z.object({ cohortId: uuid, notify: z.boolean().optional() });

/** A query value when it is a real id, else null: `idOrNull(query.get("cohort"))`. */
export function idOrNull(v: string | null): string | null {
  return v && uuid.safeParse(v).success ? v : null;
}

export const isUuid = (s: string) => uuid.safeParse(s).success;

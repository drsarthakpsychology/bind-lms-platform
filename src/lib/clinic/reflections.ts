import "server-only";
import type {
  ClinicAdminReflection,
  ClinicAdminReflections,
  ClinicMyReflections,
  ClinicReflection,
  ClinicReflectionBody,
  ClinicReflectionSaved,
} from "@/lib/app-api/contract";
import { ApiFail } from "@/lib/app-api/respond";
import { notifyClinic } from "@/lib/notify/clinic";
import { chunk, cohortStudents, fetchAll, must, requireCohort, studentCohort, todayOf, type Db } from "./data";
import { cleanPart, REPLY_MAX } from "./reflect-text";
import { isDate } from "./time";
import type { AssignmentRow, CaseLogRow, ReflectionRow } from "./types";

/**
 * Case reflections: after an OPD visit with its case count sent, the student
 * writes a few lines (what I saw, what I learned, what I want to ask). Any
 * admin reads them per student and per day; the Super Admin replies, and the
 * student gets a notice. Students act only for themselves (`userId` is the
 * verified caller). Phone numbers and emails are taken out before saving.
 */

export const REFLECTIONS_LINK = "/opd/reflections";

const fmtDay = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

function toReflection(r: ReflectionRow, names: ReadonlyMap<string, string | null>): ClinicReflection {
  return {
    id: r.id,
    assignmentId: r.assignment_id,
    date: r.date,
    batch: r.batch,
    saw: r.saw,
    learned: r.learned,
    ask: r.ask,
    at: r.updated_at ?? r.created_at,
    reply: r.reply ? { text: r.reply, at: r.replied_at ?? r.updated_at, by: r.replied_by ? (names.get(r.replied_by) ?? null) : null } : null,
  };
}

const newestFirst = (a: ReflectionRow, b: ReflectionRow) => b.date.localeCompare(a.date) || (b.created_at ?? "").localeCompare(a.created_at ?? "");

async function namesOf(db: Db, ids: Iterable<string>): Promise<Map<string, string | null>> {
  const list = [...new Set(ids)];
  const out = new Map<string, string | null>();
  for (const part of chunk(list)) {
    for (const p of must(await db.from("profiles").select("id, name").in("id", part), [] as { id: string; name: string | null }[])) out.set(p.id, p.name);
  }
  return out;
}

/* ------------------------------------------------------------ student */

export async function getMyReflections(db: Db, userId: string, cohort: string | null | undefined): Promise<ClinicMyReflections> {
  const c = await studentCohort(db, userId, cohort);
  if (!c) return { v: 1, cohortId: null, reflections: [] };
  const rows = must(await db.from("clinic_reflections").select("*").eq("user_id", userId).eq("cohort_id", c.cohortId), [] as ReflectionRow[]).sort(newestFirst);
  const names = await namesOf(db, rows.flatMap((r) => (r.replied_by ? [r.replied_by] : [])));
  return { v: 1, cohortId: c.cohortId, reflections: rows.map((r) => toReflection(r, names)) };
}

/** Write or change my reflection for one OPD day. Needs the day's case count sent (not "absent"). */
export async function saveReflection(db: Db, userId: string, body: ClinicReflectionBody, now: number): Promise<ClinicReflectionSaved> {
  const a = must(
    await db.from("clinic_opd_assignments").select("*").eq("id", body.assignmentId).eq("user_id", userId).eq("state", "published").maybeSingle(),
    null as AssignmentRow | null,
  );
  if (!a) throw new ApiFail("not_found", "That OPD day was not found.");
  if (a.date > todayOf(now)) throw new ApiFail("bad_request", "Write it on or after the day.");
  const log = must(await db.from("clinic_case_logs").select("*").eq("assignment_id", a.id).eq("user_id", userId).maybeSingle(), null as CaseLogRow | null);
  if (!log) throw new ApiFail("bad_request", "Send the day's case count first.");
  if (log.absent) throw new ApiFail("bad_request", "You were absent that day.");

  const saw = cleanPart(body.saw);
  const learned = cleanPart(body.learned);
  const ask = cleanPart(body.ask);
  if (!saw.text && !learned.text && !ask.text) throw new ApiFail("bad_request", "Write at least one line.", { fields: ["saw"] });

  const at = new Date(now).toISOString();
  const existing = must(await db.from("clinic_reflections").select("*").eq("assignment_id", a.id).maybeSingle(), null as ReflectionRow | null);
  if (existing && existing.user_id !== userId) throw new ApiFail("not_found", "That OPD day was not found.");
  const fields = { saw: saw.text, learned: learned.text, ask: ask.text, updated_at: at };
  let row: ReflectionRow | null;
  if (existing) {
    row = must(await db.from("clinic_reflections").update(fields).eq("id", existing.id).eq("user_id", userId).select("*").maybeSingle(), null as ReflectionRow | null);
  } else {
    const r = await db
      .from("clinic_reflections")
      .insert({ id: crypto.randomUUID(), assignment_id: a.id, user_id: userId, cohort_id: a.cohort_id, date: a.date, batch: a.batch, ...fields, created_at: at })
      .select("*")
      .single();
    if (r.error?.code === "23505") throw new ApiFail("conflict", "This day already has a reflection. Refresh to change it.");
    row = must(r, null as ReflectionRow | null);
  }
  const names = await namesOf(db, row?.replied_by ? [row.replied_by] : []);
  return { reflection: toReflection(row!, names), removed: saw.removed + learned.removed + ask.removed };
}

/* -------------------------------------------------------------- admin */

/** A cohort's reflections, newest first; `user` and `date` narrow the list. */
export async function listReflections(
  db: Db,
  cohort: string | null | undefined,
  filter: { user?: string | null; date?: string | null },
  canWrite: boolean,
): Promise<ClinicAdminReflections> {
  const cohortId = await requireCohort(db, cohort);
  if (filter.date && !isDate(filter.date)) throw new ApiFail("bad_request", "Pick a real date.");
  const all = (await fetchAll<ReflectionRow>(() => db.from("clinic_reflections").select("*").eq("cohort_id", cohortId).order("date", { ascending: false }))).sort(newestFirst);
  const people = await cohortStudents(db, cohortId);
  const byId = new Map(people.map((p) => [p.userId, p]));
  // Only the cohort's students (someone moved out keeps their rows, unseen here).
  const rows = all.filter((r) => byId.has(r.user_id));

  const tally = new Map<string, { count: number; waiting: number }>();
  const days = new Map<string, { count: number; waiting: number }>();
  for (const r of rows) {
    const t = tally.get(r.user_id) ?? { count: 0, waiting: 0 };
    const d = days.get(r.date) ?? { count: 0, waiting: 0 };
    t.count++;
    d.count++;
    if (!r.reply) {
      t.waiting++;
      d.waiting++;
    }
    tally.set(r.user_id, t);
    days.set(r.date, d);
  }
  const shown = rows.filter((r) => (!filter.user || r.user_id === filter.user) && (!filter.date || r.date === filter.date)).slice(0, 500);
  const names = await namesOf(db, shown.flatMap((r) => (r.replied_by ? [r.replied_by] : [])));
  return {
    v: 1,
    cohortId,
    canWrite,
    people: people.filter((p) => tally.has(p.userId)).map((p) => ({ userId: p.userId, name: p.name, roll: p.roll, ...tally.get(p.userId)! })),
    days: [...days].sort((a, b) => b[0].localeCompare(a[0])).map(([date, t]) => ({ date, ...t })),
    reflections: shown.map((r): ClinicAdminReflection => ({ ...toReflection(r, names), userId: r.user_id, name: byId.get(r.user_id)?.name ?? null, roll: byId.get(r.user_id)?.roll ?? null })),
  };
}

/** The supervisor's reply (sending again changes it). The student gets a notice when the words change. */
export async function replyReflection(db: Db, id: string, body: { reply: string }, actor: string, now: number): Promise<ClinicAdminReflection> {
  const row = must(await db.from("clinic_reflections").select("*").eq("id", id).maybeSingle(), null as ReflectionRow | null);
  if (!row) throw new ApiFail("not_found", "That reflection was not found.");
  const reply = body.reply.trim().slice(0, REPLY_MAX);
  if (!reply) throw new ApiFail("bad_request", "Write a reply.", { fields: ["reply"] });
  const at = new Date(now).toISOString();
  const changed = reply !== row.reply;
  const next = changed
    ? must(await db.from("clinic_reflections").update({ reply, replied_by: actor, replied_at: at }).eq("id", id).select("*").maybeSingle(), null as ReflectionRow | null)!
    : row;
  if (changed) {
    await notifyClinic({
      userIds: [row.user_id],
      title: "Reply to your reflection",
      text: `About your OPD day on ${fmtDay(row.date)}: ${reply.length > 300 ? `${reply.slice(0, 300)}...` : reply}`,
      sentBy: actor,
      link: REFLECTIONS_LINK,
      linkText: "Open your reflections",
    });
  }
  const names = await namesOf(db, [row.user_id, ...(next.replied_by ? [next.replied_by] : [])]);
  const student = must(await db.from("profiles").select("id, roll_number").eq("id", row.user_id).maybeSingle(), null as { roll_number: string | null } | null);
  return { ...toReflection(next, names), userId: row.user_id, name: names.get(row.user_id) ?? null, roll: student?.roll_number ?? null };
}

import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { loadActivity } from "@/lib/analytics/activity";
import { isHiddenAccount } from "@/lib/people/hidden";
import { presenceOf, type Presence } from "@/lib/people/presence";
import { accountStatus, NEEDS_ACTION, type AccountStatus } from "./account-status";
import { attentionFlags, type AttentionFlag } from "./attention";

/**
 * One row per real student with everything an admin screen needs — the single
 * read behind Students, Home, Activity and the cohort workspace, so the same
 * person never shows different facts on different screens.
 */
export type RosterRow = {
  id: string;
  name: string;
  email: string;
  roll: string | null;
  mobile: string | null;
  scope: "full" | "lectures_only";
  blocked: boolean;
  expiresAt: string | null;
  createdAt: string | null;
  account: AccountStatus;
  presence: Presence;
  lastSeen: string | null;
  cohorts: { id: string; name: string }[];
  min7: number;
  min30: number;
  activeDays30: number;
  lecturesDone: number;
  lecturesStarted: number;
  /** Lectures this person can watch (shared with their cohorts + one-off grants). */
  lecturesAvailable: number;
  watchMin: number;
  xp: number;
  detailsDone: boolean;
  flags: AttentionFlag[];
};

export type Roster = {
  rows: RosterRow[];
  cohorts: { id: string; name: string; status: string | null; course_id: string | null; starts_on: string | null; ends_on: string | null }[];
  publishedLectures: number;
};

export const loadRoster = cache(async (): Promise<Roster> => {
  const admin = createAdminClient();
  const [activity, profilesRes, cohortsRes, membersRes, linksRes, grantsRes, invitesRes, tokensRes, detailsRes, lessonsRes, failedRes] = await Promise.all([
    loadActivity(),
    admin.from("profiles").select("id, email, name, role, roll_number, mobile_number, scope, status, expires_at, active_session_token, is_test, created_at").eq("role", "student").limit(5000),
    admin.from("cohorts").select("id, name, status, course_id, starts_on, ends_on").order("created_at", { ascending: true }),
    admin.from("cohort_members").select("cohort_id, user_id").limit(20000),
    admin.from("lesson_cohorts").select("cohort_id, lesson_id").limit(50000),
    admin.from("lesson_grants").select("user_id, lesson_id").limit(20000),
    admin.from("credential_invites").select("email, status, setup_completed_at, created_at").order("created_at", { ascending: false }).limit(20000),
    admin.from("account_setup_tokens").select("user_id, email, expires_at, used_at, revoked_at, created_at").order("created_at", { ascending: false }).limit(20000),
    admin.from("student_details").select("user_id, confirmed_at").limit(20000),
    admin.from("lessons").select("id, status").limit(5000),
    admin.from("email_sends").select("recipient, status, created_at").eq("status", "failed").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()).limit(5000),
  ]);

  const act = new Map(activity.rows.map((r) => [r.id, r]));
  const cohorts = cohortsRes.error ? [] : (cohortsRes.data ?? []);
  const cohortName = new Map(cohorts.map((c) => [c.id as string, c.name as string]));
  const memberOf = new Map<string, string[]>();
  for (const m of membersRes.error ? [] : (membersRes.data ?? [])) {
    const list = memberOf.get(m.user_id as string) ?? [];
    list.push(m.cohort_id as string);
    memberOf.set(m.user_id as string, list);
  }
  const lessonsOfCohort = new Map<string, Set<string>>();
  for (const l of linksRes.error ? [] : (linksRes.data ?? [])) {
    const set = lessonsOfCohort.get(l.cohort_id as string) ?? new Set<string>();
    set.add(l.lesson_id as string);
    lessonsOfCohort.set(l.cohort_id as string, set);
  }
  const grants = new Map<string, Set<string>>();
  for (const g of grantsRes.error ? [] : (grantsRes.data ?? [])) {
    const set = grants.get(g.user_id as string) ?? new Set<string>();
    set.add(g.lesson_id as string);
    grants.set(g.user_id as string, set);
  }
  const published = (lessonsRes.data ?? []).filter((l) => !l.status || l.status === "published").length;
  // Newest invite / token per person (queries are newest first).
  const invite = new Map<string, { status: string; setup_completed_at: string | null }>();
  for (const i of invitesRes.error ? [] : (invitesRes.data ?? [])) {
    const e = String(i.email ?? "").toLowerCase();
    if (!invite.has(e)) invite.set(e, { status: String(i.status), setup_completed_at: (i.setup_completed_at as string | null) ?? null });
  }
  const token = new Map<string, { expires_at: string | null; used_at: string | null }>();
  const anyUsed = new Set<string>();
  for (const t of tokensRes.error ? [] : (tokensRes.data ?? [])) {
    const id = String(t.user_id ?? "");
    if (t.used_at) anyUsed.add(id);
    if (t.revoked_at) continue;
    if (!token.has(id)) token.set(id, { expires_at: (t.expires_at as string | null) ?? null, used_at: (t.used_at as string | null) ?? null });
  }
  const detailsDone = new Set((detailsRes.data ?? []).filter((d) => d.confirmed_at).map((d) => d.user_id as string));
  const failedTo = new Set((failedRes.data ?? []).map((f) => String(f.recipient).toLowerCase()));

  const now = Date.now();
  const rows: RosterRow[] = (profilesRes.data ?? [])
    .filter((p) => !isHiddenAccount(p))
    .map((p) => {
      const id = p.id as string;
      const email = String(p.email ?? "");
      const a = act.get(id);
      const myCohorts = (memberOf.get(id) ?? []).filter((c) => cohortName.has(c));
      const available = new Set<string>(grants.get(id) ?? []);
      for (const c of myCohorts) for (const l of lessonsOfCohort.get(c) ?? []) available.add(l);
      const inv = invite.get(email.toLowerCase());
      const tok = token.get(id);
      const account = accountStatus(
        {
          blocked: p.status === "blocked",
          expiresAt: (p.expires_at as string | null) ?? null,
          role: p.role as string,
          hasSignedIn: Boolean(p.active_session_token),
          lastSeen: a?.lastSeen ?? null,
          setupDoneAt: inv?.setup_completed_at ?? null,
          linkUsed: anyUsed.has(id),
          linkExpiresAt: tok?.expires_at ?? null,
          inviteState: inv ? (inv.status as "sent" | "failed" | "pending") : null,
        },
        now,
      );
      const row: RosterRow = {
        id,
        // Admins see full names (the student boards use "Aanya S.").
        name: String(p.name ?? "").trim() || a?.name || email.split("@")[0],
        email,
        roll: (p.roll_number as string | null) ?? null,
        mobile: (p.mobile_number as string | null) ?? null,
        scope: p.scope === "lectures_only" ? "lectures_only" : "full",
        blocked: p.status === "blocked",
        expiresAt: (p.expires_at as string | null) ?? null,
        createdAt: (p.created_at as string | null) ?? null,
        account,
        presence: presenceOf(a?.lastSeen ?? null, now),
        lastSeen: a?.lastSeen ?? null,
        cohorts: myCohorts.map((c) => ({ id: c, name: cohortName.get(c)! })),
        min7: a?.min7 ?? 0,
        min30: a?.min30 ?? 0,
        activeDays30: a?.activeDays30 ?? 0,
        lecturesDone: a?.lecturesDone ?? 0,
        lecturesStarted: a?.lecturesStarted ?? 0,
        lecturesAvailable: myCohorts.length || available.size ? available.size : published,
        watchMin: a?.watchMin ?? 0,
        xp: a?.xp ?? 0,
        detailsDone: detailsDone.has(id),
        flags: [],
      };
      row.flags = attentionFlags({
        account,
        needsAction: NEEDS_ACTION.includes(account),
        mobile: row.mobile,
        presence: row.presence,
        lecturesDone: row.lecturesDone,
        lecturesAvailable: row.lecturesAvailable,
        emailFailing: failedTo.has(email.toLowerCase()),
        detailsDone: row.detailsDone,
      });
      return row;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    rows,
    cohorts: cohorts.map((c) => ({
      id: c.id as string,
      name: c.name as string,
      status: (c.status as string | null) ?? null,
      course_id: (c.course_id as string | null) ?? null,
      starts_on: (c.starts_on as string | null) ?? null,
      ends_on: (c.ends_on as string | null) ?? null,
    })),
    publishedLectures: published,
  };
});

import "server-only";
import { cache } from "react";
import { requestMemo } from "@/lib/app-api/context";
import { latest, presenceOf } from "@/lib/people/presence";
import { pageAll, progressTotals, visitShape, visitTotals } from "@/lib/db/counts";
import { isHiddenAccount } from "@/lib/people/hidden";
import { createAdminClient } from "@/lib/supabase/server";
import { domainMastery, topConfusions } from "@/lib/learn/adaptive";
import { levelFor, liveStreak, normalise, type LearnState } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { displayName } from "@/lib/learn/leaderboard";

/** A tab left open isn't study: cap any single visit at 30 minutes. */
const MAX_VISIT_S = 30 * 60;
const DAY_MS = 86400000;
const IST_MS = 5.5 * 3600000;

export type Visit = { user_id: string; path: string; entered_at: string; left_at?: string | null; duration_seconds: number | null };
export type StudentActivity = {
  id: string;
  name: string;
  email: string;
  status: string;
  min7: number;
  min30: number;
  activeDays30: number;
  lastSeen: string | null;
  lecturesDone: number;
  lecturesStarted: number;
  watchMin: number;
  xp: number;
  level: string;
  streak: number;
  accuracy: number | null;
  mastery: number;
  practice: number;
  score: number;
};

const istDay = (iso: string) => new Date(new Date(iso).getTime() + IST_MS).toISOString().slice(0, 10);
const secs = (v: Visit) => Math.min(MAX_VISIT_S, Math.max(0, v.duration_seconds ?? 0));

/** Turn a URL path into words an admin understands. */
export function describePath(path: string, lessonTitles: Map<string, string>): string {
  const m = path.match(/^\/courses\/[^/]+\/lessons\/([^/?#]+)/);
  if (m) return `Lecture: ${lessonTitles.get(m[1]) ?? "a lecture"}`;
  const table: [RegExp, string][] = [
    [/^\/dashboard/, "Home"],
    [/^\/courses\/[^/]+\/materials/, "Materials"],
    [/^\/courses/, "Lectures list"],
    [/^\/practice\/learn\/coach/, "Learn: Coach"],
    [/^\/practice\/learn\/detective/, "Learn: Detective"],
    [/^\/practice\/learn\/progress/, "Learn: My progress"],
    [/^\/practice\/learn/, "Learn"],
    [/^\/practice\/consulting-room/, "Consulting Room"],
    [/^\/practice\/mse/, "MSE practice"],
    [/^\/practice\/medicines/, "Medicines"],
    [/^\/practice\/leaderboard/, "Rankings"],
    [/^\/practice/, "Practice"],
    [/^\/tools\/psychopharm/, "Medicines library"],
    [/^\/notifications/, "Notifications"],
    [/^\/wall/, "Wall"],
    [/^\/reflect/, "Journal"],
    [/^\/settings/, "Settings"],
    [/^\/study\/notes/, "One-page notes"],
    [/^\/study/, "Study"],
    [/^\/games\/leaderboard/, "Quiz leaderboard"],
    [/^\/games/, "Games"],
    [/^\/doubts/, "Doubts"],
    [/^\/journey|^\/passport|^\/record/, "My journey"],
    [/^\/leaderboard/, "Leaderboard"],
    [/^\/today/, "Today"],
  ];
  return table.find(([re]) => re.test(path))?.[1] ?? path;
}

/** Every student's recent activity. Read once per request (website pages and app routes alike). */
export const loadActivity = cache(() => requestMemo("analytics:activity", readActivity));

async function readActivity() {
  const admin = createAdminClient();
  const now = Date.now();
  const since30 = new Date(now - 30 * DAY_MS).toISOString();
  const since7 = new Date(now - 7 * DAY_MS).toISOString();
  // Totals come from the database (never cut at 1000 rows); see lib/db/counts.
  const [profiles, visitByUser, shape, progByUser, { data: lessons }, learnRes, sims] = await Promise.all([
    pageAll<{ id: string; name: string | null; email: string | null; status: string | null; is_test: boolean | null; role: string }>(() =>
      admin.from("profiles").select("id, name, email, status, is_test, role").eq("role", "student").order("id"),
    ),
    visitTotals(admin, since30, since7),
    visitShape(admin, since30),
    progressTotals(admin),
    admin.from("lessons").select("id, title"),
    admin.from("learn_progress").select("user_id, state"),
    pageAll<{ user_id: string; started_at: string }>(() => admin.from("sim_sessions").select("user_id, started_at").gte("started_at", since30).order("id")),
  ]);
  const learn = new Map<string, LearnState>((learnRes.error ? [] : (learnRes.data ?? [])).map((r) => [r.user_id as string, normalise(r.state)]));
  const lessonTitles = new Map((lessons ?? []).map((l) => [l.id as string, l.title as string]));
  const students = (profiles ?? []).filter((p) => !isHiddenAccount(p));
  const today = istToday();

  // Cohort heatmap: weekday (Mon=0) × IST hour → minutes.
  const heat = shape.heat.map((row) => row.map((s) => s / 60));
  const pages = new Map<string, number>();
  for (const [path, seconds] of shape.pathSeconds) {
    const label = describePath(path, lessonTitles).replace(/^Lecture: .*/, "Lectures (watching)");
    pages.set(label, (pages.get(label) ?? 0) + seconds / 60);
  }
  const simsByUser = new Map<string, string[]>();
  for (const x of sims ?? []) simsByUser.set(x.user_id, [...(simsByUser.get(x.user_id) ?? []), x.started_at]);

  const rows: StudentActivity[] = students.map((p) => {
    const v = visitByUser.get(p.id);
    const pr = progByUser.get(p.id);
    const st = learn.get(p.id);
    const mySims = simsByUser.get(p.id) ?? [];
    const practice = mySims.length;
    const row: StudentActivity = {
      id: p.id,
      name: displayName(p.name, String(p.email ?? "")),
      email: String(p.email ?? ""),
      status: String(p.status ?? "active"),
      min7: Math.round((v?.secondsWeek ?? 0) / 60),
      min30: Math.round((v?.seconds ?? 0) / 60),
      activeDays30: v?.activeDays ?? 0,
      lastSeen: latest(v?.lastVisit ?? null, pr?.lastUpdate ?? null, ...mySims),
      lecturesDone: pr?.lessonsDone ?? 0,
      lecturesStarted: pr?.lessonsStarted ?? 0,
      watchMin: Math.round((pr?.watchedSeconds ?? 0) / 60),
      xp: st?.xp ?? 0,
      level: st ? levelFor(st.xp).title : "None",
      streak: st ? liveStreak(st.streak, today) : 0,
      accuracy: st && st.answered ? Math.round((st.correct / st.answered) * 100) : null,
      mastery: st ? domainMastery(st.coach, "all").pct : 0,
      practice,
      score: 0,
    };
    // Engagement score: time, finished lectures, Learn XP and practice, weighted.
    row.score = Math.round(row.min30 + row.lecturesDone * 20 + row.xp / 10 + practice * 10 + row.activeDays30 * 5);
    return row;
  });

  return {
    rows,
    heat,
    pages: [...pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([label, min]) => ({ label, min: Math.round(min) })),
    totals: {
      students: rows.length,
      active7: rows.filter((r) => r.min7 > 0 || presenceOf(r.lastSeen, now) === "now" || presenceOf(r.lastSeen, now) === "today").length,
      activeNow: rows.filter((r) => presenceOf(r.lastSeen, now) === "now").length,
      hours30: Math.round(rows.reduce((a, r) => a + r.min30, 0) / 60),
      lecturesDone: rows.reduce((a, r) => a + r.lecturesDone, 0),
    },
  };
}

export async function loadStudentDetail(userId: string) {
  const admin = createAdminClient();
  const since30 = new Date(Date.now() - 30 * DAY_MS).toISOString();
  const [{ data: profile }, { data: visits }, { data: progress }, { data: lessons }, learnRes, { data: sims }] = await Promise.all([
    admin.from("profiles").select("id, name, email, status, created_at, mobile_number").eq("id", userId).maybeSingle(),
    pageAll<Visit>(() => admin.from("page_visits").select("user_id, path, entered_at, duration_seconds").eq("user_id", userId).gte("entered_at", since30).order("entered_at", { ascending: false }).order("id")).then((data) => ({ data })),
    admin.from("progress").select("lesson_id, watched_seconds, is_completed, updated_at").eq("user_id", userId),
    admin.from("lessons").select("id, title, week, order_index").order("order_index"),
    admin.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(),
    admin.from("sim_sessions").select("id, status, started_at, ended_at").eq("user_id", userId).order("started_at", { ascending: false }).limit(20),
  ]);
  if (!profile) return null;
  const lessonTitles = new Map((lessons ?? []).map((l) => [l.id as string, l.title as string]));
  const vs = (visits ?? []) as Visit[];
  const today = istToday();
  const daily = new Map<string, number>();
  for (const v of vs) daily.set(istDay(v.entered_at), (daily.get(istDay(v.entered_at)) ?? 0) + secs(v) / 60);
  const st = learnRes.error || !learnRes.data ? null : normalise(learnRes.data.state);
  const prog = new Map((progress ?? []).map((p) => [p.lesson_id as string, p]));
  return {
    profile: { ...profile, display: displayName(profile.name as string | null, String(profile.email ?? "")) },
    daily: Array.from({ length: 30 }, (_, k) => {
      const d = new Date(Date.now() + IST_MS - (29 - k) * DAY_MS).toISOString().slice(0, 10);
      return { day: d, min: Math.round(daily.get(d) ?? 0) };
    }),
    lectures: (lessons ?? []).map((l) => {
      const p = prog.get(l.id as string);
      return { id: l.id as string, title: l.title as string, week: l.week as number | null, watchedMin: Math.round(((p?.watched_seconds as number) ?? 0) / 60), done: Boolean(p?.is_completed), at: (p?.updated_at as string) ?? null };
    }),
    recent: vs.slice(0, 40).map((v) => ({ at: v.entered_at, what: describePath(v.path, lessonTitles), min: Math.round(secs(v) / 60) })),
    learn: st
      ? {
          xp: st.xp,
          level: levelFor(st.xp),
          streak: liveStreak(st.streak, today),
          best: st.streak.best,
          accuracy: st.answered ? Math.round((st.correct / st.answered) * 100) : null,
          answered: st.answered,
          badges: st.badges.length,
          mastery: domainMastery(st.coach, "all").pct,
          confusions: topConfusions(st.coach, 5).map((x) => `${x.a.term} ↔ ${x.b.term} (${x.times}×)`),
          lessons: Object.keys(st.lessons).length,
        }
      : null,
    sims: sims ?? [],
    totals: {
      min30: Math.round(vs.reduce((a, v) => a + secs(v), 0) / 60),
      activeDays: daily.size,
    },
  };
}

import type { FetchQueryOptions, QueryKey } from "@tanstack/react-query";
import { router } from "expo-router";

import { adminQo } from "@/admin/api";
import { clinicAdminQo, clinicQo, clinicRouteReads } from "@/clinic/api";
import { session } from "@/auth";
import { prepSetPathOf, prepSetQuery, readQuery } from "@/practise/api";
import type * as C from "./contract";
import { learnQo } from "./learn";
import { isSlow, netStore } from "./online";
import { qo, queryClient } from "./queries";

/**
 * Load before it is asked for, so screens open on data that is already here
 * (docs/PERFORMANCE.md). Three moments:
 *  1. The account opens (also under the PIN screen on a cold start): the
 *     first reads of every tab, all at once, in parallel.
 *  2. A tap: the screen it opens starts loading before the navigator has
 *     even drawn it (`go`, `prefetchRoute`).
 *  3. An answer names the obvious next step (Home's Continue, Study's
 *     next module, a module's next section, the course you are on): that
 *     step is loaded too, so Continue opens at once.
 * Every read here is the same query the screen asks for (src/api/queries.ts
 * `qo`), and one that is still fresh is not asked for again. A failed
 * prefetch is silent: the screen asks again and shows its own error.
 *
 * Kind to data and battery: nothing is loaded ahead while the phone is
 * offline, and while the connection is too slow only what was tapped loads
 * (moment 2); the guesses (1 and 3) wait for a better connection.
 */

/** A ready-made query of any shape (each one's own types are checked where it is made). */
type Read = { queryKey: QueryKey };

function load(reads: (Read | null | undefined | false)[]): void {
  for (const r of reads) if (r) void queryClient.prefetchQuery(r as FetchQueryOptions);
}

/** Loading ahead on a guess is worth it now (online, and not on a crawling connection). */
export function canGuess(): boolean {
  return !netStore.get().offline && !isSlow();
}

/** How many list rows to load ahead (the ones on screen first). */
export const AHEAD_ROWS = 3;

/** The first reads of the account's tabs (what each tab screen asks for when it opens). */
export function tabReads(me: C.Me | null): Read[] {
  if (!me) return [];
  if (me.role === "admin" || me.role === "view_admin") return [adminQo.home(), adminQo.students(), adminQo.activity(), adminQo.inbox(), clinicAdminQo.today()];
  const can = me.access.can;
  if (me.access.lecturesOnly) return [qo.home(), qo.courses(), qo.doubts(false)];
  const reads: (Read | false)[] = [
    qo.home(),
    // Home's "Your day" block (schedule, OPD day, scan).
    clinicQo.today(),
    qo.achievements(),
    qo.progress(),
    can.lectures !== false && qo.courses(),
    can.study !== false && qo.study(),
    can.study !== false && learnQo.notes(),
    learnQo.assignments(),
    (can.practice !== false || can.games !== false) && readQuery("/practise"),
    (can.practice !== false || can.games !== false) && readQuery("/prep"),
    can.medicines !== false && qo.medicines(),
  ];
  return reads.filter((r): r is Read => !!r);
}

const seg = (s: string | undefined) => {
  try {
    return decodeURIComponent(s ?? "");
  } catch {
    return s ?? "";
  }
};

/** What the screen at this address asks for first. Unknown addresses load nothing. */
export function routeReads(href: string): Read[] {
  const path = href.split(/[?#]/)[0] ?? "";
  const p = path.split("/").filter(Boolean).map(seg);
  const [a, b, c] = p;
  if (a === "clinic" || (a === "admin" && b === "clinic")) return clinicRouteReads(p);
  switch (a) {
    case "lectures":
      return [qo.courses()];
    case "course":
      return b ? [qo.course(b)] : [];
    case "lecture":
      return b ? [qo.lecture(b)] : [];
    case "material":
      return b ? [qo.material(b)] : [];
    case "study":
      if (!b) return [qo.study()];
      if (!c) return [qo.module(b)];
      if (c === "checkpoint" || c === "test") return [qo.module(b)];
      return [qo.section(b, c), qo.module(b), learnQo.marks()];
    case "notes":
      return b ? [learnQo.note(b)] : [learnQo.notes()];
    // The Study tab: modules and notes.
    case "library":
      return [qo.study(), learnQo.notes()];
    case "reference":
      return b ? [learnQo.term(b)] : [learnQo.terms()];
    case "assignments":
      return [learnQo.assignments()];
    case "journey":
      return [learnQo.journey()];
    case "progress":
      return [qo.progress(), qo.achievements()];
    case "certificates":
      return [qo.achievements()];
    case "notifications":
      return [qo.notifications()];
    case "notification":
      return b ? [qo.notification(b)] : [];
    case "doubts":
      return b ? [] : [qo.doubts(false)];
    case "doubt":
      return b ? [qo.doubt(b)] : [];
    case "settings":
      return [qo.settings()];
    case "prep": {
      if (!b) return [readQuery("/prep")];
      if (b === "set") {
        // The set itself (its query string says which), so the first question is there when the screen draws.
        const set = prepSetPathOf(href);
        return set ? [prepSetQuery(set)] : [];
      }
      if (b === "mock") return [readQuery("/prep/mock")];
      if (b === "long") return [];
      return [readQuery(`/prep/subjects/${encodeURIComponent(b)}`)];
    }
    case "practise":
      return [readQuery("/practise")];
    default:
      return [];
  }
}

/** Start loading what the screen at `href` shows (a tap, a link). Safe to call with anything. */
export function prefetchRoute(href: string | null | undefined): void {
  if (!href || !session.hasTokens() || netStore.get().offline) return;
  try {
    load(routeReads(href));
  } catch {
    /* a prefetch never breaks a tap */
  }
}

/** Open a screen and start loading its data in the same moment (the tap's handler). */
export function go(href: string): void {
  prefetchRoute(href);
  router.push(href);
}

/** The screen an AppTarget opens, as an address (the few the prefetcher knows). */
function targetHref(t: C.AppTarget | null | undefined): string | null {
  if (!t || typeof t !== "object") return null;
  switch (t.screen) {
    case "courses":
      return "/lectures";
    case "course":
      return `/course/${encodeURIComponent(t.courseId)}`;
    case "lecture":
      return `/lecture/${encodeURIComponent(t.lessonId)}`;
    case "study":
      return "/library?side=modules";
    case "studyModule":
      return `/study/${encodeURIComponent(t.moduleId)}`;
    case "studySection":
      return `/study/${encodeURIComponent(t.moduleId)}/${encodeURIComponent(t.sectionId)}`;
    case "studyNote":
      return `/notes/${encodeURIComponent(t.noteId)}`;
    default:
      return null;
  }
}

/** The obvious next step in a fresh answer, to load ahead (moment 3). */
export function nextReads(key: QueryKey, data: unknown): string[] {
  const d = data as Record<string, unknown> | null;
  if (!d || typeof d !== "object") return [];
  const out: (string | null)[] = [];
  switch (key[0]) {
    case "home": {
      const h = d as Partial<C.Home>;
      out.push(targetHref(h.step?.target));
      break;
    }
    case "study":
      out.push(targetHref((d as Partial<C.StudyHome>).next?.target));
      break;
    case "module":
      out.push(targetHref((d as Partial<C.ModuleDetail>).next?.target));
      break;
    case "courses": {
      const first = (d as Partial<C.CourseList>).courses?.[0];
      if (first) out.push(`/course/${encodeURIComponent(first.id)}`);
      break;
    }
    case "course": {
      // The lecture the student is on (the one marked next, else the one started).
      const lessons = ((d as Partial<C.CourseDetail>).weeks ?? []).flatMap((w) => (Array.isArray(w?.lessons) ? w.lessons : []));
      const on = lessons.find((l) => l.openable && l.state === "next") ?? lessons.find((l) => l.openable && l.state === "started");
      if (on) out.push(`/lecture/${encodeURIComponent(on.id)}`);
      break;
    }
    case "lecture": {
      const next = (d as Partial<C.LectureDetail>).next;
      if (next?.id) out.push(`/lecture/${encodeURIComponent(next.id)}`);
      break;
    }
    case "section": {
      // The next section of the same module: reading on opens at once.
      const next = (d as { next?: { sectionId?: string } | null }).next;
      const m = typeof key[1] === "string" ? key[1] : "";
      if (m && next?.sectionId) out.push(`/study/${encodeURIComponent(m)}/${encodeURIComponent(next.sectionId)}`);
      break;
    }
    case "notes": {
      const list = (d as { notes?: { id: string; readOn?: string | null }[] }).notes ?? [];
      const next = list.find((n) => !n.readOn);
      if (next) out.push(`/notes/${encodeURIComponent(next.id)}`);
      break;
    }
    case "doubts": {
      // The first rows on screen. (Notifications are not loaded ahead: opening one marks it read.)
      for (const x of ((d as { items?: { id: string }[] }).items ?? []).slice(0, AHEAD_ROWS)) out.push(`/doubt/${encodeURIComponent(x.id)}`);
      break;
    }
    default:
      break;
  }
  return out.filter((h): h is string => !!h);
}

let opened: string | null = null;

/**
 * Call once from the root layout. Loads the tabs as soon as an account is
 * open (or waiting for its PIN), and the next step after each fresh answer.
 * Returns the unsubscribe.
 */
export function installPrefetch(): () => void {
  const onSession = () => {
    const s = session.store.get();
    if (s.phase === "visitor" || s.phase === "loading" || !s.me) {
      if (s.phase === "visitor") opened = null;
      return;
    }
    const id = `${s.me.id}:${s.me.role}:${s.me.access.lecturesOnly ? 1 : 0}`;
    if (opened === id) return;
    opened = id;
    try {
      // Offline: nothing would arrive (the screens show their saved copies). Crawling: Home first, the rest on tap.
      if (netStore.get().offline) opened = null;
      else load(isSlow() ? tabReads(s.me).slice(0, 1) : tabReads(s.me));
    } catch {
      /* never break the opening */
    }
  };
  const offSession = session.store.subscribe(onSession);
  // Back online after opening offline: load the tabs then.
  const offNet = netStore.subscribe(() => {
    if (!netStore.get().offline && opened === null) onSession();
  });
  onSession();
  const offCache = queryClient.getQueryCache().subscribe((e) => {
    if (e.type !== "updated" || e.action.type !== "success") return;
    // Only answers from the server, not copies restored from the phone or written by a screen.
    if (e.action.manual) return;
    if (!canGuess()) return;
    for (const href of nextReads(e.query.queryKey, e.query.state.data)) prefetchRoute(href);
  });
  return () => {
    offSession();
    offNet();
    offCache();
  };
}

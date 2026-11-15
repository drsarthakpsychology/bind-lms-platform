import { router } from "expo-router";

import type { AppTarget, Me } from "@/api/contract";
import { toast } from "@/ds/toast";

/** Practise case tools the app has (src/practise/catalog.ts), and the website's names for them. */
const CASE_TOOLS = new Set(["daily", "detective", "wwyd", "two-minute", "say-it", "judgment", "ethics", "landmark", "osce", "mse-trainer", "formulation", "out-of-depth", "weak-spots"]);
const WEB_TOOL: Record<string, string> = { scenarios: "wwyd", terms: "say-it", mse: "mse-trainer", "two-minute-clinic": "two-minute" };

/** The first tab for this account. */
export function homeHref(me: Me | null): string {
  if (me?.role === "admin" || me?.role === "view_admin") return "/admin/home";
  if (me?.access?.lecturesOnly || me?.scope === "lectures_only") return "/lo/home";
  return "/home";
}

/** Which tab group this account belongs in. */
export function groupFor(me: Me | null): "(student)" | "(lecture)" | "(admin)" {
  if (me?.role === "admin" || me?.role === "view_admin") return "(admin)";
  if (me?.access?.lecturesOnly || me?.scope === "lectures_only") return "(lecture)";
  return "(student)";
}

/** The app screen for a server target; null when this version has no screen for it. */
export function hrefFor(t: AppTarget): string | null {
  switch (t.screen) {
    case "home":
      return "/";
    case "courses":
      return "/lectures";
    case "course":
      return `/course/${encodeURIComponent(t.courseId)}`;
    case "lecture":
      return `/lecture/${encodeURIComponent(t.lessonId)}${t.tab ? `?tab=${t.tab}` : ""}`;
    case "material":
      return `/material/${encodeURIComponent(t.materialId)}`;
    case "study":
      return "/study";
    case "studyModule":
      return `/study/${encodeURIComponent(t.moduleId)}`;
    case "studySection":
      return `/study/${encodeURIComponent(t.moduleId)}/${encodeURIComponent(t.sectionId)}`;
    case "studyCheckpoint":
      return `/study/${encodeURIComponent(t.moduleId)}/checkpoint/${t.n}`;
    case "studyNote":
      return `/notes/${encodeURIComponent(t.noteId)}`;
    case "doubts":
      return "/doubts";
    case "doubt":
      return `/doubt/${encodeURIComponent(t.doubtId)}`;
    case "notifications":
      return "/notifications";
    case "notification":
      return `/notification/${encodeURIComponent(t.notificationId)}`;
    case "achievements":
      return "/certificates";
    case "certificate":
      return `/certificate/${encodeURIComponent(t.credentialId)}`;
    case "progress":
      return "/progress";
    case "settings":
      return "/settings";
    case "practice":
      if (!t.tool) return "/practise";
      if (t.tool === "prep") return "/prep";
      if (t.tool === "medicines") return "/library";
      if (t.tool.startsWith("case-") || CASE_TOOLS.has(t.tool)) return `/case/${encodeURIComponent(WEB_TOOL[t.tool] ?? t.tool)}`;
      if (WEB_TOOL[t.tool]) return `/case/${WEB_TOOL[t.tool]}`;
      return "/practise";
    case "game":
      return t.game ? `/game/${encodeURIComponent(t.game)}` : "/practise";
    default:
      return t.screen === "unknown" ? learnPathFor(t.web) : null;
  }
}

/** Website paths for Learn and Me screens the server does not have a target for yet. */
function learnPathFor(web: string | undefined): string | null {
  const p = (web ?? "").split("?")[0]!.replace(/\/+$/, "");
  let m: RegExpExecArray | null;
  if (p === "/journey") return "/journey";
  if (p === "/study/notes") return "/notes";
  if ((m = /^\/study\/notes\/([^/]+)$/.exec(p))) return `/notes/${m[1]}`;
  if (p === "/study/reference") return "/reference";
  if ((m = /^\/study\/reference\/([^/]+)$/.exec(p))) return `/reference/${m[1]}`;
  if (p === "/assignments") return "/assignments";
  return null;
}

/** Open whatever a row, a button or a notification points at. */
export function openTarget(t: AppTarget): void {
  const href = hrefFor(t);
  if (href) router.push(href);
  else toast.show("This part arrives in the next update of the app.");
}

/**
 * A website address (or vibha:// link) to the app screen that shows the same
 * thing. Used for links that open the app from outside: the setup email,
 * a shared certificate, a notification link.
 */
export function pathFromLink(input: string): string {
  let path = input;
  try {
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) {
      const u = new URL(input);
      // vibha://lecture/l5 parses "lecture" as the host.
      path = (u.protocol === "vibha:" ? `/${u.host}${u.pathname}` : u.pathname) + u.search;
    }
  } catch {
    return "/";
  }
  const [rawPath = "/", query = ""] = path.split("?");
  const p = rawPath.replace(/\/+$/, "") || "/";
  const q = query ? `?${query}` : "";
  let m: RegExpExecArray | null;
  if (p === "/setup" || p === "/set-password") return `/setup${q}`;
  const learn = learnPathFor(p);
  if (learn) return learn;
  if (p === "/" || p === "/dashboard") return "/";
  if (p === "/login") return "/sign-in";
  if (p === "/waitlist") return "/request";
  if (p === "/courses") return "/lectures";
  if ((m = /^\/courses\/([^/]+)\/lessons\/([^/]+)$/.exec(p))) return `/lecture/${m[2]}${q}`;
  if ((m = /^\/courses\/([^/]+)$/.exec(p))) return `/course/${m[1]}`;
  if ((m = /^\/study\/([^/]+)\/checkpoint\/(\d+)$/.exec(p))) return `/study/${m[1]}/checkpoint/${m[2]}`;
  if ((m = /^\/doubts\/([^/]+)$/.exec(p))) return `/doubt/${m[1]}`;
  if ((m = /^\/notifications\/([^/]+)$/.exec(p))) return `/notification/${m[1]}`;
  if ((m = /^\/verify\/([^/]+)$/.exec(p))) return `/verify/${m[1]}`;
  if (p === "/achievements") return "/certificates";
  if (p === "/practise" || p === "/practice") return "/practise";
  if (p === "/practice/medicines") return "/library";
  if ((m = /^\/practice\/medicines\/([^/]+)$/.exec(p))) return `/medicine/${m[1]}`;
  if (p === "/practice/prep" || p === "/exam-prep") return "/prep";
  if (p === "/games/leaderboard" || p === "/practice/leaderboard") return "/game/leaderboard";
  if ((m = /^\/games\/([^/]+)$/.exec(p))) return `/game/${m[1]}`;
  if ((m = /^\/practice\/([^/]+)$/.exec(p)) && (CASE_TOOLS.has(m[1]!) || WEB_TOOL[m[1]!])) return `/case/${WEB_TOOL[m[1]!] ?? m[1]}`;
  if (p === "/prep") return "/prep";
  if (p === "/learn" || p === "/me") return p;
  // Paths that are the same in the app: /study, /study/m02, /study/m02/s1, /doubts, /notifications, /progress, /settings, /lecture/..., /course/...
  return p + q;
}

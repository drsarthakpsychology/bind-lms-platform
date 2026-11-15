import type { AppTarget } from "./contract";

/**
 * Turns a website path into an app screen, so the app never parses web
 * addresses. Pure. Anything without an app screen yet answers "unknown" with
 * the path kept in `web`.
 */
export function toAppTarget(href: string | null | undefined): AppTarget {
  const web = String(href ?? "");
  let path = web;
  let query = new URLSearchParams();
  try {
    const u = new URL(web, "https://app.invalid");
    path = u.pathname;
    query = u.searchParams;
  } catch {
    return { screen: "unknown", web };
  }
  const seg = path.split("/").filter(Boolean).map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  const [a, b, c, d] = seg;

  if (!a || a === "dashboard") return { screen: "home", web };
  if (a === "courses") {
    if (!b) return { screen: "courses", web };
    if (c === "lessons" && d) {
      const tab = query.get("tab");
      return { screen: "lecture", courseId: b, lessonId: d, ...(tab === "assignment" || tab === "materials" ? { tab } : {}), web };
    }
    if (c === "materials" && d) return { screen: "material", courseId: b, materialId: d, web };
    return { screen: "course", courseId: b, web };
  }
  if (a === "study") {
    if (!b) return { screen: "study", web };
    if (b === "notes") return c ? { screen: "studyNote", noteId: c, web } : { screen: "study", web };
    if (b === "map" || b === "placement" || b === "reference") return { screen: "unknown", web };
    if (c === "checkpoint" && d && /^\d+$/.test(d)) return { screen: "studyCheckpoint", moduleId: b, n: Number(d), web };
    if (c) return { screen: "studySection", moduleId: b, sectionId: c, web };
    return { screen: "studyModule", moduleId: b, web };
  }
  if (a === "doubts") return b ? { screen: "doubt", doubtId: b, web } : { screen: "doubts", web };
  if (a === "notifications") return b ? { screen: "notification", notificationId: b, web } : { screen: "notifications", web };
  if (a === "achievements") return b ? { screen: "certificate", credentialId: b, web } : { screen: "achievements", web };
  if (a === "progress" || a === "journey") return { screen: "progress", web };
  if (a === "settings" || a === "me") return { screen: "settings", web };
  if (a === "practice" || a === "practise" || a === "prep" || a === "tools") return { screen: "practice", tool: b ?? null, web };
  if (a === "games") return { screen: "game", game: b ?? null, web };
  return { screen: "unknown", web };
}

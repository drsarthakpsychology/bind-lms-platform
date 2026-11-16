import { prefs, type KeyValue } from "./storage";

/**
 * Where the app was when it last closed itself. A native crash (Java, out of
 * memory) closes the app with no JS error, so nothing can be shown at that
 * moment. Instead every navigation and every press saves the screen and the
 * last action; going to the background marks a normal stop. If the app opens
 * and the last record was still in the foreground, it closed by itself, and
 * Home says where ("The app closed last time on: Notes").
 */

export type Crumb = { screen: string; path: string; action: string | null; at: number; fg: boolean };

const KEY = "vibha.crumb.v1";
const EMPTY: Crumb = { screen: "", path: "", action: null, at: 0, fg: true };

let store: KeyValue = prefs;
let now: Crumb = EMPTY;
let previous: Crumb | null = null;

const NAMES: Record<string, string> = {
  "": "Home",
  index: "Home",
  notes: "Notes",
  study: "Study",
  lecture: "Lecture",
  lectures: "Lectures",
  course: "Course",
  material: "Lecture file",
  reference: "Quick reference",
  saved: "Saved",
  doubts: "Doubts",
  doubt: "Doubt",
  map: "Your map",
  wall: "Class wall",
  shop: "Shop",
  prep: "Mock papers",
  game: "Game",
  case: "Case",
  medicine: "Medicine",
  certificates: "Certificates",
  certificate: "Certificate",
  progress: "Progress",
  journey: "My journey",
  settings: "Settings",
  search: "Search",
  student: "Student",
  compose: "New message",
  notifications: "Notifications",
  notification: "Notification",
  practise: "Practise",
  library: "Library",
  learn: "Learn",
  me: "Me",
};

/** "/notes/neuroscience" becomes "Notes: neuroscience". */
export function screenName(path: string): string {
  const parts = String(path || "")
    .split("?")[0]!
    .split("/")
    .filter((p) => p && !/^\(.*\)$/.test(p));
  const head = parts[0] ?? "";
  const name = NAMES[head] ?? (head ? head.charAt(0).toUpperCase() + head.slice(1).replace(/-/g, " ") : "Home");
  const rest = parts
    .slice(1)
    .map((p) => {
      try {
        return decodeURIComponent(p);
      } catch {
        return p;
      }
    })
    .join(" / ");
  return rest ? `${name}: ${rest}` : name;
}

function save(): void {
  try {
    void store.set(KEY, JSON.stringify(now)).catch(() => undefined);
  } catch {
    /* a breadcrumb must never break anything */
  }
}

export const crumb = {
  /** The record for this run (the error page shows it). */
  current: (): Crumb => now,
  /** The record from the last run, when that run closed itself. Set by `load()`. */
  previous: (): Crumb | null => previous,
  /** Call on every navigation. */
  screen(path: string): void {
    if (path === now.path && now.fg) return;
    // The last press stays: it is what led to this screen.
    now = { screen: screenName(path), path, action: now.action, at: Date.now(), fg: true };
    save();
  },
  /** Call on a press: saved before the next screen draws, so a crash there is still located. */
  action(label: string): void {
    const text = String(label ?? "").trim().slice(0, 80);
    if (!text) return;
    now = { ...now, action: text, at: Date.now(), fg: true };
    save();
  },
  /** The app went to the background (false) or came back (true). */
  foreground(fg: boolean): void {
    if (now.fg === fg) return;
    now = { ...now, fg, at: Date.now() };
    save();
  },
  /** Read the last run's record once, at start-up. */
  async load(): Promise<Crumb | null> {
    try {
      const raw = await store.get(KEY);
      const p = raw ? (JSON.parse(raw) as Partial<Crumb>) : null;
      previous = p && typeof p.screen === "string" && p.screen && p.fg === true ? { screen: p.screen, path: String(p.path ?? ""), action: typeof p.action === "string" ? p.action : null, at: Number(p.at) || 0, fg: true } : null;
    } catch {
      previous = null;
    }
    return previous;
  },
  /** Test hook. */
  reset(kv?: KeyValue): void {
    store = kv ?? prefs;
    now = EMPTY;
    previous = null;
  },
};

/** One line: "Notes: neuroscience (after: Read it)". */
export function describeCrumb(c: Crumb | null): string {
  if (!c || !c.screen) return "";
  return c.action ? `${c.screen} (after: ${c.action})` : c.screen;
}

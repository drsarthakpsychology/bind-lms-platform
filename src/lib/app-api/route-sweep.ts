/**
 * The app route sweep: every request the phone app (apps/mobile) makes in
 * live mode, checked against the real route files under
 * src/app/api/app/v1. Used by src/app/api/app/v1/route-sweep.test.ts (CI) and
 * scripts/app-route-probe.ts (read-only check of the live server).
 *
 * Calls written with a literal path (api.get("/me"), api.post(`/doubts/${id}/replies`, { body }))
 * are found by reading the app's source, so a new screen is checked with no
 * edit here. Calls whose path is built in a variable are listed in DYNAMIC.
 *
 * Node only (reads files). Never import this from a route or a page.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type AppCall = {
  method: Method;
  /** Path under /api/app/v1, with `:p` for every part the app fills in. */
  path: string;
  /** Query keys the app sends. */
  query: string[];
  /** Top-level body keys the app sends (object literals only; spreads and typed variables are skipped). */
  body: string[];
  /** Sent without a token (auth: false). */
  public: boolean;
  /** file:line in apps/mobile. */
  where: string;
};

const ROOT = path.resolve(import.meta.dirname, "../../..");
export const APP_DIR = path.join(ROOT, "apps/mobile");
export const ROUTES_DIR = path.join(ROOT, "src/app/api/app/v1");

/** The app's own paths built in a variable (the scanner cannot read them). */
export const DYNAMIC: AppCall[] = [
  // src/practise/board.tsx BOARDS
  ...["league", "quiz", "overall"].map((b) => dyn("GET", `/leaderboards/${b}`, "src/practise/board.tsx:13")),
  ...["rx", "mse", "comorbid"].map((g) => dyn("GET", `/leaderboards/games/${g}`, "src/practise/board.tsx:16")),
  // src/practise/prep/set.tsx: smart list, saved/wrong lists, one topic (?set=)
  dyn("GET", "/prep/smart", "src/practise/prep/set.tsx:79"),
  dyn("GET", "/prep/lists/saved", "src/practise/prep/set.tsx:79"),
  dyn("GET", "/prep/lists/wrong", "src/practise/prep/set.tsx:79"),
  { ...dyn("GET", "/prep/subjects/:p/topics/:p", "src/practise/prep/set.tsx:79"), query: ["set"] },
  // src/practise/prep/long.tsx: /prep/long[/subject[/topic[/id]]]
  dyn("GET", "/prep/long", "src/practise/prep/long.tsx:29"),
  dyn("GET", "/prep/long/:p", "src/practise/prep/long.tsx:29"),
  dyn("GET", "/prep/long/:p/:p", "src/practise/prep/long.tsx:29"),
  dyn("GET", "/prep/long/:p/:p/:p", "src/practise/prep/long.tsx:29"),
  // src/practise/api.ts sendRecord(kind): POST /practise/records/:kind
  dyn("POST", "/practise/records/:p", "src/practise/api.ts:120"),
];
function dyn(method: Method, p: string, where: string): AppCall {
  return { method, path: p, query: [], body: [], public: false, where };
}

/**
 * Routes the app already calls that the server does not have yet, with who is
 * building them. Allowed to be missing; once a file exists it is checked like
 * every other route. Keep this short: an entry is a screen that fails live.
 */
export const PENDING: { method: Method; path: string; why: string }[] = [
  // Admin screens (agent adminfull is adding these routes, round R2).
  { method: "GET", path: "/admin/students/:p/messages", why: "adminfull" },
  { method: "GET", path: "/admin/review/signoffs", why: "adminfull" },
  { method: "POST", path: "/admin/review/signoffs/:p", why: "adminfull" },
  { method: "GET", path: "/admin/cohorts", why: "adminfull (app falls back to /admin/home on not_found)" },
  { method: "GET", path: "/admin/cohorts/:p", why: "adminfull (app falls back to /admin/home + /admin/students on not_found)" },
  { method: "GET", path: "/admin/people/:p", why: "adminfull (app falls back to /admin/people on not_found)" },
  { method: "GET", path: "/admin/certificates/settings", why: "adminfull" },
  { method: "PUT", path: "/admin/certificates/settings", why: "adminfull" },
  { method: "GET", path: "/admin/push-preferences", why: "adminfull" },
  { method: "PUT", path: "/admin/push-preferences", why: "adminfull" },
  { method: "GET", path: "/admin/system", why: "adminfull" },
  { method: "POST", path: "/admin/system/support-keys", why: "adminfull" },
  { method: "POST", path: "/admin/system/support-keys/:p/rotate", why: "adminfull" },
  { method: "POST", path: "/admin/system/support-keys/:p/revoke", why: "adminfull" },
  { method: "POST", path: "/admin/system/legacy-key/revoke", why: "adminfull" },
];
/** Query keys the app sends that the server does not read yet. */
export const PENDING_QUERY: { path: string; key: string; why: string }[] = [{ path: "/admin/doubts", key: "student", why: "adminfull (a student's doubts on the admin profile)" }];

/* ------------------------------------------------------------ app source */

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "__tests__" || name === "mock" || name.startsWith(".")) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

/** Index just past the balanced group that opens at `i` (one of ( { [ < or a quote/backtick). */
function skipGroup(s: string, i: number): number {
  const open = s[i];
  if (open === '"' || open === "'") {
    let j = i + 1;
    while (j < s.length && s[j] !== open) j += s[j] === "\\" ? 2 : 1;
    return j + 1;
  }
  if (open === "`") {
    let j = i + 1;
    while (j < s.length && s[j] !== "`") {
      if (s[j] === "\\") j += 2;
      else if (s[j] === "$" && s[j + 1] === "{") j = skipGroup(s, j + 1);
      else j += 1;
    }
    return j + 1;
  }
  const close = ({ "(": ")", "{": "}", "[": "]", "<": ">" } as Record<string, string>)[open!];
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    const ch = s[j]!;
    if (ch === '"' || ch === "'" || ch === "`") {
      j = skipGroup(s, j) - 1;
      continue;
    }
    if (open === "<" && ch === "=" && s[j + 1] === ">") {
      j += 1; // an arrow inside a type argument
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close && --depth === 0) return j + 1;
  }
  return s.length;
}

/** A string or template literal as a route pattern: `${...}` becomes `:p`, the query part is dropped. */
function literalPath(lit: string): string {
  let out = "";
  const body = lit.slice(1, -1);
  for (let j = 0; j < body.length; j++) {
    if (lit[0] === "`" && body[j] === "$" && body[j + 1] === "{") {
      const end = skipGroup(body, j + 1);
      out += "\u0000";
      j = end - 1;
    } else out += body[j];
  }
  out = out.split("?")[0]!;
  return out.replace(/\u0000+/g, ":p").replace(/\/$/, "") || "/";
}

/** Top-level keys of an object literal (`{ a: 1, b, ...c }` gives a, b). */
export function topKeys(obj: string): string[] {
  const keys: string[] = [];
  const inner = obj.trim().slice(1, -1);
  let depth = 0;
  let start = 0;
  const parts: string[] = [];
  for (let j = 0; j < inner.length; j++) {
    const ch = inner[j]!;
    if (ch === '"' || ch === "'" || ch === "`") {
      j = skipGroup(inner, j) - 1;
      continue;
    }
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(inner.slice(start, j));
      start = j + 1;
    }
  }
  parts.push(inner.slice(start));
  for (const raw of parts) {
    const p = raw.trim();
    if (!p || p.startsWith("...")) continue;
    const m = /^["']?([A-Za-z_$][\w$]*)["']?\s*(:|$)/.exec(p);
    if (m) keys.push(m[1]!);
  }
  return keys;
}

/** The value of `key:` at the top level of an object literal, if it is itself an object literal. */
function objectProp(obj: string, key: string): string | null {
  const m = new RegExp(`[{,]\\s*${key}\\s*:\\s*\\{`).exec(obj);
  if (!m) return null;
  const at = m.index + m[0].length - 1;
  return obj.slice(at, skipGroup(obj, at));
}

const CALL_RE = /(^|[^\w.$])(api\.)?(get|post|put|patch|del)\s*(?=[<(])/g;
const METHOD: Record<string, Method> = { get: "GET", post: "POST", put: "PUT", patch: "PATCH", del: "DELETE" };

/** Every call with a literal path in one source file. */
export function scanSource(src: string, file: string): AppCall[] {
  // `get(...)` without `api.` counts only where the file wraps api.get in its own helper (src/admin/api.ts).
  const ownGet = /const get = \(path: string, query\?/.test(src);
  const calls: AppCall[] = [];
  for (const m of src.matchAll(CALL_RE)) {
    const viaApi = !!m[2];
    const verb = m[3]!;
    if (!viaApi && !(ownGet && verb === "get")) continue;
    let i = m.index! + m[0].length;
    if (src[i] === "<") i = skipGroup(src, i);
    if (src[i] !== "(") continue;
    i++;
    while (/\s/.test(src[i]!)) i++;
    const q = src[i];
    if (q !== '"' && q !== "'" && q !== "`") continue;
    const litEnd = skipGroup(src, i);
    const lit = src.slice(i, litEnd);
    if (lit[1] !== "/") continue;
    const args: string[] = [];
    let j = litEnd;
    for (let n = 0; n < 2; n++) {
      while (/\s/.test(src[j]!)) j++;
      if (src[j] !== ",") break;
      j++;
      while (/\s/.test(src[j]!)) j++;
      if (src[j] === "{") {
        const end = skipGroup(src, j);
        args.push(src.slice(j, end));
        j = end;
      } else {
        // not an object literal: skip to the next top-level comma or the closing paren
        let depth = 0;
        const start = j;
        while (j < src.length) {
          const ch = src[j]!;
          if (ch === '"' || ch === "'" || ch === "`") {
            j = skipGroup(src, j);
            continue;
          }
          if (ch === "(" || ch === "{" || ch === "[") depth++;
          else if (ch === ")" || ch === "}" || ch === "]") {
            if (depth === 0) break;
            depth--;
          } else if (ch === "," && depth === 0) break;
          j++;
        }
        args.push(`#${src.slice(start, j).trim()}`);
      }
    }
    const method = METHOD[verb]!;
    const hasBody = method === "POST" || method === "PUT" || method === "PATCH";
    const bodyArg = hasBody ? args[0] : undefined;
    const optsArg = hasBody ? args[1] : args[0];
    let query: string[] = [];
    if (!viaApi && optsArg && !optsArg.startsWith("#")) query = topKeys(optsArg);
    else if (optsArg && !optsArg.startsWith("#")) {
      const qo = objectProp(optsArg, "query");
      if (qo) query = topKeys(qo);
    }
    const isPublic = !!optsArg && /\bauth\s*:\s*false\b/.test(optsArg);
    const literalBody = bodyArg && !bodyArg.startsWith("#") ? bodyArg : null;
    const line = src.slice(0, m.index!).split("\n").length;
    calls.push({ method, path: literalPath(lit), query, body: literalBody ? topKeys(literalBody) : [], public: isPublic, where: `${file}:${line}` });
  }
  return calls;
}

/** Every call the app makes in live mode: the literal ones found in its source, plus DYNAMIC. */
export function appCalls(): AppCall[] {
  const files = [...walk(path.join(APP_DIR, "src")), ...(existsSync(path.join(APP_DIR, "app")) ? walk(path.join(APP_DIR, "app")) : [])];
  const found = files.flatMap((f) => scanSource(readFileSync(f, "utf8"), path.relative(APP_DIR, f)));
  return [...found, ...DYNAMIC];
}

/** Every POST /play/:game/:action the app makes with literal names. */
export function appPlays(): { game: string; action: string; args: number; where: string }[] {
  const out: { game: string; action: string; args: number; where: string }[] = [];
  for (const f of walk(path.join(APP_DIR, "src"))) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/\bplay\s*(?=[<(])/g)) {
      let i = m.index! + m[0].length;
      if (src[i] === "<") i = skipGroup(src, i);
      if (src[i] !== "(") continue;
      const call = src.slice(i, skipGroup(src, i));
      const lit = /^\(\s*"([a-z]+)"\s*,\s*"([a-zA-Z]+)"\s*(,|\))/.exec(call);
      if (!lit) continue;
      const rest = lit[3] === ")" ? "" : call.slice(lit[0].length, -1);
      out.push({ game: lit[1]!, action: lit[2]!, args: argCount(rest), where: `${path.relative(APP_DIR, f)}:${src.slice(0, m.index!).split("\n").length}` });
    }
  }
  return out;
}
/** Number of top-level comma-separated arguments in `a, b, { c }`. */
function argCount(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return topKeysRaw(t).length;
}
function topKeysRaw(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let j = 0; j < s.length; j++) {
    const ch = s[j]!;
    if (ch === '"' || ch === "'" || ch === "`") {
      j = skipGroup(s, j) - 1;
      continue;
    }
    if (ch === "(" || ch === "{" || ch === "[") depth++;
    else if (ch === ")" || ch === "}" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      parts.push(s.slice(start, j));
      start = j + 1;
    }
  }
  parts.push(s.slice(start));
  return parts.filter((p) => p.trim());
}

/* ---------------------------------------------------------- server side */

/**
 * The route file that answers a path, as Next.js picks it: a named folder
 * first, then a [param] folder. The root catch-all ([...path], the JSON 404)
 * is never a match here: a path that only it answers is a missing route.
 */
export function resolveRoute(p: string): string | null {
  const segs = p.split("/").filter(Boolean);
  const go = (dir: string, i: number): string | null => {
    if (i === segs.length) {
      const f = path.join(dir, "route.ts");
      return existsSync(f) ? f : null;
    }
    const seg = segs[i]!;
    const names = existsSync(dir) ? readdirSync(dir).filter((n) => statSync(path.join(dir, n)).isDirectory()) : [];
    if (seg !== ":p" && names.includes(seg)) {
      const hit = go(path.join(dir, seg), i + 1);
      if (hit) return hit;
    }
    for (const n of names) {
      if (/^\[[^.][^\]]*\]$/.test(n)) {
        const hit = go(path.join(dir, n), i + 1);
        if (hit) return hit;
      }
    }
    return null;
  };
  return go(ROUTES_DIR, 0);
}

export function exportsMethod(src: string, method: Method): boolean {
  return new RegExp(`export\\s+(const|async\\s+function|function)\\s+${method}\\b`).test(src) || new RegExp(`export\\s*\\{[^}]*\\b${method}\\b[^}]*\\}`).test(src);
}

/** The route's source plus the files it imports from src/lib/app-api and next to itself, where its schemas live. */
export function routeText(file: string): string {
  const src = readFileSync(file, "utf8");
  let text = src;
  for (const m of src.matchAll(/from\s+"(@\/lib\/[^"]+|\.{1,2}\/[^"]+)"/g)) {
    const spec = m[1]!;
    const base = spec.startsWith("@/") ? path.join(ROOT, "src", spec.slice(2)) : path.resolve(path.dirname(file), spec);
    for (const cand of [`${base}.ts`, path.join(base, "index.ts")]) {
      if (existsSync(cand)) {
        text += `\n${readFileSync(cand, "utf8")}`;
        break;
      }
    }
  }
  return text;
}

/** Whether the route reads this query key (its own query.get, or the shared page params). */
export function readsQuery(src: string, key: string): boolean {
  if ((key === "limit" || key === "cursor") && /pageParams\(\s*query/.test(src)) return true;
  return new RegExp(`query\\.get\\(\\s*"${key}"\\s*\\)`).test(src);
}

/** The route's auth level; a plain handler without appRoute is public (config, public home). */
export function routeAuth(src: string): string {
  if (!/\bappRoute\b/.test(src)) return "public";
  return /appRoute(?:<[^>]*>)?\(\s*\{\s*auth:\s*"([a-z]+)"/.exec(src)?.[1] ?? "unknown";
}

/** The game's action names in src/lib/app-api/play.ts, with how many args each takes. */
export function serverPlays(): Map<string, Map<string, number>> {
  const src = readFileSync(path.join(ROOT, "src/lib/app-api/play.ts"), "utf8");
  const out = new Map<string, Map<string, number>>();
  const start = src.indexOf("export const PLAY");
  const body = src.slice(start);
  for (const g of body.matchAll(/\n {2}([a-z]+): \{/g)) {
    const open = g.index! + g[0].length - 1;
    const block = body.slice(open, skipGroup(body, open));
    const acts = new Map<string, number>();
    for (const a of block.matchAll(/([a-zA-Z]+): a\([^,]+,\s*(\d+)/g)) acts.set(a[1]!, Number(a[2]));
    out.set(g[1]!, acts);
  }
  return out;
}

export const isPending = (c: { method: Method; path: string }) => PENDING.some((p) => p.method === c.method && p.path === c.path);

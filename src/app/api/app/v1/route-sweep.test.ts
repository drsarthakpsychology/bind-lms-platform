import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PENDING, PENDING_QUERY, appCalls, appPlays, exportsMethod, isPending, readsQuery, resolveRoute, routeAuth, routeText, scanSource, serverPlays, topKeys } from "@/lib/app-api/route-sweep";

/**
 * Every request the phone app makes in live mode must reach a real route:
 * the file exists for the path, it exports the method, it reads the query keys
 * the app sends and knows the body keys. A failure names the app's file:line.
 */
const calls = appCalls();
const show = (c: { method: string; path: string; where: string }) => `${c.method} ${c.path}  (${c.where})`;

describe("app route sweep: the scanner", () => {
  it("reads paths, query, body and auth from call sites", () => {
    const src = [
      'api.get<X<Y>>(`/doubts/${encodeURIComponent(id)}/replies`, { query: { mine: mine ? 1 : undefined, limit: 50 } });',
      'api.post<R>("/auth/sign-in", { email: e.trim(), password, device }, { auth: false });',
      "api.put(\"/study/marks\", body);",
      'api.del<U>(`/assignments/${a.id}/submission`);',
      'map.get("/not-a-call");',
    ].join("\n");
    const found = scanSource(src, "x.ts");
    expect(found.map((c) => `${c.method} ${c.path}`)).toEqual(["GET /doubts/:p/replies", "POST /auth/sign-in", "PUT /study/marks", "DELETE /assignments/:p/submission"]);
    expect(found[0]!.query).toEqual(["mine", "limit"]);
    expect(found[1]!.body).toEqual(["email", "password", "device"]);
    expect(found[1]!.public).toBe(true);
    expect(found[2]!.body).toEqual([]);
    expect(topKeys("{ a: 1, b, ...c, 'd': f(1, 2) }")).toEqual(["a", "b", "d"]);
  });

  it("finds the app's calls (a sanity floor, so a broken scanner cannot pass silently)", () => {
    expect(calls.length).toBeGreaterThan(100);
    expect(calls.some((c) => c.method === "POST" && c.path === "/auth/refresh")).toBe(false); // refresh is sent by the client itself
    expect(calls.some((c) => c.method === "GET" && c.path === "/me")).toBe(true);
    expect(calls.some((c) => c.method === "POST" && c.path === "/play/:p/:p")).toBe(true);
  });
});

describe("app route sweep: every call has a route", () => {
  it("the client's own refresh call has a route", () => {
    expect(resolveRoute("/auth/refresh")).not.toBeNull();
    expect(exportsMethod(readFileSync(resolveRoute("/auth/refresh")!, "utf8"), "POST")).toBe(true);
  });

  const unique = [...new Map(calls.map((c) => [`${c.method} ${c.path}`, c])).values()];
  it.each(unique.map((c) => [show(c), c] as const))("%s", (_name, c) => {
    const file = resolveRoute(c.path);
    if (!file) {
      expect(isPending(c), `no route file for ${show(c)}`).toBe(true);
      return;
    }
    const src = readFileSync(file, "utf8");
    if (!exportsMethod(src, c.method)) {
      expect(isPending(c), `${path.relative(process.cwd(), file)} does not export ${c.method} (${c.where})`).toBe(true);
    }
  });

  it("every query key the app sends is read by the route", () => {
    const problems: string[] = [];
    for (const c of calls) {
      const file = resolveRoute(c.path);
      if (!file || !c.query.length) continue;
      const src = readFileSync(file, "utf8");
      for (const k of c.query) {
        if (readsQuery(src, k)) continue;
        if (PENDING_QUERY.some((p) => p.path === c.path && p.key === k)) continue;
        problems.push(`${show(c)}: the route ignores ?${k}=`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("every body key the app sends is known to the route's schema", () => {
    const problems: string[] = [];
    for (const c of calls) {
      const file = resolveRoute(c.path);
      if (!file || !c.body.length) continue;
      const text = routeText(file);
      for (const k of c.body) if (!new RegExp(`\\b${k}\\b`).test(text)) problems.push(`${show(c)}: the route does not know body field "${k}"`);
    }
    expect(problems).toEqual([]);
  });

  it("calls sent without a token go to public routes, and signed-in calls never to public ones that need a user", () => {
    const problems: string[] = [];
    for (const c of calls) {
      const file = resolveRoute(c.path);
      if (!file) continue;
      const auth = routeAuth(readFileSync(file, "utf8"));
      if (c.public && auth !== "public") problems.push(`${show(c)} is sent without a token but the route needs auth "${auth}"`);
    }
    expect(problems).toEqual([]);
  });

  it("PENDING lists only calls the app really makes", () => {
    for (const p of PENDING) expect(calls.some((c) => c.method === p.method && c.path === p.path), `${p.method} ${p.path} is not called by the app any more`).toBe(true);
  });
});

describe("app route sweep: a path no route answers", () => {
  it("gets a JSON not_found for every method, never the website's HTML 404", async () => {
    const mod = await import("./[...path]/route");
    for (const m of ["GET", "POST", "PUT", "PATCH", "DELETE"] as const) {
      const res = mod[m]();
      expect(res.status).toBe(404);
      expect(res.headers.get("content-type")).toMatch(/json/);
      const json = (await res.json()) as { ok: boolean; error: { code: string } };
      expect(json.ok).toBe(false);
      expect(json.error.code).toBe("not_found");
    }
  });
  it("is never picked for a path a real route answers", () => {
    expect(resolveRoute("/study")).toBeNull();
    expect(resolveRoute("/study/modules")).toMatch(/study\/modules\/route\.ts$/);
  });
});

describe("app route sweep: Practise moves", () => {
  const server = serverPlays();
  it("reads the server's games", () => expect(server.size).toBeGreaterThan(8));
  it.each(appPlays().map((p) => [`${p.game}.${p.action} (${p.where})`, p] as const))("%s", (_n, p) => {
    const acts = server.get(p.game);
    expect(acts, `no game "${p.game}" in src/lib/app-api/play.ts`).toBeDefined();
    expect(acts!.has(p.action), `no action "${p.action}" for game "${p.game}"`).toBe(true);
    expect(p.args, `${p.game}.${p.action} takes at most ${acts!.get(p.action)} args`).toBeLessThanOrEqual(acts!.get(p.action)!);
  });
});

describe("app route sweep: params the server checks by value", () => {
  it.each([
    ["leaderboards/[board]", ["league", "quiz", "overall"]],
    ["prep/lists/[list]", ["saved", "wrong"]],
  ])("%s accepts what the app sends", (dir, values) => {
    const src = readFileSync(path.join(import.meta.dirname, dir, "route.ts"), "utf8");
    for (const v of values) expect(src).toContain(`"${v}"`);
  });
  it("leaderboards/games accepts rx, mse and comorbid", () => {
    const src = readFileSync(path.join(import.meta.dirname, "../../../../lib/app-api/boards.ts"), "utf8");
    expect(src).toMatch(/GAME_BOARDS = \["rx", "mse", "comorbid"\]/);
  });
});

describe("app route sweep: the clinic routes (docs/app/API_CONTRACT_CLINIC.md)", () => {
  const doc = readFileSync(path.join(import.meta.dirname, "../../../../../docs/app/API_CONTRACT_CLINIC.md"), "utf8");
  const listed = [...doc.matchAll(/^\| (GET|POST|PUT|PATCH|DELETE) \| `([^`]+)` \|/gm)].map((m) => ({ method: m[1] as "GET" | "POST" | "PUT" | "PATCH" | "DELETE", path: m[2]!.replace(/:[a-z]+/gi, ":p") }));
  it("lists the clinic routes", () => expect(listed.length).toBeGreaterThan(40));
  it.each(listed.map((c) => [`${c.method} ${c.path}`, c] as const))("%s has a route", (_n, c) => {
    const file = resolveRoute(c.path);
    expect(file, `no route file for ${c.method} ${c.path}`).not.toBeNull();
    const src = readFileSync(file!, "utf8");
    expect(exportsMethod(src, c.method), `${c.method} not exported`).toBe(true);
    // Each method's own auth (a file can hold an admin GET and a Super Admin write).
    const auth = new RegExp(`export const ${c.method} = appRoute(?:<[^>]*>)?\\(\\{ auth: "([a-zA-Z]+)"`).exec(src)?.[1];
    expect(auth).toBe(c.path.startsWith("/clinic/admin/") ? (c.method === "GET" ? "admin" : "superAdmin") : "bearer");
  });
});

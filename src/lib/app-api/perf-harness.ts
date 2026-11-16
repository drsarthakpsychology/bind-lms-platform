/**
 * Test-only: a stand-in Supabase server for measuring the app API. It answers
 * real supabase-js requests (Auth, PostgREST, RPC, Storage) through a fake
 * global fetch, waits `delayMs` per request like a network round trip, and
 * records every request so a test can count queries and the longest chain of
 * requests that had to wait for each other (the serial depth).
 *
 * Used by src/app/api/app/v1/perf.test.ts. Never import this from a route.
 */

export type Hit = { method: string; path: string; table: string; start: number; end: number; depth: number };

export type Harness = {
  hits: Hit[];
  reset: () => void;
  /** Longest chain of requests where each began after the previous one answered. */
  serialDepth: () => number;
  restore: () => void;
  /** The user the fake Auth server answers for any token. */
  setUser: (u: { id: string; email: string }) => void;
};

type Rows = Record<string, Record<string, unknown>[]>;

export function installFakeSupabase(opts: { url: string; delayMs: number; user: { id: string; email: string }; rows: Rows }): Harness {
  const real = globalThis.fetch;
  const hits: Hit[] = [];
  let user = opts.user;
  // Every request takes the same time, so the chain a request belongs to is
  // one more than the deepest request that had already answered when it began.
  const depthAt = (t: number) => hits.filter((h) => h.end <= t).reduce((m, h) => Math.max(m, h.depth), 0);

  const fake = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const href = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!href.startsWith(opts.url)) return real(input, init);
    const u = new URL(href);
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    const table = u.pathname.replace(/^\/(rest|auth|storage)\/v1\//, "").split("/")[0] ?? "";
    const start = performance.now();
    const hit: Hit = { method, path: u.pathname, table, start, end: Infinity, depth: depthAt(start) + 1 };
    hits.push(hit);
    await new Promise((r) => setTimeout(r, opts.delayMs));
    hit.end = performance.now();

    if (u.pathname === "/auth/v1/user") return Response.json(user);
    if (u.pathname.startsWith("/auth/")) return Response.json({});
    if (u.pathname.startsWith("/storage/")) return Response.json({ signedURL: "/object/sign/x?token=t", signedUrl: `${opts.url}/x` });
    if (u.pathname.startsWith("/rest/v1/rpc/")) return Response.json(null);

    let rows = opts.rows[table] ?? [];
    // eq filters on the columns the guard reads (id, user_id), so the profile and phone rows match.
    for (const col of ["id", "user_id"]) {
      const f = u.searchParams.get(col);
      if (f?.startsWith("eq.")) rows = rows.filter((r) => String(r[col]) === f.slice(3));
    }
    const accept = headers.get("accept") ?? "";
    const range = `0-${Math.max(rows.length - 1, 0)}/${rows.length}`;
    if (method === "HEAD") return new Response(null, { status: 200, headers: { "content-range": `*/${rows.length}` } });
    if (method !== "GET") return new Response(method === "POST" ? JSON.stringify(rows.slice(0, 1)) : null, { status: method === "POST" ? 201 : 204, headers: { "content-type": "application/json" } });
    if (accept.includes("vnd.pgrst.object")) {
      if (!rows.length) return Response.json({ code: "PGRST116", message: "no rows", details: null, hint: null }, { status: 406 });
      return Response.json(rows[0], { headers: { "content-range": range } });
    }
    return Response.json(rows, { headers: { "content-range": range } });
  };
  globalThis.fetch = fake as typeof fetch;

  return {
    hits,
    reset: () => void hits.splice(0),
    serialDepth: () => hits.reduce((m, h) => Math.max(m, h.depth), 0),
    setUser: (u) => {
      user = u;
    },
    restore: () => {
      globalThis.fetch = real;
    },
  };
}

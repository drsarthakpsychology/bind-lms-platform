/**
 * A small in-memory stand-in for the Supabase query builder, for the test
 * mode tests only. Supports the filters those code paths use: eq, neq, in,
 * is, contains, or("a.eq.x,b.eq.y"), gte, lte, order, limit, range, select,
 * single, maybeSingle, insert, upsert, update, delete. Not a full emulator.
 */
type Row = Record<string, unknown>;
type Filter = (r: Row) => boolean;

export type FakeDb = {
  tables: Record<string, Row[]>;
  inserted: Record<string, Row[]>;
  from: (table: string) => unknown;
  rpc: () => Promise<{ data: null; error: { message: string } }>;
  auth: Record<string, unknown>;
};

export function fakeDb(tables: Record<string, Row[]>): FakeDb {
  const inserted: Record<string, Row[]> = {};
  const db: FakeDb = {
    tables,
    inserted,
    from(table: string) {
      const filters: Filter[] = [];
      let op: "select" | "insert" | "update" | "delete" | "upsert" = "select";
      let payload: Row[] = [];
      let patch: Row = {};
      let lim: number | null = null;
      let one: "single" | "maybe" | null = null;
      const run = () => {
        const all = (tables[table] ??= []);
        if (op === "insert" || op === "upsert") {
          (inserted[table] ??= []).push(...payload);
          all.push(...payload);
          return { data: payload, error: null };
        }
        let rows = all.filter((r) => filters.every((f) => f(r)));
        if (op === "update") {
          rows.forEach((r) => Object.assign(r, patch));
          return { data: rows, error: null };
        }
        if (op === "delete") {
          tables[table] = all.filter((r) => !rows.includes(r));
          return { data: rows, error: null, count: rows.length };
        }
        if (lim !== null) rows = rows.slice(0, lim);
        if (one) return { data: rows[0] ?? null, error: one === "single" && !rows[0] ? { message: "none" } : null };
        return { data: rows, error: null, count: rows.length };
      };
      const q: Record<string, unknown> = {
        select: () => q,
        eq: (c: string, v: unknown) => (filters.push((r) => r[c] === v), q),
        neq: (c: string, v: unknown) => (filters.push((r) => r[c] !== v), q),
        in: (c: string, v: unknown[]) => (filters.push((r) => v.includes(r[c])), q),
        is: (c: string, v: unknown) => (filters.push((r) => (r[c] ?? null) === v), q),
        not: () => q,
        gte: (c: string, v: string) => (filters.push((r) => String(r[c]) >= v), q),
        lte: (c: string, v: string) => (filters.push((r) => String(r[c]) <= v), q),
        contains: (c: string, v: unknown[]) => (filters.push((r) => Array.isArray(r[c]) && v.every((x) => (r[c] as unknown[]).includes(x))), q),
        or: (expr: string) => {
          const parts = expr.split(",").map((p) => p.split(".eq."));
          filters.push((r) => parts.some(([c, v]) => String(r[c!]) === v));
          return q;
        },
        order: () => q,
        limit: (n: number) => ((lim = n), q),
        range: () => q,
        single: () => ((one = "single"), q),
        maybeSingle: () => ((one = "maybe"), q),
        insert: (rows: Row | Row[]) => ((op = "insert"), (payload = Array.isArray(rows) ? rows : [rows]), q),
        upsert: (rows: Row | Row[]) => ((op = "upsert"), (payload = Array.isArray(rows) ? rows : [rows]), q),
        update: (p: Row) => ((op = "update"), (patch = p), q),
        delete: () => ((op = "delete"), q),
        then: (ok: (v: unknown) => unknown, bad?: (e: unknown) => unknown) => Promise.resolve(run()).then(ok, bad),
      };
      return q;
    },
    rpc: async () => ({ data: null, error: { message: "no rpc" } }),
    auth: {},
  };
  return db;
}

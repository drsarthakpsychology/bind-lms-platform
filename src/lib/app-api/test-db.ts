/**
 * A small in-memory stand-in for the Supabase client, for the app API tests.
 * It knows only the calls that code makes. `missing` imitates a database where
 * a table has not been created yet (the app_devices step not run).
 */
type Row = Record<string, unknown>;
type Err = { code?: string; message: string } | null;
type Result = { data: unknown; error: Err; count?: number | null };

export type TestDb = {
  tables: Record<string, Row[]>;
  missing: Set<string>;
  /** Every write, for assertions. */
  log: { table: string; op: string; payload: unknown }[];
  from: (table: string) => Query;
};

class Query implements PromiseLike<Result> {
  private filters: Array<(r: Row) => boolean> = [];
  private op: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: Row | Row[] | null = null;
  private conflict: string[] = [];
  private one: "single" | "maybe" | null = null;
  private max: number | null = null;
  private skip = 0;
  private sorts: { col: string; asc: boolean }[] = [];
  private head = false;
  private wantCount = false;

  constructor(
    private db: TestDb,
    private table: string,
  ) {}

  select(...args: [cols?: string, opts?: { count?: string; head?: boolean }]) {
    const opts = args[1] ?? {};
    if (this.op === "select") {
      this.head = Boolean(opts.head);
      this.wantCount = Boolean(opts.count);
    }
    return this;
  }
  insert(payload: Row | Row[]) {
    this.op = "insert";
    this.payload = payload;
    return this;
  }
  update(payload: Row) {
    this.op = "update";
    this.payload = payload;
    return this;
  }
  upsert(payload: Row | Row[], opts: { onConflict?: string } = {}) {
    this.op = "upsert";
    this.payload = payload;
    this.conflict = (opts.onConflict ?? "id").split(",").map((s) => s.trim());
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  eq(col: string, v: unknown) {
    this.filters.push((r) => r[col] === v);
    return this;
  }
  neq(col: string, v: unknown) {
    this.filters.push((r) => r[col] !== v);
    return this;
  }
  in(col: string, vs: unknown[]) {
    this.filters.push((r) => vs.includes(r[col]));
    return this;
  }
  is(col: string, v: unknown) {
    this.filters.push((r) => (r[col] ?? null) === v);
    return this;
  }
  not(col: string, _op: string, v: unknown) {
    this.filters.push((r) => (r[col] ?? null) !== v);
    return this;
  }
  gte(col: string, v: string) {
    this.filters.push((r) => String(r[col] ?? "") >= v);
    return this;
  }
  lt(col: string, v: string) {
    this.filters.push((r) => String(r[col] ?? "") < v);
    return this;
  }
  order(col: string, opts: { ascending?: boolean } = {}) {
    this.sorts.push({ col, asc: opts.ascending !== false });
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  range(from: number, to: number) {
    this.skip = from;
    this.max = to - from + 1;
    return this;
  }
  single() {
    this.one = "single";
    return this;
  }
  maybeSingle() {
    this.one = "maybe";
    return this;
  }

  private run(): Result {
    if (this.db.missing.has(this.table)) return { data: null, error: { code: "PGRST205", message: `Could not find the table 'public.${this.table}' in the schema cache` } };
    const rows = (this.db.tables[this.table] ??= []);
    const match = (r: Row) => this.filters.every((f) => f(r));
    let out: Row[] = [];
    if (this.op === "select") out = rows.filter(match);
    else if (this.op === "insert") {
      const list = (Array.isArray(this.payload) ? this.payload : [this.payload!]).map((p) => ({ id: p.id ?? `id-${rows.length + Math.random()}`, created_at: new Date().toISOString(), ...p }));
      rows.push(...list);
      out = list;
      this.db.log.push({ table: this.table, op: "insert", payload: this.payload });
    } else if (this.op === "update") {
      out = rows.filter(match);
      for (const r of out) Object.assign(r, this.payload);
      this.db.log.push({ table: this.table, op: "update", payload: this.payload });
    } else if (this.op === "upsert") {
      for (const p of Array.isArray(this.payload) ? this.payload : [this.payload!]) {
        const hit = rows.find((r) => this.conflict.every((c) => r[c] === p[c]));
        if (hit) {
          Object.assign(hit, p);
          out.push(hit);
        } else {
          const row = { id: p.id ?? `id-${rows.length + 1}`, ...p };
          rows.push(row);
          out.push(row);
        }
      }
      this.db.log.push({ table: this.table, op: "upsert", payload: this.payload });
    } else if (this.op === "delete") {
      out = rows.filter(match);
      this.db.tables[this.table] = rows.filter((r) => !match(r));
      this.db.log.push({ table: this.table, op: "delete", payload: null });
    }
    const count = out.length;
    for (const s of [...this.sorts].reverse()) {
      out = [...out].sort((a, b) => String(a[s.col] ?? "").localeCompare(String(b[s.col] ?? "")) * (s.asc ? 1 : -1));
    }
    if (this.skip) out = out.slice(this.skip);
    if (this.max !== null) out = out.slice(0, this.max);
    if (this.head) return { data: null, error: null, count };
    if (this.one) {
      if (this.one === "single" && out.length !== 1) return { data: null, error: { code: "PGRST116", message: "no rows" } };
      return { data: out[0] ?? null, error: null };
    }
    return { data: out, error: null, ...(this.wantCount ? { count } : {}) };
  }

  then<A = Result, B = never>(ok?: ((v: Result) => A | PromiseLike<A>) | null, bad?: ((e: unknown) => B | PromiseLike<B>) | null): PromiseLike<A | B> {
    return Promise.resolve(this.run()).then(ok, bad);
  }
}

export function makeTestDb(tables: Record<string, Row[]> = {}, missing: string[] = []): TestDb {
  const db: TestDb = { tables, missing: new Set(missing), log: [], from: (t) => new Query(db, t) };
  return db;
}

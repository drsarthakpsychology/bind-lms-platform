/**
 * A small in-memory stand-in for the Supabase client, for tests of the
 * certificate studio's server code. It knows only the calls that code makes.
 * `missingColumns` and `missingTables` imitate a database where
 * 2026_11_14_certificate_studio.sql has not been pasted yet.
 */
type Row = Record<string, unknown>;
type Result = { data: unknown; error: { message: string } | null; count?: number | null };

export type FakeDb = {
  tables: Record<string, Row[]>;
  missingColumns: Record<string, string[]>;
  missingTables: string[];
  from: (table: string) => Query;
};

class Query implements PromiseLike<Result> {
  private filters: Array<(r: Row) => boolean> = [];
  private op: "select" | "insert" | "update" = "select";
  private payload: Row | Row[] | null = null;
  private cols = "*";
  private head = false;
  private wantCount = false;
  private one: "single" | "maybe" | null = null;
  private max: number | null = null;
  private sort: { col: string; asc: boolean } | null = null;
  private returning = false;

  constructor(private db: FakeDb, private table: string) {}

  select(cols = "*", opts: { count?: string; head?: boolean } = {}) {
    if (this.op === "select") {
      this.cols = cols;
      this.head = Boolean(opts.head);
      this.wantCount = Boolean(opts.count);
    } else {
      this.returning = true;
      this.cols = cols;
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
  order(col: string, opts: { ascending?: boolean } = {}) {
    this.sort = { col, asc: opts.ascending !== false };
    return this;
  }
  limit(n: number) {
    this.max = n;
    return this;
  }
  maybeSingle() {
    this.one = "maybe";
    return this;
  }
  single() {
    this.one = "single";
    return this;
  }

  private missing(names: string[]): string | null {
    const gone = this.db.missingColumns[this.table] ?? [];
    return names.find((n) => gone.includes(n)) ?? null;
  }

  private run(): Result {
    if (this.db.missingTables.includes(this.table)) return { data: null, error: { message: `relation "public.${this.table}" does not exist` } };
    const rows = (this.db.tables[this.table] ??= []);
    if (this.op === "insert") {
      const list = (Array.isArray(this.payload) ? this.payload : [this.payload!]).map((r) => ({ ...r }));
      for (const r of list) {
        const bad = this.missing(Object.keys(r));
        if (bad) return { data: null, error: { message: `column "${bad}" of relation "${this.table}" does not exist` } };
        if (this.table === "credentials" && rows.some((x) => x.credential_id === r.credential_id)) return { data: null, error: { message: "duplicate key value violates unique constraint" } };
        if (this.table === "certificate_email_queue" && rows.some((x) => x.credential_id === r.credential_id && x.status === "queued")) return { data: null, error: { message: "duplicate key value violates unique constraint" } };
      }
      for (const r of list) {
        if (!r.id) r.id = crypto.randomUUID();
        if (!r.created_at) r.created_at = new Date().toISOString();
        if (this.table === "certificate_email_queue") {
          r.status ??= "queued";
          r.attempts ??= 0;
        }
        rows.push(r);
      }
      return { data: this.returning ? (this.one ? list[0] : list) : null, error: null };
    }
    if (this.op === "update") {
      const bad = this.missing(Object.keys(this.payload as Row));
      if (bad) return { data: null, error: { message: `column "${bad}" of relation "${this.table}" does not exist` } };
      const hit = rows.filter((r) => this.filters.every((f) => f(r)));
      for (const r of hit) Object.assign(r, this.payload);
      return { data: this.returning ? hit : null, error: null };
    }
    const names = this.cols.replace(/\w+\([^)]*\)/g, "").split(",").map((c) => c.trim()).filter((c) => c && c !== "*");
    const bad = this.missing(names);
    if (bad) return { data: null, error: { message: `column ${this.table}.${bad} does not exist` } };
    let hit = rows.filter((r) => this.filters.every((f) => f(r)));
    if (this.sort) {
      const { col, asc } = this.sort;
      hit = [...hit].sort((a, b) => (String(a[col] ?? "") < String(b[col] ?? "") ? -1 : 1) * (asc ? 1 : -1));
    }
    const count = hit.length;
    if (this.max !== null) hit = hit.slice(0, this.max);
    if (this.head) return { data: null, error: null, count };
    const joined = hit.map((r) => {
      if (this.table === "credentials" && /achievements\(/.test(this.cols)) {
        const a = (this.db.tables.achievements ?? []).find((x) => x.id === r.achievement_id) ?? null;
        return { ...r, achievements: a };
      }
      return { ...r };
    });
    if (this.one) return { data: joined[0] ?? null, error: this.one === "single" && !joined[0] ? { message: "no rows" } : null };
    return { data: joined, error: null, count: this.wantCount ? count : null };
  }

  then<A = Result, B = never>(ok?: ((v: Result) => A | PromiseLike<A>) | null, bad?: ((e: unknown) => B | PromiseLike<B>) | null): PromiseLike<A | B> {
    return Promise.resolve().then(() => this.run()).then(ok, bad);
  }
}

export function fakeDb(tables: Record<string, Row[]> = {}, opts: { missingColumns?: Record<string, string[]>; missingTables?: string[] } = {}): FakeDb {
  const db: FakeDb = {
    tables,
    missingColumns: opts.missingColumns ?? {},
    missingTables: opts.missingTables ?? [],
    from: (table: string) => new Query(db, table),
  };
  return db;
}

/** The columns and table the studio's database step adds. */
export const BEFORE_DB_STEP = {
  missingColumns: { credentials: ["kind", "title", "wording", "expires_at", "signatories", "course_id", "course_label", "module_label", "cohort_id", "batch_id", "replaces", "replaced_by", "email_status"] },
  missingTables: ["certificate_email_queue"],
};

/**
 * Minimal type declaration for the `pg` module, which ships no types of its
 * own. The migration script destructures `{ data }` and `{ rows }` from query
 * results and calls `.length` on them; both are surfaced here so `next build`
 * type-checks cleanly.
 */
declare module "pg" {
  export interface QueryResult {
    rows: unknown[];
    data: unknown[];
  }
  export class Client {
    constructor(config?: Record<string, unknown>);
    connect(): Promise<void>;
    query(text: string, values?: unknown[]): Promise<QueryResult>;
    end(): Promise<void>;
  }
}

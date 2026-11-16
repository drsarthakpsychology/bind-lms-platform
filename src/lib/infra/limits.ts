/** Usage limits and their words, shared by /admin/infra and the app's GET /admin/system. Pure. */
export const SUPABASE_DB_LIMIT_BYTES = 500 * 1024 * 1024; // 500 MB free
export const WARN_AT = 0.7;

export function fmtBytes(n: number): string {
  if (n >= 1024 * 1024 * 1024) return `${(n / 1024 ** 3).toFixed(2)} GB`;
  if (n >= 1024 * 1024) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

export function pct(n: number, limit: number): number {
  if (!limit) return 0;
  return Math.round((n / limit) * 100);
}

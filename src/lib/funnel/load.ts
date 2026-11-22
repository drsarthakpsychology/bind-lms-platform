import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildReport, type FunnelReport, type SummaryRow } from "./rules";

export interface FunnelData {
  /** False until 2026_11_22_funnel.sql has run (or the database did not answer). */
  ready: boolean;
  report: FunnelReport;
  referrers: { host: string; visits: number }[];
}

/** The last `days` days of request-path counts, counted in the database. */
export async function loadFunnel(admin: SupabaseClient, days = 30): Promise<FunnelData> {
  const signal = () => AbortSignal.timeout(6000);
  const [summary, steps, refs] = await Promise.all([
    admin.rpc("funnel_summary", { p_days: days }).abortSignal(signal()),
    admin.rpc("funnel_steps", { p_days: days }).abortSignal(signal()),
    admin.rpc("funnel_referrers", { p_days: days }).abortSignal(signal()),
  ]).catch(() => [null, null, null] as const);
  if (!summary || summary.error || !Array.isArray(summary.data)) {
    return { ready: false, report: buildReport([]), referrers: [] };
  }
  const rows = (summary.data as Record<string, unknown>[]).map(
    (r): SummaryRow => ({
      event: String(r.event ?? ""),
      path: String(r.path ?? ""),
      detail: String(r.detail ?? ""),
      events: Number(r.events ?? 0),
      visits: Number(r.visits ?? 0),
    }),
  );
  const stepVisits =
    steps && !steps.error && Array.isArray(steps.data)
      ? Object.fromEntries((steps.data as Record<string, unknown>[]).map((r) => [String(r.event), Number(r.visits ?? 0)]))
      : null;
  const referrers =
    refs && !refs.error && Array.isArray(refs.data)
      ? (refs.data as Record<string, unknown>[]).map((r) => ({ host: String(r.ref_host ?? ""), visits: Number(r.visits ?? 0) }))
      : [];
  return { ready: true, report: buildReport(rows, stepVisits), referrers };
}

import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { dropPushTokens, tableMissing } from "./devices";

/**
 * Expo push receipts. Sending a push only says "Expo took it" (a ticket).
 * Whether Google or Apple delivered it is known about 15 minutes later (the
 * receipt). The tickets are kept in app_push_tickets
 * (supabase/migrations_pending/2026_11_22_reminders.sql) and checked by the
 * cron every 10 minutes:
 *   - DeviceNotRegistered: the app was removed or signed out, so the token is cleared;
 *   - InvalidCredentials: the Firebase key is not uploaded to expo.dev (owner step);
 *   - other errors are logged.
 * Before the database step nothing is kept and nothing is checked.
 */
export const RECEIPTS_URL = "https://exp.host/--/api/v2/push/getReceipts";
/** Expo answers receipts after about 15 minutes and keeps them for a day. */
export const WAIT_MS = 15 * 60_000;
export const KEEP_MS = 24 * 3_600_000;
const BATCH = 300;

export type Ticket = { ticketId: string; token: string; userId: string };
type Db = ReturnType<typeof createAdminClient>;
type Fetch = typeof fetch;

function admin(): Db | null {
  try {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null;
  } catch {
    return null;
  }
}

/** Keep the tickets of one send. Never throws. */
export async function keepTickets(tickets: readonly Ticket[], given?: Db | null, now = Date.now()): Promise<void> {
  if (!tickets.length) return;
  const db = given === undefined ? admin() : given;
  if (!db) return;
  try {
    const at = new Date(now).toISOString();
    const { error } = await db.from("app_push_tickets").insert(tickets.slice(0, 1000).map((t) => ({ ticket_id: t.ticketId, token: t.token, user_id: t.userId, created_at: at })));
    if (error && !tableMissing(error) && error.code !== "PGRST205") console.warn("push tickets not kept:", error.code, error.message);
  } catch {
    /* receipts are a nice-to-have */
  }
}

export type ReceiptReport = { ready: boolean; checked: number; delivered: number; dead: number; failed: number; errors: Record<string, number> };

/** Pure: what the receipts say. */
export function readReceipts(
  tickets: readonly Ticket[],
  receipts: Record<string, { status?: string; message?: string; details?: { error?: string } } | undefined>,
): { done: string[]; deadTokens: string[]; delivered: number; failed: number; errors: Record<string, number> } {
  const done: string[] = [];
  const deadTokens: string[] = [];
  const errors: Record<string, number> = {};
  let delivered = 0;
  let failed = 0;
  for (const t of tickets) {
    const r = receipts[t.ticketId];
    if (!r) continue; // not ready yet
    done.push(t.ticketId);
    if (r.status === "ok") {
      delivered++;
      continue;
    }
    failed++;
    const kind = r.details?.error ?? "Unknown";
    errors[kind] = (errors[kind] ?? 0) + 1;
    if (kind === "DeviceNotRegistered") deadTokens.push(t.token);
  }
  return { done, deadTokens: [...new Set(deadTokens)], delivered, failed, errors };
}

/** Check the receipts of tickets older than 15 minutes; clear dead tokens. Never throws. */
export async function checkReceipts(opts: { db?: Db | null; fetchImpl?: Fetch; now?: number } = {}): Promise<ReceiptReport> {
  const empty: ReceiptReport = { ready: false, checked: 0, delivered: 0, dead: 0, failed: 0, errors: {} };
  const db = opts.db === undefined ? admin() : opts.db;
  if (!db) return empty;
  const now = opts.now ?? Date.now();
  const f = opts.fetchImpl ?? fetch;
  try {
    const { data, error } = await db
      .from("app_push_tickets")
      .select("ticket_id, token, user_id, created_at")
      .lt("created_at", new Date(now - WAIT_MS).toISOString())
      .order("created_at", { ascending: true })
      .limit(BATCH * 3);
    if (error) return empty;
    const tickets = ((data ?? []) as { ticket_id: string; token: string; user_id: string }[]).map((r) => ({ ticketId: r.ticket_id, token: r.token, userId: r.user_id }));
    const report: ReceiptReport = { ready: true, checked: 0, delivered: 0, dead: 0, failed: 0, errors: {} };
    for (let i = 0; i < tickets.length; i += BATCH) {
      const part = tickets.slice(i, i + BATCH);
      const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
      if (process.env.EXPO_ACCESS_TOKEN) headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
      const res = await f(RECEIPTS_URL, { method: "POST", headers, body: JSON.stringify({ ids: part.map((t) => t.ticketId) }), signal: AbortSignal.timeout(8000) }).catch(() => null);
      if (!res || !res.ok) continue;
      const json = (await res.json().catch(() => null)) as { data?: Record<string, { status?: string; details?: { error?: string } }> } | null;
      const r = readReceipts(part, json?.data ?? {});
      report.checked += r.done.length;
      report.delivered += r.delivered;
      report.failed += r.failed;
      report.dead += r.deadTokens.length;
      for (const [k, v] of Object.entries(r.errors)) report.errors[k] = (report.errors[k] ?? 0) + v;
      if (r.deadTokens.length) await dropPushTokens(r.deadTokens);
      if (r.done.length) await db.from("app_push_tickets").delete().in("ticket_id", r.done);
    }
    // Expo forgets receipts after a day: tickets older than that will never be answered.
    await db.from("app_push_tickets").delete().lt("created_at", new Date(now - KEEP_MS).toISOString());
    if (report.errors.InvalidCredentials) console.error("push: Expo says the Firebase key is missing or wrong (InvalidCredentials). Upload it on expo.dev (scratchpad push steps).");
    if (report.failed) console.warn("push receipts:", JSON.stringify(report.errors));
    return report;
  } catch (e) {
    console.warn("push receipts check failed:", e instanceof Error ? e.message : e);
    return empty;
  }
}

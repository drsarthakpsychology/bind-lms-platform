import "server-only";
import { after } from "next/server";
import { activePushTargets, dropPushTokens } from "./devices";
import { loadPrefsMany, type PushKind } from "./prefs";
import { toAppTarget } from "./target";
import type { PushData } from "./contract";

/**
 * Phone push for bell notifications, through the Expo push service
 * (https://exp.host/--/api/v2/push/send). Called right after every place
 * that writes a bell row (admin messages, nudges, doubts, achievements,
 * certificates).
 *
 * It never blocks and never fails the notification: it runs after the
 * response (next/server `after`) where there is one, swallows every error,
 * and does nothing before the app_devices database step (no phones known).
 * A student gets push only on their active phone, only when their
 * preferences allow that kind. Expo's "DeviceNotRegistered" answers clear
 * the dead token.
 */
export type BellRow = { id?: string | null; user_id: string; type?: string | null; title: string; body?: string | null; href?: string | null };

const EXPO_URL = "https://exp.host/--/api/v2/push/send";
const CHUNK = 100;

export type ExpoMessage = { to: string; title: string; body: string; sound: "default"; data: PushData; channelId: string; priority: "high" };

/** The messages to send, after the preference filter. Pure apart from its inputs. */
export function buildMessages(
  rows: readonly BellRow[],
  kind: PushKind,
  targets: readonly { userId: string; token: string }[],
  prefs: ReadonlyMap<string, { push: boolean; messages: boolean; doubtReplies: boolean; achievements: boolean }>,
  extra?: Partial<PushData>,
): ExpoMessage[] {
  const byUser = new Map<string, string[]>();
  for (const t of targets) byUser.set(t.userId, [...(byUser.get(t.userId) ?? []), t.token]);
  const out: ExpoMessage[] = [];
  for (const r of rows) {
    const p = prefs.get(r.user_id);
    // Reminders have their own switches (checked by the reminder runner); here only the master switch.
    if (p && (!p.push || (kind !== "reminders" && !p[kind]))) continue;
    const href = r.href ?? (r.id ? `/notifications/${r.id}` : "/notifications");
    for (const to of byUser.get(r.user_id) ?? []) {
      out.push({
        to,
        title: r.title.slice(0, 140),
        body: String(r.body ?? "").slice(0, 300),
        sound: "default",
        priority: "high",
        channelId: kind === "achievements" ? "achievements" : kind === "reminders" ? "reminders" : "messages",
        data: { notificationId: r.id ?? "", type: r.type ?? "message", target: toAppTarget(href), ...extra },
      });
    }
  }
  return out;
}

type Fetch = typeof fetch;

/** Send now. Answers how many were accepted. Never throws. */
export async function sendPush(rows: readonly BellRow[], kind: PushKind, opts: { fetchImpl?: Fetch; extra?: Partial<PushData> } = {}): Promise<number> {
  try {
    if (!rows.length || process.env.APP_PUSH_DISABLED === "1") return 0;
    const users = [...new Set(rows.map((r) => r.user_id))];
    const targets = await activePushTargets(users);
    if (!targets.length) return 0;
    const prefs = await loadPrefsMany(users);
    const messages = buildMessages(rows, kind, targets, prefs, opts.extra);
    const f = opts.fetchImpl ?? fetch;
    let accepted = 0;
    const dead: string[] = [];
    for (let i = 0; i < messages.length; i += CHUNK) {
      const batch = messages.slice(i, i + CHUNK);
      const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
      if (process.env.EXPO_ACCESS_TOKEN) headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
      const res = await f(EXPO_URL, { method: "POST", headers, body: JSON.stringify(batch), signal: AbortSignal.timeout(8000) }).catch(() => null);
      if (!res || !res.ok) continue;
      const json = (await res.json().catch(() => null)) as { data?: { status?: string; details?: { error?: string } }[] } | null;
      (json?.data ?? []).forEach((t, j) => {
        if (t?.status === "ok") accepted++;
        else if (t?.details?.error === "DeviceNotRegistered") dead.push(batch[j].to);
      });
    }
    if (dead.length) await dropPushTokens(dead);
    return accepted;
  } catch (e) {
    console.warn("sendPush failed:", e instanceof Error ? e.message : e);
    return 0;
  }
}

/**
 * Send after the response. Outside a request (scripts, tests) it simply
 * starts the send without waiting.
 */
export function queuePush(rows: readonly BellRow[], kind: PushKind, extra?: Partial<PushData>): void {
  if (!rows.length) return;
  const run = () => sendPush(rows, kind, { extra }).then(() => undefined);
  try {
    after(run);
  } catch {
    void run().catch(() => undefined);
  }
}

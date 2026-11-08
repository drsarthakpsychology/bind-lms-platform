import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Bell notifications for the doubts board, both directions:
 * - a student posts a doubt or complaint: every admin gets one;
 * - someone answers a doubt: the person who asked gets one.
 * Each opens at /notifications/<id> (which marks it read) with a link to the
 * thread. Never blocks the post: any failure is swallowed.
 */
type Row = { id: string; user_id: string; type: "message"; credential_id: null; title: string; body: string; body_html: string; href: string; sent_by: string | null };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function row(userId: string, title: string, text: string, link: string, linkLabel: string, sentBy: string | null): Row {
  const id = crypto.randomUUID();
  return {
    id,
    user_id: userId,
    type: "message",
    credential_id: null,
    title: title.slice(0, 140),
    body: text.slice(0, 500),
    body_html: `<p>${esc(text.slice(0, 1000))}</p><p><a href="${link}">${linkLabel}</a></p>`,
    href: `/notifications/${id}`,
    sent_by: sentBy,
  };
}

async function nameOf(userId: string): Promise<string | null> {
  try {
    const { data } = await createAdminClient().from("profiles").select("name").eq("id", userId).maybeSingle();
    const n = data?.name;
    return typeof n === "string" && n.trim() ? n.trim() : null;
  } catch {
    return null;
  }
}

async function insert(rows: Row[]) {
  if (!rows.length) return;
  try {
    await createAdminClient().from("notifications").insert(rows);
  } catch {
    // The post itself already succeeded; a missed bell is not worth an error.
  }
}

/** A student posted a doubt or a complaint: tell every admin. */
export async function notifyAdminsOfDoubt(input: { doubtId: string; title: string; body: string; kind: string; askerId: string }) {
  try {
    const { data } = await createAdminClient().from("profiles").select("id").eq("role", "admin").neq("status", "blocked");
    const admins = (data ?? []).map((p) => String(p.id)).filter((id) => id !== input.askerId);
    const who = (await nameOf(input.askerId)) ?? "A student";
    const what = input.kind === "complaint" ? "complaint" : "doubt";
    const text = `${who} posted a ${what}: ${input.title}. ${input.body}`.trim();
    await insert(admins.map((id) => row(id, input.kind === "complaint" ? `New complaint: ${input.title}` : `New doubt: ${input.title}`, text, `/doubts/${input.doubtId}`, `Open the ${what}`, input.askerId)));
  } catch {
    // ignore
  }
}

/** Someone answered a doubt: tell the person who asked (not when they answer themselves). */
export async function notifyAskerOfReply(input: { doubtId: string; replierId: string; body: string }) {
  try {
    const { data } = await createAdminClient().from("doubts").select("user_id, title").eq("id", input.doubtId).maybeSingle();
    if (!data || data.user_id === input.replierId) return;
    const who = (await nameOf(input.replierId)) ?? "Someone";
    const title = String(data.title ?? "your doubt");
    await insert([row(String(data.user_id), `New answer: ${title}`, `${who} answered your doubt "${title}": ${input.body}`, `/doubts/${input.doubtId}`, "Read the answer", input.replierId)]);
  } catch {
    // ignore
  }
}

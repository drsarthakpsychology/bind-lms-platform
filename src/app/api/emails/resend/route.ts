import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { EVENT_COLUMN, verifyResendSignature } from "@/lib/email/webhook";

/**
 * Resend webhook → Mail tracking.
 * - email.delivered / opened / clicked / bounced / complained: stamps the
 *   matching column on the email_sends row (found by Resend's message id).
 * - email.received (inbound replies): stores the message in email_inbound so
 *   it shows in Mail → Inbox and on the person's CRM timeline.
 * Every request must carry a valid Svix signature (RESEND_WEBHOOK_SECRET).
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();
  const ok = verifyResendSignature(
    raw,
    {
      id: request.headers.get("svix-id"),
      timestamp: request.headers.get("svix-timestamp"),
      signature: request.headers.get("svix-signature"),
    },
    process.env.RESEND_WEBHOOK_SECRET,
  );
  if (!ok) return NextResponse.json({ error: "Bad signature." }, { status: 401 });

  let event: { type?: string; created_at?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }
  const type = String(event.type ?? "");
  const data = event.data ?? {};
  const at = typeof event.created_at === "string" ? event.created_at : new Date().toISOString();
  const admin = createAdminClient();

  const column = EVENT_COLUMN[type];
  if (column) {
    const providerId = String(data.email_id ?? data.id ?? "");
    if (providerId) {
      // Keep the FIRST time something happened (an email is opened many times).
      await admin.from("email_sends").update({ [column]: at }).eq("provider_id", providerId).is(column, null);
    }
    return NextResponse.json({ ok: true });
  }

  // Resend has two inbound shapes: domain receiving ("email.received", fields
  // on data) and Inboxes ("inbox.email.received", fields on data.email).
  // Neither carries the body, so it is fetched from the Receiving API.
  if (type === "email.received" || type === "inbox.email.received") {
    const msg = (type === "inbox.email.received" && data.email && typeof data.email === "object" ? data.email : data) as Record<string, unknown>;
    const providerId = String(data.email_id ?? msg.id ?? "") || null;
    let text: string | null = typeof msg.text === "string" ? msg.text : null;
    let html: string | null = typeof msg.html === "string" ? msg.html : null;
    if (!text && !html && providerId && process.env.RESEND_API_KEY) {
      try {
        const res = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(providerId)}`, {
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const full = (await res.json()) as { text?: unknown; html?: unknown };
          text = typeof full.text === "string" ? full.text : null;
          html = typeof full.html === "string" ? full.html : null;
        }
      } catch {
        /* keep the metadata; the body can be read in Resend */
      }
    }
    const from = msg.from as unknown;
    const fromEmail =
      typeof from === "string"
        ? (from.match(/<([^>]+)>/)?.[1] ?? from)
        : String((from as { email?: string } | null)?.email ?? "");
    const fromName =
      typeof from === "string" ? (from.includes("<") ? from.split("<")[0].trim().replace(/^"|"$/g, "") || null : null) : ((from as { name?: string } | null)?.name ?? null);
    const to = Array.isArray(msg.to) ? String(msg.to[0] ?? "") : String(msg.to ?? "");
    const receivedAt = typeof msg.received_at === "string" ? msg.received_at : typeof msg.created_at === "string" ? msg.created_at : at;
    if (fromEmail) {
      await admin.from("email_inbound").upsert(
        {
          provider_id: providerId,
          from_email: fromEmail.trim().toLowerCase(),
          from_name: fromName,
          to_email: to || null,
          subject: typeof msg.subject === "string" ? msg.subject : null,
          // Plain text only is ever shown; HTML is kept for reference, never rendered.
          body_text: text ?? (html ? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : null),
          body_html: html,
          received_at: receivedAt,
        },
        { onConflict: "provider_id", ignoreDuplicates: true },
      );
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, ignored: type });
}

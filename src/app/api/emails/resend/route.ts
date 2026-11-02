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

  if (type === "email.received" || type === "inbound.email") {
    const from = data.from as unknown;
    const fromEmail =
      typeof from === "string"
        ? (from.match(/<([^>]+)>/)?.[1] ?? from)
        : String((from as { email?: string } | null)?.email ?? "");
    const fromName =
      typeof from === "string" ? (from.includes("<") ? from.split("<")[0].trim().replace(/^"|"$/g, "") : null) : ((from as { name?: string } | null)?.name ?? null);
    const to = Array.isArray(data.to) ? String(data.to[0] ?? "") : String(data.to ?? "");
    if (fromEmail) {
      await admin.from("email_inbound").upsert(
        {
          provider_id: String(data.email_id ?? data.id ?? "") || null,
          from_email: fromEmail.toLowerCase(),
          from_name: fromName,
          to_email: to || null,
          subject: typeof data.subject === "string" ? data.subject : null,
          body_text: typeof data.text === "string" ? data.text : null,
          body_html: typeof data.html === "string" ? data.html : null,
          received_at: at,
        },
        { onConflict: "provider_id", ignoreDuplicates: true },
      );
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, ignored: type });
}

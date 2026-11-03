import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { emailConfigured, sendNudges } from "@/lib/nudge/send";
import { isNudgeable } from "@/lib/nudge/select";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(200),
  message: z.string().max(1000).optional(),
});

const DEFAULT_TEXT =
  "Hi {name},\n\nYou've been quiet for a bit — your lessons and practice are waiting when you're ready. If something's in the way, we'd genuinely like to hear it.\n\n— Your programme team";

/**
 * POST /api/admin/nudge — the one-at-a-time nudge on Progress.
 *
 * Goes through the same path as the bulk send (src/lib/nudge/send.ts): the
 * shared Resend helper, logged to email_sends. Without a key it honestly
 * reports "email-not-configured" — it never claims an email went out.
 */
export async function POST(req: Request) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  if (!emailConfigured()) {
    console.warn("[nudge] RESEND_API_KEY not configured — nothing sent.");
    return NextResponse.json({ ok: true, status: "email-not-configured" });
  }

  const { data: p } = await createAdminClient()
    .from("profiles")
    .select("id, name, email, status, role, is_test")
    .ilike("email", parsed.data.email.replace(/[\\%_]/g, (c) => `\\${c}`))
    .limit(1)
    .maybeSingle();
  if (!p || !isNudgeable({ email: p.email as string, status: p.status as string | null, role: p.role as string | null, isTest: p.is_test as boolean | null })) {
    return NextResponse.json({ error: "No student with that email." }, { status: 404 });
  }

  const name = String(p.name ?? "").trim() || String(p.email).split("@")[0];
  const report = await sendNudges(
    [{ id: p.id as string, name, email: String(p.email) }],
    { subject: "A note from your programme", message: parsed.data.message ?? DEFAULT_TEXT },
    me.id,
  );
  if (report.failed.length) {
    console.error("[nudge] Resend failed:", report.failed[0].reason);
    return NextResponse.json({ error: "Email failed to send." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, status: "sent" });
}

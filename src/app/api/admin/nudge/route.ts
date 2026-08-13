import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(200),
  message: z.string().max(1000).optional(),
});

/**
 * POST /api/admin/nudge — the cohort-pulse one-tap nudge.
 *
 * Sends a personal email to a student whose activity dropped / load spiked.
 * Uses Resend's REST API via fetch (no SDK dependency) when RESEND_API_KEY +
 * RESEND_FROM_EMAIL are configured. Without a key it honestly reports
 * "email-not-configured" — it never claims an email went out.
 */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("[nudge] RESEND_API_KEY/RESEND_FROM_EMAIL not configured — nudge intent recorded only:", parsed.data.email);
    return NextResponse.json({ ok: true, status: "email-not-configured" });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [parsed.data.email],
      subject: "A note from your programme",
      text:
        parsed.data.message ??
        "Hi,\n\nYou've been quiet for a bit — your lessons and practice are waiting when you're ready. If something's in the way, we'd genuinely like to hear it.\n\n— Your programme team",
    }),
  });

  if (!res.ok) {
    console.error("[nudge] Resend failed:", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Email failed to send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, status: "sent" });
}

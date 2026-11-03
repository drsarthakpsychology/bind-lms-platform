import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { rateLimit } from "@/lib/rate-limit";
import { MAX_BULK_RECIPIENTS } from "@/lib/nudge/select";
import { emailConfigured, recipientsFor, sendNudges } from "@/lib/nudge/send";

export const runtime = "nodejs";

const schema = z.object({
  userIds: z.array(z.string().uuid()).min(1).max(MAX_BULK_RECIPIENTS),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

/**
 * POST /api/admin/nudge/bulk — "Email students who've gone quiet".
 * Admin only. Emails are looked up from the ids on the server; one email per
 * student. 5 bulk sends per admin per 10 minutes.
 */
export async function POST(req: Request) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the list, subject and message." }, { status: 400 });

  if (!emailConfigured()) {
    return NextResponse.json({ sent: 0, sentIds: [], failed: [], skipped: 0, notConfigured: true });
  }

  if (!(await rateLimit(`nudge-bulk:${me.id}`, 5, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many sends. Wait 10 minutes and try again." }, { status: 429 });
  }

  const { recipients, skipped } = await recipientsFor(parsed.data.userIds);
  const report = await sendNudges(recipients, parsed.data, me.id);
  console.info(
    `[nudge-bulk] admin=${me.id} asked=${parsed.data.userIds.length} sent=${report.sent} failed=${report.failed.length} skipped=${skipped}`,
  );
  return NextResponse.json({ ...report, skipped });
}

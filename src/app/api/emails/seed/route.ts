import { appUrl as liveAppUrl } from "@/lib/app-url";
import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { getEmailTemplate } from "@/lib/email/templates";

/**
 * POST /api/emails/seed: compose a ready-made template for the compose tab's
 * editor. Templates live server-side (they embed the brand + app URL), so the
 * client asks here and gets back {subject, html} to seed the editor + preview.
 * Admin-only.
 */
export async function POST(req: Request) {
  const profile = await requireSuperAdmin();
  if (!profile) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { templateId?: string } | null;
  const template = getEmailTemplate(body?.templateId ?? "");
  if (!template) return NextResponse.json({ error: "Unknown template." }, { status: 400 });

  const appUrl = liveAppUrl();
  const built = template.build({ appUrl });
  return NextResponse.json({ subject: built.subject, html: built.html });
}

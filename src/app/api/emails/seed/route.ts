import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { getEmailTemplate } from "@/lib/email/templates";

/**
 * POST /api/emails/seed — compose a ready-made template for the compose tab's
 * editor. Templates live server-side (they embed the brand + app URL), so the
 * client asks here and gets back {subject, html} to seed the editor + preview.
 * Admin-only.
 */
export async function POST(req: Request) {
  const profile = await requireAdmin();
  if (!profile) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { templateId?: string } | null;
  const template = getEmailTemplate(body?.templateId ?? "");
  if (!template) return NextResponse.json({ error: "Unknown template." }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";
  const built = template.build({ appUrl });
  return NextResponse.json({ subject: built.subject, html: built.html });
}

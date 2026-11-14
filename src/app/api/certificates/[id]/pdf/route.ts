import { NextResponse } from "next/server";
import { isAdminLike, requireSession } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { ownsCredential } from "@/lib/achievements/owned";
import { credentialDownloadUrl } from "@/lib/achievements/storage";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { isStudioRecord, loadCredential, pdfForRecord } from "@/lib/certificates/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/certificates/<id>/pdf: the certificate as an A4 landscape PDF.
 * Admins can open any; a student only their own (by account or email), and
 * not one that is revoked or not yet issued. Studio certificates are drawn
 * from the record each time; older ones keep the PDF they were issued with.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const me = await requireSession();
  if (!me) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id } = await ctx.params;
  const admin = createAdminClient();
  const row = await loadCredential(admin, normaliseCertificateId(id));
  if (!row || row.type !== "certificate") return NextResponse.json({ error: "Not found." }, { status: 404 });
  const staff = isAdminLike(me);
  if (!staff) {
    if (!ownsCredential(row, me.id, me.email)) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (row.status !== "issued" || row.revoked_at) return NextResponse.json({ error: "This certificate is not available." }, { status: 403 });
  }
  if (!isStudioRecord(row) && row.pdf_storage_path) {
    try {
      return NextResponse.redirect(await credentialDownloadUrl(row.pdf_storage_path, 60 * 15));
    } catch {
      /* storage not reachable: draw it from the record below */
    }
  }
  const pdf = await pdfForRecord(admin, row);
  const inline = new URL(req.url).searchParams.get("view") === "1";
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="VIBHA-certificate-${row.credential_id.replace(/[^A-Za-z0-9-]/g, "").slice(0, 24)}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

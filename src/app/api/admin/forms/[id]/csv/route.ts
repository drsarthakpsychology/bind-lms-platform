import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadForm, loadSubmissions } from "@/lib/forms/load";
import { csvFileName, submissionsCsv } from "@/lib/forms/csv";

export const dynamic = "force-dynamic";

/** GET /api/admin/forms/[id]/csv: every answer to one form as a spreadsheet. Any admin. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const admin = createAdminClient();
  const form = await loadForm(admin, id);
  if (!form) return NextResponse.json({ error: "Form not found." }, { status: 404 });
  const rows = await loadSubmissions(admin, id);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  // The byte order mark tells Excel the file is UTF-8.
  return new NextResponse("﻿" + submissionsCsv(form.fields, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvFileName(form.title, today)}"`,
      "Cache-Control": "no-store",
    },
  });
}

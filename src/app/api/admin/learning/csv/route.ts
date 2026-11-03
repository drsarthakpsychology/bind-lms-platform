import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { loadLearningInsights } from "@/lib/insights/load";
import { studentsCsv } from "@/lib/insights/learning";

export const dynamic = "force-dynamic";

/** GET /api/admin/learning/csv — per-student self-study summary. Admin-only. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }
  const res = await loadLearningInsights();
  if (!res.ok) {
    return NextResponse.json({ error: "Learning data could not be loaded." }, { status: 503 });
  }
  const csv = studentsCsv(res.insights.perStudent);
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="learning-${res.insights.today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

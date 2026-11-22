import { NextResponse } from "next/server";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { searchQuick } from "@/lib/quick-notes/library";

export const runtime = "nodejs";

/**
 * GET /api/quick-notes/search?q= : the Quick Notes page's search inside every
 * note (title, names, headings, facts, table cells). Signed-in students and
 * admins; the content is the same for everyone, so a short private cache.
 */
export async function GET(req: Request) {
  const access = await requireStudentApi({ path: "/study", flag: "learn" });
  if (!access.ok) return access.response;
  if (!rateLimitFast(`web:qnsearch:${access.profile.id}`, 120)) return NextResponse.json({ error: "slow down" }, { status: 429 });
  const q = new URL(req.url).searchParams.get("q") ?? "";
  return NextResponse.json(searchQuick(q), { headers: { "cache-control": "private, max-age=300" } });
}

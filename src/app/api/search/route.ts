import { NextResponse } from "next/server";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { parseTypes, searchEverything } from "@/lib/search/everything";

export const runtime = "nodejs";

/**
 * GET /api/search?q=&types= : the website's top bar search (students and
 * admins). The same search as the app's /api/app/v1/search: only what this
 * account can open, typo tolerant, best first, a few of each type.
 */
export async function GET(req: Request) {
  const access = await requireStudentApi();
  if (!access.ok) return access.response;
  if (!rateLimitFast(`web:search:${access.profile.id}`, 120)) return NextResponse.json({ error: "slow down" }, { status: 429 });
  const url = new URL(req.url);
  const answer = await searchEverything(access.profile, url.searchParams.get("q") ?? "", { types: parseTypes(url.searchParams.get("types")) });
  return NextResponse.json(answer, { headers: { "cache-control": "private, max-age=30" } });
}

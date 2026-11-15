import { NextResponse } from "next/server";
import { publicHome } from "@/lib/app-api/public-home";

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * GET /api/app/v1/public/home: the homepage's words as data, for the app's
 * Welcome. Public, the same for everyone, built once and cached (an hour on
 * the CDN, a day stale while it refreshes). Never refused for an old app.
 */
export function GET() {
  return NextResponse.json(
    { ok: true, data: publicHome() },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}

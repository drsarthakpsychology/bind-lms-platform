import { NextResponse } from "next/server";
import { appleAssociation } from "@/lib/app-links";

/** iPhone Universal Links proof (src/lib/app-links.ts). Not found until APPLE_TEAM_ID is set. */
export const dynamic = "force-dynamic";

export function GET() {
  const body = appleAssociation(process.env.APPLE_TEAM_ID);
  if (!body) return NextResponse.json({ error: "not_set_up" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json(body, { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" } });
}

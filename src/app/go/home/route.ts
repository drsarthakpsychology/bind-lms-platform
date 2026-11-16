import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { isAdminLike } from "@/lib/auth/guards";

/**
 * Where the VIBHA logo goes from public pages: signed-in people go to their
 * dashboard (both admin roles to /admin), everyone else to the homepage.
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  const to = session.status === "ok" ? (isAdminLike(session.profile) ? "/admin" : "/dashboard") : "/";
  return NextResponse.redirect(new URL(to, request.url));
}

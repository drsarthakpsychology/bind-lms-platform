import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";

/**
 * Where the VIBHA logo goes from public pages: signed-in people go to their
 * dashboard (admins to /admin), everyone else to the homepage.
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  const to = session.status === "ok" ? (session.profile.role === "admin" ? "/admin" : "/dashboard") : "/";
  return NextResponse.redirect(new URL(to, request.url));
}

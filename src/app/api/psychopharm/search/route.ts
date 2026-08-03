import { NextResponse } from "next/server";
import { searchDrugs } from "@/lib/psychopharm/store";
import { getSession } from "@/lib/auth/session";

/**
 * Deterministic medication-name autocomplete. Returns the generic name for
 * every match (generic, brand, alias) against the static, reviewed store.
 * No model, no generation — Rule 1. Auth-gated to enrolled students/admins.
 */
export async function GET(req: Request) {
  const session = await getSession();
  if (session.status === "unauthenticated" || session.status === "expired" || session.status === "session_replaced") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json([]);
  const results = searchDrugs(q, 12).map((d) => d.generic);
  return NextResponse.json(results);
}
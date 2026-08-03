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
  if (!q.trim()) return NextResponse.json({ matches: [], fuzzy: false });
  const ql = q.trim().toLowerCase();
  // Exact/prefix hits exist? If none, searchDrugs fell back to edit-distance —
  // surface a gentle "Did you mean…" hint.
  const hasDirectPrefix = searchDrugs(ql, 12).some((d) => d.generic.toLowerCase().includes(ql));
  const matches = searchDrugs(ql, 12).map((d) => d.generic);
  return NextResponse.json({ matches, fuzzy: !hasDirectPrefix });
}
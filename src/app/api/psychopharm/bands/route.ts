import { NextResponse } from "next/server";
import { drugDetail } from "@/lib/psychopharm/store";
import { getSession } from "@/lib/auth/session";

/**
 * Returns a drug's dose bands (for the search dose-chip step, D2).
 * Static, reviewed data. Auth-gated to enrolled students/admins.
 */
export async function GET(req: Request) {
  const session = await getSession();
  if (session.status === "unauthenticated" || session.status === "expired" || session.status === "session_replaced") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const drug = searchParams.get("drug") ?? "";
  const detail = drugDetail(drug);
  if (!detail) return NextResponse.json([]);
  return NextResponse.json(
    detail.bands.map((b) => ({
      low: b.low,
      high: b.high,
      unit: b.unit,
      band_label: b.band_label,
      band_type: b.band_type,
    })),
  );
}
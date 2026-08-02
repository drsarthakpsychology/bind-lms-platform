import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/media/same-origin";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/media/materials
 * Body: { materialId: string }
 *
 * Mints a short-lived signed URL for a material file, after verifying at
 * request time that the caller is signed in and can access the material's
 * course (admin, or enrolled student of a published course). This is the
 * "every file request re-checks enrolment at request time" rule — the bucket
 * itself is private and admin-only, so there is no URL a student can guess.
 *
 * Hardening (round 8):
 *  - Same-origin gate (Origin/Referer vs the app origin).
 *  - Rate-limited per user and per IP, matching the playback endpoint.
 *  - Short TTL: 10 minutes.
 *  - Never leaks the raw storage key — returns only a signed URL.
 */
export async function POST(request: Request) {
  // Same-origin gate — fail closed (missing or mismatched origin rejects).
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  const profile = await requireSession();
  if (!profile) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await rateLimit(`material:${profile.id}`, 60)) || !(await rateLimit(`material:ip:${ip}`, 120))) {
    return NextResponse.json({ error: "Too many requests. Slow down." }, { status: 429 });
  }

  let materialId: string;
  try {
    const body = (await request.json()) as { materialId?: string };
    if (!body.materialId || typeof body.materialId !== "string") {
      return NextResponse.json({ error: "materialId is required." }, { status: 400 });
    }
    materialId = body.materialId;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { canAccessMaterial } = await import("@/lib/enrollment");
  const access = await canAccessMaterial(materialId);
  if (!access.ok) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  if (!access.material) {
    return NextResponse.json({ error: "Material not found." }, { status: 404 });
  }

  const path = access.material.storage_path;
  if (!path) {
    return NextResponse.json({ error: "This material has no file." }, { status: 404 });
  }

  // Mint a signed URL from the private materials bucket. Materials ALWAYS live
  // in Supabase Storage (the video provider setting does not apply to them), so
  // use the Supabase provider explicitly — even when NEXT_PUBLIC_MEDIA_PROVIDER
  // is r2 for videos. The bucket has no student read policy, so only a
  // per-request signed URL works.
  const { SupabaseMediaProvider } = await import("@/lib/media/supabase");
  const provider = new SupabaseMediaProvider();
  const result = await provider.getPlaybackUrlFromBucket("materials", path, 60 * 10);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.url, expiresIn: 60 * 10 });
}

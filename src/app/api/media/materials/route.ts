import { NextResponse } from "next/server";
import { getMediaProvider } from "@/lib/media/provider";

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
 * Never leaks the raw storage key — returns only a signed URL.
 */
export async function POST(request: Request) {
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

  // Mint a signed URL from the private materials bucket. Admin client — the
  // bucket has no student read policy, so only a per-request signed URL works.
  const provider = getMediaProvider();
  const result = await provider.getPlaybackUrlFromBucket("materials", path, 60 * 15);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.url, expiresIn: 60 * 15 });
}

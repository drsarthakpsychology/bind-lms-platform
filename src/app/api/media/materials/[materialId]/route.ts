import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/media/same-origin";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import type { StreamedFile } from "@/lib/media/deliver";
import { serveMaterial } from "@/lib/media/material-serve";

/**
 * GET /api/media/materials/:materialId
 *
 * Streams a material file through the authenticated proxy: the same transport
 * as video. The client never receives a storage URL or bucket path; the object
 * is fetched server-side from the material's recorded provider/bucket/key and
 * streamed back with correct Range/206 semantics.
 *
 * Round-13 change: materials used to get a short-lived signed URL. Now they
 * proxy-stream like video, so every file type shares one delivery path.
 *
 * Performance parity with the video proxy (Round-16): the authorization +
 * file-resolution verdict is cached per (viewer, material) for 5 minutes and
 * the rate limiter is the in-memory fast one, so a chunked download doesn't
 * re-run the enrollment + material reads on every byte-range request.
 *
 * Authz: same-origin → session → admin-or-enrolled (cached verdict).
 */
export async function HEAD(
  request: NextRequest,
  ctx: { params: Promise<{ materialId: string }> },
) {
  const result = await authorizeMaterial(request, ctx);
  if (result instanceof NextResponse) return result;
  return new NextResponse(null, {
    status: result.file.status,
    headers: result.file.headers,
  });
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ materialId: string }> },
) {
  const result = await authorizeMaterial(request, ctx);
  if (result instanceof NextResponse) return result;
  return new NextResponse(result.file.stream, {
    status: result.file.status,
    headers: result.file.headers,
  });
}

async function authorizeMaterial(
  request: NextRequest,
  ctx: { params: Promise<{ materialId: string }> },
): Promise<{ file: StreamedFile } | NextResponse> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  const profile = await requireSession();
  if (!profile) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimitFast(`material:${profile.id}`, 300) || !rateLimitFast(`material:ip:${ip}`, 600)) {
    return NextResponse.json({ error: "Too many requests. Slow down." }, { status: 429 });
  }

  const { materialId } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(materialId)) {
    return NextResponse.json({ error: "Invalid material id." }, { status: 400 });
  }

  const served = await serveMaterial(profile, materialId, request.headers.get("range"));
  if (!served.ok) {
    return NextResponse.json({ error: served.error }, { status: served.status });
  }

  return { file: served.file };
}

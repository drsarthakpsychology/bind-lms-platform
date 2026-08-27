import { NextRequest, NextResponse } from "next/server";
import type { Profile } from "@/lib/auth/session";
import { requireSession } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/media/same-origin";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { streamFile, contentTypeForKind, type StreamedFile } from "@/lib/media/deliver";
import {
  getMaterialStreamVerdict,
  setMaterialStreamVerdict,
  type MaterialStreamVerdict,
} from "@/lib/media/material-stream-cache";

/**
 * GET /api/media/materials/:materialId
 *
 * Streams a material file through the authenticated proxy — the same transport
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

  // Hot path: one combined authz + resolution read per (viewer, material),
  // cached for 5 minutes — the video proxy's verdict-cache pattern.
  let verdict = getMaterialStreamVerdict(profile.id, materialId);
  if (!verdict) {
    verdict = await resolveMaterial(profile, materialId);
    setMaterialStreamVerdict(profile.id, materialId, verdict);
  }

  if (!verdict.ok) {
    return NextResponse.json({ error: verdict.reason }, { status: verdict.status ?? 403 });
  }

  const contentType = contentTypeForKind(verdict.file.kind, verdict.file.format);
  const file = await streamFile(
    verdict.file.provider,
    verdict.file.bucket,
    verdict.file.storage_path,
    request.headers.get("range"),
    contentType,
  );
  if (!file) {
    return NextResponse.json({ error: "This material couldn't be loaded." }, { status: 404 });
  }

  return { file };
}

/**
 * One read for the whole verdict: the material row (with its course embed),
 * plus an enrollment check for non-admins. Replaces the previous two-query
 * sequence (canAccessMaterial + a second material read).
 */
async function resolveMaterial(
  profile: NonNullable<Profile>,
  materialId: string,
): Promise<MaterialStreamVerdict> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: material } = await supabase
    .from("materials")
    .select("id, kind, format, storage_path, provider, bucket, course_id, courses!inner(is_published)")
    .eq("id", materialId)
    .single();

  if (!material) return { ok: false, reason: "Material not found." };

  if (profile.role !== "admin") {
    const course = Array.isArray(material.courses) ? material.courses[0] : material.courses;
    if (!course?.is_published) return { ok: false, reason: "This course isn't published." };

    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("course_id")
      .eq("user_id", profile.id)
      .eq("course_id", material.course_id)
      .maybeSingle();
    if (!enrollment) return { ok: false, reason: "You aren't enrolled in this course." };
  }

  if (material.kind === "link" || !material.storage_path) {
    return { ok: false, reason: "This material has no file.", status: 404 };
  }

  return {
    ok: true,
    file: {
      kind: material.kind,
      format: material.format,
      storage_path: material.storage_path,
      provider: material.provider === "r2" ? "r2" : "supabase",
      bucket: material.bucket ?? "materials",
    },
  };
}

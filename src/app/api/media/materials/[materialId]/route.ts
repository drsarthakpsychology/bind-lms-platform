import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/media/same-origin";
import { rateLimit } from "@/lib/rate-limit";
import { streamFile, contentTypeForKind, type StreamedFile } from "@/lib/media/deliver";

/**
 * GET /api/media/materials/:materialId
 *
 * Streams a material file through the authenticated proxy — the same transport
 * as video. The client never receives a storage URL or bucket path; the object
 * is fetched server-side from the material's recorded provider/bucket/key and
 * streamed back with correct Range/206 semantics.
 *
 * Round-13 change: materials used to get a short-lived signed URL. Now they
 * proxy-stream like video, so every file type shares one delivery path. The
 * one exception is a student's OWN submission file (see the submissions route).
 *
 * Authz: same-origin → session → canAccessMaterial (admin or enrolled student
 * of a published course). Rate-limited per user + IP.
 */

/** HEAD — lightweight access probe for the viewer. Same authz as GET, no body. */
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
  if (!(await rateLimit(`material:${profile.id}`, 60)) || !(await rateLimit(`material:ip:${ip}`, 120))) {
    return NextResponse.json({ error: "Too many requests. Slow down." }, { status: 429 });
  }

  const { materialId } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(materialId)) {
    return NextResponse.json({ error: "Invalid material id." }, { status: 400 });
  }

  const { canAccessMaterial } = await import("@/lib/enrollment");
  const access = await canAccessMaterial(materialId);
  if (!access.ok) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const materialRow = await getMaterialRecord(materialId);
  if (!materialRow) {
    return NextResponse.json({ error: "Material not found." }, { status: 404 });
  }
  if (materialRow.kind === "link" || !materialRow.storage_path) {
    return NextResponse.json({ error: "This material has no file." }, { status: 404 });
  }

  const provider = materialRow.provider === "r2" ? "r2" : "supabase";
  const bucket = materialRow.bucket ?? "materials";
  const contentType = contentTypeForKind(materialRow.kind, materialRow.format);

  const file = await streamFile(
    provider,
    bucket,
    materialRow.storage_path,
    request.headers.get("range"),
    contentType,
  );
  if (!file) {
    return NextResponse.json({ error: "This material couldn't be loaded." }, { status: 404 });
  }

  return { file };
}

async function getMaterialRecord(materialId: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("materials")
    .select("id, kind, format, storage_path, provider, bucket")
    .eq("id", materialId)
    .maybeSingle();
  return data ?? null;
}

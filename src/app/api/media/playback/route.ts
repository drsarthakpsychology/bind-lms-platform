import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { mintStreamToken } from "@/lib/media/stream-token";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/media/playback
 * Body: { lessonId: string }
 *
 * Returns a short-lived STREAM SESSION TOKEN plus the stream-proxy base. The
 * player never receives a raw storage URL — it passes the token to the stream
 * proxy, which resolves the actual object server-side after re-checking
 * enrolment. This is the round-8 "no downloadable file / no reusable URL"
 * end state:
 *   - Same-origin gate (Origin/Referer vs the app origin).
 *   - Token bound to (user, lesson, course), HMAC-signed, 5-min TTL.
 *   - Rate-limited per user and per IP.
 *   - The stream proxy serves playlist + segments + AES-128 key.
 */
export async function POST(request: Request) {
  // Same-origin gate. Origin is authoritative when present; Referer is a
  // fallback for clients that don't send Origin (older Safari GETs).
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const requestOrigin = origin ?? (referer ? new URL(referer).origin : null);
  if (requestOrigin && requestOrigin !== appOrigin) {
    return NextResponse.json({ error: "Forbidden origin." }, { status: 403 });
  }

  let lessonId: string;
  try {
    const body = (await request.json()) as { lessonId?: string };
    if (!body.lessonId || typeof body.lessonId !== "string") {
      return NextResponse.json({ error: "lessonId is required." }, { status: 400 });
    }
    lessonId = body.lessonId;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const profile = await requireSession();
  if (!profile) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // Rate limit the media-token minting per user (and per IP as a fallback key).
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await rateLimit(`media:${profile.id}`, 60)) || !(await rateLimit(`media:ip:${ip}`, 120))) {
    return NextResponse.json({ error: "Too many requests. Slow down." }, { status: 429 });
  }

  // Enrollment + publish re-check at request time (admin bypasses). A
  // non-enrolled authenticated user gets nothing, even if they know the lesson
  // id — this closes the gap where video URLs were gated on publish only.
  const { canAccessLesson } = await import("@/lib/enrollment");
  const access = await canAccessLesson(lessonId);
  if (!access.ok || !access.profile) {
    return NextResponse.json(
      { error: access.ok ? "Not authorized." : "This course isn't available to you." },
      { status: 403 },
    );
  }

  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, video_storage_path, media_assets(master_playlist, key_prefix)")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  // Determine the media shape:
  //  - A media_assets row (R2 migration done) → HLS master playlist.
  //  - Otherwise → legacy raw video (single MP4).
  const media = Array.isArray(lesson.media_assets)
    ? lesson.media_assets[0]
    : lesson.media_assets;
  const masterKey = media?.master_playlist ?? media?.key_prefix;
  const key = masterKey ?? lesson.video_storage_path;

  if (!key) {
    return NextResponse.json({ error: "This lesson has no media." }, { status: 404 });
  }
  const mediaType = masterKey ? "hls" : "mp4";

  // Resume position for this viewer (may be 0). Read alongside minting so the
  // player gets everything from one request.
  const { data: progress } = await supabase
    .from("progress")
    .select("watched_seconds")
    .eq("user_id", profile.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const courseId = access.courseId;
  if (!courseId) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  // Mint the viewer-bound stream token. No storage key, no signed URL — the
  // proxy resolves the object server-side.
  const token = mintStreamToken({
    userId: profile.id,
    lessonId,
    courseId,
  });

  return NextResponse.json({
    token,
    // The player asks for a lesson's stream by id + token; the proxy resolves
    // the object path server-side, so no storage key ever reaches the client.
    streamUrl: `/api/media/stream/${lessonId}`,
    mediaType,
    expiresIn: 300,
    resumeSeconds: progress?.watched_seconds ?? 0,
  });
}

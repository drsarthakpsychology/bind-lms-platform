import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { playbackMedia } from "@/lib/media/playback";
import { mintStreamToken } from "@/lib/media/stream-token";
import { isSameOrigin } from "@/lib/media/same-origin";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/media/playback
 * Body: { lessonId: string }
 *
 * Returns a short-lived STREAM SESSION TOKEN plus the stream-proxy base. The
 * player never receives a raw storage URL. It passes the token to the stream
 * proxy, which resolves the actual object server-side after re-checking
 * enrolment. This is the round-8 "no downloadable file / no reusable URL"
 * end state:
 *   - Same-origin gate (Origin/Referer vs the app origin): fails closed.
 *   - Token bound to (user, lesson, course), HMAC-signed, 5-min TTL.
 *   - Rate-limited per user and per IP.
 *   - The stream proxy serves playlist + segments + AES-128 key.
 */
export async function POST(request: Request) {
  // Same-origin gate: fail closed (missing or mismatched origin rejects).
  if (!isSameOrigin(request)) {
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
  // id: this closes the gap where video URLs were gated on publish only.
  const { canAccessLesson } = await import("@/lib/enrollment");
  const access = await canAccessLesson(lessonId);
  if (!access.ok || !access.profile) {
    return NextResponse.json(
      { error: access.ok ? "Not authorized." : "This course isn't available to you." },
      { status: 403 },
    );
  }

  // Media shape and resume position (src/lib/media/playback.ts, shared with the mobile app).
  const media = await playbackMedia(lessonId, profile.id);
  if (!media.ok) {
    return NextResponse.json({ error: media.error }, { status: media.status });
  }
  const { mediaType } = media;

  const courseId = access.courseId;
  if (!courseId) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  // Mint the viewer-bound stream token. No storage key, no signed URL: the
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
    resumeSeconds: media.resumeSeconds,
  });
}

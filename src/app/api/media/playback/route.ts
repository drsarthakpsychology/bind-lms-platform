import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { getMediaProvider } from "@/lib/media/provider";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/media/playback
 * Body: { lessonId: string }
 *
 * Mints a short-lived (60 min) signed URL for a lesson's master HLS playlist,
 * after checking the caller is a signed-in user who can see that course
 * (published, or an admin previewing). The provider is selected by config
 * (Supabase Storage today, Cloudflare R2 after migration).
 *
 * This endpoint is rate-limited at the proxy/edge layer (see C4) and must
 * never leak raw storage keys — it returns only a signed URL.
 */
export async function POST(request: Request) {
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
  if (!rateLimit(`media:${profile.id}`, 60) || !rateLimit(`media:ip:${ip}`, 120)) {
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

  // Determine the storage key to sign:
  //  - If a media_assets row exists (R2 migration done), use its master playlist.
  //  - Otherwise fall back to the legacy raw video path.
  const media = Array.isArray(lesson.media_assets)
    ? lesson.media_assets[0]
    : lesson.media_assets;
  const masterKey = media?.master_playlist ?? media?.key_prefix;
  const key = masterKey ?? lesson.video_storage_path;

  if (!key) {
    return NextResponse.json({ error: "This lesson has no media." }, { status: 404 });
  }

  const provider = getMediaProvider();
  const result = await provider.getPlaybackUrl(key, 60 * 60); // 60 minutes

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ url: result.url, expiresIn: 3600, key: key.split("/").pop() });
}

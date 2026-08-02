import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { verifyStreamToken } from "@/lib/media/stream-token";
import { getObjectBuffer, getObjectStream, getObjectText } from "@/lib/media/proxy-client";
import { aesEncrypt, deriveSessionKey } from "@/lib/media/crypto";
import { rateLimitFast } from "@/lib/rate-limit-fast";

/**
 * GET /api/media/stream/:lessonId(/*rest)
 *
 * Round-9 stream proxy with session-bound segment encryption.
 *
 * Every .ts segment stored in R2 is PLAINTEXT (individual 6s fragments, not a
 * complete file). On delivery the proxy:
 *   1. derives a per-session AES-128 key from the stream token (HMAC),
 *   2. encrypts the segment with that key, IV = the segment's media-sequence
 *      number (16-byte big-endian) so the player's hls.js derives the same IV,
 *   3. serves the encrypted segment.
 * The HLS playlist declares `#EXT-X-KEY:METHOD=AES-128,URI=…__key__`, and the
 * `__key__` endpoint returns the per-session key to the authorized session.
 *
 * Result: bytes in the network tab are ciphertext only useful to the active
 * 5-minute, viewer-bound token. A different viewer, a different session, or an
 * expired token yields a different (or failing) key. This is the strongest
 * obtainable without DRM.
 *
 * Authn/authz per request (always re-checked):
 *   - valid stream token bound to lesson + user
 *   - valid session
 *   - enrolment + publish
 *   - rate-limited
 */
export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ lessonId: string[] }> },
) {
  const { lessonId: segments } = await ctx.params;
  const lessonId = segments[0];
  if (!lessonId) {
    return NextResponse.json({ error: "Missing lesson id." }, { status: 400 });
  }
  const token = request.nextUrl.searchParams.get("st");
  if (!token) {
    return NextResponse.json({ error: "Missing stream token." }, { status: 401 });
  }

  const payload = verifyStreamToken(token);
  if (!payload || payload.lid !== lessonId) {
    return NextResponse.json({ error: "Invalid or expired stream token." }, { status: 401 });
  }

  const profile = await requireSession();
  if (!profile || profile.id !== payload.uid) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimitFast(`stream:${profile.id}`, 900) || !rateLimitFast(`stream:ip:${ip}`, 1800)) {
    return NextResponse.json({ error: "Too many requests. Slow down." }, { status: 429 });
  }

  // Hot path: cache the (enrollment + stream resolution) verdict per
  // (uid, lessonId) for the token's 5-min life. One DB query + zero repeats
  // for the ~600 segments per hour of playback.
  const { getStreamVerdict, setStreamVerdict } = await import("@/lib/media/stream-cache");
  let verdict = getStreamVerdict(profile.id, lessonId);
  if (!verdict) {
    const { authorizeAndResolveLesson } = await import("@/lib/media/proxy-client");
    const fresh = await authorizeAndResolveLesson({
      userId: profile.id,
      role: profile.role,
      lessonId,
    });
    verdict = { ...fresh, ok: fresh.authorized && Boolean(fresh.resolved) };
    setStreamVerdict(profile.id, lessonId, verdict);
  }

  if (!verdict.authorized) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  const resolved = verdict.resolved;
  if (!resolved) {
    return NextResponse.json({ error: "This lesson has no media." }, { status: 404 });
  }

  const { provider, bucket, key } = resolved;
  const rest = segments.slice(1).join("/");

  // Per-session AES-128 key — the same bytes the __key__ endpoint hands the
  // player. Bound to this token + lesson.
  const sessionKey = deriveSessionKey(token, lessonId);

  // ---- Per-session key endpoint. ----
  if (rest === "__key__") {
    if (!resolved.isHls) {
      return new NextResponse("No key for a non-HLS lesson.", { status: 404 });
    }
    return new NextResponse(new Uint8Array(sessionKey), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "private, no-store",
      },
    });
  }

  // ---- Legacy single-file video (migration window) — proxy-gated, not
  // segmented. Served as-is; there's no per-segment layer for a monolithic
  // file. Keep the existing byte-for-byte delivery. ----
  if (!resolved.isHls) {
    const obj = await getObjectStream(provider, bucket, key, request.headers.get("range"));
    if (!obj) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(obj.stream, {
      status: obj.status ?? 200,
      headers: {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, no-store",
        ...(obj.rangeHeader ? { "Content-Range": obj.rangeHeader } : {}),
        ...(obj.contentLength ? { "Content-Length": obj.contentLength } : {}),
      },
    });
  }

  // ---- HLS ----
  const targetKey = rest ? `${resolved.keyPrefix}/${rest}` : key;
  const isPlaylist = targetKey.endsWith(".m3u8");

  if (isPlaylist) {
    const text = await getObjectText(provider, bucket, targetKey);
    if (text === null) return new NextResponse("Not found", { status: 404 });
    const dir = rest.includes("/") ? rest.slice(0, rest.lastIndexOf("/")) : "";
    // A master playlist references variant .m3u8s; a variant playlist references
    // .ts segments. Only variant playlists get the #EXT-X-KEY line (segments).
    const isMaster = rest === "" || !text.includes(".ts");
    const rewritten = rewritePlaylist(text, lessonId, token, dir, isMaster);
    return new NextResponse(rewritten, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "private, no-store",
      },
    });
  }

  // ---- Segment: fetch plaintext, encrypt per-session, serve. ----
  const buf = await getObjectBuffer(provider, bucket, targetKey);
  if (buf === null) return new NextResponse("Not found", { status: 404 });

  // IV = media sequence number for this segment, as a 16-byte big-endian
  // buffer (AES-128 HLS spec). Parse the trailing index from the filename
  // (seg_0004.ts → 4). hls.js derives the identical IV from the playlist's
  // EXT-X-MEDIA-SEQUENCE + segment index, so it decrypts correctly.
  const seq = parseSegmentFromKey(targetKey) ?? 0;
  const iv = Buffer.alloc(16);
  iv.writeBigUInt64BE(BigInt(seq), 8);

  const { ciphertext } = aesEncrypt(buf, sessionKey, iv);
  return new NextResponse(new Uint8Array(ciphertext), {
    status: 200,
    headers: {
      "Content-Type": "video/mp2t",
      "Cache-Control": "private, no-store",
      "Content-Length": String(ciphertext.length),
    },
  });
}

/** Pull the numeric segment index out of a key like `…/hls_720/seg_0004.ts`. */
function parseSegmentFromKey(targetKey: string): number | null {
  const base = targetKey.split("/").pop() ?? "";
  const m = base.match(/seg_(\d+)\.ts/);
  return m ? Number(m[1]) : null;
}

/**
 * Rewrite an HLS playlist:
 *   - every relative segment/variant reference becomes an absolute URL back
 *     through this proxy with the stream token;
 *   - a single `#EXT-X-KEY:METHOD=AES-128,URI=…__key__` line is injected
 *     (or replaces an existing key) so the player fetches the per-session key
 *     and decrypts each segment with IV=media-sequence.
 *   - IV derives from the media sequence (the default when no IV= is present),
 *     matching our proxy-side derivation.
 */
function rewritePlaylist(
  text: string,
  lessonId: string,
  token: string,
  dir: string,
  isMaster: boolean,
): string {
  const base = `/api/media/stream/${lessonId}`;
  const keyUri = `${base}/__key__?st=${encodeURIComponent(token)}`;
  const keyLine = `#EXT-X-KEY:METHOD=AES-128,URI="${keyUri}"`;

  const lines = text.split("\n");
  // Variant playlists (which reference .ts segments) get ONE #EXT-X-KEY line,
  // inserted before the first segment reference. Master playlists (which
  // reference variant .m3u8s) get NO key line — segments never live there.
  let keyInserted = isMaster; // if master, never insert
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!isMaster && t.startsWith("#EXT-X-KEY:")) {
      // Drop any existing key line; we emit exactly one session key line.
      continue;
    }
    if (t.length > 0 && !t.startsWith("#")) {
      // Emit the DIR-RELATIVE path only — the route prepends keyPrefix when it
      // resolves the object (targetKey = `${keyPrefix}/${rest}`). Baking the
      // full prefix here would double-prefix and 404 every segment.
      const relPath = dir ? `${dir}/${t}` : t;
      const enc = relPath.split("/").map(encodeURIComponent).join("/");
      if (!isMaster && !keyInserted) {
        out.push(keyLine);
        keyInserted = true;
      }
      out.push(`${base}/${enc}?st=${encodeURIComponent(token)}`);
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}
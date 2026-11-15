import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { DEVICE, OTHER_DEVICE, STUDENT_ID, appReq, params, read } from "@/lib/app-api/test-kit";

const L = "33333333-3333-4333-8333-333333333333";
const C = "44444444-4444-4444-8444-444444444444";

const h = vi.hoisted(() => ({
  lecture: vi.fn(),
  media: vi.fn(),
  authorize: vi.fn(),
  text: vi.fn(),
  buffer: vi.fn(),
  session: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/course/lecture", () => ({ loadLecture: h.lecture }));
vi.mock("@/lib/media/playback", () => ({ playbackMedia: h.media }));
vi.mock("@/lib/auth/guards", async (orig) => ({ ...(await orig<typeof import("@/lib/auth/guards")>()), requireSession: h.session }));
vi.mock("@/lib/media/proxy-client", () => ({ authorizeAndResolveLesson: h.authorize, getObjectText: h.text, getObjectBuffer: h.buffer, getObjectStream: vi.fn() }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { clearAppViewerCache } from "@/lib/media/app-viewer";
import { deriveSessionKey } from "@/lib/media/crypto";
import { mintAppStreamToken, streamTtlSeconds, verifyAppStreamToken } from "@/lib/media/app-stream-token";
import { mintStreamToken, verifyStreamToken } from "@/lib/media/stream-token";
import { POST as stream } from "./lectures/[lessonId]/stream/route";
import { GET as proxy } from "../../media/stream/[...lessonId]/route";
import { NextRequest } from "next/server";

const lectureOk = { ok: true, lecture: { id: L, courseId: C, hasVideo: true, durationSeconds: 3600 } };

const proxyReq = (url: string, headers: Record<string, string> = {}) => new NextRequest(new URL(url, "http://test.local"), { headers });
const rest = (...p: string[]) => params({ lessonId: [L, ...p] });

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-test-secret";
  resetGuard();
  clearDeviceCache();
  clearAppViewerCache();
  for (const f of Object.values(h)) f.mockReset();
  h.lecture.mockResolvedValue(lectureOk);
  h.media.mockResolvedValue({ ok: true, mediaType: "hls", resumeSeconds: 125.7 });
  h.authorize.mockResolvedValue({ authorized: true, resolved: { provider: "r2", bucket: "plms-videos", key: `lessons/${L}/hls/master.m3u8`, keyPrefix: `lessons/${L}/hls`, isHls: true } });
});

describe("app stream tokens", () => {
  it("live for the lecture: 1.5 x length + 10 min, between 30 min and 6 h", () => {
    const rule = { factor: 1.5, marginSeconds: 600, minSeconds: 1800, maxSeconds: 21600 };
    expect(streamTtlSeconds(3600, rule)).toBe(6000);
    expect(streamTtlSeconds(300, rule)).toBe(1800);
    expect(streamTtlSeconds(5 * 3600, rule)).toBe(21600);
    expect(streamTtlSeconds(null, rule)).toBe(5400);
  });

  it("never pass for the other kind: web tokens are not app tokens and the reverse", () => {
    const app = mintAppStreamToken({ userId: STUDENT_ID, lessonId: L, courseId: C, deviceId: DEVICE, bindHeader: true, ttlSeconds: 60 }).token;
    const web = mintStreamToken({ userId: STUDENT_ID, lessonId: L, courseId: C });
    expect(verifyAppStreamToken(app)).toMatchObject({ uid: STUDENT_ID, lid: L, bh: true });
    expect(verifyStreamToken(app)).toBeNull();
    expect(verifyAppStreamToken(web)).toBeNull();
    expect(verifyAppStreamToken(app.slice(0, -2) + "xx")).toBeNull();
    expect(verifyAppStreamToken(app, Date.now() + 61_000)).toBeNull();
    expect(app).not.toContain(DEVICE);
  });
});

describe("POST /lectures/:id/stream", () => {
  it("answers the proxy address with the app token, the phone header and the watermark", async () => {
    const r = await read(await stream(appReq(`/lectures/${L}/stream`, { body: {} }), params({ lessonId: L })));
    expect(r.status).toBe(200);
    expect(r.data.url).toMatch(new RegExp(`^http://test.local/api/media/stream/${L}\\?st=a\\.`));
    expect(r.data).toMatchObject({ mediaType: "hls", headers: { "X-App-Device-Id": DEVICE }, resumeSeconds: 125, durationSeconds: 3600, progressEverySeconds: 10, watermark: { text: "Asha Rao · VIBHA-000042" } });
    expect(r.data.expiresIn).toBeGreaterThan(5990);
    expect(r.data.expiresIn).toBeLessThanOrEqual(6000);
    const token = decodeURIComponent(new URL(r.data.url).searchParams.get("st")!);
    expect(verifyAppStreamToken(token)).toMatchObject({ uid: STUDENT_ID, lid: L, cid: C });
  });

  it("refuses a rooted phone, a locked lecture and a lecture without video", async () => {
    expect((await read(await stream(appReq(`/lectures/${L}/stream`, { body: { deviceCompromised: true } }), params({ lessonId: L })))).error?.code).toBe("video_refused");
    h.lecture.mockResolvedValueOnce({ ok: false, reason: "locked" });
    expect((await read(await stream(appReq(`/lectures/${L}/stream`, { body: {} }), params({ lessonId: L })))).error?.code).toBe("feature_locked");
    h.lecture.mockResolvedValueOnce({ ok: true, lecture: { ...lectureOk.lecture, hasVideo: false } });
    expect((await read(await stream(appReq(`/lectures/${L}/stream`, { body: {} }), params({ lessonId: L })))).status).toBe(404);
  });

  it("uses the website's video limit per student", async () => {
    G.limited.add(`media:${STUDENT_ID}`);
    expect((await read(await stream(appReq(`/lectures/${L}/stream`, { body: {} }), params({ lessonId: L })))).status).toBe(429);
  });

  it("fails closed without the signing secret", async () => {
    delete process.env.SESSION_SECRET;
    expect((await read(await stream(appReq(`/lectures/${L}/stream`, { body: {} }), params({ lessonId: L })))).error?.code).toBe("unavailable");
  });
});

describe("the stream proxy with an app token", () => {
  const appToken = (bindHeader = true, deviceId = DEVICE) => mintAppStreamToken({ userId: STUDENT_ID, lessonId: L, courseId: C, deviceId, bindHeader, ttlSeconds: 600 }).token;

  it("rewrites the playlist through the proxy with the same token, without any cookie", async () => {
    h.text.mockResolvedValue("#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=1\nhls_720/index.m3u8\n");
    const t = appToken();
    const res = await proxy(proxyReq(`/api/media/stream/${L}?st=${encodeURIComponent(t)}`, { "x-app-device-id": DEVICE }), rest());
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain(`/api/media/stream/${L}/hls_720/index.m3u8?st=${encodeURIComponent(t)}`);
    expect(h.session).not.toHaveBeenCalled();
    // Read with the service role (no user cookie), which also applies the lecture status rule.
    expect(h.authorize).toHaveBeenCalledWith(expect.objectContaining({ userId: STUDENT_ID, serviceRole: true }));
  });

  it("hands out the same per-viewer AES key as the website", async () => {
    const res = await proxy(proxyReq(`/api/media/stream/${L}/__key__?st=${encodeURIComponent(appToken())}`, { "x-app-device-id": DEVICE }), rest("__key__"));
    expect(res.status).toBe(200);
    expect(Buffer.from(await res.arrayBuffer()).equals(deriveSessionKey(STUDENT_ID, L))).toBe(true);
  });

  it("refuses another phone's header, a missing header when bound, and a replaced phone", async () => {
    let res = await proxy(proxyReq(`/api/media/stream/${L}?st=${encodeURIComponent(appToken())}`, { "x-app-device-id": OTHER_DEVICE }), rest());
    expect(res.status).toBe(401);
    res = await proxy(proxyReq(`/api/media/stream/${L}?st=${encodeURIComponent(appToken())}`), rest());
    expect(res.status).toBe(401);
    // Not bound to the header: still refused once another phone is the active one.
    G.db.tables.app_devices[0].active = false;
    G.db.tables.app_devices.push({ id: "d3", user_id: STUDENT_ID, device_id: OTHER_DEVICE, name: "New", platform: "android", push_token: null, active: true, activated_at: "2026-11-10T00:00:00.000Z", last_seen_at: null });
    res = await proxy(proxyReq(`/api/media/stream/${L}?st=${encodeURIComponent(appToken(false))}`), rest());
    expect(res.status).toBe(401);
  });

  it("stops a paused account", async () => {
    G.db.tables.profiles[0].status = "blocked";
    const res = await proxy(proxyReq(`/api/media/stream/${L}?st=${encodeURIComponent(appToken())}`, { "x-app-device-id": DEVICE }), rest());
    expect(res.status).toBe(403);
  });

  it("the website's token path is unchanged: it still needs the browser session", async () => {
    h.session.mockResolvedValue(null);
    const web = mintStreamToken({ userId: STUDENT_ID, lessonId: L, courseId: C });
    let res = await proxy(proxyReq(`/api/media/stream/${L}?st=${encodeURIComponent(web)}`), rest());
    expect(res.status).toBe(401);
    h.session.mockResolvedValue({ id: STUDENT_ID, role: "student", scope: "full", active_session_token: "s" });
    h.text.mockResolvedValue("#EXTM3U\n");
    res = await proxy(proxyReq(`/api/media/stream/${L}?st=${encodeURIComponent(web)}`), rest());
    expect(res.status).toBe(200);
    expect(h.authorize).toHaveBeenLastCalledWith(expect.objectContaining({ serviceRole: false }));
  });
});

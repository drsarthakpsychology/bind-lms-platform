import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, OTHER_DEVICE, STUDENT_ID, appReq, noParams, params, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({ readAll: vi.fn(async () => undefined) }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/app/(dashboard)/notifications/actions", () => ({ markAllNotificationsRead: h.readAll }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { htmlToBlocks } from "@/lib/app-api/message-blocks";
import { buildMessages, sendPush } from "@/lib/app-api/push";
import { GET as list } from "./notifications/route";
import { GET as detail } from "./notifications/[id]/route";
import { POST as readAll } from "./notifications/read-all/route";
import { GET as getPrefs, PUT as putPrefs } from "./notifications/preferences/route";

const N1 = "aaaaaaaa-0000-4000-8000-000000000001";
const N2 = "aaaaaaaa-0000-4000-8000-000000000002";
const TOKEN = "ExponentPushToken[abcdefghijklmnop]";

const note = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  user_id: STUDENT_ID,
  type: "message",
  title: "Class moved",
  body: "Tomorrow at 6",
  body_html: '<p>Tomorrow at <strong>6</strong>. See <a href="/courses">Lectures</a> or <a href="https://example.org/x">this</a>.</p><ul><li>One</li><li><em>Two</em></li></ul>',
  href: `/notifications/${id}`,
  read_at: null,
  opened_at: null,
  sent_by: ADMIN_ID,
  created_at: "2026-11-15T10:00:00.000Z",
  ...over,
});

beforeEach(() => {
  resetGuard({ notifications: [note(N1), note(N2, { created_at: "2026-11-14T10:00:00.000Z", read_at: "2026-11-14T11:00:00.000Z", type: "certificate", href: "/achievements/VIBHA-C-1" })], app_notification_prefs: [] });
  clearDeviceCache();
  h.readAll.mockClear();
});

describe("message blocks (never HTML)", () => {
  it("turns the cleaned message into paragraphs, lists, bold, italic and links", () => {
    const { content, links } = htmlToBlocks(note(N1).body_html);
    expect(content[0]).toEqual({
      t: "p",
      spans: [
        { text: "Tomorrow at " },
        { text: "6", bold: true },
        { text: ". See " },
        { text: "Lectures", link: { target: { screen: "courses", web: "/courses" }, url: null } },
        { text: " or " },
        { text: "this", link: { target: null, url: "https://example.org/x" } },
        { text: "." },
      ],
    });
    expect(content[1]).toEqual({ t: "ul", items: [[{ text: "One" }], [{ text: "Two", italic: true }]] });
    expect(links.map((l) => l.label)).toEqual(["Lectures", "this"]);
  });

  it("keeps our own full links as app screens and drops unsafe ones", () => {
    const { content } = htmlToBlocks('<h2>Hi &amp; welcome</h2><p><a href="https://vibhapsychology.com/doubts/x">doubt</a><a href="javascript:alert(1)">bad</a></p>');
    expect(content[0]).toEqual({ t: "h", spans: [{ text: "Hi & welcome" }] });
    const spans = (content[1] as { spans: { text: string; link?: unknown }[] }).spans;
    expect(spans[0].link).toMatchObject({ target: { screen: "doubt", doubtId: "x" } });
    expect(spans[1]).toEqual({ text: "bad" });
  });
});

describe("notifications", () => {
  it("lists the student's own notices, newest first, with the unread count and paging", async () => {
    G.db.tables.notifications.push(note("cccccccc-0000-4000-8000-000000000003", { user_id: ADMIN_ID }));
    let r = await read(await list(appReq("/notifications?limit=1"), noParams));
    expect(r.data.items).toHaveLength(1);
    expect(r.data.items[0]).toMatchObject({ id: N1, target: { screen: "notification", notificationId: N1 } });
    expect(r.data.unread).toBe(1);
    expect(r.data.nextCursor).toBe("1");
    r = await read(await list(appReq("/notifications?limit=1&cursor=1"), noParams));
    expect(r.data.items[0]).toMatchObject({ id: N2, type: "certificate", target: { screen: "certificate", credentialId: "VIBHA-C-1" } });
    expect(r.data.nextCursor).toBeNull();
  });

  it("opening one marks it read and answers blocks", async () => {
    const r = await read(await detail(appReq(`/notifications/${N1}`), params({ id: N1 })));
    expect(r.status).toBe(200);
    expect(r.data).toMatchObject({ id: N1, from: "From the VIBHA team", title: "Class moved" });
    expect(r.data.readAt).toBeTruthy();
    expect(r.data.content[0].t).toBe("p");
    expect(JSON.stringify(r.data)).not.toContain("<p>");
    expect(G.db.tables.notifications.find((n) => n.id === N1)?.read_at).toBeTruthy();
  });

  it("someone else's notice is not found", async () => {
    G.db.tables.notifications[0].user_id = ADMIN_ID;
    expect((await read(await detail(appReq(`/notifications/${N1}`), params({ id: N1 })))).status).toBe(404);
  });

  it("read-all runs the website action", async () => {
    expect((await read(await readAll(appReq("/notifications/read-all", { method: "POST" }), noParams))).data).toEqual({ unread: 0 });
    expect(h.readAll).toHaveBeenCalled();
  });
});

describe("preferences", () => {
  it("default, saved, and refused when malformed", async () => {
    expect((await read(await getPrefs(appReq("/notifications/preferences"), noParams))).data).toEqual({ push: true, messages: true, doubtReplies: true, achievements: true, studyReminder: false, studyReminderTime: "19:00", synced: true });
    const r = await read(await putPrefs(appReq("/notifications/preferences", { method: "PUT", body: { doubtReplies: false, studyReminderTime: "07:30" } }), noParams));
    expect(r.data).toMatchObject({ doubtReplies: false, studyReminderTime: "07:30", synced: true });
    expect(G.db.tables.app_notification_prefs[0]).toMatchObject({ user_id: STUDENT_ID, doubt_replies: false, study_reminder_time: "07:30" });
    expect((await read(await putPrefs(appReq("/notifications/preferences", { method: "PUT", body: { studyReminderTime: "25:00" } }), noParams))).status).toBe(400);
  });

  it("before the database step they stay on the phone (synced false)", async () => {
    resetGuard({}, ["app_notification_prefs"]);
    const r = await read(await putPrefs(appReq("/notifications/preferences", { method: "PUT", body: { push: false } }), noParams));
    expect(r.data).toMatchObject({ push: false, synced: false });
  });
});

describe("push (Expo)", () => {
  it("sends to the active phone only, with the app target, and respects preferences", async () => {
    G.db.tables.app_devices[0].push_token = TOKEN;
    G.db.tables.app_devices.push({ id: "old", user_id: STUDENT_ID, device_id: OTHER_DEVICE, name: "Old", platform: "android", push_token: "ExponentPushToken[oldoldoldoldold]", active: false, activated_at: null, last_seen_at: null });
    const fetchImpl = vi.fn(async (_u: string, init: { body: string }) => new Response(JSON.stringify({ data: JSON.parse(init.body).map(() => ({ status: "ok" })) })));
    const n = await sendPush([{ id: N1, user_id: STUDENT_ID, type: "message", title: "Class moved", body: "Tomorrow", href: `/notifications/${N1}` }], "messages", { fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(n).toBe(1);
    const sent = JSON.parse((fetchImpl.mock.calls[0][1] as { body: string }).body);
    expect(sent).toEqual([{ to: TOKEN, title: "Class moved", body: "Tomorrow", sound: "default", priority: "high", channelId: "messages", data: { notificationId: N1, type: "message", target: { screen: "notification", notificationId: N1, web: `/notifications/${N1}` } } }]);

    G.db.tables.app_notification_prefs.push({ user_id: STUDENT_ID, push: true, messages: false, doubt_replies: true, achievements: true, study_reminder: false, study_reminder_time: "19:00" });
    fetchImpl.mockClear();
    expect(await sendPush([{ id: N1, user_id: STUDENT_ID, title: "x" }], "messages", { fetchImpl: fetchImpl as unknown as typeof fetch })).toBe(0);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("clears a token Expo says is dead, and never throws", async () => {
    G.db.tables.app_devices[0].push_token = TOKEN;
    const dead = vi.fn(async () => new Response(JSON.stringify({ data: [{ status: "error", details: { error: "DeviceNotRegistered" } }] })));
    await sendPush([{ id: N1, user_id: STUDENT_ID, title: "x" }], "achievements", { fetchImpl: dead as unknown as typeof fetch });
    expect(G.db.tables.app_devices[0].push_token).toBeNull();
    const boom = vi.fn(async () => {
      throw new Error("network down");
    });
    G.db.tables.app_devices[0].push_token = TOKEN;
    await expect(sendPush([{ id: N1, user_id: STUDENT_ID, title: "x" }], "messages", { fetchImpl: boom as unknown as typeof fetch })).resolves.toBe(0);
  });

  it("nothing is sent before the database step", async () => {
    resetGuard({}, ["app_devices"]);
    const f = vi.fn();
    expect(await sendPush([{ id: N1, user_id: STUDENT_ID, title: "x" }], "messages", { fetchImpl: f as unknown as typeof fetch })).toBe(0);
    expect(f).not.toHaveBeenCalled();
  });

  it("buildMessages: the master switch wins", () => {
    const prefs = new Map([[STUDENT_ID, { push: false, messages: true, doubtReplies: true, achievements: true }]]);
    expect(buildMessages([{ user_id: STUDENT_ID, title: "x" }], "messages", [{ userId: STUDENT_ID, token: TOKEN }], prefs)).toEqual([]);
  });
});

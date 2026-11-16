import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_TOKEN, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";
import type { Person } from "@/lib/crm/people";

const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const VIEW_TOKEN = "dmlld3h4eHh4eHh4eHh4.eyJleHAiOjQxMDI0NDQ4MDB9.sig";
const key = (e: string) => Buffer.from(e.toLowerCase()).toString("base64url");
const NOW = Date.parse("2026-11-15T12:00:00Z");

const person = (email: string, over: Partial<Person> = {}): Person => ({
  key: key(email), email, name: "Someone", phone: "9876543210", isStudent: false, isEnquiry: true, stage: "new", followUpAt: null,
  enquiredAt: "2026-11-01T06:00:00Z", source: "instagram", studentId: null, signedIn: false, locked: false, setupDone: false, inviteSentAt: null,
  emailsSent: 0, opened: false, replied: false, lastContactAt: null, contacted: false, lastSeen: null, paidAt: null, paidAmount: null, cohorts: [], college: null, message: "Hi", ...over,
});

const h = vi.hoisted(() => ({
  pipeline: vi.fn(),
  allowance: vi.fn(async () => ({ configured: true, limit: 100, left: 80 })),
  markPaid: vi.fn(async () => ({ error: null as string | null, missingStep: false })),
  invite: vi.fn(async () => ({ error: null as string | null, sent: true, reason: undefined as string | undefined })),
  stage: vi.fn(async () => ({ error: null as string | null })),
  activity: vi.fn(async () => ({ error: null as string | null })),
  followUp: vi.fn(async () => ({ error: null as string | null })),
  email: vi.fn(),
  waiting: vi.fn(async () => ({ error: null, sent: 2, failed: 0, left: 1 })),
  wa: vi.fn(async () => ({ error: null as string | null })),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/crm/people", async (orig) => ({ ...(await orig<typeof import("@/lib/crm/people")>()), loadPipeline: h.pipeline }));
vi.mock("@/lib/email/personal", () => ({ emailAllowance: h.allowance, composeFor: vi.fn() }));
vi.mock("@/lib/certificates/server", () => ({ emailConfigured: () => true, siteBase: () => "https://vibhapsychology.com" }));
vi.mock("@/app/(dashboard)/admin/people/actions", () => ({
  markPaid: h.markPaid, sendInvite: h.invite, setStage: h.stage, logActivity: h.activity, setFollowUp: h.followUp, emailPeople: h.email, sendWaitingPeopleEmails: h.waiting, logWhatsApp: h.wa,
}));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { peopleList } from "@/lib/app-api/admin-extras";
import { createAdminClient } from "@/lib/supabase/server";
import { GET as people } from "./people/route";
import { POST as paid } from "./people/[key]/paid/route";
import { POST as invite } from "./people/[key]/invite/route";
import { POST as stage } from "./people/[key]/stage/route";
import { POST as activity } from "./people/[key]/activity/route";
import { POST as followUp } from "./people/[key]/follow-up/route";
import { POST as email } from "./people/email/route";
import { POST as waiting } from "./people/email/send-waiting/route";
import { POST as whatsapp } from "./people/whatsapp/route";

const asAdmin = { token: ADMIN_TOKEN };
const asView = { token: VIEW_TOKEN };
const A = "aanya@x.org";

beforeEach(() => {
  resetGuard();
  G.db.tables.profiles.push(profileRow({ id: VIEW_ID, email: "view@x.org", role: "view_admin" }));
  G.db.tables.app_devices.push({ id: "d9", user_id: VIEW_ID, device_id: "phone-aaaaaaaaaaaaaaaa", name: "x", platform: "android", push_token: null, active: true, activated_at: null, last_seen_at: null });
  G.users[VIEW_TOKEN] = { id: VIEW_ID, email: "view@x.org" };
  clearDeviceCache();
  for (const f of Object.values(h)) f.mockClear();
  h.pipeline.mockResolvedValue({
    paymentReady: true,
    cohorts: [{ id: "c1", name: "Cohort 2" }],
    people: [
      person(A, { name: "Aanya Rao" }),
      person("fee@x.org", { stage: "fee_shared", name: "Fee", lastContactAt: "2026-11-14T06:00:00Z" }),
      person("joined@x.org", { isStudent: true, isEnquiry: false, setupDone: true, stage: "joined", paidAt: "2026-11-10T06:00:00Z", paidAmount: 5000, cohorts: [{ id: "c1", name: "Cohort 2" }], source: null, phone: null, followUpAt: "2026-11-15T10:00:00Z", enquiredAt: null }),
      person("invited@x.org", { isStudent: true, isEnquiry: false, inviteSentAt: "2026-11-12T06:00:00Z", source: null, enquiredAt: null }),
      person("no@x.org", { stage: "not_interested" }),
    ],
  });
  h.email.mockResolvedValue({ error: null, sent: ["Aanya Rao"], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 79, queueFailed: false });
});

describe("GET /admin/people", () => {
  it("students cannot open it; view admins can, without write", async () => {
    expect((await read(await people(appReq("/admin/people"), noParams))).error?.code).toBe("forbidden");
    expect((await read(await people(appReq("/admin/people", asView), noParams))).data.canWrite).toBe(false);
  });

  it("gives the quick views with counts under the other filters", async () => {
    const r = await peopleList(createAdminClient(), { view: "not_paid", quiet: null, q: null, stage: null, cohort: null, source: null, from: null, to: null, last: null, enquiries: false }, { limit: 50, start: 0 }, true, NOW);
    expect(r.view).toBe("not_paid");
    expect(r.items.map((p) => p.email)).toEqual(["fee@x.org", "invited@x.org"]);
    expect(r.counts).toMatchObject({ all: 5, not_paid: 2, invited: 1, not_converted: 2, joined: 1 });
    expect(r.views.map((v) => v.id)).toEqual(["all", "not_paid", "invited", "not_converted", "quiet", "joined"]);
    expect(r).toMatchObject({ paymentReady: true, followUpsDue: 1, allowance: { left: 80 }, quietDays: 14, quietChoices: [7, 14, 30], canWrite: true });
    expect(r.sources).toContain("instagram");
    const conv = await peopleList(createAdminClient(), { view: "not_converted", quiet: null, q: "aanya", stage: null, cohort: null, source: null, from: null, to: null, last: null, enquiries: false }, { limit: 50, start: 0 }, true, NOW);
    expect(conv.items.map((p) => p.email)).toEqual([A]);
    expect(conv.counts.all).toBe(1);
  });

  it("rows have every promised value and the person's key", async () => {
    const r = await read(await people(appReq("/admin/people?view=joined", asAdmin), noParams));
    const [p] = r.data.items;
    expect(p).toMatchObject({ key: key("joined@x.org"), joined: true, paidAmount: 5000, stageLabel: "Joined", source: "Added as a student", whatsapp: null, cohorts: [{ id: "c1", name: "Cohort 2" }] });
    const first = (await read(await people(appReq("/admin/people?q=aanya", asAdmin), noParams))).data.items[0];
    expect(first.whatsapp).toBe("https://wa.me/919876543210");
    for (const k of ["key", "name", "email", "stage", "stageLabel", "source", "lastContact"]) expect(typeof first[k]).toBe("string");
  });

  it("filters stage, cohort, source, dates and last contact; enquiries=1 keeps enquiries only; pages", async () => {
    const q = async (s: string) => (await read(await people(appReq(`/admin/people?${s}`, asAdmin), noParams))).data;
    expect((await q("stage=fee_shared")).total).toBe(1);
    expect((await q("cohort=c1")).total).toBe(1);
    expect((await q("source=instagram")).total).toBe(3);
    expect((await q("last=never")).total).toBe(4);
    expect((await q("from=2026-11-12&to=2026-11-13")).total).toBe(1);
    expect((await q("enquiries=1")).total).toBe(3);
    expect((await q("view=nonsense")).view).toBe("all");
    const p1 = await q("limit=2");
    expect(p1).toMatchObject({ total: 5, nextCursor: "2" });
    expect((await q("limit=2&cursor=4")).items).toHaveLength(1);
  });
});

describe("people actions", () => {
  it("view admins write nothing", async () => {
    const k = key(A);
    for (const r of [
      paid(appReq(`/admin/people/${k}/paid`, { ...asView, body: { paid: true } }), params({ key: k })),
      invite(appReq(`/admin/people/${k}/invite`, { ...asView, body: {} }), params({ key: k })),
      stage(appReq(`/admin/people/${k}/stage`, { ...asView, body: { stage: "contacted" } }), params({ key: k })),
      email(appReq("/admin/people/email", { ...asView, body: { keys: [k], subject: "a", body: "b" } }), noParams),
      whatsapp(appReq("/admin/people/whatsapp", { ...asView, body: { keys: [k], text: "Hi" } }), noParams),
    ]) expect((await read(await r)).error?.code).toBe("forbidden");
    for (const f of [h.markPaid, h.invite, h.stage, h.email, h.wa]) expect(f).not.toHaveBeenCalled();
  });

  it("mark paid passes the email from the key; before the database step it answers unavailable with missingStep", async () => {
    const k = key(A);
    expect((await read(await paid(appReq(`/admin/people/${k}/paid`, { ...asAdmin, body: { paid: true, amount: 5000, note: "UPI" } }), params({ key: k })))).data).toEqual({ paid: true });
    expect(h.markPaid).toHaveBeenCalledWith(A, true, 5000, "UPI");
    h.markPaid.mockResolvedValueOnce({ error: "Paste 2026_11_15_people_payment.sql in Supabase first, then Mark paid will save.", missingStep: true });
    const r = await read(await paid(appReq(`/admin/people/${k}/paid`, { ...asAdmin, body: { paid: true } }), params({ key: k })));
    expect(r.error).toMatchObject({ code: "unavailable", details: { missingStep: true } });
    expect((await read(await paid(appReq("/admin/people/bad/paid", { ...asAdmin, body: { paid: true } }), params({ key: "bad" })))).error?.code).toBe("not_found");
  });

  it("invite, stage, activity and follow-up call the website's actions", async () => {
    const k = key(A);
    expect((await read(await invite(appReq(`/admin/people/${k}/invite`, { ...asAdmin, body: { name: "Aanya" } }), params({ key: k })))).data).toEqual({ sent: true, reason: null });
    expect(h.invite).toHaveBeenCalledWith(A, "Aanya");
    expect((await read(await stage(appReq(`/admin/people/${k}/stage`, { ...asAdmin, body: { stage: "contacted" } }), params({ key: k })))).data).toEqual({ saved: true });
    h.stage.mockResolvedValueOnce({ error: "Unknown stage." });
    expect((await read(await stage(appReq(`/admin/people/${k}/stage`, { ...asAdmin, body: { stage: "zzz" } }), params({ key: k })))).error?.code).toBe("bad_request");
    expect((await read(await activity(appReq(`/admin/people/${k}/activity`, { ...asAdmin, body: { kind: "call", text: "Spoke" } }), params({ key: k })))).data).toEqual({ saved: true });
    expect(h.activity).toHaveBeenCalledWith(A, "call", "Spoke");
    expect((await read(await activity(appReq(`/admin/people/${k}/activity`, { ...asAdmin, body: { kind: "sms", text: "x" } }), params({ key: k })))).error?.code).toBe("bad_request");
    expect((await read(await followUp(appReq(`/admin/people/${k}/follow-up`, { ...asAdmin, body: { date: "2026-11-20" } }), params({ key: k })))).data).toEqual({ saved: true });
    expect((await read(await followUp(appReq(`/admin/people/${k}/follow-up`, { ...asAdmin, body: { date: "soon" } }), params({ key: k })))).error?.code).toBe("bad_request");
  });

  it("emails people by key and sends waiting pipeline emails", async () => {
    const r = await read(await email(appReq("/admin/people/email", { ...asAdmin, body: { keys: [key(A), "junk"], subject: "Hi {first_name}", body: "x" } }), noParams));
    expect(r.data).toMatchObject({ sent: ["Aanya Rao"], remainingToday: 79 });
    expect(h.email).toHaveBeenCalledWith({ emails: [A], subject: "Hi {first_name}", body: "x" });
    expect((await read(await email(appReq("/admin/people/email", { ...asAdmin, body: { keys: ["junk"], subject: "a", body: "b" } }), noParams))).error?.code).toBe("bad_request");
    expect((await read(await waiting(appReq("/admin/people/email/send-waiting", { ...asAdmin, method: "POST" }), noParams))).data).toEqual({ sent: 2, failed: 0, left: 1 });
  });

  it("gives WhatsApp links with the first name filled and logs only pipeline people", async () => {
    const r = await read(await whatsapp(appReq("/admin/people/whatsapp", { ...asAdmin, body: { keys: [key(A), key("stranger@x.org")], text: "Hi {first_name}" } }), noParams));
    expect(r.data.links).toEqual([{ key: key(A), name: "Aanya Rao", url: `https://wa.me/919876543210?text=${encodeURIComponent("Hi Aanya")}` }]);
    expect(h.wa).toHaveBeenCalledWith([A], "Hi {first_name}");
  });
});

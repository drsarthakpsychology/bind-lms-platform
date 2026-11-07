import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "1.2.3.4" }) }));
const rate = vi.fn();
vi.mock("@/lib/rate-limit", () => ({ rateLimitResult: (...a: unknown[]) => rate(...a) }));
const loadFormBySlug = vi.fn();
vi.mock("@/lib/forms/load", () => ({ loadFormBySlug: (...a: unknown[]) => loadFormBySlug(...a) }));
const linkContact = vi.fn();
vi.mock("@/lib/forms/contacts", async (orig) => ({ ...(await orig<typeof import("@/lib/forms/contacts")>()), linkContact: (...a: unknown[]) => linkContact(...a) }));
const insert = vi.fn();
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => ({ from: () => ({ insert }) }) }));

import { submitLinkForm } from "./actions";

const FORM = {
  id: "f1",
  slug: "dd43237dfa",
  title: "T",
  description: null,
  isActive: true,
  createdAt: "",
  fields: [
    { key: "full_name", type: "text", label: "Full Name", required: true },
    { key: "email_address", type: "email", label: "Email Address", required: true },
    { key: "mobile_number", type: "phone", label: "Mobile Number", required: true },
  ],
};

const fd = (o: Record<string, string>) => {
  const d = new FormData();
  for (const [k, v] of Object.entries(o)) d.append(k, v);
  return d;
};

beforeEach(() => {
  vi.clearAllMocks();
  rate.mockResolvedValue("allowed");
  loadFormBySlug.mockResolvedValue(FORM);
  linkContact.mockResolvedValue("c1");
  insert.mockResolvedValue({ error: null });
});

describe("submitLinkForm", () => {
  it("saves answers with name, email and phone copied out and the contact linked", async () => {
    const res = await submitLinkForm("dd43237dfa", fd({ full_name: "Asha <b>K</b>", email_address: "Asha@Example.com", mobile_number: "98765 43210" }));
    expect(res).toEqual({ ok: true });
    expect(linkContact).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ email: "asha@example.com", name: "Asha K", tag: "dd43237dfa" }));
    expect(insert).toHaveBeenCalledWith({
      form_id: "f1",
      responses: { full_name: "Asha K", email_address: "asha@example.com", mobile_number: "98765 43210" },
      name: "Asha K",
      email: "asha@example.com",
      phone: "98765 43210",
      contact_id: "c1",
    });
  });
  it("pretends success for bots and saves nothing", async () => {
    expect(await submitLinkForm("dd43237dfa", fd({ _hp: "spam" }))).toEqual({ ok: true });
    expect(insert).not.toHaveBeenCalled();
  });
  it("refuses a closed form", async () => {
    loadFormBySlug.mockResolvedValue({ ...FORM, isActive: false });
    expect(await submitLinkForm("dd43237dfa", fd({}))).toMatchObject({ ok: false, closed: true });
  });
  it("returns per question errors", async () => {
    const res = await submitLinkForm("dd43237dfa", fd({ full_name: "A", email_address: "x" }));
    expect(res).toMatchObject({ ok: false, errors: { email_address: "Enter a valid email.", mobile_number: "Please fill this in." } });
    expect(insert).not.toHaveBeenCalled();
  });
  it("blocks when over the limit, but a counter outage still saves", async () => {
    rate.mockResolvedValueOnce("limited");
    expect((await submitLinkForm("dd43237dfa", fd({}))).ok).toBe(false);
    rate.mockResolvedValue("unavailable");
    expect(await submitLinkForm("dd43237dfa", fd({ full_name: "A", email_address: "a@b.co", mobile_number: "9876543210" }))).toEqual({ ok: true });
  });
});

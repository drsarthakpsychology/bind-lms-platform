import { describe, expect, it, vi } from "vitest";
import { linkContact, normalizeEmail, planContact, type ContactRow } from "./contacts";

const input = { email: "asha@example.com", name: "Asha", phone: "9876543210", tag: "dd43237dfa", answers: { full_name: "Asha", topics: ["A", "B"] } };

describe("normalizeEmail", () => {
  it("lower cases and trims, rejects junk", () => {
    expect(normalizeEmail("  Asha@Example.COM ")).toBe("asha@example.com");
    expect(normalizeEmail("nope")).toBeNull();
    expect(normalizeEmail(null)).toBeNull();
  });
});

describe("planContact", () => {
  it("creates a new contact tagged with the form slug", () => {
    expect(planContact(null, input)).toEqual({
      action: "create",
      row: { email: "asha@example.com", name: "Asha", phone: "9876543210", tags: ["dd43237dfa"], attributes: { full_name: "Asha", topics: "A, B" } },
    });
  });
  it("links an existing contact, adds the tag and fills only blanks", () => {
    const existing: ContactRow = { id: "c1", email: "asha@example.com", name: "Asha K", phone: null, tags: ["lead"], attributes: { full_name: "Asha K" } };
    expect(planContact(existing, input)).toEqual({
      action: "link",
      id: "c1",
      patch: { phone: "9876543210", tags: ["lead", "dd43237dfa"], attributes: { full_name: "Asha K", topics: "A, B" } },
    });
  });
  it("changes nothing when the contact already has it all", () => {
    const existing: ContactRow = { id: "c1", email: "asha@example.com", name: "Asha", phone: "1", tags: ["dd43237dfa"], attributes: { full_name: "x", topics: "y" } };
    expect(planContact(existing, input)).toEqual({ action: "link", id: "c1", patch: null });
  });
});

/** A tiny fake of the Supabase query builder, enough for linkContact. */
function fakeAdmin(opts: { found?: (ContactRow | null)[]; insert?: { data: unknown; error: unknown } }) {
  const found = [...(opts.found ?? [null])];
  const calls: { op: string; payload?: unknown }[] = [];
  const admin = {
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: found.shift() ?? null }) }) }),
      update: (payload: unknown) => {
        calls.push({ op: "update", payload });
        return { eq: async () => ({ error: null }) };
      },
      insert: (payload: unknown) => {
        calls.push({ op: "insert", payload });
        return { select: () => ({ single: async () => opts.insert ?? { data: { id: "new" }, error: null } }) };
      },
    }),
  };
  return { admin: admin as never, calls };
}

describe("linkContact", () => {
  it("creates when no contact has the email", async () => {
    const { admin, calls } = fakeAdmin({ found: [null] });
    expect(await linkContact(admin, input)).toBe("new");
    expect(calls.map((c) => c.op)).toEqual(["insert"]);
  });
  it("reuses the winner when two inserts race", async () => {
    const winner: ContactRow = { id: "w1", email: input.email, name: "Asha", phone: "9876543210", tags: ["dd43237dfa"], attributes: {} };
    const { admin, calls } = fakeAdmin({ found: [null, winner], insert: { data: null, error: { code: "23505" } } });
    expect(await linkContact(admin, input)).toBe("w1");
    expect(calls.map((c) => c.op)).toEqual(["insert", "update"]);
  });
  it("returns null instead of throwing when saving fails", async () => {
    const { admin } = fakeAdmin({ found: [null], insert: { data: null, error: { code: "500" } } });
    expect(await linkContact(admin, input)).toBeNull();
    const broken = { from: vi.fn(() => { throw new Error("down"); }) } as never;
    expect(await linkContact(broken, input)).toBeNull();
  });
});

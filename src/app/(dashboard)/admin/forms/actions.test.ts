import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
const requireSuperAdmin = vi.fn();
vi.mock("@/lib/auth/guards", () => ({ requireSuperAdmin: () => requireSuperAdmin() }));
const loadForm = vi.fn();
const countSubmissions = vi.fn();
vi.mock("@/lib/forms/load", () => ({ loadForm: (...a: unknown[]) => loadForm(...a), countSubmissions: (...a: unknown[]) => countSubmissions(...a) }));

const ops: { op: string; payload?: unknown }[] = [];
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({
    from: () => ({
      update: (payload: unknown) => {
        ops.push({ op: "update", payload });
        return { eq: async () => ({ error: null }) };
      },
      delete: () => {
        ops.push({ op: "delete" });
        return { eq: async () => ({ error: null }) };
      },
      insert: (payload: unknown) => {
        ops.push({ op: "insert", payload });
        return { select: () => ({ single: async () => ({ data: { id: "new" }, error: null }) }) };
      },
    }),
  }),
}));

import { createForm, duplicateForm, removeForm, setFormOpen, updateForm } from "./actions";

const draft = { title: "T", description: "", isActive: true, fields: [{ key: "q", type: "text", label: "Q", required: false }] };

beforeEach(() => {
  vi.clearAllMocks();
  ops.length = 0;
  requireSuperAdmin.mockResolvedValue({ id: "me", role: "admin" });
  loadForm.mockResolvedValue({ id: "f1", title: "T", description: null, fields: [], isActive: true });
});

describe("form actions", () => {
  it("refuse anyone who is not a Super Admin", async () => {
    requireSuperAdmin.mockResolvedValue(null);
    for (const res of [await createForm(draft), await updateForm("f1", draft), await setFormOpen("f1", false), await duplicateForm("f1"), await removeForm("f1", true)]) {
      expect(res.error).toMatch(/Super Admin/);
    }
    expect(ops).toEqual([]);
  });

  it("asks before touching a form that has answers, then closes it instead of deleting", async () => {
    countSubmissions.mockResolvedValue(259);
    expect(await removeForm("f1", false)).toEqual({ error: null, outcome: "needs_confirm", responses: 259 });
    expect(ops).toEqual([]);
    expect(await removeForm("f1", true)).toEqual({ error: null, outcome: "archived", responses: 259 });
    expect(ops).toEqual([{ op: "update", payload: { is_active: false } }]);
  });

  it("deletes a form with no answers", async () => {
    countSubmissions.mockResolvedValue(0);
    expect(await removeForm("f1", false)).toEqual({ error: null, outcome: "deleted" });
    expect(ops.map((o) => o.op)).toEqual(["update", "delete"]);
  });

  it("copies a form closed, with a new link and no answers", async () => {
    expect(await duplicateForm("f1")).toEqual({ error: null, id: "new" });
    expect(ops[0].payload).toMatchObject({ title: "Copy of T", is_active: false, created_by: "me" });
    expect((ops[0].payload as { slug: string }).slug).toMatch(/^[0-9a-f]{10}$/);
  });

  it("rejects a form with no questions", async () => {
    expect((await createForm({ ...draft, fields: [] })).error).toBe("Add at least one question.");
  });
});

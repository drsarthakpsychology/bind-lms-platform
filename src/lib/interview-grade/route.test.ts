import { beforeEach, describe, expect, it, vi } from "vitest";
import { SEED_CASES } from "@/lib/psychopharm/sim/cases";

vi.mock("server-only", () => ({}));

const m = vi.hoisted(() => ({
  session: { id: "11111111-1111-4111-8111-111111111111", case_id: "22222222-2222-4222-8222-222222222222", user_id: "u1", difficulty: "cooperative" } as Record<string, unknown> | null,
  turns: [] as { role: string; content: string }[],
  guardThrows: false,
  stored: null as unknown,
  saved: true,
  record: vi.fn(async () => true),
  ai: vi.fn(),
}));

vi.mock("@/lib/auth/api-guard", () => ({ requireStudentApi: async () => ({ ok: true, profile: { id: "u1" } }) }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: async () => true }));
vi.mock("@/lib/learn/model/server", () => ({ recordAttempts: m.record }));
vi.mock("@/lib/ai/client", () => ({ aiChat: m.ai }));
vi.mock("@/lib/ai/guards", () => ({
  guardStudentCall: () => {
    if (m.guardThrows) throw new Error("no no-train provider");
  },
}));
vi.mock("@/lib/interview-grade/store", () => ({ loadGrade: async () => m.stored, saveGrade: async () => m.saved }));
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({
    from(table: string) {
      const q = {
        select: () => q,
        eq: () => q,
        order: () => q,
        limit: async () => ({ data: m.turns }),
        update: () => q,
        maybeSingle: async () => ({ data: table === "sim_sessions" ? m.session : { title: SEED_CASES[0].title, case_data: SEED_CASES[0] } }),
      };
      return q;
    },
  }),
}));

import { POST } from "@/app/api/practice/sim/grade/route";

const body = (extra: Record<string, unknown> = {}) =>
  new Request("http://x/api/practice/sim/grade", {
    method: "POST",
    body: JSON.stringify({ sessionId: m.session?.id ?? "11111111-1111-4111-8111-111111111111", submission: { mse: { mood: "low" }, risk: { findings: "passive", level: "moderate" }, formulation: "stress" }, ...extra }),
  });

beforeEach(() => {
  m.session = { id: "11111111-1111-4111-8111-111111111111", case_id: "22222222-2222-4222-8222-222222222222", user_id: "u1", difficulty: "cooperative" };
  m.turns = [
    { role: "student", content: "What brings you in?" },
    { role: "patient", content: "Heaviness." },
    { role: "student", content: "Have you had thoughts of ending your life?" },
    { role: "patient", content: "Sometimes I think they'd be better off." },
  ];
  m.guardThrows = false;
  m.stored = null;
  m.record.mockClear();
  m.ai.mockReset();
});

describe("POST /api/practice/sim/grade (AI mocked)", () => {
  it("grades, stores and records <topic>:apply and <topic>:risk", async () => {
    m.ai.mockResolvedValue({ text: "", provider: "groq", json: { mse: [{ domain: "mood", verdict: "accurate", feedback: "Yes." }], risk: { expected_level: "moderate", feedback: "Good direct question." }, rapport: { score: 2, feedback: "Okay." }, formulation: { score: 2, feedback: "Thin." }, better_questions: [], summary: "Fine." } });
    const res = await POST(body());
    expect(res.status).toBe(200);
    const j = (await res.json()) as { grade: { aiChecked: boolean; parts: { risk: { asked: { id: string }[] } } } };
    expect(j.grade.aiChecked).toBe(true);
    expect(j.grade.parts.risk.asked.map((x) => x.id)).toContain("death-thoughts");
    expect(m.ai.mock.calls[0][1]).toMatchObject({ workload: "debrief_scoring" });
    const calls = m.record.mock.calls as unknown as [string, { skill: string }[]][];
    expect(calls[0][1].map((a) => a.skill)).toEqual(expect.arrayContaining(["depression:apply", "depression:risk"]));
  });

  it("keeps the safety guard: no safe provider means no model call, rules-only grade", async () => {
    m.guardThrows = true;
    const res = await POST(body());
    const j = (await res.json()) as { grade: { aiChecked: boolean } };
    expect(j.grade.aiChecked).toBe(false);
    expect(m.ai).not.toHaveBeenCalled();
  });

  it("refuses someone else's session and odd bodies", async () => {
    m.session = { ...m.session!, user_id: "someone-else" };
    expect((await POST(body())).status).toBe(404);
    expect((await POST(body({ hack: true }))).status).toBe(400);
  });

  it("returns a stored grade without marking again", async () => {
    m.stored = { grade: { overall: 50 }, submission: {} };
    const j = (await (await POST(body())).json()) as { cached: boolean };
    expect(j.cached).toBe(true);
    expect(m.record).not.toHaveBeenCalled();
  });
});

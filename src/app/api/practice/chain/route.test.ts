import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock server auth/rate-limit before importing the route (same pattern as the
// MSE/OSCE attempt-route tests). State is settable per test so each branch of
// the chain logic can be exercised. insertArgs/updateArgs capture what the
// route wrote, so assertions read the real payloads.
const { supabase, insertArgs, updateArgs, state } = vi.hoisted(() => {
  const state = {
    user: { id: "user-1" } as { id: string } | null,
    session: { case_id: "case-uuid-1" } as { case_id: string } | null,
    simCase: {
      title: "Ravi, 32 — the voice",
      follow_up: null,
    } as { title: string; follow_up: Record<string, unknown> | null },
    existingChain: null as { id: string; steps: Array<{ surface: string; status: string }> } | null,
    updateError: null as { message: string } | null,
    insertError: null as { message: string } | null,
    insertId: "chain-uuid-1",
  };

  const insertArgs: Record<string, unknown>[] = [];
  const updateArgs: Record<string, unknown>[] = [];

  const practiceChain = {
    select: vi.fn(() => practiceChain),
    eq: vi.fn(() => practiceChain),
    maybeSingle: vi.fn(() => Promise.resolve({ data: state.existingChain })),
    update: vi.fn((arg: Record<string, unknown>) => {
      updateArgs.push(arg);
      return { eq: vi.fn(() => Promise.resolve({ error: state.updateError })) };
    }),
    insert: vi.fn((arg: Record<string, unknown>) => {
      insertArgs.push(arg);
      return {
        select: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({ data: { id: state.insertId }, error: state.insertError }),
          ),
        })),
      };
    }),
  };

  const supabase = {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: state.user } })),
    },
    from: vi.fn((table: string) => {
      if (table === "sim_sessions") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn(() => ({
                maybeSingle: vi.fn(() => Promise.resolve({ data: state.session })),
              })),
            })),
          })),
        };
      }
      if (table === "sim_cases") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn(() => Promise.resolve({ data: state.simCase })),
            })),
          })),
        };
      }
      return practiceChain; // practice_chains
    }),
  };

  return { supabase, insertArgs, updateArgs, state };
});

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => supabase,
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue(true),
}));

import { POST } from "./route";

const SESSION_ID = "11111111-2222-3333-8888-555555555555";

function post(body: unknown) {
  return POST(
    new Request("http://test/api/practice/chain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/practice/chain", () => {
  beforeEach(() => {
    insertArgs.length = 0;
    updateArgs.length = 0;
    // Default state for a fresh chain creation.
    state.user = { id: "user-1" };
    state.session = { case_id: "case-uuid-1" };
    state.simCase = { title: "Ravi, 32 — the voice", follow_up: null };
    state.existingChain = null;
    state.updateError = null;
    state.insertError = null;
  });

  it("rejects unauthenticated requests", async () => {
    state.user = null;
    const res = await post({ session_id: SESSION_ID });
    expect(res.status).toBe(401);
  });

  it("rejects an invalid body", async () => {
    const res = await post({ session_id: "not-a-uuid" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when the session is not the caller's", async () => {
    state.session = null;
    const res = await post({ session_id: SESSION_ID });
    expect(res.status).toBe(404);
  });

  it("creates a chain WITHOUT a follow-up step when the case has no follow_up content", async () => {
    const res = await post({ session_id: SESSION_ID });
    expect(res.status).toBe(200);
    expect(insertArgs).toHaveLength(1);
    const row = insertArgs[0];
    expect(row.user_id).toBe("user-1");
    const surfaces = (row.steps as Array<{ surface: string }>).map((s) => s.surface);
    expect(surfaces).toEqual(["consulting_room", "formulation", "mse", "rounds"]);
    expect(surfaces).not.toContain("follow_up");
  });

  it("appends a follow-up step when the case has follow_up content", async () => {
    state.simCase = { title: "Ravi, 32 — the voice", follow_up: { reason: "medication review" } };
    const res = await post({ session_id: SESSION_ID });
    expect(res.status).toBe(200);
    expect(insertArgs).toHaveLength(1);
    const row = insertArgs[0];
    const surfaces = (row.steps as Array<{ surface: string }>).map((s) => s.surface);
    expect(surfaces).toEqual(["consulting_room", "formulation", "mse", "rounds", "follow_up"]);
    // The follow-up surfaces as the next step once the base chain is done.
    const body = await res.json();
    expect(body.next).toMatchObject({ surface: "formulation", label: "Formulation Forge", patient: "Ravi" });
  });

  it("extends an existing chain idempotently when follow_up content lands later", async () => {
    state.existingChain = {
      id: "chain-1",
      steps: [{ surface: "formulation", status: "pending" }],
    };
    state.simCase = { title: "Ravi, 32 — the voice", follow_up: { reason: "medication review" } };
    const res = await post({ session_id: SESSION_ID });
    expect(res.status).toBe(200);
    expect(updateArgs).toHaveLength(1);
    const updateArg = updateArgs[0] as { steps: Array<{ surface: string }> };
    const followUpSteps = updateArg.steps.filter((s) => s.surface === "follow_up");
    expect(followUpSteps).toHaveLength(1);
    expect(followUpSteps[0]).toMatchObject({ surface: "follow_up", status: "pending" });
  });

  it("does not duplicate the follow-up step on a chain that already has it", async () => {
    state.existingChain = {
      id: "chain-1",
      steps: [
        { surface: "formulation", status: "pending" },
        { surface: "follow_up", status: "pending" },
      ],
    };
    state.simCase = { title: "Ravi, 32 — the voice", follow_up: { reason: "medication review" } };
    const res = await post({ session_id: SESSION_ID });
    expect(res.status).toBe(200);
    expect(updateArgs).toHaveLength(1);
    const updateArg = updateArgs[0] as { steps: Array<{ surface: string }> };
    expect(updateArg.steps.filter((s) => s.surface === "follow_up")).toHaveLength(1);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const store = vi.hoisted(() => ({
  listLiveCases: vi.fn(),
  getAiCase: vi.fn(),
  saveAiCase: vi.fn(),
  flagAiCase: vi.fn(),
  listForReview: vi.fn(),
  setAiCaseStatus: vi.fn(),
}));
const cache = vi.hoisted(() => ({ mem: new Map<string, string>() }));

vi.mock("./store", () => store);
vi.mock("@/lib/rate-limit", () => ({ rateLimit: vi.fn(async () => true) }));
vi.mock("@/lib/ai/client", () => ({ aiChat: vi.fn(async () => ({ text: "", provider: "fixture" })) }));
vi.mock("@/lib/ai/cache", () => ({
  cacheKeyFor: (w: string, q: string) => `${w}|${q}`,
  readCached: async (k: string) => (cache.mem.has(k) ? { text: cache.mem.get(k)!, hit: "memory" } : { text: "", hit: "none" }),
  writeCached: async (k: string, _w: string, _p: string, text: string) => {
    cache.mem.set(k, text);
  },
}));

import { getAiPracticeCase, loadAiCase } from "./index";
import { GOOD_MDD } from "./fixtures.test-data";

beforeEach(() => {
  cache.mem.clear();
  for (const f of Object.values(store)) f.mockReset();
  store.listLiveCases.mockResolvedValue([]);
  store.getAiCase.mockResolvedValue(null);
  store.saveAiCase.mockResolvedValue(false); // table missing
});

describe("getAiPracticeCase (AI mocked, tables missing)", () => {
  it("generates, then serves the same request from the cache and by id", async () => {
    const chat = vi.fn(async () => ({ text: JSON.stringify(GOOD_MDD), provider: "groq" }));
    const a = await getAiPracticeCase({ dx: "mdd", difficulty: 2, setting: "indian", chat });
    expect(a?.fresh).toBe(true);
    expect(a?.daily.answer).toBe("mdd");
    const b = await getAiPracticeCase({ dx: "mdd", difficulty: 2, setting: "indian", chat });
    expect(b?.fresh).toBe(false);
    expect(chat).toHaveBeenCalledTimes(1);
    const byId = await loadAiCase(a!.case.id);
    expect(byId?.case.id).toBe(a!.case.id);
    expect(byId?.status).toBe("live");
  });

  it("returns null when nothing is stored and AI is off", async () => {
    expect(await getAiPracticeCase({ dx: "mdd", difficulty: 1, setting: "global" })).toBeNull();
  });

  it("reuses a stored live case before generating", async () => {
    store.listLiveCases.mockResolvedValueOnce([{ ...GOOD_MDD, id: "ai-mdd-x", answer: "mdd", chapter: "depressive", status: "live", flags: 0 }]);
    const chat = vi.fn();
    const r = await getAiPracticeCase({ dx: "mdd", difficulty: 2, setting: "indian", chat });
    expect(r?.case.id).toBe("ai-mdd-x");
    expect(chat).not.toHaveBeenCalled();
  });
});

describe("loadAiCase", () => {
  it("refuses removed cases and odd ids", async () => {
    store.getAiCase.mockResolvedValueOnce({ id: "ai-mdd-y", clues: GOOD_MDD.clues, answer: "mdd", status: "removed", flags: 2 });
    expect(await loadAiCase("ai-mdd-y")).toBeNull();
    expect(await loadAiCase("../etc")).toBeNull();
  });
});

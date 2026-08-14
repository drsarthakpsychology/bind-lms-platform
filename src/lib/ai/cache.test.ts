import { describe, expect, it, beforeEach } from "vitest";
import {
  cacheKeyFor,
  readCached,
  readMemoryCache,
  writeCached,
  writeMemoryCache,
} from "./cache";

describe("AI response cache (§37 capacity)", () => {
  beforeEach(() => {
    // Reset the in-memory cache by writing nothing and relying on module state;
    // each test uses distinct keys.
  });

  it("cacheKeyFor is stable and ignores case/whitespace", () => {
    const a = cacheKeyFor("knowledge_tutor", "What is depression", "grounded", "difficult");
    const b = cacheKeyFor("knowledge_tutor", "  what is depression ", "grounded", "difficult");
    expect(a).toBe(b);
    expect(a.length).toBe(64); // sha256 hex
  });

  it("cacheKeyFor distinguishes questions with different content", () => {
    const a = cacheKeyFor("knowledge_tutor", "What is depression?", "grounded", "difficult");
    const b = cacheKeyFor("knowledge_tutor", "What is depression", "grounded", "difficult");
    expect(a).not.toBe(b);
  });

  it("memory write then read returns the text + model", () => {
    const key = cacheKeyFor("knowledge_tutor", "dopamine hypothesis", "grounded", "difficult");
    writeMemoryCache(key, "The dopamine hypothesis...", "deepseek-v4-pro");
    const hit = readMemoryCache(key);
    expect(hit?.text).toBe("The dopamine hypothesis...");
    expect(hit?.model).toBe("deepseek-v4-pro");
  });

  it("a miss returns empty / hit=none", async () => {
    const key = cacheKeyFor("knowledge_tutor", "never asked before", "grounded", "difficult");
    const r = await readCached(key);
    expect(r.hit).toBe("none");
    expect(r.text).toBe("");
  });

  it("writeCached then readCached returns a memory hit", async () => {
    const key = cacheKeyFor("knowledge_tutor", "what is anxiety", "grounded", "difficult");
    await writeCached(key, "knowledge_tutor", "groq", "Anxiety is...", "llama-3.3-70b");
    const r = await readCached(key);
    expect(r.hit).toBe("memory");
    expect(r.text).toBe("Anxiety is...");
    expect(r.model).toBe("llama-3.3-70b");
  });

  it("different questions never collide", async () => {
    const k1 = cacheKeyFor("knowledge_tutor", "what is depression", "grounded", "difficult");
    const k2 = cacheKeyFor("knowledge_tutor", "what is mania", "grounded", "difficult");
    writeMemoryCache(k1, "depression answer");
    expect(readMemoryCache(k2)).toBeNull();
  });
});

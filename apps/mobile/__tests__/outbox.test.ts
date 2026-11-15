import type { SaveItem } from "@/api/contract";
import { createOutbox } from "@/lib/outbox";
import { memoryStore } from "@/lib/storage";

describe("save outbox", () => {
  it("keeps only the newest progress per lecture and never goes backwards", async () => {
    const post = jest.fn(async () => {
      throw new Error("offline");
    });
    const box = createOutbox({ store: memoryStore(), post, schedule: () => undefined });
    await box.add({ kind: "progress", payload: { lessonId: "l5", watched: 100, duration: 3600 } });
    await box.add({ kind: "progress", payload: { lessonId: "l5", watched: 60, duration: 3600 } });
    await box.add({ kind: "progress", payload: { lessonId: "l6", watched: 10, duration: 3600 } });
    await box.flush();
    expect(box.items()).toHaveLength(2);
    expect((box.items()[0] as Extract<SaveItem, { kind: "progress" }>).payload.watched).toBe(100);
    expect(box.state.get().retrying).toBe(true);
  });

  it("removes items the server stored or dropped, keeps the rest", async () => {
    const post = jest.fn(async (items: SaveItem[]) => ({ results: items.map((i) => ({ id: i.id, status: i.id === "i1" ? ("retry" as const) : ("ok" as const) })) }));
    const store = memoryStore();
    const box = createOutbox({ store, post, schedule: () => undefined, newId: (() => { let n = 0; return () => `i${n++}`; })() });
    await box.add({ kind: "complete", payload: { lessonId: "l1" } });
    await box.add({ kind: "complete", payload: { lessonId: "l2" } });
    await box.flush();
    expect(box.items().map((i) => i.id)).toEqual(["i1"]);
    expect(JSON.parse((await store.get("vibha.outbox.v1"))!)).toHaveLength(1);
  });

  it("clears on sign-out", async () => {
    const box = createOutbox({ store: memoryStore(), post: async () => { throw new Error("x"); }, schedule: () => undefined });
    await box.add({ kind: "complete", payload: { lessonId: "l1" } });
    await box.clear();
    expect(box.items()).toEqual([]);
    expect(box.state.get()).toMatchObject({ pending: 0, retrying: false });
  });
});

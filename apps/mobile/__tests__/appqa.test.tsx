/**
 * Bugs found in the final app check, one test each.
 */
import { focusManager } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";

import { homeView, lectureView, notificationDetailView, streamView } from "@/api/adapt-core";
import type { SaveItem } from "@/api/contract";
import { ApiFailure } from "@/api/errors";
import { onAppState } from "@/api/lifecycle";
import { outbox } from "@/api/outbox";
import { session } from "@/auth";
import { createOutbox } from "@/lib/outbox";
import { usePushRouting } from "@/push";
import { memoryStore } from "@/lib/storage";
import { issued } from "@/screens/me/certificates";
import { act, fireEvent, screen } from "@testing-library/react-native";
import { Button } from "@/ds";
import { render } from "./utils";

describe("answers with nulls draw instead of throwing", () => {
  it("Home without a step, lists or quests", () => {
    for (const raw of [null, {}, { step: null, upNext: null, courses: [null], quests: { quests: null } }]) {
      const h = homeView(raw);
      expect(typeof h.step.title).toBe("string");
      expect(h.step.title.length).toBeGreaterThan(0);
      expect(Array.isArray(h.upNext) && Array.isArray(h.courses)).toBe(true);
    }
    expect(homeView({ quests: { quests: [{ id: "q1", label: "Read", target: null }] } }).quests?.quests[0]?.target.screen).toBe("home");
  });
  it("a lecture without progress, materials or a title", () => {
    const l = lectureView({ id: "l1", progress: null, materials: null, assignment: { id: "a1", submission: { files: null } } });
    expect(l.progress).toEqual({ watchedSeconds: 0, completed: false });
    expect(l.materials).toEqual([]);
    expect(l.title).toBe("Lecture");
    expect(l.assignment?.submission?.files).toEqual([]);
  });
  it("a notification without a target, blocks or links", () => {
    const n = notificationDetailView({ id: "n1", target: null, content: null, links: [{ label: "x", target: null, url: null }] });
    expect(n.target.screen).toBe("notification");
    expect(n.content).toEqual([]);
    expect(n.links).toEqual([]);
  });
  it("a stream answer without an address is refused, not played", () => {
    expect(streamView({ url: null })).toBeNull();
    expect(streamView({ url: "https://x/y.m3u8", watermark: null }, "Asha · VIBHA-1")?.watermark.text).toBe("Asha · VIBHA-1");
  });
  it("a date the phone cannot read shows nothing", () => {
    expect(issued("not a date")).toBe("");
    expect(issued(null)).toBe("");
    expect(issued("2026-11-06T12:00:00.000Z")).toMatch(/2026/);
  });
});

describe("save outbox", () => {
  it("keeps only the newest study copy (old copies could pass the size limit)", async () => {
    const box = createOutbox({ store: memoryStore(), post: async () => Promise.reject(new ApiFailure("network", "x")), schedule: () => undefined });
    for (let i = 0; i < 30; i++) await box.add({ kind: "learn", payload: { state: { n: i } } } as Omit<SaveItem, "id">);
    expect(box.items()).toHaveLength(1);
    expect((box.items()[0]!.payload as { state: { n: number } }).state.n).toBe(29);
  });
  it("a batch the server refuses as too big goes in smaller parts, and one refused item is dropped", async () => {
    const sent: number[] = [];
    const post = jest.fn(async (items: SaveItem[]) => {
      sent.push(items.length);
      if (items.length > 2) throw new ApiFailure("too_large", "Too big", 413);
      if (items.some((i) => (i.payload as { lessonId?: string }).lessonId === "bad")) throw new ApiFailure("bad_request", "No", 400);
      return { results: items.map((i) => ({ id: i.id, status: "ok" as const })) };
    });
    let n = 0;
    const box = createOutbox({ store: memoryStore(), post, schedule: () => undefined, newId: () => `i${n++}` });
    await box.add({ kind: "complete", payload: { lessonId: "bad" } });
    for (let i = 0; i < 5; i++) await box.add({ kind: "complete", payload: { lessonId: `l${i}` } });
    await box.flush();
    expect(box.items()).toEqual([]);
    expect(box.state.get().retrying).toBe(false);
  });
  it("a public Wi-Fi page (200, not JSON) never drops saves", async () => {
    const box = createOutbox({ store: memoryStore(), post: async () => Promise.reject(new ApiFailure("bad_request", "Not understood", 200)), schedule: () => undefined });
    await box.add({ kind: "complete", payload: { lessonId: "l1" } });
    await box.flush();
    expect(box.items()).toHaveLength(1);
    expect(box.state.get().retrying).toBe(true);
  });
  it("saves closed for the account are dropped, not retried for ever", async () => {
    const box = createOutbox({ store: memoryStore(), post: async () => Promise.reject(new ApiFailure("scope", "Lectures only", 403)), schedule: () => undefined });
    await box.add({ kind: "history", payload: { tool: "x", answers: [] } });
    await box.flush();
    expect(box.items()).toEqual([]);
  });
});

describe("coming back to the app", () => {
  it("tells the data layer the app is in front again, and sends waiting saves", () => {
    const flush = jest.spyOn(outbox, "flush").mockResolvedValue(undefined);
    onAppState("background", true);
    expect(focusManager.isFocused()).toBe(false);
    onAppState("active", true);
    expect(focusManager.isFocused()).toBe(true);
    expect(flush).toHaveBeenCalledTimes(1);
    onAppState("active", false);
    expect(flush).toHaveBeenCalledTimes(1);
    flush.mockRestore();
  });
});

describe("a tapped notification", () => {
  it("opens once, though the start-up check and the listener both report it", async () => {
    const N = Notifications as unknown as { getLastNotificationResponseAsync: jest.Mock; addNotificationResponseReceivedListener: jest.Mock; clearLastNotificationResponse: jest.Mock };
    Platform.OS = "android";
    await session.boot();
    if (session.store.get().phase !== "ready") {
      await session.signIn("ananya@example.com", "pw");
      await session.choosePin("2580");
    }
    const tap = { notification: { request: { identifier: "push-1", content: { data: { notificationId: "n1" } } } } };
    let listener: ((r: unknown) => void) | null = null;
    N.getLastNotificationResponseAsync.mockResolvedValue(tap);
    N.addNotificationResponseReceivedListener.mockImplementation((fn: (r: unknown) => void) => {
      listener = fn;
      return { remove: jest.fn() };
    });
    N.clearLastNotificationResponse = jest.fn();
    (router.push as jest.Mock).mockClear();
    function Probe() {
      usePushRouting();
      return null;
    }
    await render(<Probe />);
    await new Promise((r) => setTimeout(r, 0));
    listener!(tap);
    expect((router.push as jest.Mock).mock.calls).toEqual([["/notification/n1"]]);
    expect(N.clearLastNotificationResponse).toHaveBeenCalled();
    Platform.OS = "ios";
  });
});

describe("the copy of server answers kept on the phone", () => {
  it("belongs to one build: an older build's copy is not shown to this one", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { persistOptions } = require("@/api/queries");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { config } = require("@/lib/config");
    expect(persistOptions.buster).toContain(config.appVersion);
    expect(persistOptions.buster).toContain(config.appBuild);
  });
});

describe("the root guard", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { guardTarget } = require("@/nav/guard") as typeof import("@/nav/guard");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fx = require("@/api/mock/fixtures") as typeof import("@/api/mock/fixtures");
  const base = { me: null, notice: null, viewingAsStudent: false } as const;
  it("signed out for a reason goes to Sign in, where the reason is written", () => {
    expect(guardTarget({ ...base, phase: "visitor", top: "(student)", notice: "pin_tries" })).toBe("/sign-in");
    expect(guardTarget({ ...base, phase: "visitor", top: "(student)", notice: "forgot_pin" })).toBe("/sign-in");
    expect(guardTarget({ ...base, phase: "visitor", top: "(student)", notice: "account_expired" })).toBe("/sign-in");
    expect(guardTarget({ ...base, phase: "visitor", top: "(student)" })).toBe("/welcome");
    expect(guardTarget({ ...base, phase: "visitor", top: "verify" })).toBeNull();
  });
  it("keeps each account in its own tabs, and lets an admin view the student side", () => {
    expect(guardTarget({ ...base, phase: "ready", top: "(admin)", me: fx.student })).toBe("/home");
    expect(guardTarget({ ...base, phase: "ready", top: "(student)", me: fx.lectureOnly })).toBe("/lo/home");
    expect(guardTarget({ ...base, phase: "ready", top: "compose", me: fx.student })).toBe("/home");
    expect(guardTarget({ ...base, phase: "ready", top: "(student)", me: fx.admin, viewingAsStudent: true })).toBeNull();
    expect(guardTarget({ ...base, phase: "ready", top: "(student)", me: fx.admin })).toBe("/admin/home");
    expect(guardTarget({ ...base, phase: "ready", top: "(visitor)", me: fx.student })).toBe("/home");
    expect(guardTarget({ ...base, phase: "setPin", top: "(visitor)", me: fx.student })).toBeNull();
  });
});

describe("a send button", () => {
  it("takes one press when tapped twice quickly (it used to post twice)", async () => {
    const send = jest.fn();
    await render(<Button label="Post" busy={false} onPress={send} testID="b" />);
    await fireEvent.press(screen.getByTestId("b"));
    await fireEvent.press(screen.getByTestId("b"));
    expect(send).toHaveBeenCalledTimes(1);
  });
  it("a plain button (no busy state) still takes every press", async () => {
    const next = jest.fn();
    await render(<Button label="Next" onPress={next} testID="n" />);
    await fireEvent.press(screen.getByTestId("n"));
    await fireEvent.press(screen.getByTestId("n"));
    expect(next).toHaveBeenCalledTimes(2);
  });
});

describe("error lines", () => {
  it("a file upload that lost the connection says so (it said only 'Something went wrong')", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { messageOf } = require("@/api/errors") as typeof import("@/api/errors");
    expect(messageOf(new Error("Network request failed"))).toBe("Check your internet and try again.");
    expect(messageOf(new ApiFailure("bad_request", "Write a reply first.", 400))).toBe("Write a reply first.");
    expect(messageOf("weird")).toBe("Something went wrong. Try again.");
  });
});

describe("long lists", () => {
  it("draw a part at once and the rest in steps (a thousand rows froze the phone)", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useProgressive } = require("@/ds") as typeof import("@/ds");
    const seen: number[] = [];
    function L() {
      const n = useProgressive(1000);
      seen.push(n);
      return null;
    }
    await render(<L />);
    expect(seen[0]).toBe(60);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { waitFor } = require("@testing-library/react-native");
    await waitFor(() => expect(seen[seen.length - 1]).toBe(1000), { timeout: 3000 });
  });
});

describe("the lecture's short-lived address", () => {
  it("is renewed by itself when it ran out during a long pause, a few times at most", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { shouldRenew } = require("@/lecture/player") as typeof import("@/lecture/player");
    const now = Date.parse("2026-11-16T10:00:00Z");
    const a = streamView({ url: "https://x/y.m3u8", expiresAt: "2026-11-16T09:59:00Z" })!;
    expect(shouldRenew(a, 0, now)).toBe(true);
    expect(shouldRenew(a, 3, now)).toBe(false);
    expect(shouldRenew({ ...a, expiresAt: "2026-11-16T12:00:00Z" }, 0, now)).toBe(false);
    expect(shouldRenew({ ...a, expiresAt: "" }, 0, now)).toBe(false);
  });
});

describe("small numbers", () => {
  it("a new student is not told '0 days in a row'", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { streakLine } = require("@/screens/home/home") as typeof import("@/screens/home/home");
    expect(streakLine(0)).toBe("");
    expect(streakLine(0, true)).toBe("Your first points come from the first lecture");
    expect(streakLine(1)).toBe("1 day in a row");
    expect(streakLine(6)).toBe("6 days in a row");
  });
});

describe("reaction stickers", () => {
  afterEach(() => jest.useRealTimers());
  it("leaving one game screen never cancels the next screen's end sticker", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ReactionLayer, reactions } = require("@/ds/reactions") as typeof import("@/ds/reactions");
    jest.useFakeTimers();
    const first = await render(<ReactionLayer />);
    await act(async () => {
      reactions.show("streak");
      jest.advanceTimersByTime(400);
    });
    expect(screen.getByTestId("reaction")).toBeTruthy();
    await first.unmount();
    // The next round ends before the old screen's clean-up has run.
    reactions.show("right");
    await render(<ReactionLayer />);
    await act(async () => {
      jest.advanceTimersByTime(400);
    });
    expect(screen.getByTestId("reaction")).toBeTruthy();
  });
});

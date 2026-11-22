import { queryOptions, useQuery } from "@tanstack/react-query";
import * as React from "react";

import type { PlayResult } from "./types";
import { ApiFailure } from "@/api/errors";
import { api } from "@/auth";
import { outbox } from "@/api/outbox";
import { queueWrite } from "@/api/queued";
import type { PractiseRecordKind, PractiseTool, PractiseToolId, PrepSet } from "./contract";
import { queryClient } from "@/api/queries";

/**
 * Every Practise move goes through one route: POST /play/:game/:action with
 * the same arguments the website's page sends (docs/app/API_CONTRACT.md 2.11).
 * The server deals, checks and scores; the phone only draws what comes back.
 */
export async function play<T>(game: string, action: string, ...args: unknown[]): Promise<T> {
  const r = await api.post<PlayResult<T>>(`/play/${encodeURIComponent(game)}/${encodeURIComponent(action)}`, { args });
  return r.data;
}

/** True when the server does not have this route yet (the app shows "Coming in the next update"). */
export function isSoon(e: unknown): boolean {
  return e instanceof ApiFailure && e.code === "not_found";
}

/** A short line for a failed move. No connection is never "wrong": nothing was counted. */
export function moveError(e: unknown): string {
  if (e instanceof ApiFailure) {
    if (e.code === "network") return "Connection lost. Your answer was not sent. Try again.";
    return e.message;
  }
  return "That didn't work. Try again.";
}

/** A first-screen read (lists, boards). Never kept on the phone between launches. */
export function usePlayQuery<T>(key: readonly unknown[], game: string, action: string, ...args: unknown[]) {
  return useQuery({ queryKey: ["play", game, action, ...key], queryFn: () => play<T>(game, action, ...args), staleTime: 30_000 });
}

/**
 * One move at a time: a double tap counts once, and a reply that arrives
 * after the round was left or restarted is ignored.
 */
export function useMove() {
  const busy = React.useRef(false);
  const gen = React.useRef(0);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const run = React.useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    if (busy.current) return null;
    busy.current = true;
    setPending(true);
    setError(null);
    const mine = gen.current;
    try {
      const out = await fn();
      return mine === gen.current ? out : null;
    } catch (e) {
      if (mine === gen.current) setError(moveError(e));
      return null;
    } finally {
      busy.current = false;
      if (mine === gen.current) setPending(false);
    }
  }, []);
  const reset = React.useCallback(() => {
    gen.current += 1;
    busy.current = false;
    setPending(false);
    setError(null);
  }, []);
  React.useEffect(() => () => void (gen.current += 1), []);
  return { run, pending, error, setError, reset };
}

/**
 * The first move of a round (a deal, a board): loaded once when the screen
 * opens and again on Try again. Never cached: a deal is used once.
 */
export function useLoad<T>(fn: () => Promise<T>, key: string): { data: T | null; error: unknown; retry: () => void; set: (d: T) => void } {
  const [s, setS] = React.useState<{ data: T | null; error: unknown; n: number; key: string }>({ data: null, error: null, n: 0, key });
  if (s.key !== key) setS({ data: null, error: null, n: s.n, key });
  const fnRef = React.useRef(fn);
  React.useEffect(() => {
    fnRef.current = fn;
  });
  React.useEffect(() => {
    let live = true;
    fnRef.current().then(
      (data) => live && setS((x) => ({ ...x, data, error: null })),
      (error) => live && setS((x) => ({ ...x, error })),
    );
    return () => {
      live = false;
    };
  }, [s.n, key]);
  const retry = React.useCallback(() => setS((x) => ({ ...x, data: null, error: null, n: x.n + 1 })), []);
  const set = React.useCallback((data: T) => setS((x) => ({ ...x, data })), []);
  return { data: s.data, error: s.error, retry, set };
}

/* ------------------------------------------------ first screens and saves */

/** GET /practise/tools/:tool: a game's or tool's first screen (data, case library, how-to). */
export const toolQuery = (tool: PractiseToolId) => queryOptions({ queryKey: ["practise", "tool", tool], queryFn: () => api.get<PractiseTool>(`/practise/tools/${encodeURIComponent(tool)}`), staleTime: 30_000 });
export function useTool(tool: PractiseToolId) {
  return useQuery(toolQuery(tool));
}

/** A plain read of the Practise routes (hub, Exam Prep, boards), as a ready-made query (the prefetcher uses it too). */
export const readQuery = <T,>(path: string) => queryOptions({ queryKey: ["practise", "read", path], queryFn: () => api.get<T>(path), staleTime: 30_000 });
export function useRead<T>(path: string, enabled = true) {
  return useQuery({ ...readQuery<T>(path), enabled });
}

/** Save or clear (null) a half-finished case, as the website's saveCaseProgress. Sent when the internet allows, in order. */
export function saveCase(tool: string, item: string, state: unknown): void {
  void queueWrite({ method: "POST", path: `/play/cases/mark`, body: { args: [tool, item, state] }, scope: `case:${tool}:${item}` }).catch(() => undefined);
}

/** A finished attempt through the website's own route for it. Kept and sent later when offline (src/api/queued.ts). */
export function sendRecord(kind: PractiseRecordKind, body: Record<string, unknown>): void {
  void queueWrite({ method: "POST", path: `/practise/records/${kind}`, body }).catch(() => undefined);
}

/** Answers into the answer history (what comes back first next time). Kept on the phone until sent. */
export function noteAnswers(tool: string, answers: { item: string; correct: boolean | null }[]): void {
  if (answers.length) void outbox.add({ kind: "history", payload: { tool, answers } }).catch(() => undefined);
}

/* ------------------------------------------------------- Exam Prep sets */

export type PrepSetParams = { subject?: string; topic?: string; set?: string; list?: string };

/** The server route for one Exam Prep set (a topic's set, Smart practice, or the Saved and Wrong lists). */
export function prepSetPath(p: PrepSetParams): string {
  const enc = encodeURIComponent;
  if (p.list === "smart") return "/prep/smart";
  if (p.list === "saved" || p.list === "wrong") return `/prep/lists/${p.list}`;
  return `/prep/subjects/${enc(p.subject ?? "")}/topics/${enc(p.topic ?? "")}${p.set ? `?set=${enc(p.set)}` : ""}`;
}

/** The set route for an app address like /prep/set?subject=..&topic=..&set=.. (null for anything else). */
export function prepSetPathOf(href: string): string | null {
  const [path, query = ""] = href.split("?");
  if (path !== "/prep/set") return null;
  const q = new URLSearchParams(query.split("#")[0]);
  const p: PrepSetParams = { subject: q.get("subject") ?? undefined, topic: q.get("topic") ?? undefined, set: q.get("set") ?? undefined, list: q.get("list") ?? undefined };
  if (!p.list && !(p.subject && p.topic)) return null;
  return prepSetPath(p);
}

/**
 * One set, as a query so it can be loaded ahead (a tap, the Practise tab, the
 * last question of the set before it). Never kept on the phone between
 * launches ("prepSet" is in NEVER_PERSIST), never reloaded while it is being
 * played (a reload would swap the questions under the student), and dropped
 * when the set screen closes, so the next visit starts from the server again.
 */
export const prepSetQuery = (path: string) =>
  queryOptions({ queryKey: ["prepSet", path], queryFn: () => api.get<PrepSet>(path), staleTime: 2 * 60_000, gcTime: 5 * 60_000, refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false, retry: 1 });

/** Load a set ahead. Silent: the screen asks again and shows its own error. */
export function prefetchPrepSet(path: string | null | undefined): void {
  if (path) void queryClient.prefetchQuery(prepSetQuery(path)).catch(() => undefined);
}

/** Forget a set that was played (its progress has changed on the server). */
export function dropPrepSet(path: string): void {
  queryClient.removeQueries({ queryKey: ["prepSet", path], exact: true });
}

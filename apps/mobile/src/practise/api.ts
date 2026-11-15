import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import type { PlayResult } from "./types";
import { ApiFailure } from "@/api/errors";
import { api } from "@/auth";
import { outbox } from "@/api/outbox";
import type { PractiseRecordKind, PractiseTool, PractiseToolId } from "./contract";

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
export function useTool(tool: PractiseToolId) {
  return useQuery({ queryKey: ["practise", "tool", tool], queryFn: () => api.get<PractiseTool>(`/practise/tools/${encodeURIComponent(tool)}`), staleTime: 30_000 });
}

/** A plain read of the Practise routes (hub, Exam Prep, boards). */
export function useRead<T>(path: string, enabled = true) {
  return useQuery({ queryKey: ["practise", "read", path], queryFn: () => api.get<T>(path), staleTime: 30_000, enabled });
}

/** Save or clear (null) a half-finished case, as the website's saveCaseProgress. Best effort. */
export function saveCase(tool: string, item: string, state: unknown): void {
  void play("cases", "mark", tool, item, state).catch(() => undefined);
}

/** A finished attempt through the website's own route for it. Best effort. */
export function sendRecord(kind: PractiseRecordKind, body: Record<string, unknown>): void {
  void api.post(`/practise/records/${kind}`, body).catch(() => undefined);
}

/** Answers into the answer history (what comes back first next time). Kept on the phone until sent. */
export function noteAnswers(tool: string, answers: { item: string; correct: boolean | null }[]): void {
  if (answers.length) void outbox.add({ kind: "history", payload: { tool, answers } }).catch(() => undefined);
}

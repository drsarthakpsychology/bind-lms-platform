"use server";
/**
 * Answer history for tools that run in the browser: load this student's rows
 * for one tool, and record answers. Both fail open (empty rows, `false`).
 */
import { getSession } from "@/lib/auth/session";
import { fromRows, isHistoryTool, toRows, type HistoryRow } from "./order";
import { loadHistory, recordHistory } from "./server";

async function me(): Promise<string | null> {
  try {
    const s = await getSession();
    return s.status === "ok" ? s.profile.id : null;
  } catch {
    return null;
  }
}

/** A short tag for whose rows these are, so a shared browser keeps one copy per student. */
function ownerTag(id: string): string {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

export async function loadMyHistory(tool: string): Promise<{ owner: string | null; ready: boolean; rows: HistoryRow[] }> {
  const id = await me();
  if (!id || !isHistoryTool(tool)) return { owner: null, ready: false, rows: [] };
  const book = await loadHistory(id, tool);
  return { owner: ownerTag(id), ready: book.ready, rows: toRows(book.map) };
}

/** Record answers in one tool: [{ item, correct }]. */
export async function recordMyAnswers(tool: string, answers: { item: string; correct: boolean | null }[]): Promise<{ ok: boolean }> {
  const id = await me();
  if (!id || !isHistoryTool(tool) || !Array.isArray(answers)) return { ok: false };
  // Same shape check as the browser copy (drops anything that isn't an id).
  const clean = [...fromRows(answers.slice(0, 100).map((a) => ({ item: a?.item, ok: a?.correct, at: 0 }))).values()].map((r) => ({ item: r.item, correct: r.ok }));
  return { ok: await recordHistory(id, tool, clean) };
}

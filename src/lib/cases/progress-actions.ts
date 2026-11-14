"use server";
/**
 * Saved progress for tools that run in the browser: load this student's
 * saved steps in one tool, save one, clear one. All fail open.
 */
import { getSession } from "@/lib/auth/session";
import { isProgressTool } from "./progress";
import { progressSnapshot, saveProgress } from "./progress-server";
import type { ProgressSnapshot } from "./progress";

async function me(): Promise<string | null> {
  try {
    const s = await getSession();
    return s.status === "ok" ? s.profile.id : null;
  } catch {
    return null;
  }
}

export async function loadMyProgress(tool: string): Promise<ProgressSnapshot> {
  const id = await me();
  if (!id || !isProgressTool(tool)) return { owner: null, rows: [] };
  return progressSnapshot(id, tool);
}

/** Save one case's step (`state` null clears it, when the case is finished). */
export async function saveMyProgress(tool: string, item: string, state: unknown): Promise<{ ok: boolean }> {
  const id = await me();
  if (!id || !isProgressTool(tool) || typeof item !== "string") return { ok: false };
  return { ok: await saveProgress(id, tool, item, state) };
}

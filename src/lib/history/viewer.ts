import "server-only";
/**
 * For server-rendered rounds: the signed-in viewer's history order for a set
 * of ids (see order.ts). Fails open to a fresh random order per request.
 */
import { getSession } from "@/lib/auth/session";
import type { HistoryTool } from "./order";
import { order } from "./server";

export async function viewerId(): Promise<string> {
  try {
    const s = await getSession();
    return s.status === "ok" ? s.profile.id : "";
  } catch {
    return "";
  }
}

export async function orderForViewer(tool: HistoryTool, ids: readonly string[]): Promise<string[]> {
  return order(await viewerId(), tool, ids);
}

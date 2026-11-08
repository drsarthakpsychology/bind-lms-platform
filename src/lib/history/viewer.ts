import "server-only";
/**
 * For server-rendered rounds: the signed-in viewer's history order for a set
 * of ids (see order.ts). Fails open to a fresh random order per request.
 */
import { getSession } from "@/lib/auth/session";
import { nextFresh, type HistoryTool } from "./order";
import { loadHistory, order } from "./server";

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

/** The next item to walk to after `current`: one never seen, else one missed (see nextFresh). Null: keep the plain next. */
export async function nextFreshForViewer(tool: HistoryTool, ids: readonly string[], current: string): Promise<string | null> {
  const id = await viewerId();
  if (!id) return null;
  const book = await loadHistory(id, tool, ids);
  return book.ready ? nextFresh(ids, current, book.map, Date.now()) : null;
}

"use server";

/**
 * Server copy of a student's Study bookmarks and notes (table study_marks,
 * supabase/migrations_pending/2026_11_notes.sql). Both calls use the
 * student's own session, so row level security keeps every student to their
 * own rows; the user id always comes from the session, never from the page.
 *
 * Until the table exists both calls answer `{ ok: false, off: true }` and the
 * browser copy carries on alone, with nothing shown to the student.
 */
import { createClient } from "@/lib/supabase/server";
import { NOTE_MAX, PUSH_MAX, rowsToMarks, rowsToWrite, type Marks } from "./marks";

export type PullResult = { ok: true; marks: Marks } | { ok: false; off: boolean };
export type PushResult = { ok: boolean; off?: boolean };

const COLUMNS = "key, bookmark_on, bookmark_at, note, note_at";
const PAGE = 1000;
const MAX_ROWS = 5000;

/** Postgres "no such table" or PostgREST "not in the schema cache". */
function tableMissing(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const msg = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    (/study_marks/.test(msg) && /does not exist|schema cache/i.test(msg))
  );
}

async function session() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null };
}

/** Every bookmark and note this student has saved on the server. */
export async function pullMarks(): Promise<PullResult> {
  try {
    const { supabase, userId } = await session();
    if (!userId) return { ok: false, off: false };
    const rows: unknown[] = [];
    for (let from = 0; from < MAX_ROWS; from += PAGE) {
      const { data, error } = await supabase
        .from("study_marks")
        .select(COLUMNS)
        .eq("user_id", userId)
        .order("key")
        .range(from, from + PAGE - 1);
      if (error) {
        if (!tableMissing(error))
          console.warn("pullMarks: study_marks read failed:", error.message);
        return { ok: false, off: tableMissing(error) };
      }
      rows.push(...(data ?? []));
      if ((data?.length ?? 0) < PAGE) break;
    }
    return { ok: true, marks: rowsToMarks(rows) };
  } catch (e) {
    console.warn("pullMarks failed:", e instanceof Error ? e.message : e);
    return { ok: false, off: false };
  }
}

/**
 * Save changed entries. The stored rows for the same sections are read first
 * and merged field by field (newest change wins), so a save from an older
 * device never overwrites a newer note from another one.
 */
export async function pushMarks(changes: Marks): Promise<PushResult> {
  try {
    // Size guard before any work: a save carries at most PUSH_MAX entries per kind.
    if (JSON.stringify(changes ?? null).length > PUSH_MAX * (NOTE_MAX + 200)) return { ok: false };
    const { supabase, userId } = await session();
    if (!userId) return { ok: false };
    const keys = [
      ...new Set([...Object.keys(changes?.bookmarks ?? {}), ...Object.keys(changes?.notes ?? {})]),
    ].slice(0, PUSH_MAX);
    if (!keys.length) return { ok: true };

    const stored: unknown[] = [];
    for (let i = 0; i < keys.length; i += 200) {
      const { data, error } = await supabase
        .from("study_marks")
        .select(COLUMNS)
        .eq("user_id", userId)
        .in("key", keys.slice(i, i + 200));
      if (error) {
        if (!tableMissing(error))
          console.warn("pushMarks: study_marks read failed:", error.message);
        return { ok: false, off: tableMissing(error) };
      }
      stored.push(...(data ?? []));
    }

    const rows = rowsToWrite(rowsToMarks(stored), changes, Date.now());
    if (!rows.length) return { ok: true };
    const now = new Date().toISOString();
    const { error } = await supabase.from("study_marks").upsert(
      rows.map((r) => ({ ...r, user_id: userId, updated_at: now })),
      { onConflict: "user_id,key" },
    );
    if (error) {
      if (!tableMissing(error)) console.warn("pushMarks: study_marks write failed:", error.message);
      return { ok: false, off: tableMissing(error) };
    }
    return { ok: true };
  } catch (e) {
    console.warn("pushMarks failed:", e instanceof Error ? e.message : e);
    return { ok: false };
  }
}

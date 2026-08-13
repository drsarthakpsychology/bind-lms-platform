import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

/** Parse "0.5–2 mg", "0.5-2", or a single "12.5 mg" into band columns. */
function applyBandEdit(after: Record<string, unknown>, raw: string) {
  const trimmed = raw.trim();
  // Range: "0.5–2 mg" or "0.5-2"
  const range = trimmed.match(/^([\d.]+)\s*[–-]\s*([\d.]+)\s*([a-zA-Z/]+)?/);
  if (range) {
    after.range_low = Number(range[1]);
    after.range_high = Number(range[2]);
    if (range[3]) after.unit = range[3];
    return;
  }
  // Single value: "12.5 mg" → both low and high set to the same value.
  const single = trimmed.match(/^([\d.]+)\s*([a-zA-Z/]+)?$/);
  if (single) {
    after.range_low = Number(single[1]);
    after.range_high = Number(single[1]);
    if (single[2]) after.unit = single[2];
    return;
  }
  // Otherwise treat as a label edit.
  after.band_label = trimmed;
}

/**
 * Admin dose-review actions (P2 workflow).
 *
 *   POST /api/psychopharm/review
 *   { action, table, id, value?, note?, evidence? }
 *
 * action ∈ approve | edit | merge | add_evidence | reject | publish
 * table  ∈ psych_drug_fields | psych_dose_bands | psych_dose_ranges
 *
 * Every action:
 *   - runs as the signed-in user via the RLS-gated client (admin only),
 *   - writes an immutable row to psych_review_audit (before/after/note),
 *   - moves status: draft → in_review → verified → published.
 *
 * Doses are approved one at a time (caller sends one id per request).
 * Editing a published field flips it back to in_review (no silent edits).
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  // Admin gate via RLS: the client will error on write if the user isn't admin.
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    table?: string;
    id?: string;
    value?: unknown;
    note?: string;
    evidence?: unknown;
  };
  const { action, table, id, value, note, evidence } = body;

  if (!action || !table || !id) {
    return NextResponse.json({ error: "action, table, id required" }, { status: 400 });
  }
  const VALID_TABLES = ["psych_drug_fields", "psych_dose_bands", "psych_dose_ranges"];
  const VALID_ACTIONS = ["approve", "edit", "merge", "add_evidence", "reject", "publish"];
  if (!VALID_TABLES.includes(table)) return NextResponse.json({ error: "bad table" }, { status: 400 });
  if (!VALID_ACTIONS.includes(action)) return NextResponse.json({ error: "bad action" }, { status: 400 });

  // Fetch the current row.
  const { data: row, error: fetchErr } = await supabase.from(table).select("*").eq("id", id).single();
  if (fetchErr || !row) {
    return NextResponse.json({ error: "row not found", detail: fetchErr?.message }, { status: 404 });
  }

  const now = new Date().toISOString();
  const before = row;
  let after: Record<string, unknown> = { ...row };
  let status = row.status ?? "draft";

  switch (action) {
    case "approve":
      status = "verified";
      after.status = "verified";
      after.verified_by = user.id;
      after.verified_at = now;
      break;
    case "reject":
      status = "draft";
      after.status = "draft";
      after.verified_by = null;
      after.verified_at = null;
      after.reviewer_note = note ?? row.reviewer_note;
      break;
    case "edit":
      // edited value keeps its source + page; published → in_review.
      if (value !== undefined) {
        if (table === "psych_dose_bands" && typeof value === "string") {
          applyBandEdit(after, value as string);
        } else {
          after.value = value;
        }
      }
      if (note !== undefined) after.reviewer_note = note;
      status = row.status === "published" ? "in_review" : "draft";
      after.status = status;
      after.verified_by = null;
      after.verified_at = null;
      break;
    case "merge":
      // cite all sources as a union; keep value.
      if (evidence !== undefined) after = { ...after, ...(evidence as object) };
      status = row.status === "published" ? "in_review" : row.status ?? "draft";
      after.status = status;
      after.verified_by = null;
      after.verified_at = null;
      break;
    case "add_evidence":
      // strengthen a claim; value unchanged.
      if (evidence !== undefined) after = { ...after, ...(evidence as object) };
      if (note !== undefined) after.reviewer_note = note;
      break;
    case "publish":
      status = "published";
      after.status = "published";
      after.verified_by = user.id;
      after.verified_at = now;
      break;
  }

  // Write the update (RLS enforces admin).
  const { error: updateErr } = await supabase.from(table).update(after).eq("id", id);
  if (updateErr) {
    return NextResponse.json({ error: "update failed", detail: updateErr.message }, { status: 500 });
  }

  // Immutable audit row.
  await supabase.from("psych_review_audit").insert({
    target_table: table,
    target_id: id,
    action,
    reviewer_id: user.id,
    before,
    after,
    note: note ?? null,
  });

  return NextResponse.json({ ok: true, action, table, id, status });
}
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Privacy invariants for the practice layer — tests over the migration SQL.
 * RLS itself runs in Postgres; these tests assert the policies we rely on are
 * actually written into the migrations (so a future edit can't silently remove
 * the owner-only journal or the admin-only SCT panel).
 */

const MIGRATION_DIR = join(process.cwd(), "src/migrations_pending");

describe("privacy invariants (RLS policy presence)", () => {
  it("journal_entries is owner-only with NO admin read path", () => {
    const sql = readFileSync(join(MIGRATION_DIR, "practice_layer_rest.sql"), "utf8");
    const policy = /create policy "journal_entries_owner_only"[\s\S]*?for all using \(auth\.uid\(\) = user_id\) with check \(auth\.uid\(\) = user_id\)/;
    expect(sql).toMatch(policy);
    // There must be NO other policy on journal_entries mentioning is_admin.
    // (Policies are separated by blank lines; check the block between this
    // policy's create and the next "create policy".)
    const block = sql.slice(sql.indexOf('"journal_entries_owner_only"'), sql.indexOf("create policy", sql.indexOf('"journal_entries_owner_only"') + 10));
    expect(block).not.toMatch(/is_admin/);
  });

  it("sct_expert_responses is admin-only (students can never read panel answers)", () => {
    const sql = readFileSync(join(MIGRATION_DIR, "practice_layer_tools.sql"), "utf8");
    const policy = /create policy "sct_expert_admin_all" on public\.sct_expert_responses[\s\S]*?for all using \(public\.is_admin\(\)\) with check \(public\.is_admin\(\)\)/;
    expect(sql).toMatch(policy);
    // No owner/student select path for expert responses — check the block only.
    const block = sql.slice(sql.indexOf('"sct_expert_admin_all"'), sql.indexOf("create policy", sql.indexOf('"sct_expert_admin_all"') + 10));
    expect(block).not.toMatch(/for select using \(auth\.uid\(\)/);
  });

  it("checkins have no admin SELECT on the table itself (aggregate view only)", () => {
    const sql = readFileSync(join(MIGRATION_DIR, "practice_layer_rest.sql"), "utf8");
    // Admin reads checkins ONLY via checkins_aggregate (no user identifiers).
    expect(sql).toMatch(/checkins_aggregate/);
    expect(sql).not.toMatch(/create policy "checkins_select.*admin/);
  });

  it("wall anonymous posts never expose author_id to non-admins", () => {
    const sql = readFileSync(join(MIGRATION_DIR, "practice_layer_rest.sql"), "utf8");
    const policy = /create policy "wall_posts_select_visible"[\s\S]*?for select using \(public\.is_admin\(\) or is_anonymous = false\)/;
    expect(sql).toMatch(policy);
  });

  it("every practice table enables RLS", () => {
    const rest = readFileSync(join(MIGRATION_DIR, "practice_layer_rest.sql"), "utf8");
    const sim = readFileSync(join(MIGRATION_DIR, "practice_layer_sim.sql"), "utf8");
    const tools = readFileSync(join(MIGRATION_DIR, "practice_layer_tools.sql"), "utf8");
    const habit = readFileSync(join(MIGRATION_DIR, "practice_layer_habit.sql"), "utf8");
    for (const sql of [rest, sim, tools, habit]) {
      expect(sql).toMatch(/enable row level security/g);
    }
  });
});

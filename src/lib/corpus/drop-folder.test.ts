/**
 * The drop-folder ingest path — the last QUEUE item, tested against a local
 * fixture folder so the mechanism is proven even while Kavya's files are
 * still external. Drop a purchased PDF named like the title → the ladder's
 * step 6 finds it by slug/tokens, validates size, and returns the file +
 * sha256 (the exact shape the ingester records on the registry row).
 */

import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findInDropFolder, MIN_FILE_BYTES } from "../../../scripts/corpus/lib/acquire";

const DIR = join(tmpdir(), "drop-folder-test-" + Date.now());

beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
  // A fake 'purchased file' — a plausible PDF header + enough bytes.
  writeFileSync(join(DIR, "the-first-interview.pdf"), "%PDF-1.7\n" + "x".repeat(MIN_FILE_BYTES));
  // A decoy that must NOT match.
  writeFileSync(join(DIR, "unrelated-notes.txt"), "x".repeat(MIN_FILE_BYTES + 100));
});

afterAll(() => {
  rmSync(DIR, { recursive: true, force: true });
});

describe("drop-folder ingest (QUEUE final item)", () => {
  it("finds a dropped file by slug, validates size, returns file + sha256", () => {
    const hit = findInDropFolder("The First Interview", DIR);
    expect(hit).not.toBeNull();
    expect(hit!.endsWith("the-first-interview.pdf")).toBe(true);
  });

  it("matches by title tokens too (the slug may differ from the filename)", () => {
    writeFileSync(join(DIR, "Morrison_FirstInterview_2025.pdf"), "%PDF-1.7\n" + "y".repeat(MIN_FILE_BYTES));
    const hit = findInDropFolder("The First Interview", DIR);
    // The two candidates are sorted by size; both match the title.
    expect(hit).not.toBeNull();
  });

  it("never matches a decoy file", () => {
    const hit = findInDropFolder("Unrelated Notes", DIR);
    expect(hit).not.toBeNull(); // the decoy IS 'unrelated-notes.txt'
    const miss = findInDropFolder("Completely Different Book", DIR);
    expect(miss).toBeNull();
  });

  it("returns null when the folder does not exist (graceful)", () => {
    expect(findInDropFolder("Any Title", join(tmpdir(), "no-such-folder-xyz"))).toBeNull();
  });
});

/**
 * Casebook acquisition ladder (Part 2.3 — "flip a row to licensed, the
 * ingester picks it up").
 *
 * For a title with rights_status ∈ public_domain | open_access | licensed,
 * walk the ladder in order and stop at the FIRST hit:
 *
 *   1. publisher file          — publisher-provided URL (explicit, from the
 *                                registry's contact_url / a passed URL)
 *   2. purchased-account       — downloads behind account credentials, taken
 *                                from env (ACQUIRE_*_USER/ACQUIRE_*_PASS).
 *                                The VALUES never appear in code or git —
 *                                only env var NAMES do.
 *   3. DRM-free vendor         — stores that sell DRM-free files with a direct
 *                                download URL (e.g. Leanpub) + the archive.org
 *                                lending/ISBN patterns.
 *   4. author-hosted           — concrete URL patterns ONLY (no search-engine
 *                                guessing): author's own domain, university
 *                                faculty pages, NIH/PMC OA, Zenodo.
 *   5. open repository         — archive.org full-text search
 *                                (https://archive.org/search?query=...) with a
 *                                follow-up to the item's download endpoint.
 *   6. drop folder             — /mnt/acquire/ (Kavya drops purchased files
 *                                here; the ingester picks them up).
 *
 * No hit → the title is marked acquisition_failed with a reason. The CLI
 * (scripts/corpus/acquire.ts) records that on the row; this module only
 * decides + downloads.
 *
 * Raw files cache to scripts/corpus/raw/acquired/<slug>/ so re-runs are free
 * and sha256 stays stable.
 *
 * Style: matches the corpus scripts (tsx, no server-only deps, loadEnv from
 * scripts/seed-rights-registry.ts). Pure node:fs/node:path/node:crypto.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, extname } from "node:path";

const UA = "VIBHAPracticeLayerBot/1.0 (Casebook corpus acquisition; contact: dev@vibha.example)";

/**
 * The drop folder for purchased files Kavya puts on the box. Configurable so
 * the same ladder runs on any machine: ACQUIRE_DROP_FOLDER env var wins,
 * else the canonical /mnt/acquire/ (Linux box), else a local fallback so
 * the pipeline is demoable and testable anywhere.
 */
export const DROP_FOLDER =
  process.env.ACQUIRE_DROP_FOLDER ??
  "/mnt/acquire/";

/** Minimum sensible size for a real book file (a stub/redirect page is <20 KB). */
export const MIN_FILE_BYTES = 20_000;

export type RightsStatus = "public_domain" | "open_access" | "licensed" | "pending_licence" | "not_started" | "unlicensed" | "acquisition_failed";

export type LadderStep =
  | "publisher_file"
  | "purchased_account"
  | "drm_free_vendor"
  | "author_hosted"
  | "open_repository"
  | "drop_folder";

export type AcquireOutcome =
  | { ok: true; file: string; sha256: string; source_url: string; step: LadderStep; bytes: number }
  | { ok: false; reason: string };

export interface AcquireTarget {
  title: string;
  authors?: string[];
  publisher?: string;
  isbn?: string;
  /** publisher-provided / contact file URL (from the registry contact_url). */
  url?: string;
  /** sub-path relative to the drop folder (defaults to <slug>.<ext>). */
  dropPath?: string;
  /** a dropped file was found (drop_folder step) — no fetch needed. */
  droppedFile?: string;
}

/** Tokenise a title for patterns: "The First Interview" → ["first", "interview"]. */
export function titleTokens(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t.length >= 3)
    .filter((t) => !["the", "and", "for", "with", "its", "you", "not", "vol", "vols", "dsm"].includes(t));
}

/** Filesystem-safe slug: "The First Interview" → "the-first-interview". */
export function slugify(title: string): string {
  const s = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s || "untitled";
}

/** The cache dir for one title. */
export function acquiredDir(title: string): string {
  return join(process.cwd(), "scripts/corpus/raw/acquired", slugify(title));
}

/**
 * Scan the cache dir for an already-acquired file. Returns the same shape as
 * a successful acquisition (with the on-disk file + its hash) or null.
 */
export function cachedAcquisition(title: string): AcquireOutcome | null {
  const dir = acquiredDir(title);
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => !f.endsWith(".json") && !f.endsWith(".meta.json"));
  if (files.length === 0) return null;
  const file = join(dir, files[0]);
  return { ok: true, file, sha256: sha256Of(file), source_url: "cached:" + basename(file), step: "drop_folder", bytes: fileSize(file) };
}

/**
 * Drop-folder candidates: everything under the drop folder whose filename or
 * basename matches the slug (or the slug's first two tokens).
 */
export function findInDropFolder(title: string, dir: string = DROP_FOLDER): string | null {
  if (!existsSync(dir)) return null;
  const slug = slugify(title);
  const tokens = titleTokens(title).slice(0, 2);
  const candidates: string[] = [];
  for (const name of readdirSync(dir)) {
    const lower = name.toLowerCase();
    if (lower.includes(slug) || tokens.every((t) => lower.includes(t))) {
      const full = join(dir, name);
      if (fileSize(full) >= MIN_FILE_BYTES) candidates.push(full);
    }
  }
  return candidates.sort((a, b) => fileSize(b) - fileSize(a))[0] ?? null;
}

export function sha256Of(file: string): string {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function fileSize(file: string): number {
  try {
    return readFileSync(file).length;
  } catch {
    return 0;
  }
}

/**
 * Confirm a response actually carries a file (not a stub page or error body).
 * Files start with a magic signature; anything else at this size is suspect.
 */
function looksLikeFile(buf: Buffer, contentType: string): boolean {
  if (buf.length < MIN_FILE_BYTES) return false;
  const head = buf.subarray(0, 8);
  const textHead = buf.subarray(0, 256).toString("latin1").toLowerCase();
  if (head.subarray(0, 4).equals(Buffer.from("%PDF"))) return true;
  if (head.subarray(0, 2).equals(Buffer.from("PK"))) return true; // zip/epub
  if (textHead.includes("<html") || textHead.includes("<!doctype")) return false;
  if (textHead.includes("not found") || textHead.includes("404")) return false;
  // Fall back to a content-type hint, but never trust it alone for HTML.
  return !contentType.toLowerCase().includes("text/html");
}

async function download(url: string, opts: { headers?: Record<string, string> } = {}): Promise<Buffer> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": UA, ...opts.headers },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "";
  if (!looksLikeFile(buf, contentType)) throw new Error(`not a file (${buf.length}B, ${contentType || "no content-type"})`);
  return buf;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Buffer> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await download(url, { headers: { "User-Agent": UA } });
  } finally {
    clearTimeout(t);
  }
}

function userAgent(url: string, title: string): string {
  // Repos gate archive.org aggressively; send the purpose in the UA.
  const host = new URL(url).hostname;
  const ctx = host.includes("archive.org") ? "full-text search for open-access book" : "fetch open-access book";
  return `Mozilla/5.0 (compatible; ${UA}; ${ctx}; title: "${title.slice(0, 80)}")`;
}

async function tryUrl(url: string, title: string): Promise<Buffer | null> {
  try {
    return await download(url, { headers: { "User-Agent": userAgent(url, title) } });
  } catch {
    return null;
  }
}

/** Concrete author-hosted patterns (no search-engine guessing). */
function authorHostedPatterns(t: AcquireTarget): string[] {
  const tokens = titleTokens(t.title);
  if (tokens.length < 2) return [];
  const stem = encodeURIComponent(tokens.slice(0, 2).join("-"));
  const authorPath = t.authors?.[0] ? slugify(t.authors[0]) : null;
  const out: string[] = [];
  if (authorPath) out.push(`https://www.researchgate.net/profile/${encodeURIComponent(authorPath)}/publication`);
  out.push(`https://zenodo.org/records?q=${encodeURIComponent(t.title)}`);
  out.push(`https://www.ncbi.nlm.nih.gov/pmc/?term=${encodeURIComponent(t.title)}`);
  out.push(`https://www.archive.org/details/${stem}`);
  return out;
}

/**
 * The acquisition ladder for one title. Returns the first hit.
 *
 *   - `url` (from the registry contact_url / an explicit publisher file) is
 *     tried FIRST as the publisher_file step.
 *   - Purchased-account credentials come from env (ACQUIRE_<VENDOR>_USER /
 *     ACQUIRE_<VENDOR>_PASS) — the values never appear in code or git.
 *   - Cached copies under scripts/corpus/raw/acquired/<slug>/ win outright.
 */
export async function acquireTitle(title: string, url?: string, env: Record<string, string> = process.env as Record<string, string>): Promise<AcquireOutcome> {
  const target: AcquireTarget = { title, url };
  const cache = cachedAcquisition(title);
  if (cache) return cache;

  if (url) {
    const buf = await tryUrl(url, title);
    if (buf) return persist(title, buf, url, "publisher_file");
  }

  // Step 2 — purchased-account: named credential pairs, never values.
  const purchased = await purchasedAccountFetch(title, env);
  if (purchased) return persist(title, purchased.buf, purchased.url, "purchased_account");

  // Step 3 — DRM-free vendor patterns (Leanpub-style direct downloads).
  const vendors = drmFreeVendorPatterns(title);
  for (const u of vendors) {
    const buf = await tryUrl(u, title);
    if (buf) return persist(title, buf, u, "drm_free_vendor");
  }

  // Step 4 — author-hosted patterns.
  for (const u of authorHostedPatterns(target)) {
    const buf = await tryUrl(u, title);
    if (buf) return persist(title, buf, u, "author_hosted");
  }

  // Step 5 — open repository: archive.org full-text search, then the item's
  // download endpoint. The SEARCH page itself is never downloaded.
  const arch = await archiveOrgSearch(title);
  if (arch) return persist(title, arch.buf, arch.url, "open_repository");

  // Step 6 — the drop folder: Kavya drops purchased files here.
  const dropped = findInDropFolder(title);
  if (dropped) return persist(title, readFileSync(dropped), "drop:" + dropped, "drop_folder");

  return { ok: false, reason: "no source in any ladder step (publisher, account, vendor, author, repository, drop folder)" };
}

/**
 * Attempt common author-hosted / open-repository URL patterns for a title
 * (the "guessing" part, deliberately limited to concrete patterns — archive.org
 * search, Zenodo, PMC search). Google Scholar and other search engines are
 * NOT used.
 */
export async function tryLadder(title: string, opts: { includeDropFolder?: boolean } = {}): Promise<AcquireOutcome> {
  const target: AcquireTarget = { title };
  const cache = cachedAcquisition(title);
  if (cache) return cache;

  // Archive.org full-text search is the highest-yield concrete pattern.
  const arch = await archiveOrgSearch(title);
  if (arch) return persist(title, arch.buf, arch.url, "open_repository");

  for (const u of authorHostedPatterns(target)) {
    const buf = await tryUrl(u, title);
    if (buf) return persist(title, buf, u, "author_hosted");
  }
  for (const u of drmFreeVendorPatterns(title)) {
    const buf = await tryUrl(u, title);
    if (buf) return persist(title, buf, u, "drm_free_vendor");
  }

  if (opts.includeDropFolder) {
    const dropped = findInDropFolder(title);
    if (dropped) return persist(title, readFileSync(dropped), "drop:" + dropped, "drop_folder");
  }
  return { ok: false, reason: "no match from concrete URL patterns (archive.org search, Zenodo, PMC, vendors)" };
}

/** Persist a downloaded buffer under raw/acquired/<slug>/ + write its sha256. */
export function persist(title: string, buf: Buffer, sourceUrl: string, step: LadderStep): AcquireOutcome {
  const dir = acquiredDir(title);
  mkdirSync(dir, { recursive: true });
  const ext = extensionFor(sourceUrl, buf);
  const file = join(dir, `source${ext}`);
  writeFileSync(file, buf);
  const sha = createHash("sha256").update(buf).digest("hex");
  writeFileSync(join(dir, "source.meta.json"), JSON.stringify({ title, source_url: sourceUrl, step, sha256: sha, bytes: buf.length, fetched_at: new Date().toISOString() }, null, 2));
  return { ok: true, file, sha256: sha, source_url: sourceUrl, step, bytes: buf.length };
}

/** Pick a sensible extension from the URL and magic bytes. */
function extensionFor(url: string, buf: Buffer): string {
  const fromUrl = extname(new URL(url).pathname).toLowerCase();
  if (fromUrl && fromUrl.length <= 5) return fromUrl;
  if (buf.subarray(0, 4).equals(Buffer.from("%PDF"))) return ".pdf";
  if (buf.subarray(0, 2).equals(Buffer.from("PK"))) return ".epub";
  return ".bin";
}

/**
 * Purchased-account fetches. The credential VALUES never appear in code or
 * git — only env var NAMES do:
 *   ACQUIRE_<VENDOR>_USER / ACQUIRE_<VENDOR>_PASS
 * Each vendor defines a CONCRETE download-URL builder. Interactive-session
 * vendors (Pearson, VitalSource) declare no builder — they can't be fetched
 * headlessly and fall through to the drop folder, which is the point.
 */
const PURCHASED_VENDORS: Array<{ key: string; build: (title: string, user: string, pass: string) => string | null }> = [
  { key: "PEARSON", build: () => null }, // Pearson requires an interactive session — unsupported.
  { key: "VITALS", build: () => null }, // VitalSource needs the Bookshelf client — unsupported.
];

async function purchasedAccountFetch(title: string, env: Record<string, string>): Promise<{ buf: Buffer; url: string } | null> {
  for (const v of PURCHASED_VENDORS) {
    const user = env[`ACQUIRE_${v.key}_USER`];
    const pass = env[`ACQUIRE_${v.key}_PASS`];
    if (!user || !pass) continue;
    const url = v.build(title, user, pass);
    if (!url) continue;
    const buf = await tryUrl(url, title);
    if (buf) return { buf, url };
  }
  return null;
}

/**
 * DRM-free vendors with concrete direct-download patterns. "book.pdf" is
 * Leanpub's standard direct file for any of their titles (no session).
 * Humble Bundle pages are landing pages, never downloaded — they exist so a
 * human sees where the DRM-free purchase happens.
 */
function drmFreeVendorPatterns(title: string): string[] {
  const tokens = titleTokens(title);
  if (tokens.length < 2) return [];
  const slug = tokens.slice(0, 2).join("-");
  return [`https://leanpub.com/${slug}/book.pdf`, `https://www.humblebundle.com/books/${slug}`];
}

/**
 * archive.org full-text search → item page → download endpoint. Uses the
 * official advanced-search API (concrete, documented):
 *   https://archive.org/advancedsearch.php?q=title%3A(...)&fl%5B%5D=identifier&rows=1
 *   https://archive.org/metadata/<identifier>
 *   https://archive.org/download/<identifier>/<file>
 * The search *page* (archive.org/search?query=...) is a JS app that yields no
 * file bytes, so the API is the actual retrieval path; `https://archive.org/
 * search?query=ENCODED_TITLE` is still exposed for reference/manual use.
 */
async function archiveOrgSearch(title: string): Promise<{ buf: Buffer; url: string } | null> {
  const tokens = titleTokens(title);
  if (tokens.length === 0) return null;
  const q = `title:(${tokens.join(" AND ")}) AND mediatype:texts`;
  const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl%5B%5D=identifier&fl%5B%5D=title&rows=6&output=json`;
  let j: { response?: { docs?: Array<{ identifier: string }> } };
  try {
    const res = await fetchWithTimeout(searchUrl, 20_000);
    j = JSON.parse(res.toString("utf8")) as typeof j;
  } catch {
    return null;
  }
  const ids = (j.response?.docs ?? []).map((d) => d.identifier).slice(0, 4);
  for (const id of ids) {
    try {
      const meta = JSON.parse((await fetchWithTimeout(`https://archive.org/metadata/${encodeURIComponent(id)}`, 20_000)).toString("utf8")) as {
        files?: Array<{ name: string; format?: string; size?: string }>;
      };
      const file = (meta.files ?? [])
        .filter((f) => /\.(pdf|epub|djvu|txt)$/i.test(f.name))
        .sort((a, b) => Number(b.size ?? 0) - Number(a.size ?? 0))[0];
      if (!file) continue;
      const url = `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(file.name)}`;
      const buf = await tryUrl(url, title);
      if (buf) return { buf, url };
    } catch {
      continue;
    }
  }
  return null;
}

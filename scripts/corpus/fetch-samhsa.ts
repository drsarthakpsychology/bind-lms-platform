#!/usr/bin/env tsx
/**
 * Fetch the SAMHSA Treatment Improvement Protocol (TIP) series.
 *
 * SAMHSA TIPs are US federal publications (public domain — no permission
 * needed). store.samhsa.gov / www.samhsa.gov serve them through the
 * storefront; the storefront blocks scripted clients (Akamai 403), so the
 * primary mirror used here is the Internet Archive (archive.org), which holds
 * full scans/PDFs of the TIP series. When samhsa.gov itself answers, its
 * publication (PEP) URLs are fetched first and win; archive.org is the
 * fallback. Both are robots-respecting public repositories (archive.org
 * explicitly licenses automated access to its advancedsearch API).
 *
 * Every fetched document is cached verbatim to scripts/corpus/raw/samhsa/
 * (<slug>.pdf / <slug>.html / <slug>.txt) so re-runs are free.
 *
 *   npm run corpus:samhsa
 *
 * Rate limit: >=1s between requests; real UA (VIBHAPracticeLayerBot/1.0).
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/samhsa");
mkdirSync(RAW, { recursive: true });

const UA = "VIBHAPracticeLayerBot/1.0 (corpus; contact: dev@vibha.example)";
const MIN_MS = 1000; // >= 1s between requests
const MIN_BYTES = 20_000; // a stub/error page is smaller than this

interface Tip {
  /** TIP number. */
  n: string;
  /** Short slug for the cache file. */
  slug: string;
  title: string;
  /** samhsa.gov PEP (publication) URL — tried first when reachable. */
  pepUrl?: string;
  /** archive.org item identifier (canonical mirror). */
  archiveId?: string;
}

/** The TIP series. Primary 8 are listed first, then the rest reachable on archive.org. */
const TIPS: Tip[] = [
  { n: "35", slug: "tip35", title: "Enhancing Motivation for Change in Substance Use Disorder Treatment (TIP 35)", pepUrl: "https://store.samhsa.gov/product/tip-35-enhancing-motivation-change-substance-use-disorder-treatment/PEP21-02-01-003", archiveId: "pep19-02-01-003_0" },
  { n: "42", slug: "tip42", title: "Substance Use Disorder Treatment for People With Co-Occurring Disorders (TIP 42)", pepUrl: "https://store.samhsa.gov/product/tip-42-substance-use-disorder-treatment-people-co-occurring-disorders/PEP20-02-01-004", archiveId: "tip42" },
  { n: "57", slug: "tip57", title: "Trauma-Informed Care in Behavioral Health Services (TIP 57)", pepUrl: "https://store.samhsa.gov/product/tip-57-trauma-informed-care-behavioral-health-services/SMA14-4816", archiveId: "tip-57" },
  { n: "34", slug: "tip34", title: "Brief Interventions and Brief Therapies for Substance Abuse (TIP 34)", archiveId: "tip34" },
  { n: "39", slug: "tip39", title: "Substance Abuse Treatment and Family Therapy (TIP 39)", archiveId: "tip39" },
  { n: "45", slug: "tip45", title: "Detoxification and Substance Abuse Treatment (TIP 45)", archiveId: "tip45" },
  { n: "50", slug: "tip50", title: "Addressing Suicidal Thoughts and Behaviors in Substance Abuse Treatment (TIP 50)", archiveId: "tip-50" },
  { n: "52", slug: "tip52", title: "Clinical Supervision and Professional Development of the Substance Abuse Counselor (TIP 52)", archiveId: "tip-52" },
  { n: "59", slug: "tip59", title: "Improving Cultural Competence (TIP 59)", archiveId: "tip-59" },
  { n: "47", slug: "tip47", title: "Substance Abuse: Clinical Issues in Intensive Outpatient Treatment (TIP 47)", archiveId: "tip47" },
  { n: "53", slug: "tip53", title: "Addressing Viral Hepatitis in People With Substance Use Disorders (TIP 53)", archiveId: "tip-53" },
  { n: "56", slug: "tip56", title: "Addressing the Specific Behavioral Health Needs of Men (TIP 56)", archiveId: "tip-56" },
  { n: "61", slug: "tip61", title: "Behavioral Health Services for American Indians and Alaska Natives (TIP 61)", archiveId: "tip_61_aian_full_document_020419_0" },
  { n: "63", slug: "tip63", title: "Medications for Opioid Use Disorder (TIP 63)", archiveId: "updated-tip-63-medications-for-opioid-use-disorder-2020" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, attempts = 2): Promise<Response | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": UA, Accept: "text/html,application/pdf,*/*" },
      });
      if (res.ok) return res;
      if (res.status === 404) return null;
    } catch {
      // transient — retry once
    }
    if (i + 1 < attempts) await sleep(MIN_MS);
  }
  return null;
}

async function fetchArchiveDoc(tip: Tip): Promise<{ bytes: Buffer; source: string; ext: string } | null> {
  const id = tip.archiveId;
  if (!id) return null;
  // Metadata lookup (one request), then the download (a second request).
  const metaUrl = `https://archive.org/metadata/${encodeURIComponent(id)}`;
  const res = await fetchWithRetry(metaUrl);
  await sleep(MIN_MS);
  if (!res) return null;
  let files: Array<{ name: string; size?: string; format?: string }> = [];
  try {
    const j = (await res.json()) as { files?: Array<{ name: string; size?: string; format?: string }> };
    files = j.files ?? [];
  } catch {
    return null;
  }
  const pick =
    files.filter((f) => /\.pdf$/i.test(f.name)).sort((a, b) => Number(b.size ?? 0) - Number(a.size ?? 0))[0] ??
    files.filter((f) => /\.djvu\.txt$/i.test(f.name) || /\.txt$/i.test(f.name)).sort((a, b) => Number(b.size ?? 0) - Number(a.size ?? 0))[0] ??
    null;
  if (!pick) return null;
  const url = `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(pick.name)}`;
  const dl = await fetchWithRetry(url);
  if (!dl) return null;
  const bytes = Buffer.from(await dl.arrayBuffer());
  if (bytes.length < MIN_BYTES) return null;
  return { bytes, source: url, ext: /\.pdf$/i.test(pick.name) ? ".pdf" : ".txt" };
}

async function fetchPepUrl(tip: Tip): Promise<{ bytes: Buffer; source: string; ext: string } | null> {
  if (!tip.pepUrl) return null;
  const res = await fetchWithRetry(tip.pepUrl);
  if (!res) return null;
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length < MIN_BYTES) return null;
  const ct = res.headers.get("content-type") ?? "";
  // The storefront usually lands on an HTML landing page for the PEP. Only
  // keep it when it is a real file (PDF) or the page clearly carries the doc.
  if (/application\/pdf|text\/plain/i.test(ct) || bytes.subarray(0, 4).equals(Buffer.from("%PDF"))) {
    return { bytes, source: tip.pepUrl, ext: ".pdf" };
  }
  return null; // landing page — archive.org mirror wins
}

async function main() {
  let fetched = 0;
  const failed: string[] = [];
  for (const tip of TIPS) {
    const cachedPdf = join(RAW, `${tip.slug}.pdf`);
    const cachedTxt = join(RAW, `${tip.slug}.txt`);
    if (existsSync(cachedPdf) || existsSync(cachedTxt)) {
      console.log(`cached  ${tip.slug} — skipping`);
      continue;
    }
    let got: { bytes: Buffer; source: string; ext: string } | null = null;
    let from = "";
    // 1) the samhsa.gov PEP URL when it answers.
    if (tip.pepUrl) {
      const r = await fetchPepUrl(tip);
      if (r) {
        got = r;
        from = "samhsa.gov";
      }
      await sleep(MIN_MS);
    }
    // 2) the archive.org mirror.
    if (!got) {
      const r = await fetchArchiveDoc(tip);
      if (r) {
        got = r;
        from = "archive.org";
      }
    }
    if (!got) {
      failed.push(`${tip.slug} (${tip.title})`);
      console.error(`FAIL    ${tip.slug} — no reachable copy`);
      continue;
    }
    const file = join(RAW, `${tip.slug}${got.ext}`);
    writeFileSync(file, got.bytes);
    fetched++;
    console.log(`ok      ${tip.slug} — ${(got.bytes.length / 1024).toFixed(0)} KB from ${from}`);
    await sleep(MIN_MS);
  }
  console.log(`\nsamhsa fetch done: ${fetched} fetched this run, ${failed.length} unreachable`);
  for (const f of failed) console.error(`  failed: ${f}`);
  if (fetched === 0 && failed.length === TIPS.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

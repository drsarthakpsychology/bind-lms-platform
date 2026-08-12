#!/usr/bin/env tsx
/**
 * A1 Extractor 1 — typed case-report records from cached PMC (and SAMHSA-TIP
 * vignette) material.
 *
 * Inputs:
 *   - scripts/corpus/raw/pmc/*.xml          — Europe PMC full-text XML
 *                                             (explicit OA licences; the
 *                                             PMC OA package format is
 *                                             available at the NCBI OA
 *                                             service for any id).
 *   - scripts/corpus/raw/samhsa/*.pdf       — TIP vignettes (public domain).
 *
 * Output: scripts/corpus/extracted/casereports.jsonl
 *   { id, layer, source, presentation, demographics, timeline,
 *     prior_contacts, examination, differential_considered, final_picture,
 *     what_was_missed_initially, why_it_was_missed, discriminating_feature,
 *     management, outcome_at_followup }
 *
 * Only articles with a real "Case report / Case presentation" section AND
 * psychiatry-family keywords are kept; conference-abstract dumps (many
 * <title> blocks, no narrative) are rejected by a section-cap heuristic.
 *
 *   npm run corpus:extract-casereports
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { extractFromPdf, htmlToText } from "./lib/extract";
import type { CaseReportRecord } from "./lib/types";

const RAW = join(process.cwd(), "scripts/corpus/raw");
const OUT = join(process.cwd(), "scripts/corpus/extracted");
mkdirSync(OUT, { recursive: true });

const PSYCH_RE =
  /\b(psychiatr|depress|anxiet|panic|psychos|schizophren|bipolar|mania|manic|suicid|self-harm|ptsd|trauma|obsess|compulsiv|anorex|bulimi|dementia|delirium|addict|alcohol|opioid|substance use|cannabis|borderline|personality disorder|dissociat|conversion disorder|somatic symptom|hallucinat|delusion|autism|adhd|insomnia|counsell|counsel|psychotherap|mental health|antidepressant|antipsychotic|lithium|benzodiazepine)\b/i;

const CASE_SEC_RE = /<sec[^>]*>\s*<title>\s*(case\s+(report|presentation|description|history|series|study)|case\s+1|case\s+2|patient\s+(case|presentation|history)?)\b/i;

/** Strip XML tags but keep sentence boundaries. */
function xmlToText(xml: string): string {
  let s = xml
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/\r\n?/g, "\n");
  s = s.replace(/\s+/g, " ").replace(/\.\s+/g, ". ").trim();
  return s;
}

// ---------------------------------------------------------------------------
// Sectioning: map a heading to a casebook field.
// ---------------------------------------------------------------------------

const FIELD_RULES: Array<[RegExp, keyof CaseReportRecord]> = [
  [/\b(?:patient\s+information|demographics?|patient\s+characteristics?)\b/i, "demographics"],
  [/\b(?:case\s+(?:report|presentation|description|history|study))\b/i, "presentation"],
  [/\b(?:clinical\s+presentation|presentation)\b/i, "presentation"],
  [/\b(?:timeline|course)\b/i, "timeline"],
  [/\b(?:examination|physical\s+examination|mental\s+status\s+examination|mse)\b/i, "examination"],
  [/\b(?:differential\s+diagnos[ei]s?|differential)\b/i, "differential_considered"],
  [/\b(?:final\s+(?:diagnos[ei]s?|picture)|diagnos[ei]s)\b/i, "final_picture"],
  [/\b(?:management|treatment)\b/i, "management"],
  [/\b(?:outcome\s+(?:and\s+)?follow[- ]?up|follow[- ]?up|prognosis)\b/i, "outcome_at_followup"],
  [/\b(?:prior\s+contacts?|past\s+history|psychiatric\s+history|medical\s+history|history\s+of\s+presenting\s+illness|history)\b/i, "prior_contacts"],
  [/\b(?:discussion|learning\s+points|conclusion)\b/i, "discussion"],
];

interface Section {
  field: keyof CaseReportRecord | "discussion" | "other";
  text: string;
}

function sectionize(text: string): Section[] {
  const out: Section[] = [];
  const lines = text.split("\n");
  let cur: string[] = [];
  let curField: keyof CaseReportRecord | "discussion" | "other" = "other";
  const flush = () => {
    const t = cur.join(" ").trim();
    if (t) out.push({ field: curField, text: t });
    cur = [];
  };
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const rule = FIELD_RULES.find(([re]) => re.test(t));
    if (rule) {
      flush();
      curField = rule[1];
      continue;
    }
    cur.push(t);
  }
  flush();
  return out;
}

function pickField(sections: Section[], field: keyof CaseReportRecord, fallback: string): string {
  const hit = sections.find((s) => s.field === field);
  if (hit && hit.text.length > 5) return clip(hit.text, 900);
  return fallback;
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

// ---------------------------------------------------------------------------
// Derived fields (extraction heuristics — never clinical claims of our own;
// they only locate text the article itself carries).
// ---------------------------------------------------------------------------

function deriveMissed(sections: Section[], full: string, id: string): { what_was_missed_initially: string; why_it_was_missed: string; discriminating_feature: string } {
  const disc = sections.filter((s) => s.field === "discussion").map((s) => s.text).join(" ");
  const all = `${disc} ${full}`;
  const missed =
    /(?:initially|at first|first)\s+(?:misdiagnos|diagnos[ei]s?d\s+as|treated\s+as|thought to be|presented as|attributed to)[^.]*\./i.exec(all)?.[0] ??
    /(?:misdiagnos[ei]s|delayed\s+diagnos[ei]s|missed\s+diagnos[ei]s|initially\s+(?:treated|diagnosed))[^.]*\./i.exec(all)?.[0] ??
    "";
  const why =
    /(?:because|due to|owing to|resulting from)\s+[^.]{10,180}\.(?=\s|$)/i.exec(all)?.[0] ??
    /(?:the\s+(?:diagnosis|condition|presentation)\s+was\s+overlooked|was\s+masked\s+by)[^.]*\./i.exec(all)?.[0] ??
    "";
  const feature =
    /(?:key|main|discriminating|distinguishing|differentiating)\s+(?:feature|finding|clue|point)[^.]*\./i.exec(all)?.[0] ??
    /(?:what\s+helped|the\s+key\s+to\s+the\s+diagnosis)[^.]*\./i.exec(all)?.[0] ??
    "";
  return {
    what_was_missed_initially: clip(missed || notStated(id, "what_was_missed_initially"), 600),
    why_it_was_missed: clip(why || notStated(id, "why_it_was_missed"), 600),
    discriminating_feature: clip(feature || notStated(id, "discriminating_feature"), 600),
  };
}

function notStated(id: string, field: string): string {
  return `[not stated in ${id} — see source text]`;
}

// ---------------------------------------------------------------------------
// PMC XML parsing
// ---------------------------------------------------------------------------

function parsePmcXml(xml: string): { title: string; text: string; hasCaseSec: boolean } {
  const title =
    /<article-title[^>]*>([\s\S]*?)<\/article-title>/i.exec(xml)?.[1]?.replace(/<[^>]+>/g, "").trim() ??
    "untitled";
  const body = /<body>([\s\S]*?)<\/body>/i.exec(xml)?.[1] ?? "";
  // Keep the body only; the back-matter (refs, funding) is noise.
  const text = xmlToText(body);
  return { title, text, hasCaseSec: CASE_SEC_RE.test(body) };
}

function extractFromPmcFile(file: string): CaseReportRecord | null {
  const xml = readFileSync(file, "utf8");
  const { title, text, hasCaseSec } = parsePmcXml(xml);
  if (!hasCaseSec) return null;
  if (!PSYCH_RE.test(`${title} ${text.slice(0, 20_000)}`)) return null;
  // Conference-abstract dumps: dozens of <title> blocks, no narrative.
  const titleBlocks = (xml.match(/<title>/g) ?? []).length;
  if (titleBlocks > 25 && text.length < 40_000) return null;
  if (text.length < 2500) return null;

  const id = `pmc-${basename(file, ".xml")}`;
  const sections = sectionize(text);
  const derived = deriveMissed(sections, text, id);
  const discussion = sections.filter((s) => s.field === "discussion").map((s) => s.text).join(" ");

  return {
    id,
    layer: "clinical",
    source: `pmc/${basename(file)}`,
    presentation: pickField(sections, "presentation", clip(text.slice(0, 700), 900)),
    demographics: pickField(sections, "demographics", extractDemographics(text, id)),
    timeline: pickField(sections, "timeline", notStated(id, "timeline")),
    prior_contacts: pickField(sections, "prior_contacts", notStated(id, "prior_contacts")),
    examination: pickField(sections, "examination", notStated(id, "examination")),
    differential_considered: pickField(sections, "differential_considered", notStated(id, "differential_considered")),
    final_picture: pickField(sections, "final_picture", notStated(id, "final_picture")),
    what_was_missed_initially: derived.what_was_missed_initially,
    why_it_was_missed: derived.why_it_was_missed,
    discriminating_feature: derived.discriminating_feature,
    management: pickField(sections, "management", notStated(id, "management")),
    outcome_at_followup: pickField(sections, "outcome_at_followup", notStated(id, "outcome_at_followup")),
  };
}

function extractDemographics(text: string, id: string): string {
  const m = /(?:a|an)\s+(\d+)[-\s]year[- ]old[^,.]{0,80}/i.exec(text);
  if (m) return clip(m[0], 200);
  const m2 = /(?:male|female|man|woman|girl|boy)\s*(?:aged|of|,)?\s*\d+/i.exec(text);
  if (m2) return clip(m2[0], 200);
  return notStated(id, "demographics");
}

// ---------------------------------------------------------------------------
// SAMHSA TIP vignette extraction
// ---------------------------------------------------------------------------

function samhsaVignettes(): CaseReportRecord[] {
  const dir = join(RAW, "samhsa");
  const out: CaseReportRecord[] = [];
  if (!existsSync(dir)) return out;
  let idn = 0;
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".pdf"))) {
    let text = "";
    try {
      text = extractFromPdf(readFileSync(join(dir, f))).text;
    } catch {
      continue;
    }
    if (!text) continue;
    // Cut at the end of the document body (skip appendices).
    const idx = text.search(/\n(?:appendix|references|resources)\b/i);
    if (idx > 0) text = text.slice(0, idx);
    // "Case Vignette", "Clinical Vignette", "Case Example", "Mrs. …" examples.
    for (const m of text.matchAll(/^(?:case\s+vignette|clinical\s+vignette|case\s+example|vignette)\b[^\n]*\n([\s\S]*?)(?=^(?:case\s+vignette|clinical\s+vignette|case\s+example|vignette|discussion|chapter\s+\d|endnotes)\b|\z)/gim)) {
      const body = m[1].trim();
      if (body.length < 400 || body.length > 12_000) continue;
      if (!PSYCH_RE.test(body)) continue;
      idn++;
      const id = `samhsa-${f.replace(/\.pdf$/, "")}-${idn}`;
      const clean = htmlToText(body);
      const sections = sectionize(clean);
      const derived = deriveMissed(sections, clean, id);
      const demog = extractDemographics(clean, id);
      out.push({
        id,
        layer: "clinical",
        source: `samhsa/${f}`,
        presentation: pickField(sections, "presentation", clip(clean.slice(0, 700), 900)),
        demographics: demog !== notStated(id, "demographics") ? demog : notStated(id, "demographics"),
        timeline: notStated(id, "timeline"),
        prior_contacts: notStated(id, "prior_contacts"),
        examination: notStated(id, "examination"),
        differential_considered: notStated(id, "differential_considered"),
        final_picture: notStated(id, "final_picture"),
        what_was_missed_initially: derived.what_was_missed_initially,
        why_it_was_missed: derived.why_it_was_missed,
        discriminating_feature: derived.discriminating_feature,
        management: notStated(id, "management"),
        outcome_at_followup: notStated(id, "outcome_at_followup"),
      });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const out: CaseReportRecord[] = [];
  const pmcDir = join(RAW, "pmc");
  let skipped = 0;
  if (existsSync(pmcDir)) {
    for (const f of readdirSync(pmcDir).filter((f) => f.endsWith(".xml"))) {
      try {
        const rec = extractFromPmcFile(join(pmcDir, f));
        if (rec) out.push(rec);
        else skipped++;
      } catch {
        skipped++;
      }
    }
  }
  const samhsa = samhsaVignettes();
  out.push(...samhsa);

  writeFileSync(join(OUT, "casereports.jsonl"), out.map((r) => JSON.stringify(r)).join("\n") + "\n");
  console.log(`wrote ${out.length} case-report records to scripts/corpus/extracted/casereports.jsonl`);
  console.log(`  pmc records: ${out.length - samhsa.length} (${skipped} files skipped: no case-report section / not psychiatry / abstract dump / too short)`);
  console.log(`  samhsa vignette records: ${samhsa.length}`);
}

main();

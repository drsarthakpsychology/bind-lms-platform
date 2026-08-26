import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LEGAL } from "./legal-constants";

/**
 * Policy content access — the single way routes read `content/policies/*.md`.
 * One file per policy, frontmatter `{ title, slug, lastUpdated, summary,
 * order }`, body verbatim. Placeholders `[REGISTERED_ADDRESS]` /
 * `[EFFECTIVE_DATE]` are substituted here from `legal-constants` so every page
 * renders from one source of truth (and the TODO tokens stay visibly
 * unresolved until Kavya supplies the values).
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "policies");

export interface PolicyMeta {
  title: string;
  slug: string;
  lastUpdated: string;
  summary: string;
  order: number;
}

export interface Heading {
  /** Anchor id on the rendered h2/h3 (matches the brief's `#2-3-...` style). */
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Policy {
  meta: PolicyMeta;
  /** Markdown body with placeholders substituted — no frontmatter, no title h1. */
  body: string;
  /** The section headings, for the "on this page" TOC. */
  headings: Heading[];
}

/** Strip inline markdown so display text and ids are the plain words. */
export function cleanHeadingText(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [link](url) → link
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** → bold
    .replace(/`([^`]+)`/g, "$1") // `code` → code
    .trim();
}

/**
 * The anchor-id rule shared by the rendered headings AND the TOC, so a
 * `#2-3-the-only-exception` link always lands. `2.3 The only exception` →
 * `2-3-the-only-exception` (dot becomes a hyphen, punctuation stripped,
 * spaces → hyphens).
 */
export function headingSlug(text: string): string {
  return cleanHeadingText(text)
    .toLowerCase()
    .replace(/\./g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function substitutePlaceholders(source: string): string {
  // Never ship a raw bracket token to a live legal page. While the address is
  // still awaiting Kavya it renders as a graceful placeholder ("Available on
  // request") rather than the unresolved `[REGISTERED_ADDRESS]`.
  const address = LEGAL.registeredAddress.startsWith("[")
    ? "Available on request"
    : LEGAL.registeredAddress;
  return source
    .replaceAll("[REGISTERED_ADDRESS]", address)
    .replaceAll("[EFFECTIVE_DATE]", LEGAL.effectiveDate);
}

/** Extract `##`/`###` section headings from a body for the "on this page" TOC. */
function extractHeadings(body: string): Heading[] {
  const out: Heading[] = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.*)$/);
    if (!m) continue;
    const level = m[1].length === 2 ? 2 : 3;
    const text = cleanHeadingText(m[2]);
    out.push({ id: headingSlug(text), text, level });
  }
  return out;
}

function readPolicyFile(fileName: string): Policy | null {
  const raw = readFileSync(path.join(CONTENT_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? "");
  const title = String(data.title ?? "");
  const summary = String(data.summary ?? "");
  const lastUpdated = substitutePlaceholders(String(data.lastUpdated ?? ""));
  const order = Number(data.order ?? 0);
  if (!slug || !title) return null;
  const body = substitutePlaceholders(content.trim());
  return {
    meta: { title, slug, lastUpdated, summary, order },
    body,
    headings: extractHeadings(body),
  };
}

/** All policies, sorted by the frontmatter `order` (the sidebar + index list). */
export function getPolicies(): Policy[] {
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPolicyFile)
    .filter((p): p is Policy => p !== null)
    .sort((a, b) => a.meta.order - b.meta.order);
}

/** One policy by slug, or null for an unknown route (caller calls notFound()). */
export function getPolicy(slug: string): Policy | null {
  const fileName = readdirSync(CONTENT_DIR).find(
    (f) => f.endsWith(".md") && f.replace(/\.md$/, "") === slug,
  );
  if (!fileName) return null;
  return readPolicyFile(fileName);
}

/**
 * Human-readable material/lesson titles. Some records carry the raw storage
 * key ("Curriculum_Overview_Light") as their title; students should see a
 * cleaned, sentence-cased title instead.
 */

const KNOWN_SUFFIXES = [
  "_light",
  "_dark",
  "_v2",
  "_v3",
  "_final",
  "_copy",
  "_new",
  "_old",
];

/** Strip a file extension (last dot that isn't part of a path). */
function stripExtension(s: string): string {
  const dot = s.lastIndexOf(".");
  if (dot === -1 || dot === 0) return s;
  // Only strip if the extension looks like one (≤5 chars, alphanumeric).
  const ext = s.slice(dot + 1);
  if (/^[a-z0-9]{1,5}$/i.test(ext)) return s.slice(0, dot);
  return s;
}

/** Sentence-case a cleaned string ("curriculum overview" → "Curriculum overview"). */
function sentenceCase(s: string): string {
  const lower = s.toLowerCase().trim();
  if (!lower) return lower;
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Turn a raw filename/storage key into a display title: replace underscores and
 * hyphens with spaces, drop known theme/version suffixes, drop the extension,
 * sentence-case. Falls back to the original if nothing survives.
 */
export function cleanMaterialTitle(raw: string): string {
  if (!raw) return raw;
  let s = raw.trim();

  s = stripExtension(s);

  const lower = s.toLowerCase();
  for (const suffix of KNOWN_SUFFIXES) {
    if (lower.endsWith(suffix)) {
      s = s.slice(0, s.length - suffix.length);
      break;
    }
  }

  s = s.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

  return s ? sentenceCase(s) : raw;
}

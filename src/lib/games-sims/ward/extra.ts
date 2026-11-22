import type { Campaign, Quality, Vars, WardOption } from "./engine";
import { EXTRA_A } from "./extra-a";
import { EXTRA_B } from "./extra-b";
import { EXTRA_C } from "./extra-c";
import { EXTRA_D } from "./extra-d";

/** [quality, text, why, dial changes, flags]. */
export type WardExtra = Record<string, [Quality, string, string, Partial<Vars>?, string[]?][]>;

/**
 * Ward Week decisions that had only two choices (a full plan against an
 * obvious mistake) get two more of similar length, each with its reason,
 * so the student has to weigh real options (practice audit H2).
 * Keyed "campaign:decision". New ids follow the old ones (c, d...).
 */
const EXTRA: WardExtra = { ...EXTRA_A, ...EXTRA_B, ...EXTRA_C, ...EXTRA_D };

export function withExtraOptions(c: Campaign): Campaign {
  for (const ch of c.chapters)
    for (const d of ch.decisions) {
      const more = EXTRA[`${c.id}:${d.id}`];
      if (!more || d.options.length >= 4) continue;
      const used = new Set(d.options.map((x) => x.id));
      const ids = "abcdefgh".split("").filter((x) => !used.has(x));
      d.options = [...d.options, ...more.map(([q, text, why, fx = {}, set = []], i): WardOption => ({ id: ids[i]!, q, text, why, fx, set }))];
    }
  return c;
}

export const EXTRA_KEYS = Object.keys(EXTRA);

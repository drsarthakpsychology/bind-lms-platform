/** Team helpers shared by Escape Room and Ward Week (pure). */
import type { Rng } from "./common";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1

export function teamCode(rng: Rng, length = 5): string {
  let s = "";
  for (let i = 0; i < length; i++) s += CODE_CHARS[Math.floor(rng() * CODE_CHARS.length)];
  return s;
}

export function normaliseCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

export const TEAM_NAMES = ["Amygdala", "Hippocampus", "Thalamus", "Cerebellum", "Insula", "Cingulate", "Pons", "Raphe", "Locus", "Striatum", "Fornix", "Broca", "Wernicke", "Synapse", "Axon", "Dendrite"];

export function teamName(rng: Rng): string {
  return `Team ${TEAM_NAMES[Math.floor(rng() * TEAM_NAMES.length)]}`;
}

export const TEAM_LIMITS = { escape: { min: 2, max: 5 }, ward: { min: 2, max: 3 } } as const;

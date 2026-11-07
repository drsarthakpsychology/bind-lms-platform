import type { FigureDef } from "./types";
import { ANATOMY } from "./anatomy";
import { CHARTS } from "./charts";

/** Every figure by id. Anatomy figures live in ./anatomy, clinical and psychology charts in ./charts. */
export const FIGURES: Record<string, FigureDef> = Object.fromEntries([...ANATOMY, ...CHARTS].map((f) => [f.id, f]));

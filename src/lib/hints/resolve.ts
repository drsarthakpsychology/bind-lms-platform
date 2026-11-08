/**
 * What a hint shows, per game, worked out on the server from the game's own
 * content (never from what the browser claims is right). Pure.
 *
 * Most games get "rule out two": two wrong options disappear. Comorbid gets
 * "a card that fits". The answer itself is never shown by a hint.
 */
import { CASES as DETECTIVE_CASES } from "@/lib/learn/detective";
import { drugById, MYSTERIES, PUZZLES, reviewById } from "@/lib/games-sims/rx/content";
import { STEPS } from "@/lib/games-sims/rx/game";
import { excerptById } from "@/lib/games-sims/mse/excerpts";
import { campaignById } from "@/lib/games-sims/ward/campaigns";
import { check, replay, type Move, type Setup } from "@/lib/games-sims/comorbid/game";
import { hashString } from "@/lib/games-sims/common";
import { itemKey, ruleOut, type HintGame } from "./rules";

export type HintAsk =
  | { game: "detective"; run: string; round: number; answer: string; options: string[] }
  | { game: "rx"; run: string; kind: "chain" | "mystery" | "puzzle" | "review"; id: string; step: number; options: string[] }
  | { game: "mse"; run: string; excerpt: string; idx: number; options: string[] }
  | { game: "ward"; run: string; campaign: string; decision: string; options: string[] }
  | { game: "comorbid"; run: string; level: 1 | 2 | 3; moves: Move[] };

export type HintGive = { remove: string[]; pick: string | null; text: string };

export type Resolved = { game: HintGame; item: string; give: HintGive } | null;

const opts = (o: unknown): string[] => (Array.isArray(o) ? [...new Set(o.filter((x): x is string => typeof x === "string" && x.length <= 200))].slice(0, 8) : []);
const RULE_OUT = "Two wrong answers are gone.";

/** Turn a request into the item it spends on and what the hint shows. */
export function resolveHint(a: HintAsk): Resolved {
  if (!a || typeof a !== "object" || typeof a.run !== "string" || a.run.length < 4 || a.run.length > 60) return null;
  switch (a.game) {
    case "detective": {
      const c = DETECTIVE_CASES.find((x) => x.answer === a.answer);
      const o = opts(a.options);
      if (!c || !o.includes(c.answer) || !Number.isInteger(a.round) || a.round < 0 || a.round > 50) return null;
      return { game: "detective", item: itemKey("detective", a.run, a.round), give: { remove: ruleOut(o, [c.answer], hashString(`${a.run}:${a.round}`)), pick: null, text: RULE_OUT } };
    }
    case "rx": {
      const o = opts(a.options);
      let right: string | undefined;
      if (a.kind === "chain") {
        const d = drugById(a.id);
        const s = STEPS[a.step];
        right = d && s ? d[s.key] : undefined;
      } else if (a.kind === "mystery") right = MYSTERIES.find((m) => m.id === a.id)?.answer;
      else if (a.kind === "puzzle") right = PUZZLES.find((p) => p.id === a.id)?.answer;
      else if (a.kind === "review") right = reviewById(a.id)?.answer;
      if (!right || !o.includes(right)) return null;
      const local = a.kind === "chain" ? `${a.id}.${a.step}` : a.id;
      return { game: "rx", item: itemKey("rx", a.run, local), give: { remove: ruleOut(o, [right], hashString(`${a.run}:${local}`)), pick: null, text: RULE_OUT } };
    }
    case "mse": {
      const f = excerptById(a.excerpt)?.findings[a.idx];
      const o = opts(a.options);
      if (!f || !o.includes(f.a)) return null;
      // Near misses stay: they teach the difference.
      return { game: "mse", item: itemKey("mse", a.run, a.excerpt, a.idx), give: { remove: ruleOut(o, [f.a, ...(f.close ?? [])], hashString(`${a.run}:${a.excerpt}:${a.idx}`)), pick: null, text: RULE_OUT } };
    }
    case "ward": {
      const d = campaignById(a.campaign)?.chapters.flatMap((ch) => ch.decisions).find((x) => x.id === a.decision);
      if (!d) return null;
      const weak = d.options.filter((o) => o.q === "harm" || o.q === "poor").map((o) => o.id);
      const keep = d.options.filter((o) => !weak.includes(o.id)).map((o) => o.id);
      return {
        game: "ward",
        item: itemKey("ward", a.run, a.campaign, a.decision),
        give: { remove: ruleOut(d.options.map((o) => o.id), keep, hashString(`${a.run}:${a.decision}`)), pick: null, text: "Two weak choices are gone." },
      };
    }
    case "comorbid": {
      if (![1, 2, 3].includes(a.level) || !Array.isArray(a.moves) || a.moves.length > 80) return null;
      const setup: Setup = { seed: a.run, mode: "bot", level: a.level, names: ["Player 1", "Player 2"] };
      const { game } = replay(setup, a.moves.filter((m) => m && typeof m.uid === "string" && (m.action === "play" || m.action === "swap")));
      if (game.winner !== null || game.turn !== 0) return null;
      const fit = game.seats[0].hand.find((c) => check(game, 0, c).ok);
      return {
        game: "comorbid",
        item: itemKey("comorbid", a.run, game.moves),
        give: fit ? { remove: [], pick: fit.uid, text: "This card fits." } : { remove: [], pick: null, text: "Nothing in your hand fits. Swap a card." },
      };
    }
  }
  return null;
}

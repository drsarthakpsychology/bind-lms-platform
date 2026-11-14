/**
 * Ward Week, served from the server. The browser gets the session it is in,
 * the beats that show, and the decision in play with its options' words
 * only; how good each option is, what it changes, why, and the strongest
 * call come back only once the decision is made, and the ending only at the
 * end. Pure, so every rule is unit-tested; the server actions live in
 * src/app/(dashboard)/games/ward/actions.ts.
 *
 * A solo game is a signed token holding the run, the campaign and the
 * student's own choices so far (option letters), so the story is replayed
 * on the server and can be saved in the browser and carried on later.
 */
import { CAMPAIGNS, campaignById } from "./campaigns";
import { bestOption, choose, currentDecision, endingFor, findDecision, outcomeScore, replay, visibleBeats, type Campaign, type WardState } from "./engine";
import type { CampaignCard, Scene, WardEnd, WardReveal } from "./rules";

const LETTERS = ["a", "b", "c", "d", "e", "f"];

export const campaignCard = (c: Campaign): CampaignCard => ({ id: c.id, title: c.title, patient: c.patient, place: c.place, blurb: c.blurb, sessions: c.chapters.length });
export const campaignCards = (): CampaignCard[] => CAMPAIGNS.map(campaignCard);

export function sceneOf(c: Campaign, st: WardState): Scene {
  const d = currentDecision(c, st);
  const ch = c.chapters[st.chapter];
  return {
    title: c.title,
    patient: c.patient,
    note: c.note ?? null,
    sessions: c.chapters.length,
    chapter: st.chapter,
    chapterTitle: ch?.title ?? "",
    beats: visibleBeats(c, st),
    decision: d ? { kind: d.kind, prompt: d.prompt, options: d.options.map((o) => ({ id: o.id, text: o.text })) } : null,
    vars: { ...st.vars },
    step: st.log.length,
    done: st.done,
  };
}

/** The reveal for choosing `optionId` at state `before` (null if it is not an option now). */
export function revealOf(c: Campaign, before: WardState, optionId: string, voters: number | null = null): { reveal: WardReveal; after: WardState } | null {
  const d = currentDecision(c, before);
  const o = d?.options.find((x) => x.id === optionId);
  if (!d || !o) return null;
  const after = choose(c, before, optionId, voters ?? undefined);
  const best = bestOption(d);
  return {
    after,
    reveal: {
      chapter: before.chapter,
      chapterTitle: c.chapters[before.chapter]?.title ?? "",
      beats: visibleBeats(c, before),
      kind: d.kind,
      skill: d.skill,
      letter: (LETTERS[d.options.indexOf(o)] ?? "a").toUpperCase(),
      text: o.text,
      q: o.q,
      why: o.why,
      best: o.q === "best" ? null : { text: best.text, why: best.why },
      before: { ...before.vars },
      after: { ...after.vars },
      voters,
    },
  };
}

/** Every decision of a team's log, as reveals (all are already made). */
export function revealsOf(c: Campaign, st: WardState): WardReveal[] {
  const out: WardReveal[] = [];
  let cur = replay(c, []);
  for (const l of st.log) {
    const r = revealOf(c, cur, l.option, l.voters ?? null);
    if (!r) break;
    out.push(r.reveal);
    cur = r.after;
  }
  return out;
}

export function endOf(c: Campaign, st: WardState): WardEnd | null {
  if (!st.done) return null;
  const ending = endingFor(c, st);
  return {
    title: ending.title,
    text: ending.text,
    score: outcomeScore(st),
    vars: { ...st.vars },
    log: st.log.flatMap((l) => {
      const f = findDecision(c, l.decision);
      const o = f?.decision.options.find((x) => x.id === l.option);
      if (!f || !o) return [];
      return [{ chapter: f.chapter, kind: f.decision.kind, prompt: f.decision.prompt, text: o.text, q: l.q, best: l.q === "best" ? null : bestOption(f.decision).text }];
    }),
  };
}

/* ---------------------------------------------------------------- solo */

export type WardToken = { u: string; run: string; c: string; ch: string[] };

/** The campaign and state behind a verified token, for this student only. */
export function soloState(t: WardToken | null, userId: string): { c: Campaign; st: WardState } | null {
  if (!t || t.u !== userId || typeof t.run !== "string" || typeof t.c !== "string" || !Array.isArray(t.ch) || t.ch.length > 60) return null;
  const c = campaignById(t.c);
  if (!c) return null;
  return replayChoices(c, t.ch);
}

/** Replay choices; null if one of them was not an option at its step. */
export function replayChoices(c: Campaign, choices: readonly unknown[]): { c: Campaign; st: WardState } | null {
  let st = replay(c, []);
  for (const x of choices) {
    if (typeof x !== "string") return null;
    const next = choose(c, st, x);
    if (next === st) return null;
    st = next;
  }
  return { c, st };
}

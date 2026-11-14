import { describe, expect, it } from "vitest";
import { makeRng } from "../common";
import { currentExcerpt, dealMse, nextExcerpt, seenIds, tagMse, type MseToken } from "./deal";
import { EXCERPTS } from "./excerpts";
import { ROUND_SIZE } from "./rules";
import { TERMS } from "./terms";

const mask = (run: string, r: number) => (r * 104729 + 17) >>> 0;
const EMPTY = new Map();

describe("MSE Lab deal", () => {
  it("a dealt excerpt carries the interview and options, never the answers or explanations", () => {
    for (const lv of [1, 2, 3] as const) {
      const d = dealMse("u", "run1", lv, makeRng(lv), EMPTY, 0, mask)!;
      const e = currentExcerpt(d.payload, "u", mask)!;
      expect(d.excerpt.quotes).toEqual(e.findings.map((f) => f.q));
      const text = JSON.stringify(d);
      expect(text).not.toMatch(/"(a|why|close|also|answer)"/);
      for (const f of e.findings) {
        expect(text.includes(f.why)).toBe(false);
        // The options are the answer and its wrong ones, shuffled.
        expect(new Set(d.excerpt.options[e.findings.indexOf(f)])).toEqual(new Set([f.a, ...f.o.filter((o) => o !== f.a)]));
      }
      expect(currentExcerpt(d.payload, "someone else", mask)).toBeNull();
    }
  });

  it("plays a whole round on the server: each tag is graded, then the next excerpt is dealt", () => {
    const d = dealMse("u", "run1", 1, makeRng(4), EMPTY, 0, mask)!;
    let t: MseToken = d.payload;
    for (let ex = 0; ex < ROUND_SIZE; ex++) {
      const e = currentExcerpt(t, "u", mask)!;
      for (const [i, f] of e.findings.entries()) {
        const res = tagMse(t, e, { domain: TERMS[f.a].domain, term: f.a })!;
        expect(res.reveal.score).toBe(1);
        expect(res.reveal.why).toBe(f.why);
        expect(!!res.excerptDone).toBe(i === e.findings.length - 1);
        t = res.next;
      }
      expect(currentExcerpt(t, "u", mask)).toBeNull();
      const n = nextExcerpt(t, makeRng(ex), EMPTY, 0, mask);
      if (ex === ROUND_SIZE - 1) expect(n).toBeNull();
      else {
        expect(n).not.toBeNull();
        t = n!.payload;
      }
    }
    expect(t.sc).toEqual(Array(ROUND_SIZE).fill(1));
    expect(new Set(seenIds(t, mask)).size).toBe(ROUND_SIZE);
    expect(t.b).toBeGreaterThan(0);
  });

  it("grades a wrong tag, explains why not, and refuses a word that was not dealt", () => {
    const d = dealMse("u", "run2", 2, makeRng(8), EMPTY, 0, mask)!;
    const e = currentExcerpt(d.payload, "u", mask)!;
    const f = e.findings[0];
    const wrong = f.o.find((o) => o !== f.a && !(f.close ?? []).includes(o))!;
    const res = tagMse(d.payload, e, { domain: null, term: wrong })!;
    expect(res.reveal.score).toBe(0);
    expect(res.reveal.answer).toBe(f.a);
    expect(res.reveal.whyNot).toContain(TERMS[f.a].label);
    const notDealt = Object.keys(TERMS).find((k) => !d.excerpt.options[0].includes(k))!;
    expect(tagMse(d.payload, e, { domain: null, term: notDealt })).toBeNull();
    expect(EXCERPTS.length).toBeGreaterThan(ROUND_SIZE);
  });
});

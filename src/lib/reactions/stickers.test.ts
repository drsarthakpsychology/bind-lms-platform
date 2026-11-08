import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LINES } from "./lines";
import { pickFrom, type Recent } from "./pick";
import { MOODS, moodForScore, STICKERS, stickerSrc, stickersFor } from "./stickers";

const PUBLIC = join(process.cwd(), "public");

/** Width and height from a WebP header (VP8, VP8L or VP8X). */
function webpSize(file: string): { w: number; h: number } {
  const b = readFileSync(file);
  expect(b.toString("ascii", 0, 4)).toBe("RIFF");
  expect(b.toString("ascii", 8, 12)).toBe("WEBP");
  const kind = b.toString("ascii", 12, 16);
  if (kind === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  if (kind === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { w: 1 + (bits & 0x3fff), h: 1 + ((bits >> 14) & 0x3fff) };
  }
  return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
}

describe("reaction stickers", () => {
  it("every sticker file referenced exists, with the size the code reserves", () => {
    for (const s of STICKERS) {
      const file = join(PUBLIC, stickerSrc(s.id));
      expect(existsSync(file), file).toBe(true);
      expect(webpSize(file), s.id).toEqual({ w: s.w, h: s.h });
    }
  });

  it("every file in public/reactions is used", () => {
    const files = readdirSync(join(PUBLIC, "reactions")).filter((f) => f.endsWith(".webp"));
    expect(files.sort()).toEqual(STICKERS.map((s) => `${s.id}.webp`).sort());
  });

  it("every mood has a sticker and every sticker has a short alt text", () => {
    for (const m of MOODS) expect(stickersFor(m).length, m).toBeGreaterThan(0);
    for (const s of STICKERS) {
      expect(s.alt.length).toBeGreaterThan(8);
      expect(s.alt.length).toBeLessThanOrEqual(40);
      expect(/[–—]/.test(s.alt)).toBe(false);
    }
  });

  it("matches the owner's mood table", () => {
    const by = (m: string) => STICKERS.filter((s) => s.mood === m).map((s) => s.id).sort();
    expect(by("right")).toEqual(["flower-cat", "pointing-cat", "shaka-cat", "smug-beagle", "smug-thumbs-up"]);
    expect(by("streak")).toEqual(["hamster-heart", "sunlit-dog"]);
    expect(by("surprise")).toEqual(["shocked-dog"]);
    expect(by("near")).toEqual(["crying-thumbs-up"]);
    expect(by("wrong")).toEqual(["cat-hand-on-head", "crying-cat", "praying-dog", "screaming-point-cat", "smug-corgi", "wet-cat-stare"]);
  });

  it("maps a round's score to a mood", () => {
    expect(moodForScore(10, 10)).toBe("streak");
    expect(moodForScore(7, 10)).toBe("right");
    expect(moodForScore(4, 10)).toBe("near");
    expect(moodForScore(1, 10)).toBe("wrong");
    expect(moodForScore(0, 0)).toBe("near");
  });
});

describe("reaction picks", () => {
  it("rarely repeats a sticker and line pair", () => {
    let recent: Recent = { s: [], l: [] };
    let seed = 3;
    const rand = () => ((seed = (seed * 48271) % 2147483647) / 2147483647);
    const seen: string[] = [];
    for (let i = 0; i < 20; i++) {
      const p = pickFrom("wrong", recent, rand);
      recent = p.recent;
      seen.push(`${p.reaction.sticker.id}|${p.reaction.line}`);
      expect(LINES.wrong).toContain(p.reaction.line);
      expect(p.reaction.sticker.mood).toBe("wrong");
    }
    // No pair in a run of 20, and no line twice within the remembered window.
    expect(new Set(seen).size).toBe(20);
    const ids = seen.map((x) => x.split("|")[0]);
    for (let i = 1; i < ids.length; i++) expect(ids[i]).not.toBe(ids[i - 1]);
  });

  it("falls back to the least recent when everything was shown lately", () => {
    const p = pickFrom("surprise", { s: ["shocked-dog"], l: [] }, () => 0);
    expect(p.reaction.sticker.id).toBe("shocked-dog");
    expect(p.recent.s).toEqual(["shocked-dog"]);
  });
});

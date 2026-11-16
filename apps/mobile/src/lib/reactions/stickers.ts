import type { ImageSourcePropType } from "react-native";

/**
 * The reaction stickers: the same files as the website's public/reactions
 * (stylised cat and dog memes, blue riso on lime or cream paper), bundled in
 * assets/reactions so they show offline. Names, moods and descriptions match
 * src/lib/reactions/stickers.ts on the website; keep the two in step.
 *
 * w and h are the files' real pixel sizes (374 at most), so a picture keeps
 * its shape before it decodes. Shown at 132 points at most, which is about
 * the files' size on a 3x phone: no larger copies are needed.
 */

export type Mood = "right" | "streak" | "surprise" | "near" | "wrong";

/** Good moods sit on lime paper; the others on cream. */
export const GOOD_MOODS: ReadonlySet<Mood> = new Set<Mood>(["right", "streak", "surprise"]);

export type StickerId =
  | "smug-thumbs-up"
  | "shaka-cat"
  | "flower-cat"
  | "pointing-cat"
  | "smug-beagle"
  | "hamster-heart"
  | "sunlit-dog"
  | "shocked-dog"
  | "crying-thumbs-up"
  | "wet-cat-stare"
  | "cat-hand-on-head"
  | "screaming-point-cat"
  | "smug-corgi"
  | "praying-dog"
  | "crying-cat";

export type Sticker = { id: StickerId; mood: Mood; alt: string; w: number; h: number; src: ImageSourcePropType };

export const STICKERS: readonly Sticker[] = [
  { id: "smug-thumbs-up", mood: "right", alt: "Smug cat giving a thumbs up", w: 349, h: 374, src: require("../../../assets/reactions/smug-thumbs-up.webp") },
  { id: "shaka-cat", mood: "right", alt: "Cat throwing a shaka sign", w: 337, h: 374, src: require("../../../assets/reactions/shaka-cat.webp") },
  { id: "flower-cat", mood: "right", alt: "Happy cat holding a flower", w: 374, h: 371, src: require("../../../assets/reactions/flower-cat.webp") },
  { id: "pointing-cat", mood: "right", alt: "Cat pointing a paw at you", w: 305, h: 374, src: require("../../../assets/reactions/pointing-cat.webp") },
  { id: "smug-beagle", mood: "right", alt: "Smug beagle looking pleased", w: 276, h: 374, src: require("../../../assets/reactions/smug-beagle.webp") },
  { id: "hamster-heart", mood: "streak", alt: "Hamster making a tiny heart", w: 253, h: 374, src: require("../../../assets/reactions/hamster-heart.webp") },
  { id: "sunlit-dog", mood: "streak", alt: "Dog glowing in the sunlight", w: 347, h: 374, src: require("../../../assets/reactions/sunlit-dog.webp") },
  { id: "shocked-dog", mood: "surprise", alt: "Shocked dog staring in disbelief", w: 365, h: 374, src: require("../../../assets/reactions/shocked-dog.webp") },
  { id: "crying-thumbs-up", mood: "near", alt: "Crying cat giving a thumbs up", w: 374, h: 367, src: require("../../../assets/reactions/crying-thumbs-up.webp") },
  { id: "wet-cat-stare", mood: "wrong", alt: "Wet cat staring blankly", w: 370, h: 374, src: require("../../../assets/reactions/wet-cat-stare.webp") },
  { id: "cat-hand-on-head", mood: "wrong", alt: "Cat with a paw on its head", w: 374, h: 297, src: require("../../../assets/reactions/cat-hand-on-head.webp") },
  { id: "screaming-point-cat", mood: "wrong", alt: "Screaming cat pointing", w: 374, h: 346, src: require("../../../assets/reactions/screaming-point-cat.webp") },
  { id: "smug-corgi", mood: "wrong", alt: "Smug corgi giving side eye", w: 327, h: 374, src: require("../../../assets/reactions/smug-corgi.webp") },
  { id: "praying-dog", mood: "wrong", alt: "Dog with its paws pressed together", w: 342, h: 374, src: require("../../../assets/reactions/praying-dog.webp") },
  { id: "crying-cat", mood: "wrong", alt: "Crying cat with teary eyes", w: 374, h: 326, src: require("../../../assets/reactions/crying-cat.webp") },
];

export function stickersFor(mood: Mood): Sticker[] {
  return STICKERS.filter((s) => s.mood === mood);
}

export function stickerById(id: StickerId): Sticker {
  return STICKERS.find((s) => s.id === id)!;
}

/** A round's score as a mood, for end screens (the website's moodForScore). */
export function moodForScore(right: number, total: number): Mood {
  if (total <= 0) return "near";
  const r = right / total;
  if (r >= 0.85) return "streak";
  if (r >= 0.6) return "right";
  if (r >= 0.35) return "near";
  return "wrong";
}

/**
 * Which meme stands in for each kind of empty or error page (it replaced the
 * hand-drawn cat):
 * - empty: nothing here yet (a list with no rows)
 * - clear: all done, nothing waiting for you
 * - soon: opens soon, coming in the next update
 * - missing: not found, nothing matches the search
 * - error: could not load, something went wrong
 * - locked: you do not have access
 * - wait: please wait (paused account, update needed)
 * - win: done, it worked
 * - hello: a friendly wave (the end of Welcome)
 */
export type StateMood = "empty" | "clear" | "soon" | "missing" | "error" | "locked" | "wait" | "win" | "hello";

export const STATE_STICKER: Record<StateMood, StickerId> = {
  empty: "wet-cat-stare",
  clear: "sunlit-dog",
  soon: "flower-cat",
  missing: "screaming-point-cat",
  error: "cat-hand-on-head",
  locked: "smug-corgi",
  wait: "praying-dog",
  win: "shaka-cat",
  hello: "smug-thumbs-up",
};

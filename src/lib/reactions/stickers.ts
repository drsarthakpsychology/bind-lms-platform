/**
 * The reaction stickers (public/reactions/*.webp): stylised cat and dog
 * memes, blue halftone riso on lime paper (good moods) or cream paper (bad
 * moods), thick ink outline, blue offset shadow. Made by
 * scripts/reactions/stylize.py; the art is fixed, this file only names it.
 *
 * w and h are the files' real pixel sizes, so every <img> reserves its box
 * before the file arrives (no layout shift).
 */

export type Mood = "right" | "streak" | "surprise" | "near" | "wrong";

export const MOODS: readonly Mood[] = ["right", "streak", "surprise", "near", "wrong"];

/** Good moods sit on lime paper; the others on cream. */
export const GOOD_MOODS: ReadonlySet<Mood> = new Set<Mood>(["right", "streak", "surprise"]);

export type Sticker = { id: string; mood: Mood; alt: string; w: number; h: number };

export const STICKERS: readonly Sticker[] = [
  { id: "smug-thumbs-up", mood: "right", alt: "Smug cat giving a thumbs up", w: 349, h: 374 },
  { id: "shaka-cat", mood: "right", alt: "Cat throwing a shaka sign", w: 337, h: 374 },
  { id: "flower-cat", mood: "right", alt: "Happy cat holding a flower", w: 374, h: 371 },
  { id: "pointing-cat", mood: "right", alt: "Cat pointing a paw at you", w: 305, h: 374 },
  { id: "smug-beagle", mood: "right", alt: "Smug beagle looking pleased", w: 276, h: 374 },
  { id: "hamster-heart", mood: "streak", alt: "Hamster making a tiny heart", w: 253, h: 374 },
  { id: "sunlit-dog", mood: "streak", alt: "Dog glowing in the sunlight", w: 347, h: 374 },
  { id: "shocked-dog", mood: "surprise", alt: "Shocked dog staring in disbelief", w: 365, h: 374 },
  { id: "crying-thumbs-up", mood: "near", alt: "Crying cat giving a thumbs up", w: 374, h: 367 },
  { id: "wet-cat-stare", mood: "wrong", alt: "Wet cat staring blankly", w: 370, h: 374 },
  { id: "cat-hand-on-head", mood: "wrong", alt: "Cat with a paw on its head", w: 374, h: 297 },
  { id: "screaming-point-cat", mood: "wrong", alt: "Screaming cat pointing", w: 374, h: 346 },
  { id: "smug-corgi", mood: "wrong", alt: "Smug corgi giving side eye", w: 327, h: 374 },
  { id: "praying-dog", mood: "wrong", alt: "Dog with its paws pressed together", w: 342, h: 374 },
  { id: "crying-cat", mood: "wrong", alt: "Crying cat with teary eyes", w: 374, h: 326 },
];

export function stickerSrc(id: string): string {
  return `/reactions/${id}.webp`;
}

export function stickersFor(mood: Mood): Sticker[] {
  return STICKERS.filter((s) => s.mood === mood);
}

export function stickerById(id: string): Sticker | undefined {
  return STICKERS.find((s) => s.id === id);
}

/** A round's score as a mood, for end screens: hype for a strong round, a roast for a weak one. */
export function moodForScore(right: number, total: number): Mood {
  if (total <= 0) return "near";
  const r = right / total;
  if (r >= 0.85) return "streak";
  if (r >= 0.6) return "right";
  if (r >= 0.35) return "near";
  return "wrong";
}

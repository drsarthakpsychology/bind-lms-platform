import { pickReaction, type Reaction } from "@/lib/reactions/pick";
import { readReactionsOn } from "@/lib/reactions/prefs";
import { stickerSrc, type Mood } from "@/lib/reactions/stickers";

/**
 * The one reaction on screen (app wide). Quiz screens ask for one through
 * useReaction(); the ReactionLayer in the app shell draws it. Kept outside
 * React so any screen can fire one without a provider.
 */

export type Shown = Reaction & { key: number };

let current: Shown | null = null;
let lastAt = 0;
let seq = 0;
const subs = new Set<() => void>();

function emit() {
  for (const cb of subs) cb();
}

export function subscribeShown(cb: () => void): () => void {
  subs.add(cb);
  return () => subs.delete(cb);
}
export const getShown = (): Shown | null => current;
export const getShownServer = (): Shown | null => null;

/** When the last reaction was asked for (for the 15 s throttle). */
export function lastShownAt(): number {
  return lastAt;
}

/** Let the right/wrong mark land first, then show (once the sticker has loaded, or 0.8 s at most). */
const SETTLE_MS = 320;
const LOAD_CAP_MS = 800;

export function showReaction(mood: Mood): void {
  if (typeof window === "undefined" || !readReactionsOn()) return;
  lastAt = Date.now();
  const r = pickReaction(mood);
  const t0 = lastAt;
  const img = new Image();
  img.decoding = "async";
  img.src = stickerSrc(r.sticker.id);
  const loaded = typeof img.decode === "function" ? img.decode().catch(() => undefined) : Promise.resolve();
  void Promise.race([loaded, new Promise((res) => setTimeout(res, LOAD_CAP_MS))]).then(() => {
    setTimeout(
      () => {
        if (!readReactionsOn()) return;
        current = { ...r, key: ++seq };
        emit();
      },
      Math.max(0, SETTLE_MS - (Date.now() - t0)),
    );
  });
}

export function dismissReaction(key?: number): void {
  if (!current || (key !== undefined && current.key !== key)) return;
  current = null;
  emit();
}

/** Tests only. */
export function resetReactionStore(): void {
  current = null;
  lastAt = 0;
  emit();
}

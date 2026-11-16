import { createStore } from "@/lib/store";

/**
 * The sign in to Home handoff ("the door opens", docs/MOTION.md).
 *
 * `holdPin`: the sign-in screen is still playing its exit (tick, then the
 * form drops away), so the PIN screen waits for it. Sign-in sets it before
 * asking the server and clears it when its exit is done, on failure, or when
 * it unmounts, so the PIN screen can never be held back for good.
 *
 * `opening`: a new PIN was just chosen. The PIN screen stays up until Home
 * has mounted and painted under it (app/_layout.tsx), then lifts away.
 */
export const handoff = createStore<{ holdPin: boolean; opening: boolean }>({ holdPin: false, opening: false });

export function holdPin(): void {
  if (!handoff.get().holdPin) handoff.set({ holdPin: true });
}

export function releasePin(): void {
  if (handoff.get().holdPin) handoff.set({ holdPin: false });
}

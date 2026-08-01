import "server-only";

/**
 * Media provider abstraction.
 *
 * The player never constructs a storage URL itself — it asks the API for a
 * playback URL (see getPlaybackUrl). This module is where that URL gets
 * minted, behind an interface so we can swap Supabase Storage for Cloudflare
 * R2 (or anything else) without touching player or route code.
 *
 * Selected by config: `NEXT_PUBLIC_MEDIA_PROVIDER` = "supabase" | "r2".
 */

export type SignedPlaybackResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export type UploadResult =
  | { ok: true; key: string }
  | { ok: false; error: string };

export interface MediaProvider {
  /** Mint a short-lived signed URL for a stored object (or HLS master). */
  getPlaybackUrl(key: string, expiresSeconds?: number): Promise<SignedPlaybackResult>;
  /**
   * Mint a short-lived signed URL for an object in an explicit bucket.
   * Used for the private `materials` bucket, where the path alone isn't enough
   * (the provider defaults to the videos bucket).
   */
  getPlaybackUrlFromBucket(
    bucket: string,
    key: string,
    expiresSeconds?: number,
  ): Promise<SignedPlaybackResult>;
  /** Begin an upload for a given key (returns a signed upload URL/token). */
  prepareUpload(key: string): Promise<UploadResult>;
  /** Check the provider is reachable (health). */
  health(): Promise<boolean>;
}

export function getMediaProvider(): MediaProvider {
  const provider = process.env.NEXT_PUBLIC_MEDIA_PROVIDER ?? "supabase";
  if (provider === "r2") {
    // Lazy require so R2 env vars are only read when actually selected.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { R2MediaProvider } = require("./r2");
    return new R2MediaProvider();
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { SupabaseMediaProvider } = require("./supabase");
  return new SupabaseMediaProvider();
}

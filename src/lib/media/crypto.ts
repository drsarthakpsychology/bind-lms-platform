import "server-only";

import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

/**
 * Session-bound encryption for the stream proxy.
 *
 * Round 9 "real protection": every segment is encrypted with a key derived
 * from the (HMAC-signed) stream session token. Copying bytes out of the
 * network tab yields ciphertext that is only useful to the active session
 * — replaying the token after it expires fails, and a different session's
 * token yields a different key.
 *
 * Design:
 *   - The at-rest R2 segment is AES-128 encrypted with `media_assets.encryption_key`
 *     (16 random bytes stored in Supabase, never in R2).
 *   - The proxy re-encrypts each segment with a per-session key derived from
 *     the stream token. The player sees only the per-session ciphertext.
 *   - The HLS playlist declares the session key via a standard `#EXT-X-KEY`
 *     URI; hls.js fetches it transparently through the authed endpoint.
 *
 * Honest limits: a determined user can still screen-record decrypted frames
 * in the browser. Without DRM (Widevine/FairPlay), this is the ceiling.
 */

/** Derive a 16-byte AES key from the stream token, bound to a lesson. */
export function deriveSessionKey(streamToken: string, lessonId: string): Buffer {
  // Fail closed: never derive from an empty/public value, which would make the
  // session key derivable by anyone. SESSION_SECRET is a dedicated signing
  // secret — deliberately NOT the service-role key, which bypasses RLS and
  // must never double as a generic signing secret (audit finding #5).
  const baseSecret = process.env.SESSION_SECRET;
  if (!baseSecret) {
    throw new Error(
      "No session-key secret configured. Set SESSION_SECRET.",
    );
  }
  const hmac = createHmac("sha256", `plms-session-key-v1:${lessonId}`)
    .update(baseSecret)
    .update(streamToken);
  return hmac.digest().subarray(0, 16);
}

/** Generate a fresh 16-byte AES-128 key for at-rest encryption. */
export function generateAssetKey(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Encrypt a buffer with AES-128-CBC. Returns the ciphertext plus a fresh
 * IV. Callers must use a unique IV per segment (we generate fresh per call).
 *
 * ffmpeg's HLS AES-128 mode expects CBC + PKCS7 padding — same here so the
 * playlist's `#EXT-X-KEY` URI plays the same role.
 */
export function aesEncrypt(plaintext: Buffer, key: Buffer, iv?: Buffer): { ciphertext: Buffer; iv: Buffer } {
  const useIv = iv ?? randomBytes(16);
  const cipher = createCipheriv("aes-128-cbc", key, useIv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return { ciphertext, iv: useIv };
}

export function aesDecrypt(ciphertext: Buffer, key: Buffer, iv: Buffer): Buffer {
  const decipher = createDecipheriv("aes-128-cbc", key, iv);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

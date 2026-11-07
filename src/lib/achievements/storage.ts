import "server-only";
import { makeR2Client, GetObjectCommand, PutObjectCommand } from "@/lib/media/r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Credential file storage on Cloudflare R2 (reuses the existing bucket and
 * S3-compatible client). Only the object KEY is stored in Supabase; the bytes
 * never touch Postgres or Supabase Storage.
 */

function bucket(): string {
  const b = process.env.R2_BUCKET_NAME;
  if (!b) throw new Error("R2_BUCKET_NAME is not set.");
  return b;
}

/** Upload a generated PDF (or badge image) to R2; returns the object key used. */
export async function putCredentialAsset(key: string, bytes: Buffer | Uint8Array, contentType: string): Promise<string> {
  const b = bucket();
  await makeR2Client().send(
    new PutObjectCommand({ Bucket: b, Key: key, Body: bytes, ContentType: contentType }),
  );
  return key;
}

/** Mint a short-lived, signed download URL for a private credential asset. */
export async function credentialDownloadUrl(key: string, expiresSeconds = 60 * 60): Promise<string> {
  const b = bucket();
  return getSignedUrl(makeR2Client(), new GetObjectCommand({ Bucket: b, Key: key }), { expiresIn: expiresSeconds });
}

/** A fresh, cryptographically-unpredictable credential token (not the internal id). */
export function newCredentialId(): string {
  // 32 hex chars from two UUIDs: 122 bits, opaque, non-sequential.
  return `${crypto.randomUUID().replace(/-/g, "")}${crypto.randomUUID().replace(/-/g, "")}`;
}

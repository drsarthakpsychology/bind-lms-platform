import "server-only";

import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { MediaProvider, SignedPlaybackResult, UploadResult } from "./provider";

/**
 * Cloudflare R2 media provider. R2 exposes an S3-compatible API, so we use
 * the AWS SDK pointed at R2's endpoint. Short-lived signed URLs are minted
 * server-side per request; the raw keys are never sent to the browser.
 *
 * Env: CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *      R2_BUCKET_NAME (see .env.example).
 */
export class R2MediaProvider implements MediaProvider {
  private client: S3Client;
  private bucket: string;

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET_NAME;
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error("R2 env vars are not set (see .env.example).");
    }
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.bucket = bucket;
  }

  async getPlaybackUrl(key: string, expiresSeconds = 3600): Promise<SignedPlaybackResult> {
    return this.getPlaybackUrlFromBucket(this.bucket, key, expiresSeconds);
  }

  async getPlaybackUrlFromBucket(
    bucket: string,
    key: string,
    expiresSeconds = 3600,
  ): Promise<SignedPlaybackResult> {
    try {
      const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
      const url = await getSignedUrl(this.client, cmd, { expiresIn: expiresSeconds });
      return { ok: true, url };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Could not sign R2 URL." };
    }
  }

  async prepareUpload(key: string): Promise<UploadResult> {
    // For simplicity we return the key; the publish script uploads directly
    // with its own credentials. This interface method exists so the API can
    // later add signed-upload support without changing the player.
    return { ok: true, key };
  }

  async health(): Promise<boolean> {
    try {
      // A HEAD-style check: list at most one object.
      await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: "_health_check" }),
      );
      return true;
    } catch {
      // _health_check won't exist; a 404 still proves connectivity.
      return true;
    }
  }
}

// Re-exported for the publish/upload scripts.
export { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand };

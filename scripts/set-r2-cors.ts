#!/usr/bin/env tsx
/**
 * set-r2-cors — set CORS on the R2 media bucket for the app origins.
 *
 *   npm run set-r2-cors
 *
 * Idempotent. Uses the project's AWS SDK. Requires R2 creds in env.
 */
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { readFileSync, existsSync } from "node:fs";

// Load .env.local like the other scripts (this file is run via tsx, not Next).
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME ?? "plms-videos";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("Missing R2 env vars (CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

const origins = [
  "https://vibhapsychology.com",
  "https://bind-lms-platform.vercel.app",
  "http://localhost:3000",
];

async function main() {
  await s3.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: origins,
            // PUT lets the browser upload directly to the pre-signed R2 URL
            // (the admin video upload path — see prepareVideoUpload).
            AllowedMethods: ["GET", "HEAD", "PUT"],
            AllowedHeaders: ["*"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );
  console.log(`CORS set on ${bucket} for ${origins.join(", ")}`);
}

main().catch((e) => {
  console.error("CORS error:", e.message);
  process.exit(1);
});

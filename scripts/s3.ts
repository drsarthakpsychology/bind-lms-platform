/**
 * Minimal R2/S3 CLI for GitHub Actions (runners no longer ship Docker, so the
 * old `docker run amazon/aws-cli` calls in uptime.yml / backup.yml fail).
 *
 * Uses the same @aws-sdk/client-s3 the app already depends on. Runs via tsx.
 *
 * Commands:
 *   get   <bucket> <key>              print object to stdout (exit 1 if missing)
 *   put   <bucket> <key> <file|-|->   upload a file, or stdin with `-`
 *   list  <bucket> [prefix]           print keys, one per line
 *   rm    <bucket> <key>              delete one key
 *
 * Env (all required): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
 */
import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

function client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error("Missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY");
    process.exit(2);
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function get(bucket: string, key: string) {
  const s3 = client();
  try {
    const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const text = await Body?.transformToString();
    if (text !== undefined) process.stdout.write(text);
  } catch (e: unknown) {
    if ((e as { name?: string }).name === "NoSuchKey") process.exit(1);
    throw e;
  }
}

async function put(bucket: string, key: string, source: string) {
  const s3 = client();
  let body: Uint8Array;
  if (source === "-") {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
    body = Buffer.concat(chunks);
  } else {
    const { readFile } = await import("node:fs/promises");
    body = await readFile(source);
  }
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
}

async function list(bucket: string, prefix: string) {
  const s3 = client();
  let token: string | undefined;
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix || undefined,
      ContinuationToken: token,
    }));
    for (const obj of res.Contents ?? []) if (obj.Key) console.log(obj.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
}

async function rm(bucket: string, key: string) {
  const s3 = client();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

const [, , cmd, ...args] = process.argv;
const main = {
  get,
  put,
  list,
  rm,
}[cmd] as ((...a: string[]) => Promise<void>) | undefined;

if (!main) {
  console.error("usage: s3.ts <get|put|list|rm> [args...]");
  process.exit(2);
}

main(...args).catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});

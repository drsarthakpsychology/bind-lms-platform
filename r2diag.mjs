import { S3Client, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "node:fs";

const env = {};
for (const line of readFileSync("/Users/kavyabothra/Downloads/plms (1)/.env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)=["']?(.*?)["']?\s*$/);
  if (m) env[m[1]] = m[2];
}

const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const bucket = env.R2_BUCKET_NAME;
const key = "lessons/b2bbbd69-a554-458c-9c27-611baaaf4ea9/source/67985e17-62a1-4981-95e9-c38e3c3f9972-Edited_Video_.mp4";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});

const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
console.log("HEAD Content-Type:", head.ContentType);
console.log("HEAD Content-Length:", head.ContentLength);
console.log("HEAD Metadata:", JSON.stringify(head.Metadata ?? {}));

const first = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key, Range: "bytes=0-262143" }));
const buf = Buffer.from(await first.Body.transformToByteArray());
const txt = buf.toString("latin1");
function idx(box) { return txt.indexOf(box); }
console.log("ftyp at:", idx("ftyp"));
console.log("moov at:", idx("moov"));
console.log("mdat at:", idx("mdat"));
console.log("moov before mdat (faststart)?", idx("moov") >= 0 && idx("mdat") >= 0 ? idx("moov") < idx("mdat") : "moov/mdat not both in first 256KB");

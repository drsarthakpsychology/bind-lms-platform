import { NextResponse } from "next/server";
import { assetLinks } from "@/lib/app-links";

/** Android App Links proof: links to this site may open the Vibha Psychology app (src/lib/app-links.ts). */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(assetLinks(process.env.ANDROID_SHA256_FINGERPRINTS), {
    headers: { "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" },
  });
}

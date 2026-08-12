import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { synthesize } from "@/lib/voice/synthesize";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  text: z.string().min(1).max(2000),
  voice: z.string().min(1).max(120),
  emotionTag: z.enum(["", "happy", "sad", "angry", "surprised", "neutral"]).default("neutral"),
  speed: z.number().min(0.5).max(2).default(1),
});

/**
 * POST /api/practice/voice/synthesis — server-side TTS.
 * CosyVoice 2 (NVIDIA NIM) → Kokoro → fixture. Cache-first (R2 keyed on
 * sha256(text+voice+emotion+speed)). Fixture mode returns provider
 * 'fixture' and the client renders with browser speech + affect mapping —
 * the app is fully demoable with zero keys.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`voice:synth:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const result = await synthesize({
    text: parsed.data.text,
    voice: parsed.data.voice,
    emotionTag: parsed.data.emotionTag,
    speed: parsed.data.speed,
  });

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { guardStudentCall } from "@/lib/ai/guards";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  audioBase64: z.string().min(1).max(4_000_000),
  mime: z.string().default("audio/webm"),
});

/**
 * POST /api/practice/voice/stt — server-side Whisper transcription.
 * Provider chain: GROQ_API_KEY (fast Whisper) → NVIDIA_API_KEY (NIM Whisper)
 * → honest 503 (browser Web Speech remains the free default).
 * The client ALWAYS shows the interim transcript and lets the student EDIT
 * before sending — that fixes Indian-accent accuracy for free.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const allowed = await rateLimit(`voice:stt:${user.id}`, 30);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  try {
    guardStudentCall("sim_patient_turn", { enabled: process.env.AI_ENABLED !== "false" });
  } catch (e) {
    return NextResponse.json({ error: "STT unavailable", detail: (e as Error).message }, { status: 503 });
  }

  const audio = Buffer.from(parsed.data.audioBase64, "base64");

  // 0) Deepgram (server-side key; streaming-capable, medical vocabulary).
  if (process.env.DEEPGRAM_API_KEY) {
    try {
      const fd = new FormData();
      fd.append("audio", new Blob([audio], { type: parsed.data.mime }), "speech.webm");
      fd.append("model", "whisper");
      fd.append("language", "en-IN");
      const res = await fetch("https://api.deepgram.com/v1/listen", {
        method: "POST",
        headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}` },
        body: fd,
      });
      if (res.ok) {
        const j = (await res.json()) as {
          results?: { channels?: Array<{ alternatives?: Array<{ transcript?: string }> }> };
        };
        const t = j.results?.channels?.[0]?.alternatives?.[0]?.transcript;
        if (t) return NextResponse.json({ transcript: t });
      }
    } catch {
      /* fall through to the next provider */
    }
  }

  const transcribe = async (url: string, apiKey: string): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append("file", new Blob([audio], { type: parsed.data.mime }), "speech.webm");
      fd.append("model", "whisper-large-v3");
      fd.append("language", "en");
      fd.append("response_format", "json");
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: fd,
      });
      if (!res.ok) return null;
      const j = (await res.json()) as { text?: string };
      return j.text ?? null;
    } catch {
      return null;
    }
  };

  if (process.env.GROQ_API_KEY) {
    const t = await transcribe("https://api.groq.com/openai/v1/audio/transcriptions", process.env.GROQ_API_KEY);
    if (t !== null) return NextResponse.json({ transcript: t });
  }
  if (process.env.NVIDIA_API_KEY) {
    const t = await transcribe("https://integrate.api.nvidia.com/v1/audio/transcriptions", process.env.NVIDIA_API_KEY);
    if (t !== null) return NextResponse.json({ transcript: t });
  }

  return NextResponse.json(
    { error: "No STT provider configured — browser Web Speech is your free default." },
    { status: 503 },
  );
}

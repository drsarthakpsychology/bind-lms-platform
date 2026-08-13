import "server-only";

/**
 * Server-side TTS synthesis (v5 §6). Provider chain with failover:
 *
 *   1. CosyVoice 2 (Apache 2.0) — via NVIDIA NIM's OpenAI-compatible audio
 *      endpoint when NVIDIA_API_KEY is set. Inline emotion tags come from
 *      affectToVoice().
 *   2. Kokoro-82M (Apache 2.0, CPU) — fallback tier (self-hosted API URL
 *      via KOKORO_API_URL when configured).
 *   3. Fixture mode (AI_ENABLED=false OR no provider): returns a
 *      deterministic synthesis descriptor; the CLIENT then renders the
 *      patient line with browser speechSynthesis using the affect-mapped
 *      rate/pitch (which is always-on regardless of keys) — so the app is
 *      fully demoable with zero keys.
 *
 * EVERY synthesis is cached in R2 keyed on sha256(text+voice+emotion+speed)
 * so the expensive provider call happens once per unique line.
 *
 * Licensed tiers we deliberately DO NOT use (non-commercial licences):
 * F5-TTS, XTTS v2, IndexTTS-2, open Fish Speech.
 */

import { synthesisCacheKey, type SynthesisRequest } from "./synthesis-keys";
export { synthesisCacheKey, type SynthesisRequest };

export interface SynthesisResult {
  /** R2 object key when cached/synthesised; null in fixture mode. */
  objectKey: string | null;
  /** Absolute public URL when available. */
  url: string | null;
  /** sha256(text+voice+emotion+speed) — the cache key. */
  cacheKey: string;
  /** 'mimo' | 'elevenlabs' | 'cosyvoice2' | 'kokoro' | 'fixture' */
  provider: "mimo" | "elevenlabs" | "qwen3" | "chatterbox" | "cosyvoice2" | "kokoro" | "fixture";
}


function r2Env(): { accountId?: string; accessKeyId?: string; secretAccessKey?: string; bucket?: string; publicUrl?: string } {
  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL,
  };
}

/**
 * Check R2 for the cached synthesis. Returns the public URL when present.
 * (Object existence via HEAD on the public URL — cheap and works with the
 * public bucket URL when configured.)
 */
async function r2Has(key: string): Promise<boolean> {
  const { publicUrl, bucket } = r2Env();
  const base = publicUrl ?? (bucket ? `https://${bucket}.r2.dev` : null);
  if (!base) return false;
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/voice/${key}.mp3`, {
      method: "HEAD",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Qwen3-TTS (primary tier, commercially permissive). OpenAI-compatible
 * /v1/audio/speech endpoint at QWEN_TTS_URL when configured (e.g. a
 * self-hosted vLLM / SiliconFlow instance). 10 languages, voice cloning,
 * natural-language voice direction — the brief's PRIMARY.
 */
async function synthesizeQwen3(req: SynthesisRequest): Promise<{ ok: true; objectKey: string; url: string | null } | { ok: false; reason: string }> {
  const base = process.env.QWEN_TTS_URL;
  const apiKey = process.env.QWEN_TTS_API_KEY;
  if (!base) return { ok: false, reason: "no QWEN_TTS_URL" };
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/v1/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: req.model ?? "Qwen3-TTS",
        input: req.text,
        voice: req.voice,
        speed: req.speed ?? 1,
        response_format: "mp3",
      }),
    });
    if (!res.ok) return { ok: false, reason: `qwen3 ${res.status}` };
    const audio = Buffer.from(await res.arrayBuffer());
    const key = synthesisCacheKey(req);
    const write = await putR2(`voice/${key}.mp3`, audio);
    return { ok: true, objectKey: `voice/${key}.mp3`, url: write?.url ?? null };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}

/**
 * Chatterbox-Turbo (quality tier, MIT). Native [laugh] [cough] [chuckle]
 * tags + emotion exaggeration control — the affect states map onto these.
 * OpenAI-compatible /v1/audio/speech at CHATTERBOX_TTS_URL.
 */
async function synthesizeChatterbox(req: SynthesisRequest): Promise<{ ok: true; objectKey: string; url: string | null } | { ok: false; reason: string }> {
  const base = process.env.CHATTERBOX_TTS_URL;
  const apiKey = process.env.CHATTERBOX_TTS_API_KEY;
  if (!base) return { ok: false, reason: "no CHATTERBOX_TTS_URL" };
  try {
    // Map affect → native tags: tearful_break → [sob], laughs → [laugh],
    // agitation → emotion exaggeration up.
    const tagged = req.text
      .replace(/\(laughs\)/gi, "[laugh]")
      .replace(/\(sighs\)/gi, "[sigh]")
      .replace(/\(voice breaks\)/gi, "[sob]")
      .replace(/\(coughs?\)/gi, "[cough]");
    const res = await fetch(`${base.replace(/\/$/, "")}/v1/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: "Chatterbox-Turbo",
        input: tagged,
        voice: req.voice,
        speed: req.speed ?? 1,
        response_format: "mp3",
      }),
    });
    if (!res.ok) return { ok: false, reason: `chatterbox ${res.status}` };
    const audio = Buffer.from(await res.arrayBuffer());
    const key = synthesisCacheKey(req);
    const write = await putR2(`voice/${key}.mp3`, audio);
    return { ok: true, objectKey: `voice/${key}.mp3`, url: write?.url ?? null };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}

/** CosyVoice 2 via NVIDIA NIM (OpenAI-compatible). Emotion tags inline. */
async function synthesizeCosyVoice(req: SynthesisRequest): Promise<{ ok: true; objectKey: string; url: string | null } | { ok: false; reason: string }> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return { ok: false, reason: "no NVIDIA_API_KEY" };

  // The inline tag wraps the text per CosyVoice's emotion-tag syntax
  // (Apache-2.0 model; tags passed through when the NIM endpoint supports
  // them, dropped otherwise — the affect mapping to rate/pitch still holds).
  const tagged = req.emotionTag && req.emotionTag !== "neutral"
    ? `[[${req.emotionTag}]] ${req.text}`
    : req.text;

  try {
    const res = await fetch("https://integrate.api.nvidia.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "cosyvoice2-0.5b", // CosyVoice 2 hosted on NIM, Apache 2.0
        input: tagged,
        voice: req.voice,
        speed: req.speed ?? 1,
        response_format: "mp3",
      }),
    });
    if (!res.ok) return { ok: false, reason: `nim ${res.status}` };
    const audio = Buffer.from(await res.arrayBuffer());
    const key = synthesisCacheKey(req);
    const write = await putR2(`voice/${key}.mp3`, audio);
    return { ok: true, objectKey: `voice/${key}.mp3`, url: write?.url ?? null };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}

/** Kokoro-82M via a self-hosted OpenAI-compatible endpoint (CPU). */
async function synthesizeKokoro(req: SynthesisRequest): Promise<{ ok: true; objectKey: string; url: string | null } | { ok: false; reason: string }> {
  const base = process.env.KOKORO_API_URL;
  if (!base) return { ok: false, reason: "no KOKORO_API_URL" };
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/v1/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "kokoro",
        input: req.text,
        voice: req.voice,
        speed: req.speed ?? 1,
      }),
    });
    if (!res.ok) return { ok: false, reason: `kokoro ${res.status}` };
    const audio = Buffer.from(await res.arrayBuffer());
    const key = synthesisCacheKey(req);
    const write = await putR2(`voice/${key}.mp3`, audio);
    return { ok: true, objectKey: `voice/${key}.mp3`, url: write?.url ?? null };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}

/** R2 put via the SDK (the project's existing S3 client — R2's SigV4 is
 *  handled by the SDK, not hand-rolled). On any error the synthesis is still
 *  returned (the caller is not blocked by storage). */
async function putR2(
  key: string,
  body: Buffer,
): Promise<{ url: string | null } | null> {
  const { accountId, accessKeyId, secretAccessKey, bucket, publicUrl } = r2Env();
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "audio/mpeg",
    }));
    const publicBase = publicUrl ?? (bucket ? `https://${bucket}.r2.dev` : null);
    return { url: publicBase ? `${publicBase.replace(/\/$/, "")}/${key}` : null };
  } catch {
    return null;
  }
}

/**
 * MiMo-V2.5-TTS (MIT, arena-top) — the research round's primary open-weights
 * pick (docs/MODEL_RESEARCH.md). OpenAI-compatible /v1/audio/speech at
 * MIMO_TTS_URL (Xiaomi API free beta, or self-host). Free + commercially
 * usable (MIT) — the first tier tried.
 */
async function synthesizeMiMo(req: SynthesisRequest): Promise<{ ok: true; objectKey: string; url: string | null } | { ok: false; reason: string }> {
  const base = process.env.MIMO_TTS_URL;
  const apiKey = process.env.MIMO_TTS_API_KEY;
  if (!base) return { ok: false, reason: "no MIMO_TTS_URL" };
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/v1/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: req.model ?? "mimo-v2.5-tts",
        input: req.text,
        voice: req.voice,
        speed: req.speed ?? 1,
        response_format: "mp3",
      }),
    });
    if (!res.ok) return { ok: false, reason: `mimo ${res.status}` };
    const audio = Buffer.from(await res.arrayBuffer());
    const key = synthesisCacheKey(req);
    const write = await putR2(`voice/${key}.mp3`, audio);
    return { ok: true, objectKey: `voice/${key}.mp3`, url: write?.url ?? null };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}

/**
 * ElevenLabs (LAST-RESORT optional tier) — paid. Only tried after every free
 * tier (MiMo, Kokoro, Qwen3, Chatterbox, CosyVoice) has failed. Not
 * recommended; kept only if Kavya specifically wants premium voices.
 */
async function synthesizeElevenLabs(req: SynthesisRequest): Promise<{ ok: true; objectKey: string; url: string | null } | { ok: false; reason: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) return { ok: false, reason: "no ELEVENLABS_API_KEY/VOICE_ID" };
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: req.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.45, similarity_boost: 0.75 },
      }),
    });
    if (!res.ok) return { ok: false, reason: `elevenlabs ${res.status}` };
    const audio = Buffer.from(await res.arrayBuffer());
    const key = synthesisCacheKey(req);
    const write = await putR2(`voice/${key}.mp3`, audio);
    return { ok: true, objectKey: `voice/${key}.mp3`, url: write?.url ?? null };
  } catch (e) {
    return { ok: false, reason: (e as Error).message };
  }
}

/**
 * The single synthesis entry point. Cache-first, then the provider chain in
 * quality order: ElevenLabs (premium) → Qwen3-TTS (primary) →
 * Chatterbox-Turbo (quality) → CosyVoice2 (streaming) → Kokoro (CPU) →
 * honest fixture mode. Never throws — the client has browser TTS.
 */
export async function synthesize(req: SynthesisRequest): Promise<SynthesisResult> {
  const key = synthesisCacheKey(req);

  if (process.env.AI_ENABLED === "true") {
    // Cache-first (the cache is content-keyed, provider-agnostic).
    if (await r2Has(key)) {
      return { objectKey: `voice/${key}.mp3`, url: null, cacheKey: key, provider: "kokoro" };
    }
    // FREE-FIRST: open/zero-cost tiers before any paid option.
    // 1 MiMo (MIT) → 2 Kokoro (Apache, CPU) → 3 Qwen3 (hosted) →
    // 4 Chatterbox (MIT) → 5 CosyVoice (NVIDIA free) → 6 ElevenLabs (paid, last).
    const mimo = await synthesizeMiMo(req);
    if (mimo.ok) return { objectKey: mimo.objectKey, url: mimo.url, cacheKey: key, provider: "mimo" };
    const kokoro = await synthesizeKokoro(req);
    if (kokoro.ok) return { objectKey: kokoro.objectKey, url: kokoro.url, cacheKey: key, provider: "kokoro" };
    const qwen = await synthesizeQwen3(req);
    if (qwen.ok) return { objectKey: qwen.objectKey, url: qwen.url, cacheKey: key, provider: "qwen3" };
    const chatter = await synthesizeChatterbox(req);
    if (chatter.ok) return { objectKey: chatter.objectKey, url: chatter.url, cacheKey: key, provider: "chatterbox" };
    const cosy = await synthesizeCosyVoice(req);
    if (cosy.ok) return { objectKey: cosy.objectKey, url: cosy.url, cacheKey: key, provider: "cosyvoice2" };
    const eleven = await synthesizeElevenLabs(req);
    if (eleven.ok) return { objectKey: eleven.objectKey, url: eleven.url, cacheKey: key, provider: "elevenlabs" };
  }

  // Fixture mode — the client renders with browser speech + affect mapping.
  return { objectKey: null, url: null, cacheKey: key, provider: "fixture" };
}

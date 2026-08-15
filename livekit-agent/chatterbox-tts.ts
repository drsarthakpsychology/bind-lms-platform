/**
 * Chatterbox TTS — a LiveKit `tts.TTS` plugin backed by an OpenAI-compatible
 * Chatterbox server (`/v1/audio/speech`, SSE, PCM16).
 *
 * Chatterbox is the open-source (MIT) voice model from Resemble AI — Turbo
 * (350M, sub-200ms streaming, CUDA ~4-6GB VRAM) or Nano (110M, 3x realtime on
 * CPU). The server is the community `chatterbox-openai`/`Chatterbox-TTS-Server`
 * FastAPI app; point this plugin at it with `CHATTERBOX_URL`.
 *
 * This is TTS only. The patient brain (engine, case truth, memory, personality)
 * is untouched — the LLM writes the words, Chatterbox just says them naturally.
 */
import { tts } from "@livekit/agents";
import { AudioFrame } from "@livekit/rtc-node";

/** The `APIConnectOptions` type, derived structurally (not re-exported). */
type ConnectOptions = NonNullable<Parameters<tts.TTS["synthesize"]>[1]>;

export interface ChatterboxTTSOptions {
  /** Base URL of the OpenAI-compatible Chatterbox server, e.g. `http://10.0.0.5:4123`. */
  baseUrl: string;
  /** Model id the server understands (default maps to Chatterbox Turbo). */
  model?: string;
  /** Registered voice id on the server. */
  voice?: string;
  /** Optional bearer token if the server requires auth. */
  apiKey?: string;
  /** PCM16 sample rate to request. Chatterbox's native rate is 24000. */
  sampleRate?: number;
}

const DEFAULT_OPTIONS = {
  model: "chatterbox-turbo",
  voice: "",
  apiKey: "",
  sampleRate: 24000,
};

/** Post a segment to the server and yield PCM16 frames from the SSE stream. */
async function* synthesizeSegment(
  opts: Required<ChatterboxTTSOptions>,
  input: string,
  signal: AbortSignal,
): AsyncGenerator<{ frame: AudioFrame; rate: number; final: boolean }> {
  const base = opts.baseUrl.replace(/\/+$/, "");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (opts.apiKey) headers.Authorization = `Bearer ${opts.apiKey}`;

  const res = await fetch(`${base}/v1/audio/speech`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: opts.model,
      voice: opts.voice || undefined,
      input,
      response_format: "pcm",
      stream: true,
      sample_rate: opts.sampleRate,
    }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`chatterbox tts http ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) >= 0) {
      const rawEvent = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      for (const line of rawEvent.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") return;
        let ev: Record<string, unknown>;
        try {
          ev = JSON.parse(data);
        } catch {
          continue;
        }
        if (ev.type === "response.output_audio.delta" && typeof ev.audio === "string") {
          const buf = Buffer.from(ev.audio, "base64");
          const pcm = new Int16Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 2));
          if (pcm.length === 0) continue;
          const rate =
            typeof ev.sample_rate === "number" && ev.sample_rate > 0
              ? ev.sample_rate
              : opts.sampleRate;
          yield { frame: new AudioFrame(pcm, rate, 1, pcm.length), rate, final: false };
        }
        // `response.completed` / `response.output_audio.done` — the server marks
        // the end of a segment; the flush sentinel below sets `final`.
      }
    }
  }
}

/** Buffered-mode stream: synthesizes the whole text and emits every frame. */
class ChatterboxChunkedStream extends tts.ChunkedStream {
  get label() {
    return "chatterbox.ChunkedStream";
  }

  protected async run(): Promise<void> {
    const signal = this.abortSignal;
    let finalFrame: { frame: AudioFrame; rate: number } | undefined;
    for await (const chunk of synthesizeSegment(this.opts, this.inputText, signal)) {
      finalFrame = { frame: chunk.frame, rate: chunk.rate };
      this.queue.put({
        requestId: this.requestId,
        segmentId: "1",
        frame: chunk.frame,
        final: false,
      });
    }
    if (finalFrame) {
      this.queue.put({
        requestId: this.requestId,
        segmentId: "1",
        frame: finalFrame.frame,
        final: true,
      });
    }
    // The base ChunkedStream closes the queue when run() returns.
  }

  constructor(
    private readonly opts: Required<ChatterboxTTSOptions>,
    text: string,
    tts: tts.TTS,
    connOptions?: ConnectOptions,
    abortSignal?: AbortSignal,
    private readonly requestId: string = `cb-${crypto.randomUUID()}`,
  ) {
    super(text, tts, connOptions, abortSignal);
  }
}

/** Streaming-mode stream: one synthesis per flush sentinel. */
class ChatterboxSynthesizeStream extends tts.SynthesizeStream {
  get label() {
    return "chatterbox.SynthesizeStream";
  }

  constructor(
    private readonly opts: Required<ChatterboxTTSOptions>,
    private readonly parent: ChatterboxTTS,
    connOptions?: ConnectOptions,
  ) {
    super(parent, connOptions);
  }

  protected async run(): Promise<void> {
    let segment = 0;
    let pending = "";

    const speak = async (text: string, final: boolean) => {
      if (!text.trim()) return;
      segment += 1;
      const requestId = `cb-${crypto.randomUUID()}`;
      const segmentId = `seg-${segment}`;
      this.markStarted();
      let last: { frame: AudioFrame; rate: number } | undefined;
      try {
        for await (const chunk of synthesizeSegment(this.opts, text, this.abortController.signal)) {
          last = { frame: chunk.frame, rate: chunk.rate };
          this.queue.put({
            requestId,
            segmentId,
            frame: chunk.frame,
            deltaText: text,
            final: false,
          });
        }
      } catch (e) {
        // A failed segment must not kill the session — the pipeline recovers,
        // and the next student turn re-synthesizes.
        this.parent.emit("error", {
          type: "tts_error",
          timestamp: Date.now(),
          label: this.parent.label,
          error: e as Error,
          recoverable: true,
        });
        return;
      }
      if (last) {
        this.queue.put({
          requestId,
          segmentId,
          frame: last.frame,
          deltaText: text,
          final,
        });
      }
    };

    for await (const data of this.input) {
      if (data === tts.SynthesizeStream.FLUSH_SENTINEL) {
        await speak(pending, true);
        pending = "";
      } else {
        pending += data;
      }
    }
    if (pending) {
      await speak(pending, true);
    }
    this.queue.put(tts.SynthesizeStream.END_OF_STREAM);
  }
}

/**
 * LiveKit TTS adapter for Chatterbox. Configure with `CHATTERBOX_URL` (and
 * optionally `CHATTERBOX_TTS_MODEL` / `CHATTERBOX_TTS_VOICE`).
 */
export class ChatterboxTTS extends tts.TTS {
  readonly label = "chatterbox";

  constructor(private readonly opts: ChatterboxTTSOptions) {
    super(opts.sampleRate ?? DEFAULT_OPTIONS.sampleRate, 1, { streaming: true });
  }

  get model() {
    return this.opts.model ?? DEFAULT_OPTIONS.model;
  }

  get provider() {
    return "chatterbox";
  }

  synthesize(text: string, connOptions?: ConnectOptions, abortSignal?: AbortSignal): tts.ChunkedStream {
    return new ChatterboxChunkedStream(
      { ...DEFAULT_OPTIONS, ...this.opts },
      text,
      this,
      connOptions,
      abortSignal,
    );
  }

  stream(options?: { connOptions?: ConnectOptions }): tts.SynthesizeStream {
    return new ChatterboxSynthesizeStream(
      { ...DEFAULT_OPTIONS, ...this.opts },
      this,
      options?.connOptions,
    );
  }
}

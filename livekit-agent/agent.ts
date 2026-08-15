/**
 * The LiveKit realtime voice agent — VIBHA's simulated patient.
 *
 * LiveKit is the realtime TRANSPORT (WebRTC, STT, TTS, turn detection,
 * barge-in). The EXISTING patient engine (src/lib/sim) is the BRAIN: every
 * student turn goes through runSessionTurn → runPatientTurn with the case
 * truth, disclosure gates, patient state, memory, and the real Groq LLM.
 *
 * There is exactly ONE patient engine and ONE memory. Text mode and realtime
 * voice are the same conversation — this agent persists into the same
 * sim_turns/sim_sessions rows the text path writes.
 *
 * Run: npm run livekit:worker   (dev mode connects to LiveKit Cloud)
 * Deploy: lk agent create (LiveKit Cloud hosts the worker)
 */
import { createClient as createSupabase } from "@supabase/supabase-js";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import {
  cli,
  defineAgent,
  inference,
  llm,
  ServerOptions,
  tts,
  voice,
  type ChatContext,
  type JobContext,
} from "@livekit/agents";
import { readFileSync } from "node:fs";
import { runSessionTurn } from "../src/lib/sim/turn-service";
import { ChatterboxTTS } from "./chatterbox-tts";

dotenv.config({ path: ".env.local" });

function env(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

const PATIENT_AGENT_NAME = "bind-patient";

/**
 * The patient's voice.
 *
 * Primary: Chatterbox (open-source, MIT) served by an OpenAI-compatible
 * Chatterbox server — the most human-sounding voice, with natural prosody and
 * paralinguistic expressiveness, at near-zero cost. Configure with
 * `CHATTERBOX_URL` (+ optional `CHATTERBOX_TTS_MODEL` / `CHATTERBOX_TTS_VOICE` /
 * `CHATTERBOX_API_KEY`).
 *
 * Fallback: Cartesia Sonic-2 via LiveKit Inference — genuinely natural and
 * low-latency (~75ms TTFB), used only when no Chatterbox server is reachable.
 */
function makeTTS(): tts.TTS {
  const chatterboxUrl = env("CHATTERBOX_URL");
  const primary = chatterboxUrl
    ? new ChatterboxTTS({
        baseUrl: chatterboxUrl,
        model: env("CHATTERBOX_TTS_MODEL"),
        voice: env("CHATTERBOX_TTS_VOICE"),
        apiKey: env("CHATTERBOX_API_KEY"),
      })
    : new inference.TTS({
        model: env("LIVEKIT_TTS_MODEL") ?? "cartesia/sonic-2",
        voice: env("LIVEKIT_TTS_VOICE") ?? "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        language: "en",
      });
  console.log(
    "[patient-agent] TTS primary:",
    chatterboxUrl
      ? `chatterbox (${env("CHATTERBOX_TTS_MODEL") ?? "chatterbox-turbo"})`
      : "livekit-inference (cartesia/sonic-2)",
  );
  // The patient must ALWAYS be able to speak. If the primary TTS fails at
  // runtime (server down, bad voice id), LiveKit falls back to the known-good
  // Inworld voice — dead air is never acceptable in a clinical interview.
  const knownGood = new inference.TTS({
    model: "inworld/inworld-tts-2",
    voice: "Guy",
    language: "en",
  });
  return new tts.FallbackAdapter({ ttsInstances: [primary, knownGood], maxRetryPerTTS: 2 });
}

interface WorkerDeps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  resolveSession: () => { sessionId: string; userId: string };
}

/** A LiveKit `LLM` whose brain is the existing patient engine. */
class PatientEngineLLM extends llm.LLM {
  label(): string {
    return "patient-engine";
  }

  constructor(readonly deps: WorkerDeps) {
    super();
  }

  chat(opts: { chatCtx: ChatContext }): llm.LLMStream {
    return new PatientEngineStream(this, opts);
  }
}

class PatientEngineStream extends llm.LLMStream {
  constructor(
    private engine: PatientEngineLLM,
    opts: { chatCtx: ChatContext },
  ) {
    super(engine, {
      chatCtx: opts.chatCtx,
      connOptions: { maxRetry: 0, retryIntervalMs: 0, timeoutMs: 15_000 },
    });
  }

  protected async run(): Promise<void> {
    const messages = [...this.chatCtx.items].filter((m) => m.type === "message") as Array<{
      role: string;
      textContent?: string;
    }>;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.textContent?.trim();

    if (!text) {
      this.output.close();
      return;
    }

    const { sessionId, userId } = this.engine.deps.resolveSession();
    try {
      const result = await runSessionTurn({
        supabase: this.engine.deps.supabase,
        sessionId,
        userId,
        message: text,
      });
      this.output.put({
        id: crypto.randomUUID(),
        delta: { role: "assistant", content: result.reply },
      });
    } catch (e) {
      console.error("[patient-agent] turn failed:", e);
      this.output.put({
        id: crypto.randomUUID(),
        delta: { role: "assistant", content: "Sorry… the words aren't coming out right now. Could you ask that again?" },
      });
    }
    this.output.close();
  }
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    const room = ctx.room;
    const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL") ?? "";
    const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createSupabase(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const resolveSession = () => {
      const humans = [...room.remoteParticipants.values()].filter(
        (p) => p.identity && p.identity !== PATIENT_AGENT_NAME,
      );
      return { sessionId: room.name ?? "", userId: humans[0]?.identity ?? "" };
    };

    const engineLLM = new PatientEngineLLM({ supabase, resolveSession });

    const session = new voice.AgentSession({
      llm: engineLLM,
      stt: new inference.STT({
        model: env("LIVEKIT_STT_MODEL") ?? "deepgram/nova-3",
        language: "en",
      }),
      tts: makeTTS(),
      turnHandling: {
        turnDetection: new inference.TurnDetector(),
      },
    });

    await session.start({
      agent: voice.Agent.create({
        instructions:
          "You are a simulated psychiatric patient in a clinical interview. " +
          "Answer according to your case and how the student treats you. Never break character.",
      }),
      room,
    });

    await ctx.connect();
    console.log(`[patient-agent] joined room ${room.name}`);
  },
});

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: PATIENT_AGENT_NAME,
  }),
);

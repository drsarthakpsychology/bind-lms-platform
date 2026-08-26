import { directorSchema, type DirectorDecision } from "./director";
import { readFileSync } from "node:fs";

/**
 * The LLM gateway for the patient engine OUTSIDE the Next.js server.
 *
 * The Next app uses `aiChat` (server-only, multi-provider failover). A
 * standalone worker / script can't import `server-only`, so this is the same
 * Groq call the app's `aiChat` would make, wired into the engine's injectable
 * Director/Actor stubs. Everything else — state, gates, disclosure, memory,
 * case truth — is the EXISTING engine (`runPatientTurn`).
 *
 * The prompt builders + schema are shared with the app, so the two paths
 * produce the same patient.
 */

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

/** Models sometimes fence JSON or emit `+1` — strip + sanitise before parsing. */
export function extractJson(text: string): string {
  let s = text;
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) s = fenced[1];
  else {
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    if (start >= 0 && end > start) s = s.slice(start, end + 1);
  }
  return s.replace(/([:,\s[])\+(\d)/g, "$1$2").trim();
}

const MODEL = "llama-3.3-70b-versatile";

export async function callGroq(prompt: string): Promise<string> {
  const key = env("GROQ_API_KEY");
  if (!key) throw new Error("GROQ_API_KEY not configured");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`groq ${res.status}`);
  const j = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return j.choices?.[0]?.message?.content ?? "";
}

/** The engine's injectable Director + Actor, backed by the real Groq model. */
export function makeDirectorActor() {
  return {
    director: async (prompt: string): Promise<DirectorDecision> => {
      const text = await callGroq(prompt);
      try {
        return directorSchema.parse(JSON.parse(extractJson(text)));
      } catch {
        // One repair retry, exactly like the app's aiChat.
        const repair = await callGroq(`${prompt}\n\nReturn valid JSON matching the schema exactly. Output ONLY the JSON object.`);
        return directorSchema.parse(JSON.parse(extractJson(repair)));
      }
    },
    actor: async (prompt: string): Promise<string> => callGroq(prompt),
  };
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { aiChat } from "@/lib/ai/client";
import { guardStudentCall } from "@/lib/ai/guards";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const helpSchema = z.object({
  entryId: z.string().uuid(),
  content: z.string().min(1).max(8000),
});

/**
 * POST /api/practice/journal/help — "help me think about this".
 * journal_support is the MOST sensitive workload. It routes ONLY to no-train
 * providers (asserted by the guard). If none available → honest 503 message,
 * never a silent downgrade to a training provider.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const profile = await requireSession();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = profile;

  const allowed = await rateLimit(`journal-help:${user.id}`, 10);
  if (!allowed) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = helpSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Ownership: the entry must be the user's own.
  const { data: entry } = await supabase
    .from("journal_entries")
    .select("id")
    .eq("id", parsed.data.entryId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  // The data-policy guard: journal_support has student data, so it must go to
  // a no-train provider. If none is configured, throw an honest 503.
  try {
    guardStudentCall("journal_support", { enabled: process.env.AI_ENABLED !== "false" });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 503 },
    );
  }

  const reply = await aiChat(
    [
      {
        role: "system",
        content:
          "You are a reflective supervisor for a psychology trainee. Your job is to help them THINK, never to analyse, diagnose, or judge. Ask one open question that helps them clarify their own thinking. Keep it to 2-3 sentences. Do not diagnose. Do not give clinical advice. If something you read seems genuinely concerning (e.g. imminent self-harm), say clearly: 'this sounds like something worth talking to your faculty or a professional about' and stop.",
      },
      { role: "user", content: parsed.data.content },
    ],
    { workload: "journal_support", maxTokens: 200, temperature: 0.6 },
  );

  return NextResponse.json({ reply: reply.text });
}

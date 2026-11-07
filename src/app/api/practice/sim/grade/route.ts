import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { createAdminClient } from "@/lib/supabase/server";
import { aiChat } from "@/lib/ai/client";
import { guardStudentCall } from "@/lib/ai/guards";
import { rateLimit } from "@/lib/rate-limit";
import { recordAttempts } from "@/lib/learn/model/server";
import { factsFromCase } from "@/lib/interview-grade/facts";
import { gradeAttempts, gradeInterview, type GraderChat } from "@/lib/interview-grade/grade";
import { loadGrade, saveGrade } from "@/lib/interview-grade/store";
import { modelGradeSchema, submissionSchema } from "@/lib/interview-grade/types";

export const runtime = "nodejs";

const bodySchema = z.object({ sessionId: z.string().uuid(), submission: submissionSchema }).strict();

/** The grader on the student-data lane (no-train providers only, enforced by the router). */
const graderChat: GraderChat = async (messages) => {
  const res = await aiChat(messages, { workload: "debrief_scoring", schema: modelGradeSchema, capability: "json", temperature: 0.2, maxTokens: 1800 });
  return { text: res.text, json: res.json, provider: res.provider };
};

/**
 * POST /api/practice/sim/grade
 * Graded interview: the student's MSE, risk and formulation write-up plus the
 * transcript are marked once (rule checklist + one model call), stored, and
 * fed to the student model as "<topic>:apply" and "<topic>:risk".
 * If no safe AI provider is available, the checklist parts are still graded.
 */
export async function POST(req: Request) {
  const access = await requireStudentApi({ path: "/practice/consulting-room", flag: "consulting_room" });
  if (!access.ok) return access.response;
  const user = access.profile;

  if (!(await rateLimit(`sim:grade:${user.id}`, 5))) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  const { sessionId, submission } = parsed.data;

  const admin = createAdminClient();
  const { data: session } = await admin.from("sim_sessions").select("id, case_id, user_id, difficulty").eq("id", sessionId).maybeSingle();
  if (!session || session.user_id !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Graded once: a stored grade is returned as is.
  const stored = await loadGrade(sessionId, user.id);
  if (stored) return NextResponse.json({ grade: stored.grade, cached: true });

  const { data: turns } = await admin.from("sim_turns").select("role, content").eq("session_id", sessionId).order("created_at", { ascending: true }).limit(200);
  const transcript = (turns ?? []).map((t) => ({ role: t.role === "student" ? ("student" as const) : ("patient" as const), content: String(t.content ?? "") }));
  if (transcript.filter((t) => t.role === "student").length < 2) return NextResponse.json({ error: "Talk with the patient a little more before you hand in." }, { status: 400 });

  const { data: caseRow } = await admin.from("sim_cases").select("title, case_data").eq("id", session.case_id).maybeSingle();
  const facts = factsFromCase(String(caseRow?.title ?? "Practice patient"), String(session.difficulty ?? ""), caseRow?.case_data as Record<string, unknown> | null);

  // Student data only goes to a no-train provider. Passing a cap makes the
  // guard run its no-train-provider check (the router also enforces it per call).
  let chat: GraderChat | null = graderChat;
  try {
    guardStudentCall("debrief_scoring", { enabled: process.env.AI_ENABLED !== "false", dailyCap: 1 });
  } catch {
    chat = null;
  }

  const grade = await gradeInterview({ facts, transcript, submission, chat });
  const saved = await saveGrade({ sessionId, userId: user.id, caseId: session.case_id ?? null, topic: facts.topic, submission, grade });
  await admin.from("sim_sessions").update({ status: "complete", ended_at: new Date().toISOString() }).eq("id", sessionId).eq("status", "active");
  // Fed to the student model once per grade (a stored grade returns early above).
  await recordAttempts(user.id, gradeAttempts(grade, facts.topic, String(session.case_id ?? sessionId)));

  return NextResponse.json({ grade, saved });
}

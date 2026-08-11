import { createClient } from "@/lib/supabase/server";
import { RolePlayLobby } from "./role-play-lobby";
import { RolePlayRoom } from "./role-play-room";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/role-play — peer role-play rooms (Part 6.6).
 * Pair up with a classmate: one plays the patient, one the clinician.
 * Message thread persists per session; both participants can read it.
 * No AI involved — the peer IS the patient.
 */
export default async function RolePlayPage(props: {
  searchParams: Promise<{ session?: string }>;
}) {
  await requireFeature("peer_roleplay");
  const sp = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Load this student's active + recent sessions.
  const { data: sessions } = await supabase
    .from("pair_sessions")
    .select("id, student_a, student_b, role_a, status, created_at")
    .or(`student_a.eq.${user.id},student_b.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(20);

  // Map participant ids → emails for display.
  const ids = [...new Set((sessions ?? []).flatMap((s) => [s.student_a, s.student_b]))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", ids);
  const emailBy = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  const openSessionId = sp.session ?? null;

  const myRole = (s: { student_a: string; role_a: string }) =>
    s.student_a === user.id ? s.role_a : s.role_a === "patient" ? "clinician" : "patient";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Peer role-play</p>
      <h1 className="mt-1 text-h1">Practice with a classmate</h1>
      <p className="mt-1 text-small text-muted-foreground">
        One of you plays the patient, the other the clinician. The person, not a script,
        is what makes it real. Message thread persists for both of you.
      </p>

      <div className="mt-6">
        {openSessionId ? (
          <RolePlayRoom
            sessionId={openSessionId}
            myId={user.id}
            myRole={myRole((sessions ?? []).find((s) => s.id === openSessionId) ?? { student_a: user.id, role_a: "patient" })}
          />
        ) : (
          <RolePlayLobby
            sessions={(sessions ?? []).map((s) => ({
              id: s.id,
              peerEmail: emailBy.get(s.student_a === user.id ? s.student_b : s.student_a) ?? "peer",
              role: myRole(s as { student_a: string; role_a: string }),
              status: s.status as string,
              createdAt: s.created_at,
            }))}
          />
        )}
      </div>
    </div>
  );
}

import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Button, RowsSkeleton, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Enter, LoadSwap } from "@/motion";
import { space, useTheme } from "@/theme";
import { ConfirmSheet, FilterChips, SmallButton, Status } from "../kit";
import { plural } from "../format";
import { openStudent } from "../nav";
import { EmptyState, Group, Locked, MockNote, Panel, Screen, useSample } from "../ui";
import { FAILED_EMAILS, WALL_REPORTS, type FailedEmail, type WallReport } from "./mock";

/**
 * Wall reports: posts a student reported, with who wrote it and why it was
 * reported. Keep it, or remove it from the wall (asks first).
 */
export function WallReportsScreen() {
  const c = useTheme();
  const sample = useSample(WALL_REPORTS);
  const [rows, setRows] = React.useState<WallReport[]>(WALL_REPORTS);
  const [view, setView] = React.useState<"open" | "done">("open");
  const [remove, setRemove] = React.useState<WallReport | null>(null);
  const decide = (id: string, state: WallReport["state"]) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, state } : x)));
    haptic.success();
    toast.show(state === "removed" ? "Post removed from the wall" : "Post kept");
  };
  const open = rows.filter((r) => r.state === "open");
  const shown = view === "open" ? open : rows.filter((r) => r.state !== "open");
  return (
    <Screen title="Wall reports" lead={open.length ? `${plural(open.length, "report")} waiting` : "Nothing waiting"} testID="admin-wall-reports">
      <FilterChips label="Show" value={view} onChange={setView} testID="wall-filter" options={[{ id: "open", name: "Waiting", count: open.length }, { id: "done", name: "Decided" }]} />
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={4} />}>
        <View style={{ gap: space[3] }}>
          {shown.length ? (
            shown.map((r, i) => (
              <Enter key={r.id} i={i}>
                <Panel testID={`wall-${r.id}`} style={{ gap: space[3] }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[2] }}>
                    <Status tone={r.state === "open" ? "warn" : r.state === "removed" ? "alert" : "ok"} strong>
                      {r.state === "open" ? r.reason : r.state === "removed" ? "Removed" : "Kept"}
                    </Status>
                    <T v="caption" tone="muted" num>
                      {r.when}
                    </T>
                  </View>
                  <View style={{ borderLeftWidth: 3, borderColor: c.hairline, paddingLeft: space[3] }}>
                    <T v="small">{r.post}</T>
                  </View>
                  <T v="caption" tone="muted">
                    Posted by {r.author} · reported by {r.reportedBy}
                    {r.state !== "open" ? ` · ${r.reason}` : ""}
                  </T>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                    {r.state === "open" ? (
                      <Locked row>
                        <View style={{ flexDirection: "row", gap: space[2] }}>
                          <SmallButton label="Keep" onPress={() => decide(r.id, "kept")} testID={`wall-${r.id}-keep`} />
                          <SmallButton danger label="Remove post" onPress={() => setRemove(r)} testID={`wall-${r.id}-remove`} />
                        </View>
                      </Locked>
                    ) : null}
                    <SmallButton label={`Open ${r.author.split(" ")[0]}`} onPress={() => openStudent(r.authorId)} testID={`wall-${r.id}-student`} />
                  </View>
                </Panel>
              </Enter>
            ))
          ) : (
            <EmptyState title={view === "open" ? "No reports waiting" : "Nothing decided yet"} body={view === "open" ? "When a student reports a post on the class wall, it lands here." : "Reports you keep or remove show here."} action={{ label: "Open the class wall", onPress: () => router.push("/wall") }} />
          )}
          <MockNote />
        </View>
      </LoadSwap>
      <ConfirmSheet open={!!remove} onClose={() => setRemove(null)} title="Remove this post?" body={remove ? `${remove.author}'s post comes off the class wall for everyone. They are not told why unless you message them.` : undefined} confirm="Remove post" danger onConfirm={() => { if (remove) decide(remove.id, "removed"); setRemove(null); }} testID="wall-confirm" />
    </Screen>
  );
}

/**
 * Failed emails: what did not arrive, why, and what to do about it. Send one
 * again, or all of them.
 */
export function FailedEmailsScreen() {
  const sample = useSample(FAILED_EMAILS);
  const [rows, setRows] = React.useState<FailedEmail[]>(FAILED_EMAILS);
  const [busy, setBusy] = React.useState<string | null>(null);
  const failed = rows.filter((r) => r.state === "failed");
  const resend = (ids: string[]) => {
    setBusy(ids.length > 1 ? "all" : ids[0] ?? null);
    setTimeout(() => {
      setRows((r) => r.map((x) => (ids.includes(x.id) ? { ...x, state: "sent" as const } : x)));
      setBusy(null);
      haptic.success();
      toast.show(ids.length > 1 ? `${ids.length} emails sent again` : "Sent again");
    }, 500);
  };
  return (
    <Screen
      title="Failed emails"
      lead={failed.length ? `${plural(failed.length, "email")} did not arrive` : "Everything arrived"}
      testID="admin-failed-emails"
      footer={
        failed.length > 1 ? (
          <Locked>
            <Button label={`Send all ${failed.length} again`} busy={busy === "all"} needsServer onPress={() => resend(failed.map((f) => f.id))} testID="failed-all" />
          </Locked>
        ) : undefined
      }
    >
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={4} />}>
        <View style={{ gap: space[3] }}>
          {rows.length ? (
            <Group title="Last 7 days" count={rows.length}>
              {rows.map((r, i) => (
                <Enter key={r.id} i={i}>
                  <Panel testID={`failed-${r.id}`} style={{ gap: space[2] }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2], alignItems: "flex-start" }}>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <T v="bodyStrong">{r.name}</T>
                        <T v="small" tone="muted">
                          {r.to}
                        </T>
                      </View>
                      <Status tone={r.state === "sent" ? "ok" : "alert"}>{r.state === "sent" ? "Sent again" : "Failed"}</Status>
                    </View>
                    <T v="small">{r.subject}</T>
                    {r.state === "failed" ? (
                      <>
                        <T v="small" tone="muted">
                          {r.why}. {r.fix}
                        </T>
                        <T v="caption" tone="muted" num>
                          {r.when} · tried {r.tries === 1 ? "once" : `${r.tries} times`}
                        </T>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], paddingTop: space[1] }}>
                          <Locked row>
                            <SmallButton label="Send again" busy={busy === r.id} onPress={() => resend([r.id])} testID={`failed-${r.id}-again`} />
                          </Locked>
                          {r.studentId ? <SmallButton label="Open student" onPress={() => openStudent(r.studentId!)} testID={`failed-${r.id}-student`} /> : null}
                        </View>
                      </>
                    ) : null}
                  </Panel>
                </Enter>
              ))}
            </Group>
          ) : (
            <EmptyState title="No failed emails" body="Every email in the last 7 days arrived." />
          )}
          <MockNote />
        </View>
      </LoadSwap>
    </Screen>
  );
}

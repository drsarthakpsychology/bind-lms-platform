import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { messageOf } from "@/api/errors";
import { Button, RowsSkeleton, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Enter } from "@/motion";
import { space, useTheme } from "@/theme";
import { ago, plural } from "../format";
import { ConfirmSheet, Loaded, SmallButton, Status } from "../kit";
import { liveCalls, useFailedEmails, useWallReports, type FailedEmail, type WallReport } from "../live";
import { openStudent } from "../nav";
import { guarded, useAdminRole } from "../role";
import { EmptyState, Group, Locked, Panel, Screen } from "../ui";

/** Runs one write for these screens: view-only refused first, then the server, then everything admin read again. */
function useWrite() {
  const qc = useQueryClient();
  const { role } = useAdminRole();
  const [busy, setBusy] = React.useState<string | null>(null);
  const run = async <T,>(tag: string, call: () => Promise<T>, done: (r: T) => string): Promise<T | undefined> =>
    guarded(role, "mail", async () => {
      setBusy(tag);
      try {
        const r = await call();
        haptic.success();
        toast.show(done(r));
        await qc.invalidateQueries({ queryKey: ["admin"] });
        return r;
      } catch (e) {
        haptic.warn();
        toast.show(messageOf(e));
        return undefined;
      } finally {
        setBusy(null);
      }
    });
  return { run, busy };
}

/* --------------------------------------------------------- wall reports */

/**
 * Wall reports: posts or replies a student reported on the class wall, what
 * was said and why it was reported. Marking one handled closes the report;
 * the post itself stays (as on the website).
 */
export function WallReportsScreen() {
  const c = useTheme();
  const q = useWallReports();
  const { run, busy } = useWrite();
  const n = q.data?.length ?? 0;
  return (
    <Screen title="Wall reports" lead={q.data ? (n ? `${plural(n, "report")} waiting` : "Nothing waiting") : undefined} testID="admin-wall-reports" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="wall reports" skeleton={<RowsSkeleton rows={4} />}>
        {(rows) =>
          rows.length ? (
            <View style={{ gap: space[3] }}>
              {rows.map((r: WallReport, i) => (
                <Enter key={r.id} i={i}>
                  <Panel testID={`wall-${r.id}`} style={{ gap: space[3] }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[2] }}>
                      <Status tone="warn" strong>
                        {r.reason}
                      </Status>
                      <T v="caption" tone="muted" num>
                        {ago(r.at)}
                      </T>
                    </View>
                    <View style={{ borderLeftWidth: 3, borderColor: c.hairline, paddingLeft: space[3] }}>
                      <T v="small">{r.text}</T>
                    </View>
                    <T v="caption" tone="muted">
                      A {r.kind} by {r.author ?? "someone posting without their name"}
                    </T>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                      <Locked row>
                        <SmallButton label="Mark handled" busy={busy === r.id} onPress={() => void run(r.id, () => liveCalls.closeWallReport(r.id), () => "Report closed. The post stays on the wall.")} testID={`wall-${r.id}-close`} />
                      </Locked>
                      {r.authorId ? <SmallButton label="Open their page" onPress={() => openStudent(r.authorId!)} testID={`wall-${r.id}-student`} /> : null}
                    </View>
                  </Panel>
                </Enter>
              ))}
            </View>
          ) : (
            <EmptyState title="No reports waiting" body="When a student reports a post on the class wall, it shows here." action={{ label: "Open the class wall", onPress: () => router.push("/wall") }} />
          )
        }
      </Loaded>
    </Screen>
  );
}

/* -------------------------------------------------------- failed emails */

function FailedCard({ r, i, busy, onAgain, onClear }: { r: FailedEmail; i: number; busy: string | null; onAgain: () => void; onClear: () => void }) {
  return (
    <Enter i={i}>
      <Panel testID={`failed-${r.id}`} style={{ gap: space[2] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2], alignItems: "flex-start" }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T v="bodyStrong">{r.name ?? r.to}</T>
            {r.name ? (
              <T v="small" tone="muted">
                {r.to}
              </T>
            ) : null}
          </View>
          <Status tone="alert">{r.kind}</Status>
        </View>
        <T v="small">{r.subject}</T>
        <T v="small" tone="muted">
          {r.why}
        </T>
        <T v="caption" tone="muted" num>
          {ago(r.at)} · tried {r.tries === 1 ? "once" : `${r.tries} times`}
        </T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], paddingTop: space[1] }}>
          <Locked row>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
              {r.canResend ? <SmallButton label="Send again" busy={busy === `again:${r.id}`} onPress={onAgain} testID={`failed-${r.id}-again`} /> : null}
              <SmallButton label="Clear" busy={busy === `clear:${r.id}`} onPress={onClear} testID={`failed-${r.id}-clear`} />
            </View>
          </Locked>
          {r.studentId ? <SmallButton label="Open student" onPress={() => openStudent(r.studentId!)} testID={`failed-${r.id}-student`} /> : null}
        </View>
      </Panel>
    </Enter>
  );
}

/**
 * Failed emails: what did not arrive, why, and what to do. Send one again, or
 * clear it from this list. Clearing never deletes it: the send history on the
 * website keeps every email.
 */
export function FailedEmailsScreen() {
  const q = useFailedEmails();
  const { run, busy } = useWrite();
  const [ask, setAsk] = React.useState<"again" | "clear" | null>(null);
  const rows = q.data?.items ?? [];
  const again = (ids: string[] | null) =>
    run(ids ? `again:${ids[0]}` : "again:all", () => liveCalls.retryFailed(ids), (r) => {
      const sent = typeof r.sent === "number" ? r.sent : null;
      return sent === null ? "Sent again" : sent ? `${plural(sent, "email")} sent again` : "Nothing could be sent. The reason is on each email.";
    });
  const clear = (ids: string[] | null) => run(ids ? `clear:${ids[0]}` : "clear:all", () => liveCalls.clearFailed(ids), (n) => (n ? `${plural(n, "email")} cleared. The history keeps them.` : "Nothing to clear"));
  return (
    <Screen
      title="Failed emails"
      lead={q.data ? (rows.length ? `${plural(rows.length, "email")} did not arrive` : "Everything arrived") : undefined}
      testID="admin-failed-emails"
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      footer={
        rows.length > 1 ? (
          <Locked>
            <View style={{ flexDirection: "row", gap: space[2] }}>
              <View style={{ flex: 1 }}>
                <Button label="Send all again" busy={busy === "again:all"} onPress={() => setAsk("again")} testID="failed-all" />
              </View>
              <View style={{ flex: 1 }}>
                <Button kind="quiet" label="Clear all" busy={busy === "clear:all"} onPress={() => setAsk("clear")} testID="failed-clear-all" />
              </View>
            </View>
          </Locked>
        ) : undefined
      }
    >
      <Loaded q={q} what="failed emails" skeleton={<RowsSkeleton rows={4} />}>
        {(d) =>
          d.items.length ? (
            <Group title="Not delivered" count={d.items.length}>
              {d.items.map((r, i) => (
                <FailedCard key={r.id} r={r} i={i} busy={busy} onAgain={() => void again([r.id])} onClear={() => void clear([r.id])} />
              ))}
            </Group>
          ) : (
            <EmptyState title="No failed emails" body="Every email arrived, or the failed ones were cleared." />
          )
        }
      </Loaded>
      <ConfirmSheet
        open={ask !== null}
        onClose={() => setAsk(null)}
        title={ask === "clear" ? `Clear all ${rows.length}?` : `Send all ${rows.length} again?`}
        body={ask === "clear" ? "They leave this list. Nothing is deleted: the send history on the website keeps every email." : "Each one is sent once more, within today's email allowance. Ones that cannot go yet stay here."}
        confirm={ask === "clear" ? "Clear all" : "Send all again"}
        onConfirm={() => {
          const what = ask;
          setAsk(null);
          if (what === "clear") void clear(null);
          else void again(null);
        }}
        testID="failed-confirm"
      />
    </Screen>
  );
}

import * as React from "react";
import { View } from "react-native";

import { useAdminAction, useRefreshAdmin } from "@/admin/api";
import { FilterChips, Loaded, Quiet, SmallButton, Tag } from "@/admin/kit";
import { useAdminRole } from "@/admin/role";
import { Button, Field, RowsSkeleton, Screen, Sheet, T } from "@/ds";
import { StaggerList } from "@/motion";
import { space, useTheme } from "@/theme";
import { adminClinicCalls, useAdminLeaves } from "../api";
import type { AdminLeave } from "../contract";
import { dateLabel, leavesLine, rangeLabel, timeLabel } from "../logic";
import { LeaveWord } from "../parts";

/** Approve or not, with an optional note the student sees. */
function DecideSheet({ item, decision, onClose }: { item: AdminLeave | null; decision: "approve" | "reject"; onClose: () => void }) {
  const [note, setNote] = React.useState("");
  const { run, busy } = useAdminAction();
  const go = async () => {
    if (!item) return;
    const r = await run("clinic", () => adminClinicCalls.decide(item.id, { decision, note: note.trim() || null }), { done: decision === "approve" ? `Approved for ${item.name}` : `Not approved for ${item.name}` });
    if (r !== undefined) {
      setNote("");
      onClose();
    }
  };
  return (
    <Sheet open={!!item} onClose={onClose} title={item ? `${decision === "approve" ? "Approve" : "Not approve"}: ${item.name}` : ""} testID="decide-sheet">
      <View style={{ gap: space[4] }}>
        {item?.overLimit && decision === "approve" ? (
          <T v="small" tone="alert">
            {item.name} has no leaves left. Approving still counts it.
          </T>
        ) : null}
        <Field label="Note to the student (optional)" value={note} onChangeText={setNote} maxLength={200} testID="decide-note" />
        <Button kind={decision === "approve" ? "primary" : "quiet"} label={decision === "approve" ? "Approve" : "Not approve"} busy={!!busy} onPress={() => void go()} testID="decide-go" />
      </View>
    </Sheet>
  );
}

function LeaveCard({ l, onDecide, canWrite }: { l: AdminLeave; onDecide: (d: "approve" | "reject") => void; canWrite: boolean }) {
  const c = useTheme();
  return (
    <View testID={`aleave-${l.id}`} style={{ paddingVertical: space[4], gap: space[2], borderTopWidth: 1, borderColor: c.hairline }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <T v="bodyStrong">{l.name}</T>
          <T v="small" tone="muted">
            {l.kind === "early" ? `Leave early at ${timeLabel(l.leaveAt ?? "")}` : l.sessions.length > 1 ? `Leave for ${l.sessions.length} sessions` : "Leave"}
            {l.cohort ? ` · ${l.cohort}` : ""}
          </T>
        </View>
        <LeaveWord s={l.status} />
      </View>
      {l.sessions.map((s) => (
        <T key={s.id} v="small" num>
          {s.title} · {dateLabel(s.date)}, {rangeLabel(s.start, s.end)}
        </T>
      ))}
      <T v="small" tone="muted">
        “{l.reason}”
      </T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], alignItems: "center" }}>
        {l.overLimit ? <Tag tone="alert">Over the limit</Tag> : null}
        {l.kind === "leave" ? (
          <T v="small" tone="muted" num>
            {leavesLine(l.left)} of {l.allowance}
          </T>
        ) : (
          <T v="small" tone="muted">
            Does not use a leave
          </T>
        )}
      </View>
      {l.adminNote ? (
        <T v="small" tone="muted">
          Your note: {l.adminNote}
        </T>
      ) : null}
      {l.status === "pending" && canWrite ? (
        <View style={{ flexDirection: "row", gap: space[2], paddingTop: space[1] }}>
          <SmallButton label="Approve" onPress={() => onDecide("approve")} testID={`aleave-${l.id}-approve`} />
          <SmallButton label="Not approve" danger onPress={() => onDecide("reject")} testID={`aleave-${l.id}-reject`} />
        </View>
      ) : null}
    </View>
  );
}

/** Leave requests: the waiting ones first, each with its sessions, reason and the over-limit flag. */
export function AdminLeavesScreen() {
  const [status, setStatus] = React.useState<"pending" | "all">("pending");
  const q = useAdminLeaves(status);
  const { canWrite } = useAdminRole();
  const { refresh, refreshing } = useRefreshAdmin();
  const [open, setOpen] = React.useState<{ item: AdminLeave; d: "approve" | "reject" } | null>(null);
  return (
    <Screen testID="admin-leaves" title="Leave requests" onRefresh={refresh} refreshing={refreshing}>
      <FilterChips label="Show" value={status} onChange={setStatus} testID="aleave-filter" options={[{ id: "pending", name: "Waiting" }, { id: "all", name: "All" }]} />
      <Loaded q={q} what="leave requests" soon skeleton={<RowsSkeleton rows={4} />}>
        {(d) =>
          d.items.length ? (
            <StaggerList>
              {d.items.map((l) => (
                <LeaveCard key={l.id} l={l} canWrite={canWrite} onDecide={(x) => setOpen({ item: l, d: x })} />
              ))}
            </StaggerList>
          ) : (
            <Quiet>{status === "pending" ? "Nothing waiting." : "No requests yet."}</Quiet>
          )
        }
      </Loaded>
      <DecideSheet item={open?.item ?? null} decision={open?.d ?? "approve"} onClose={() => setOpen(null)} />
    </Screen>
  );
}

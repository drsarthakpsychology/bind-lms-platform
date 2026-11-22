import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { View } from "react-native";

import { messageOf } from "@/api/errors";
import { Button, Row, RowsSkeleton, Sheet, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { space } from "@/theme";
import { ConfirmSheet, Loaded, Quiet, Status } from "../kit";
import { liveCalls, ROLE_CHANGE, useAdmins, type AdminPerson, type RoleTarget } from "../live";
import { guarded, useAdminRole } from "../role";
import { EmptyState, Group, Panel, Screen } from "../ui";

const ROLE_NAME = { admin: "Super Admin", view_admin: "View only" } as const;

/** The changes offered for one admin, and why any is not. Pure, so it is tested. */
export function roleChoices(p: AdminPerson, all: AdminPerson[]): { to: RoleTarget; blocked: string | null }[] {
  const supers = all.filter((a) => a.role === "admin").length;
  const last = p.role === "admin" && supers <= 1;
  const order: RoleTarget[] = ["admin", "view_admin", "student", "none"];
  return order.filter((t) => t !== p.role).map((to) => ({ to, blocked: last && to !== "admin" ? "This is the only Super Admin. Make someone else a Super Admin first." : null }));
}

/** What the confirm sheet says will change, exactly. */
export function changeWords(p: AdminPerson, to: RoleTarget, me: boolean): string {
  const who = me ? "You" : p.name || p.email;
  const from = ROLE_NAME[p.role];
  return `${who}: ${from} to ${to === "admin" ? "Super Admin" : to === "view_admin" ? "view only" : to === "student" ? "student" : "no access"}. ${ROLE_CHANGE[to].what}${me && to !== "admin" ? " You will lose the right to undo this yourself." : ""}`;
}

/**
 * Admins: who can use the admin side, and what each may do. A Super Admin
 * can make someone a Super Admin or view-only, or take admin away (back to
 * a student, or no access). The server refuses to remove the last Super
 * Admin, and a change to your own rights asks twice. Every change is logged.
 */
export function AdminsScreen() {
  const { canWrite, role } = useAdminRole();
  const q = useAdmins(canWrite);
  const qc = useQueryClient();
  const [open, setOpen] = React.useState<AdminPerson | null>(null);
  const [pick, setPick] = React.useState<RoleTarget | null>(null);
  const [self, setSelf] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const me = q.data?.me ?? "";
  const close = () => {
    setOpen(null);
    setPick(null);
    setSelf(false);
  };
  const apply = async (p: AdminPerson, to: RoleTarget, confirmSelf: boolean) => {
    await guarded(role, "admin-rights", async () => {
      setBusy(true);
      try {
        await liveCalls.setRole(p.id, to, confirmSelf);
        haptic.success();
        toast.show(`${p.name || p.email}: ${ROLE_CHANGE[to].label.replace(/^Make /, "").replace(/^Remove admin: /, "")}`);
        close();
        await qc.invalidateQueries({ queryKey: ["admin"] });
      } catch (e) {
        haptic.warn();
        toast.show(messageOf(e));
      } finally {
        setBusy(false);
      }
    });
  };
  if (!canWrite) {
    return (
      <Screen title="Admins" testID="admin-admins">
        <EmptyState title="Only a Super Admin can see this" body="Ask a Super Admin to change who can use the admin side." />
      </Screen>
    );
  }
  return (
    <Screen title="Admins" lead="Who can use the admin side" testID="admin-admins" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="admins" skeleton={<RowsSkeleton rows={3} />}>
        {(d) => (
          <>
            {(["admin", "view_admin"] as const).map((r) => {
              const list = d.items.filter((p) => p.role === r);
              return (
                <Group key={r} title={r === "admin" ? "Super Admins" : "View-only admins"} count={list.length}>
                  <T v="caption" tone="muted" style={{ paddingHorizontal: 4 }}>
                    {r === "admin" ? "See and change everything." : "See everything, change nothing."}
                  </T>
                  {list.length ? (
                    <Panel rows>
                      {list.map((p) => (
                        <Row key={p.id} testID={`admin-${p.id}`} title={`${p.name || p.email}${p.id === d.me ? " (you)" : ""}`} meta={p.name ? p.email : undefined} trailing={p.blocked ? <Status tone="warn">Cannot sign in</Status> : undefined} onPress={() => setOpen(p)} />
                      ))}
                    </Panel>
                  ) : (
                    <Quiet>Nobody yet.</Quiet>
                  )}
                </Group>
              );
            })}
            <Quiet>To add a new admin, use Admins on the website. Every change here is written in the admin log.</Quiet>
          </>
        )}
      </Loaded>
      <Sheet open={!!open && !pick} onClose={close} title={open ? open.name || open.email : "Admin"} testID="admin-sheet">
        {open ? (
          <View style={{ gap: space[3] }}>
            <T v="small" tone="muted">
              Now: {ROLE_NAME[open.role]}. Pick what they should be.
            </T>
            <Panel rows>
              {roleChoices(open, q.data?.items ?? []).map((ch) => (
                <Row key={ch.to} testID={`role-${ch.to}`} title={ROLE_CHANGE[ch.to].label} meta={ch.blocked ?? ROLE_CHANGE[ch.to].what} onPress={ch.blocked ? undefined : () => setPick(ch.to)} />
              ))}
            </Panel>
            <Button kind="text" full label="Close" onPress={close} />
          </View>
        ) : null}
      </Sheet>
      <ConfirmSheet
        open={!!open && !!pick && !self}
        onClose={close}
        title={pick ? `${ROLE_CHANGE[pick].label}?` : "Change?"}
        body={open && pick ? changeWords(open, pick, open.id === me) : undefined}
        confirm={pick ? ROLE_CHANGE[pick].label : "Change"}
        danger={pick === "student" || pick === "none"}
        busy={busy}
        onConfirm={() => {
          if (!open || !pick) return;
          if (open.id === me) setSelf(true);
          else void apply(open, pick, false);
        }}
        testID="role-confirm"
      />
      <ConfirmSheet open={!!open && !!pick && self} onClose={close} title="This is your own account. Sure?" body="You are changing your own rights. After this you may not be able to change them back yourself." confirm="Yes, change my rights" danger busy={busy} onConfirm={() => open && pick && void apply(open, pick, true)} testID="role-confirm-self" />
    </Screen>
  );
}

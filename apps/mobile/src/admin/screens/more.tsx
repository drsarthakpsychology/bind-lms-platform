import { useQueryClient } from "@tanstack/react-query";
import { go } from "@/api/prefetch";
import { router } from "expo-router";
import { Award, BellRing, ChartNoAxesColumn, CircleHelp, ClipboardList, FileCheck, Flag, FlaskConical, Gauge, GraduationCap, KeyRound, LogOut, MailWarning, Megaphone, MessageCircleQuestion, Radar, Settings, ToggleRight, Trophy, Users } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { messageOf } from "@/api/errors";
import { session } from "@/auth";
import { IconDot, Row, RowList, RowsSkeleton, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminDoubts, usePushPrefs, useSubmissions } from "../api";
import type { AdminPushPrefs } from "../extra";
import { Avatar, ConfirmSheet, Loaded } from "../kit";
import { ADMIN_PUSH } from "../push";
import { isWaiting } from "./doubts";
import { useAdminRole } from "../role";
import { startViewAs } from "../view-as";
import { useTestMode } from "../test-mode";
import { FAILED_EMAILS, FEATURES, WALL_REPORTS } from "./mock";
import { Group, Panel, RolePill, Screen } from "../ui";

/**
 * More: everything the admin runs that is not a tab, grouped by the job it
 * does. Messages and queues first (they have counts), then records, then the
 * controls, then this phone and the account.
 */
export function AdminMoreScreen() {
  const c = useTheme();
  const me = session.store.use((s) => s.me);
  const { roleLabel } = useAdminRole();
  const waiting = useAdminDoubts("");
  const toGrade = useSubmissions("pending");
  const test = useTestMode() === "admin";
  const [out, setOut] = React.useState(false);
  const n = (x: number | undefined) => (x ? String(x) : undefined);
  const open = FEATURES.flatMap((g) => g.items).filter((f) => f.state === "unlocked").length;
  return (
    <Screen tab title="More" testID="admin-more">
      <Panel style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <Avatar name={me?.name ?? me?.email ?? "A"} size={48} />
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <T v="h3">{me?.name || "Admin"}</T>
          {me?.email ? (
            <T v="small" tone="muted">
              {me.email}
            </T>
          ) : null}
          <T v="caption" tone="muted" testID="more-role">
            {roleLabel}
          </T>
        </View>
        <RolePill />
      </Panel>
      <Group title="Messages and queues">
        <Panel rows>
          <Row title="Announcements" meta="Send a notice, see what was sent and opened" icon={<IconDot icon={Megaphone} />} onPress={() => router.push("/admin/messages")} testID="more-messages" />
          <Row title="Doubts and concerns" icon={<IconDot icon={MessageCircleQuestion} />} trailing={n(waiting.data?.items.filter(isWaiting).length)} onPress={() => router.push("/admin/doubts")} testID="more-doubts" />
          <Row title="Wall reports" meta="Posts students reported" icon={<IconDot icon={Flag} />} trailing={n(WALL_REPORTS.filter((r) => r.state === "open").length)} onPress={() => router.push("/admin/wall-reports")} testID="more-wall" />
          <Row title="Failed emails" meta="What did not arrive, and why" icon={<IconDot icon={MailWarning} />} trailing={n(FAILED_EMAILS.filter((r) => r.state === "failed").length)} onPress={() => router.push("/admin/failed-emails")} testID="more-failed" />
          <Row title="Review" meta="Hand-ins and sign-offs" icon={<IconDot icon={FileCheck} />} trailing={n(toGrade.data?.pending)} onPress={() => router.push("/admin/review")} testID="more-review" />
        </Panel>
      </Group>
      <Group title="Records">
        <Panel rows>
          <Row title="Cohorts" icon={<IconDot icon={Users} />} onPress={() => router.push("/admin/cohorts")} testID="more-cohorts" />
          <Row title="Enquiries" meta="Who asked, and who to contact next" icon={<IconDot icon={Radar} />} onPress={() => router.push("/admin/people")} testID="more-people" />
          <Row title="Forms" meta="Answers, and email who answered" icon={<IconDot icon={ClipboardList} />} onPress={() => router.push("/admin/forms")} testID="more-forms" />
          <Row title="Certificates" meta="Issue, issued list, types, settings" icon={<IconDot icon={Award} />} onPress={() => router.push("/admin/certificates")} testID="more-certificates" />
          <Row title="Leaderboard" meta="Every student, by cohort" icon={<IconDot icon={Trophy} />} onPress={() => router.push("/admin/leaderboard")} testID="more-leaderboards" />
          <Row title="Learning insights" meta="What the class finds hard" icon={<IconDot icon={ChartNoAxesColumn} />} onPress={() => router.push("/admin/insights")} testID="more-insights" />
        </Panel>
      </Group>
      <Group title="Controls">
        <Panel rows>
          <Row title="What is live" meta="Every feature: hidden, shown or open, with limits" icon={<IconDot icon={ToggleRight} />} trailing={`${open} open`} onPress={() => router.push("/admin/switches")} testID="more-switches" />
          <Row title="Access" meta="Open or close sections for many students at once" icon={<IconDot icon={KeyRound} />} onPress={() => router.push("/admin/access")} testID="more-access" />
          <Row title="Test mode" meta="Try the student side as a hidden test student" icon={<IconDot icon={FlaskConical} />} trailing={test ? "On" : "Off"} onPress={() => router.push("/admin/test-mode")} testID="more-test-mode" />
          <Row title="System" meta="Support keys, and how full things are" icon={<IconDot icon={Gauge} />} onPress={() => router.push("/admin/system")} testID="more-system" />
        </Panel>
      </Group>
      <Group title="This phone">
        <Panel rows>
          <Row title="Admin alerts" meta="New doubts and enquiries, as notifications" icon={<IconDot icon={BellRing} />} onPress={() => router.push("/admin/alerts")} testID="more-alerts" />
          <Row title="Settings" icon={<IconDot icon={Settings} />} onPress={() => router.push("/settings")} testID="more-settings" />
          <Row title="Help" icon={<IconDot icon={CircleHelp} />} onPress={() => router.push("/help")} />
        </Panel>
      </Group>
      <Group title="Account">
        <Panel rows>
          <Row title="View as student" meta="See VIBHA the way students see it" icon={<IconDot icon={GraduationCap} />} onPress={startViewAs} testID="more-view-as" />
          <Row title="Log out" danger icon={<LogOut size={20} color={c.danger} />} chevron={false} onPress={() => setOut(true)} testID="more-logout" />
        </Panel>
      </Group>
      <ConfirmSheet open={out} onClose={() => setOut(false)} title="Log out?" body="You will need your email and password to come back in." confirm="Log out" danger onConfirm={() => void session.signOut()} testID="confirm-logout" />
    </Screen>
  );
}

/** Which admin notices come to this phone. Each admin chooses their own. */
export function AdminAlertsScreen() {
  const q = usePushPrefs();
  const qc = useQueryClient();
  const set = async (p: Partial<AdminPushPrefs>) => {
    qc.setQueryData<AdminPushPrefs>(["admin", "push-prefs", ""], (prev) => (prev ? { ...prev, ...p } : prev));
    try {
      await adminCalls.pushPrefs(p);
    } catch (e) {
      toast.show(messageOf(e));
      void q.refetch();
    }
  };
  return (
    <Screen title="Admin alerts" testID="admin-alerts" lead="Sent to this phone as notifications. A tap opens the right screen.">
      <Loaded q={q} soon what="alerts" skeleton={<RowsSkeleton rows={3} />}>
        {(p) => (
          <Panel rows>
            {/* Falling behind has no sender on the server yet, so it is not offered. */}
            {(Object.keys(ADMIN_PUSH) as (keyof typeof ADMIN_PUSH)[]).filter((k) => k !== "falling_behind").map((k) => (
              <SwitchRow key={k} title={ADMIN_PUSH[k].title} meta={ADMIN_PUSH[k].about} value={p[ADMIN_PUSH[k].pref]} onChange={(v) => void set({ [ADMIN_PUSH[k].pref]: v })} testID={`alert-${k}`} />
            ))}
          </Panel>
        )}
      </Loaded>
    </Screen>
  );
}

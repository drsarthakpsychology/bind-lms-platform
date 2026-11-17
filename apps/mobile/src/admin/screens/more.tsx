import { useQueryClient } from "@tanstack/react-query";
import { go } from "@/api/prefetch";
import { openLink } from "@/lib/open";
import { router } from "expo-router";
import { Award, Bell, BellRing, CalendarClock, BookOpen, CircleHelp, ClipboardList, FileCheck, Gauge, GraduationCap, LogOut, MessageCircleQuestion, Radar, Settings, Users } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { messageOf } from "@/api/errors";
import { session } from "@/auth";
import { Row, RowList, RowsSkeleton, Screen, Section, SwitchRow, T } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { haptic } from "@/lib/haptics";
import { space, useTheme } from "@/theme";
import { adminCalls, useAdminDoubts, usePushPrefs, useSubmissions } from "../api";
import type { AdminPushPrefs } from "../extra";
import { Avatar, ConfirmSheet, Loaded } from "../kit";
import { AdminTop } from "../nav";
import { ADMIN_PUSH } from "../push";
import { isWaiting } from "./doubts";
import { useAdminRole } from "../role";
import { startViewAs } from "../view-as";
import { TestModeSection } from "../test-mode";

/** More: every admin place that is not a tab, grouped, then your account. */
export function AdminMoreScreen() {
  const c = useTheme();
  const me = session.store.use((s) => s.me);
  const { roleLabel } = useAdminRole();
  const waiting = useAdminDoubts("");
  const toGrade = useSubmissions("pending");
  const [out, setOut] = React.useState(false);
  const icon = { size: 20, color: c.muted };
  const n = (x: number | undefined) => (x ? String(x) : undefined);
  const web = (path: string) => () => void openLink(`${config.site}${path}`);
  return (
    <Screen tab top={<AdminTop />} testID="admin-more">
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
        <Avatar name={me?.name ?? me?.email ?? "A"} size={56} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <T v="h2">{me?.name || "More"}</T>
          {me?.email ? (
            <T v="small" tone="muted">
              {me.email}
            </T>
          ) : null}
          <T v="caption" tone="muted" testID="more-role">
            {roleLabel}
          </T>
        </View>
      </View>
      <Section title="People">
        <RowList>
          <Row title="Cohorts" icon={<Users {...icon} />} onPress={() => router.push("/admin/cohorts")} testID="more-cohorts" />
          <Row title="People" meta="Enquiries and who to contact next" icon={<Radar {...icon} />} onPress={() => router.push("/admin/people")} testID="more-people" />
          <Row title="Forms" meta="Answers, and email who answered" icon={<ClipboardList {...icon} />} onPress={() => router.push("/admin/forms")} testID="more-forms" />
        </RowList>
      </Section>
      <Section title="Clinic">
        <RowList>
          <Row title="Sessions and attendance" meta="Today, Show code, leave, timetable, OPD" icon={<CalendarClock {...icon} />} onPress={() => go("/admin/clinic")} testID="more-clinic" />
        </RowList>
      </Section>
      <Section title="Teach">
        <RowList>
          <Row title="Doubts and concerns" icon={<MessageCircleQuestion {...icon} />} trailing={n(waiting.data?.items.filter(isWaiting).length)} onPress={() => router.push("/admin/doubts")} testID="more-doubts" />
          <Row title="Review" meta="Hand-ins and sign-offs" icon={<FileCheck {...icon} />} trailing={n(toGrade.data?.pending)} onPress={() => router.push("/admin/review")} testID="more-review" />
          <Row title="Content" meta="On the website: courses and lectures" icon={<BookOpen {...icon} />} onPress={web("/admin/courses")} />
        </RowList>
      </Section>
      <Section title="Credentials">
        <RowList>
          <Row title="Certificates and badges" icon={<Award {...icon} />} onPress={() => router.push("/admin/certificates")} testID="more-certificates" />
        </RowList>
      </Section>
      <Section title="Settings">
        <RowList>
          <Row title="Admin alerts" meta="New doubts, enquiries, students falling behind" icon={<BellRing {...icon} />} onPress={() => router.push("/admin/alerts")} testID="more-alerts" />
          <Row title="Notifications" icon={<Bell {...icon} />} onPress={() => router.push("/notifications")} />
          <Row title="Settings" icon={<Settings {...icon} />} onPress={() => router.push("/settings")} testID="more-settings" />
          <Row title="System" meta="Support keys, and how full things are" icon={<Gauge {...icon} />} onPress={() => router.push("/admin/system")} testID="more-system" />
          <Row title="Help" icon={<CircleHelp {...icon} />} onPress={() => router.push("/help")} />
        </RowList>
      </Section>
      <TestModeSection />
      <Section title="Account">
        <RowList>
          <Row title="View as student" meta="See VIBHA the way students see it" icon={<GraduationCap {...icon} />} onPress={startViewAs} testID="more-view-as" />
          <Row title="Log out" danger icon={<LogOut size={20} color={c.danger} />} chevron={false} onPress={() => setOut(true)} testID="more-logout" />
        </RowList>
      </Section>
      <ConfirmSheet open={out} onClose={() => setOut(false)} title="Log out?" body="You will need your email and password to come back in." confirm="Log out" danger onConfirm={() => void session.signOut()} testID="confirm-logout" />
    </Screen>
  );
}

/** Which admin notices come to this phone. Each admin chooses their own. */
export function AdminAlertsScreen() {
  const q = usePushPrefs();
  const qc = useQueryClient();
  const set = async (p: Partial<AdminPushPrefs>) => {
    haptic.select();
    qc.setQueryData<AdminPushPrefs>(["admin", "push-prefs", ""], (prev) => (prev ? { ...prev, ...p } : prev));
    try {
      await adminCalls.pushPrefs(p);
    } catch (e) {
      toast.show(messageOf(e));
      void q.refetch();
    }
  };
  return (
    <Screen testID="admin-alerts" lead="Sent to this phone as notifications. A tap opens the right screen.">
      <Loaded q={q} soon what="alerts" skeleton={<RowsSkeleton rows={3} />}>
        {(p) => (
          <RowList>
            {/* Falling behind has no sender on the server yet, so it is not offered. */}
            {(Object.keys(ADMIN_PUSH) as (keyof typeof ADMIN_PUSH)[]).filter((k) => k !== "falling_behind").map((k) => (
              <SwitchRow key={k} title={ADMIN_PUSH[k].title} meta={ADMIN_PUSH[k].about} value={p[ADMIN_PUSH[k].pref]} onChange={(v) => void set({ [ADMIN_PUSH[k].pref]: v })} testID={`alert-${k}`} />
            ))}
          </RowList>
        )}
      </Loaded>
    </Screen>
  );
}

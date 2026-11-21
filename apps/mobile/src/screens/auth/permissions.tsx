import { useSegments } from "expo-router";
import { Bell, Camera } from "lucide-react-native";
import * as React from "react";
import { BackHandler, Platform, View } from "react-native";

import type { Me } from "@/api/contract";
import { api } from "@/auth";
import { Button, T, toast } from "@/ds";
import { introSeen, markIntroSeen, permissions, type PermKind, type PermState } from "@/lib/permissions";
import { Enter, Swap } from "@/motion";
import { groupFor } from "@/nav/targets";
import { enablePush } from "@/push";
import { Gate } from "@/screens/auth/gates";
import { LecturesOnlyGate, outsideLectures } from "@/screens/auth/scope";
import { markTourSeen, TabTour, tourSeen } from "@/screens/auth/tour";
import { space, useTheme } from "@/theme";

const STEPS: Record<PermKind, { icon: typeof Bell; title: string; line: string; points: [string, string] }> = {
  notifications: { icon: Bell, title: "Get class and leave updates", line: "We let you know when a class changes or your leave is answered.", points: ["Only about your own classes, leave and doubts", "Turn it off any time in Me, then Settings"] },
  camera: { icon: Camera, title: "Scan in for attendance", line: "The camera is used only to scan the attendance code at your session.", points: ["Nothing is recorded or saved", "No camera? You can always type the code"] },
};

/** Which permissions to ask for on this account: only those the phone can still ask. Camera only for students (the clinic scanner). */
export function introSteps(me: Me | null, states: Record<PermKind, PermState>): PermKind[] {
  const askable = (s: PermState) => s === "ask" || s === "retry";
  const out: PermKind[] = [];
  if (askable(states.notifications)) out.push("notifications");
  if (groupFor(me) === "(student)" && askable(states.camera)) out.push("camera");
  return out;
}

/** The browser build (screenshots, development) shows the tour only when the address asks for it: ?tour=1. */
function webAsks(name: "tour" | "perms"): boolean {
  try {
    return typeof window !== "undefined" && new URLSearchParams(window.location.search).get(name) === "1";
  } catch {
    return false;
  }
}

/**
 * Everything that happens once after the first sign-in, in order:
 *   1. students: the tab tour, with Jyo saying hello (src/screens/auth/tour.tsx)
 *   2. one calm screen per permission, a line on why, Allow (the phone's
 *      own question) or Not now
 * Each is shown once on this phone; Settings > Permissions has the switches
 * afterwards. Also holds the "lectures only" screen for a lectures-only
 * account that opened a link to something outside its lectures.
 */
export function FirstRunPermissions({ active, me }: { active: boolean; me: Me | null }) {
  const [tour, setTour] = React.useState<"unknown" | "show" | "done">("unknown");
  const [steps, setSteps] = React.useState<PermKind[] | null>(null);
  const [i, setI] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const checked = React.useRef(false);
  const toured = React.useRef(false);
  const group = groupFor(me);
  const top = useSegments()[0] as string | undefined;

  // 1. The tour: students only, once.
  React.useEffect(() => {
    if (!active || toured.current) return;
    toured.current = true;
    if (group !== "(student)") return setTour("done");
    if (Platform.OS === "web") return setTour(webAsks("tour") ? "show" : "done");
    let live = true;
    void tourSeen()
      .then((seen) => {
        if (!live) return;
        // Remembered as soon as it appears: closing the app half way never brings it back.
        if (!seen) markTourSeen();
        setTour(seen ? "done" : "show");
      })
      .catch(() => live && setTour("done"));
    return () => {
      live = false;
    };
  }, [active, group]);

  // 2. The permissions, once the tour is out of the way.
  React.useEffect(() => {
    if (!active || tour !== "done" || checked.current) return;
    checked.current = true;
    if (Platform.OS === "web") {
      // The browser build cannot ask; ?perms=1 shows both steps for screenshots.
      if (webAsks("perms")) setSteps(groupFor(me) === "(student)" ? ["notifications", "camera"] : ["notifications"]);
      return;
    }
    let live = true;
    void (async () => {
      if (await introSeen()) return;
      const [notifications, camera] = await Promise.all([permissions.read("notifications"), permissions.read("camera")]);
      const s = introSteps(me, { notifications, camera });
      // Shown once: remembered as soon as it appears (or when there is nothing to ask).
      markIntroSeen();
      if (live && s.length) setSteps(s);
    })().catch(() => undefined);
    return () => {
      live = false;
    };
  }, [active, me, tour]);

  const kind = tour === "done" ? steps?.[i] : undefined;
  const next = React.useCallback(() => {
    setBusy(false);
    setI((n) => n + 1);
  }, []);

  React.useEffect(() => {
    if (!kind) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      next();
      return true;
    });
    return () => sub.remove();
  }, [kind, next]);

  if (!active) return null;
  if (tour === "show") return <TabTour name={typeof me?.name === "string" ? me.name.split(" ")[0] : undefined} onDone={() => setTour("done")} />;
  if (!kind) return outsideLectures(group, top) ? <LecturesOnlyGate /> : null;
  const step = STEPS[kind];
  const total = steps?.length ?? 1;
  const allow = async () => {
    setBusy(true);
    try {
      if (kind === "notifications") {
        // Asks, then gives this phone's push address to the server.
        const s = await enablePush();
        if (s === "granted") await api.put("/notifications/preferences", { push: true }).catch(() => undefined);
        // Allowed on the phone, but this version of the app cannot receive them yet: say so, never pretend.
        else if (s === "unavailable") toast.show("Notifications do not work in this version of the app yet. An update will turn them on.", 6000);
      } else {
        await permissions.request("camera");
      }
    } catch {
      /* a refusal or a failure only moves on */
    }
    next();
  };
  return (
    <Gate
      testID="first-run-permissions"
      titleKey={kind}
      title={step.title}
      lead={total > 1 ? `${i + 1} of ${total}` : "One quick question"}
      footer={
        <>
          <Button label="Allow" busy={busy} onPress={() => void allow()} testID={`perm-allow-${kind}`} />
          <Button kind="text" full label="Not now" disabled={busy} onPress={next} testID={`perm-skip-${kind}`} />
        </>
      }
    >
      <Swap k={kind} dir={1}>
        <StepBody icon={step.icon} line={step.line} points={step.points} testID={`perm-step-${kind}`} />
      </Swap>
    </Gate>
  );
}

function StepBody({ icon: Icon, line, points, testID }: { icon: typeof Bell; line: string; points: readonly string[]; testID: string }) {
  const c = useTheme();
  const a = c.areas.learn;
  return (
    <View testID={testID} accessibilityLiveRegion="polite" style={{ gap: space[5] }}>
      <Enter i={0} kind="pop">
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
          <Icon size={38} color={a.deep} strokeWidth={2} />
        </View>
      </Enter>
      <Enter i={1}>
        <T v="reading">{line}</T>
      </Enter>
      <View style={{ gap: space[3] }}>
        {points.map((p, n) => (
          <Enter key={p} i={n + 2} style={{ flexDirection: "row", alignItems: "flex-start", gap: space[3] }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: a.deep, marginTop: 7 }} />
            <T v="small" tone="muted" style={{ flex: 1 }}>
              {p}
            </T>
          </Enter>
        ))}
      </View>
    </View>
  );
}

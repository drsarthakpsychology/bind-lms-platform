import { Bell, Camera } from "lucide-react-native";
import * as React from "react";
import { BackHandler, Platform, View } from "react-native";

import type { Me } from "@/api/contract";
import { api } from "@/auth";
import { Button, T } from "@/ds";
import { introSeen, markIntroSeen, permissions, type PermKind, type PermState } from "@/lib/permissions";
import { groupFor } from "@/nav/targets";
import { enablePush } from "@/push";
import { Gate } from "@/screens/auth/gates";
import { Swap } from "@/motion";
import { space, useTheme } from "@/theme";

const STEPS: Record<PermKind, { icon: typeof Bell; title: string; line: string }> = {
  notifications: { icon: Bell, title: "Get class and leave updates", line: "We let you know when a class changes or your leave is answered." },
  camera: { icon: Camera, title: "Scan in for attendance", line: "The camera is used only to scan the attendance code at your session." },
};

/** Which permissions to ask for on this account: only those the phone can still ask. Camera only for students (the clinic scanner). */
export function introSteps(me: Me | null, states: Record<PermKind, PermState>): PermKind[] {
  const askable = (s: PermState) => s === "ask" || s === "retry";
  const out: PermKind[] = [];
  if (askable(states.notifications)) out.push("notifications");
  if (groupFor(me) === "(student)" && askable(states.camera)) out.push("camera");
  return out;
}

/**
 * The first-run step after sign-in: one calm screen per permission, a
 * line on why, Allow (the phone's own question) or Not now. Shown once on
 * this phone; Settings > Permissions has them afterwards.
 */
export function FirstRunPermissions({ active, me }: { active: boolean; me: Me | null }) {
  const [steps, setSteps] = React.useState<PermKind[] | null>(null);
  const [i, setI] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const checked = React.useRef(false);

  React.useEffect(() => {
    if (!active || checked.current || Platform.OS === "web") return;
    checked.current = true;
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
  }, [active, me]);

  const kind = steps?.[i];
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

  if (!active || !kind) return null;
  const step = STEPS[kind];
  const allow = async () => {
    setBusy(true);
    try {
      if (kind === "notifications") {
        // Asks, then gives this phone's push address to the server.
        const s = await enablePush();
        if (s === "granted") await api.put("/notifications/preferences", { push: true }).catch(() => undefined);
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
      footer={
        <>
          <Button label="Allow" busy={busy} onPress={() => void allow()} testID={`perm-allow-${kind}`} />
          <Button kind="text" full label="Not now" disabled={busy} onPress={next} testID={`perm-skip-${kind}`} />
        </>
      }
    >
      <Swap k={kind}>
        <StepBody icon={step.icon} title={step.title} line={step.line} testID={`perm-step-${kind}`} />
      </Swap>
    </Gate>
  );
}

function StepBody({ icon: Icon, title, line, testID }: { icon: typeof Bell; title: string; line: string; testID: string }) {
  const c = useTheme();
  return (
    <View testID={testID} accessibilityLiveRegion="polite" style={{ alignItems: "center", gap: space[4] }}>
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: c.tint, alignItems: "center", justifyContent: "center" }}>
        <Icon size={40} color={c.ink} />
      </View>
      <T v="h1" center>
        {title}
      </T>
      <T center tone="muted">
        {line}
      </T>
    </View>
  );
}

import { Bell, Camera } from "lucide-react-native";
import * as React from "react";
import { Platform } from "react-native";

import { IconDot, Row, RowList, Section } from "@/ds";
import { openPhoneSettings, stateLabel, usePermission, type PermKind, type PermState } from "@/lib/permissions";
import { enablePush } from "@/push";

/** What tapping a permission row does in each state. */
export function rowAction(s: PermState): "ask" | "settings" | null {
  if (s === "ask" || s === "retry") return "ask";
  if (s === "blocked" || s === "granted") return "settings";
  return null;
}

function PermRow({ kind, title, meta, icon }: { kind: PermKind; title: string; meta: string; icon: typeof Bell }) {
  const p = usePermission(kind);
  const act = rowAction(p.state);
  const onPress = async () => {
    if (act === "settings") return openPhoneSettings();
    if (act !== "ask") return;
    // Notifications: ask, and give this phone's push address to the server too.
    if (kind === "notifications") await enablePush();
    else await p.ask();
    p.refresh();
  };
  const hint = act === "ask" ? "Tap to allow" : act === "settings" ? "Open settings" : undefined;
  return (
    <Row
      testID={`perm-row-${kind}`}
      title={title}
      meta={p.state === "blocked" ? `${meta} Turn it on in the phone's settings.` : meta}
      icon={<IconDot icon={icon} />}
      trailing={stateLabel(p.state)}
      onPress={act ? () => void onPress() : undefined}
      accessibilityLabel={`${title}: ${stateLabel(p.state)}${hint ? `. ${hint}` : ""}`}
    />
  );
}

/** Settings > Permissions: each permission with its state; a tap allows it or opens the phone's settings. */
export function PermissionsSection() {
  if (Platform.OS === "web") return null;
  return (
    <Section title="Permissions" quiet>
      <RowList>
        <PermRow kind="notifications" title="Notifications" meta="Class and leave updates." icon={Bell} />
        <PermRow kind="camera" title="Camera" meta="Scanning the attendance code." icon={Camera} />
        <Row testID="perm-open-settings" title="Open phone settings" onPress={openPhoneSettings} />
      </RowList>
    </Section>
  );
}

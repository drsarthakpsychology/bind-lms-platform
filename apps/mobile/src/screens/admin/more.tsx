import { router } from "expo-router";
import { Bell, CircleHelp, Settings } from "lucide-react-native";
import * as React from "react";
import { Linking } from "react-native";

import { useMe } from "@/api/queries";
import { Row, RowList, Screen, Section, T } from "@/ds";
import { config } from "@/lib/config";
import { TabTop } from "@/nav/top";
import { useTheme } from "@/theme";

/** More: the rest of admin work. Daily tasks are in the app; the big tools stay on the website. */
export function AdminMore() {
  const c = useTheme();
  const me = useMe();
  const icon = { size: 20, color: c.muted };
  const web = (path: string) => () => void Linking.openURL(`${config.site}${path}`);
  return (
    <Screen tab top={<TabTop sub="Admin" />} title="More" testID="admin-more">
      {me.data ? (
        <T v="small" tone="muted">
          Signed in as {me.data.name ?? me.data.email}
        </T>
      ) : null}
      <Section title="On the website">
        <RowList>
          <Row title="Courses and lectures" meta="Upload and arrange lectures" onPress={web("/admin/courses")} />
          <Row title="Grading" meta="Mark hand-ins" onPress={web("/admin/grading")} />
          <Row title="Certificates" meta="The certificate studio" onPress={web("/admin/certificates")} />
          <Row title="What's live" meta="Feature switches" onPress={web("/admin/features")} />
        </RowList>
      </Section>
      <Section title="You">
        <RowList>
          <Row title="Notifications" icon={<Bell {...icon} />} onPress={() => router.push("/notifications")} />
          <Row title="Settings" icon={<Settings {...icon} />} onPress={() => router.push("/settings")} />
          <Row title="Help" icon={<CircleHelp {...icon} />} onPress={() => router.push("/help")} />
        </RowList>
      </Section>
    </Screen>
  );
}

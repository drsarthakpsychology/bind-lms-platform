import { router } from "expo-router";
import { PenLine } from "lucide-react-native";
import * as React from "react";

import { useAdminMessages } from "@/api/queries";
import { Button, Loaded, Row, RowList, RowsSkeleton, Screen } from "@/ds";
import { TabTop } from "@/nav/top";
import { when } from "@/screens/notifications/list";
import { useTheme } from "@/theme";

/** Messages: what was sent, newest first; New message pinned low. */
export function AdminMessages() {
  const c = useTheme();
  const q = useAdminMessages();
  return (
    <Screen tab top={<TabTop sub="Admin" />} title="Messages" testID="admin-messages" footer={<Button label="New message" icon={<PenLine size={20} color={c.onPrimary} />} onPress={() => router.push("/compose")} />}>
      <Loaded q={q} soon what="messages" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => (
          <RowList>
            {d.items.map((m) => (
              <Row key={m.id} unread={m.unread} title={m.title} meta={`To ${m.to} · ${m.preview}`} trailing={when(m.at)} chevron={false} />
            ))}
          </RowList>
        )}
      </Loaded>
    </Screen>
  );
}

import { router } from "expo-router";
import { ExternalLink } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { Button, EmptyState } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { space, useTheme } from "@/theme";

/**
 * A part the app does not have yet: never a dead end. It opens the same page
 * on the website, or goes back.
 */
export function SoonState({ web, body = "This part is ready on the website.", testID = "soon" }: { web: string; body?: string; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ gap: space[3] }}>
      <EmptyState mood="sleepy" title="Coming soon to the app" body={body} />
      <Button label="Open on the website" icon={<ExternalLink size={18} color={c.onPrimary} />} onPress={() => void Linking.openURL(`${config.site}${web}`).catch(() => toast.show("That didn't open. Try again."))} testID="soon-web" />
      <Button kind="text" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/practise"))} testID="soon-back" />
    </View>
  );
}

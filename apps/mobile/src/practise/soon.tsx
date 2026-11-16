import * as React from "react";

import { ComingSoon } from "@/ds";

/**
 * A part the app does not have yet: never a dead end. It opens the same page
 * on the website, or goes back. The one shared part lives in src/ds/query.tsx.
 */
<<<<<<< HEAD
export function SoonState({ web, body, testID }: { web: string; body?: string; testID?: string }) {
  return <ComingSoon web={web} body={body} home="/practise" testID={testID} />;
=======
export function SoonState({ web, body = "This part is ready on the website.", testID = "soon" }: { web: string; body?: string; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ gap: space[3] }}>
      <EmptyState mood="soon" title="Coming soon to the app" body={body} />
      <Button label="Open on the website" icon={<ExternalLink size={18} color={c.onPrimary} />} onPress={() => void Linking.openURL(`${config.site}${web}`).catch(() => toast.show("That didn't open. Try again."))} testID="soon-web" />
      <Button kind="text" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/practise"))} testID="soon-back" />
    </View>
  );
>>>>>>> admin-redesign
}

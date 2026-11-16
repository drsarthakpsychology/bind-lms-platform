import * as React from "react";

import { ComingSoon } from "@/ds";

/**
 * A part the app does not have yet: never a dead end. It opens the same page
 * on the website, or goes back. The one shared part lives in src/ds/query.tsx.
 */
export function SoonState({ web, body, testID }: { web: string; body?: string; testID?: string }) {
  return <ComingSoon web={web} body={body} home="/practise" testID={testID} />;
}

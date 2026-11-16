import { Redirect } from "expo-router";

/** Old links to the inbox (notifications, saved to-dos) open the Messages tab, where the inbox lives. */
export default function InboxRedirect() {
  return <Redirect href="/admin/messages" />;
}

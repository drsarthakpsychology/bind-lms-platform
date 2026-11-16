import { Redirect } from "expo-router";

/**
 * An address the app has no screen for (an old link, a website page that is
 * not in the app): go to the front door instead of the router's own
 * "unmatched route" page, which lists every screen.
 */
export default function NotFound() {
  return <Redirect href="/" />;
}

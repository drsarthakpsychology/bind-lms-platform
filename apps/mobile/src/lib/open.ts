import { Linking } from "react-native";

import { toast } from "@/ds/toast";

/**
 * Open a link in another app (browser, WhatsApp, mail, phone). Linking.openURL
 * rejects when no app on the phone takes the link (no mail app, a tablet with
 * no phone); `void Linking.openURL()` swallowed that, so the tap did nothing.
 */
export async function openLink(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    toast.show(/^mailto:/i.test(url) ? "No email app on this phone opens this." : /^tel:/i.test(url) ? "This phone cannot make calls." : "Could not open the link on this phone.");
    return false;
  }
}

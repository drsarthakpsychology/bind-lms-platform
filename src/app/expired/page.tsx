import type { Metadata } from "next";
import { Hourglass } from "lucide-react";
import { AccountNotice } from "@/components/site/account-notice";

export const metadata: Metadata = {
  title: "Access ended",
  robots: { index: false, follow: false },
};

export default function ExpiredPage() {
  return (
    <AccountNotice
      icon={Hourglass}
      title="Your access has ended"
      text="Your access window is over. If you think that's a mistake, message us and we'll check."
    />
  );
}

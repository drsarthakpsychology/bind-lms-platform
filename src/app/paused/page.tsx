import type { Metadata } from "next";
import { PauseCircle } from "lucide-react";
import { AccountNotice } from "@/components/site/account-notice";

export const metadata: Metadata = {
  title: "Access paused",
  robots: { index: false, follow: false },
};

export default function PausedPage() {
  return (
    <AccountNotice
      icon={PauseCircle}
      title="Your access is paused"
      text="Message us and we'll sort it out."
    />
  );
}

import { CirclePlay, House, MessageCircleQuestionMark, User } from "lucide-react-native";

import { TabBar } from "@/nav/tabs";

/** Lectures-only accounts: Home, Lectures, Doubts, Me. */
export default function LectureTabs() {
  return (
    <TabBar
      tabs={[
        { name: "lo/home", title: "Home", icon: House },
        { name: "lo/lectures", title: "Lectures", icon: CirclePlay },
        { name: "lo/doubts", title: "Doubts", icon: MessageCircleQuestionMark },
        { name: "lo/me", title: "Me", icon: User },
      ]}
    />
  );
}

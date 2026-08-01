import { LayoutDashboard, Users, BookOpen, Inbox } from "lucide-react";
import type { NavItem } from "@/components/navigation/nav-items";

export const STUDENT_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "My Courses", icon: LayoutDashboard, exact: true },
];

export const ADMIN_ITEMS: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
];

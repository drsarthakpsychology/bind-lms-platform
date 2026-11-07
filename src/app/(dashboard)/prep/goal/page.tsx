import { redirect } from "next/navigation";

/** Picking an exam is gone: the bank is the same for every exam. */
export default function OldGoalPage() {
  redirect("/prep");
}

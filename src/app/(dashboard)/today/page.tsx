import { redirect } from "next/navigation";

/**
 * /today is retired as the front door (the "main light" is gone). Students land
 * on /dashboard, where each part carries its own small resume affordance (the
 * course's "Continue/Start" row, the practice hub's "Recommended for you"
 * card). This route now just forwards anyone with an old bookmark to /dashboard
 * instead of 404ing.
 */
export default function TodayRedirectPage() {
  redirect("/dashboard");
}

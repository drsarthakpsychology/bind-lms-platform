import { redirect } from "next/navigation";

/** Old address: missed questions now come back in Smart practice (and the Wrong answers list). */
export default function OldReviewPage() {
  redirect("/prep/smart");
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type CreateCourseState = { error: string | null };

export async function createCourse(
  _prevState: CreateCourseState,
  formData: FormData,
): Promise<CreateCourseState> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const title = String(formData.get("title") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title) return { error: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .insert({ title, is_published: isPublished });

  if (error) return { error: "Could not create the course." };

  revalidatePath("/admin/courses");
  return { error: null };
}

export async function setCoursePublished(
  courseId: string,
  isPublished: boolean,
): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .update({ is_published: isPublished })
    .eq("id", courseId);

  if (error) return { error: "Could not update the course." };

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  return { error: null };
}

export async function deleteCourse(courseId: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: "Not authorized." };

  const supabase = await createClient();
  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) return { error: "Could not delete the course." };

  revalidatePath("/admin/courses");
  return { error: null };
}

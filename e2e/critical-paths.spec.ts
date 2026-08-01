import { test, expect } from "@playwright/test";

/**
 * The four paths that must never break. These run against the live site
 * (or a preview URL via E2E_BASE_URL). Credentials come from env secrets so
 * nothing sensitive is committed.
 */

// These are set in the GitHub Actions job (secrets), not committed.
const STUDENT_EMAIL = process.env.E2E_STUDENT_EMAIL ?? "";
const STUDENT_PASSWORD = process.env.E2E_STUDENT_PASSWORD ?? "";
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "";

test("student can log in", async ({ page }) => {
  test.skip(!STUDENT_EMAIL, "E2E_STUDENT_EMAIL not set");
  await page.goto("/login");
  await page.getByLabel("Email").fill(STUDENT_EMAIL);
  await page.getByLabel("Password").fill(STUDENT_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  // Lands on the dashboard after successful login.
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("My Courses")).toBeVisible();
});

test("student can open a lesson with a video player", async ({ page }) => {
  test.skip(!STUDENT_EMAIL, "E2E_STUDENT_EMAIL not set");
  // Requires a real lesson id — provided via env for the run.
  const lessonUrl = process.env.E2E_LESSON_URL;
  test.skip(!lessonUrl, "E2E_LESSON_URL not set");
  // Sign in first.
  await page.goto("/login");
  await page.getByLabel("Email").fill(STUDENT_EMAIL);
  await page.getByLabel("Password").fill(STUDENT_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.goto(lessonUrl!);
  // The player container must render with the watermark present.
  await expect(page.locator('[data-testid="plms-player"]')).toBeVisible();
  await expect(page.locator('[data-testid="plms-watermark"]')).toBeVisible();
});

test("student can submit an assignment", async ({ page }) => {
  test.skip(!STUDENT_EMAIL, "E2E_STUDENT_EMAIL not set");
  const assignmentUrl = process.env.E2E_ASSIGNMENT_URL;
  test.skip(!assignmentUrl, "E2E_ASSIGNMENT_URL not set");
  await page.goto("/login");
  await page.getByLabel("Email").fill(STUDENT_EMAIL);
  await page.getByLabel("Password").fill(STUDENT_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.goto(assignmentUrl!);
  const textarea = page.getByLabel(/your response|written response/i);
  await textarea.fill("Automated E2E test submission");
  await page.getByRole("button", { name: /submit/i }).click();
  await expect(page.getByText(/pending review|submitted/i)).toBeVisible();
});

test("admin can create a student", async ({ page }) => {
  test.skip(!ADMIN_EMAIL, "E2E_ADMIN_EMAIL not set");
  await page.goto("/login");
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.goto("/admin/students");
  await page.getByRole("button", { name: /add student|create student/i }).click();
  const email = `e2e_${Date.now()}@test.local`;
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill("E2eTest123!");
  await page.getByRole("button", { name: /create|add/i }).click();
  await expect(page.getByText(email)).toBeVisible();
});

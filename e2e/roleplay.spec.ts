import { test, expect } from "@playwright/test";

/**
 * Peer role-play — two users in one session.
 * Account 1 = the shared storageState session (test@vibha.test) creates the
 * session + sends a line as clinician. Account 2 = peer@vibha.test in a
 * FRESH context (no storageState) opens the same session and replies as the
 * patient. Verifies the thread is shared and polling delivers both sides.
 */

const PEER_EMAIL = "peer@vibha.test";
const PEER_PASSWORD = "K#test";

test("peer role-play: create session, message, peer replies", async ({ page, browser }) => {
  // --- Account 1 (the shared session) creates the session. ---
  await page.goto("/practice/role-play", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText(/practice with a classmate|peer role-play/i);
  await page.fill("#peer-email", PEER_EMAIL);
  await page.getByRole("button", { name: /I'll play the clinician/i }).click();
  await page.getByRole("button", { name: /start role-play/i }).click();
  await page.waitForURL(/\/practice\/role-play\?session=/, { timeout: 10000 });
  const sessionUrl = page.url();
  console.log("✓ session created:", sessionUrl.split("session=")[1].slice(0, 8));

  await page.fill("input[placeholder*='character']", "Namaste, come in. What brings you here today?");
  await page.getByRole("button", { name: /send/i }).click();
  await page.waitForTimeout(1200);
  await expect(page.getByText(/Namaste, come in/i)).toBeVisible({ timeout: 6000 });
  console.log("✓ clinician message sent");

  // --- Account 2 (peer) in a FRESH context with NO shared storageState. ---
  const peerCtx = await browser!.newContext({
    baseURL: "http://localhost:3000",
    storageState: { cookies: [], origins: [] }, // clear the account-1 session
  });
  const peer = await peerCtx.newPage();
  await peer.goto("/login");
  await peer.fill("#email", PEER_EMAIL);
  await peer.fill("#password", PEER_PASSWORD);
  await peer.getByRole("button", { name: /sign in|log in/i }).click();
  // The role-based landing page is /today for students (/admin for admins).
  await peer.waitForURL(/dashboard|practice|today|admin/, { timeout: 15000 });
  await peer.waitForTimeout(800);

  await peer.goto(sessionUrl, { waitUntil: "networkidle" });
  await expect(peer.getByText(/Namaste, come in/i)).toBeVisible({ timeout: 10000 });
  console.log("✓ peer sees the thread");

  await peer.fill("input[placeholder*='character']", "I've been having trouble sleeping all week, doctor.");
  await peer.getByRole("button", { name: /send/i }).click();
  await peer.waitForTimeout(1200);
  await expect(peer.getByText(/trouble sleeping all week/i)).toBeVisible({ timeout: 6000 });

  // Account 1's polling picks up the peer's reply.
  await expect(page.getByText(/trouble sleeping all week/i)).toBeVisible({ timeout: 8000 });
  console.log("✓ clinician sees the patient's reply (polling works)");

  await peerCtx.close();
});

# Running Lumen on Your Computer (Local Development)

This guide assumes **no technical background**. Follow the steps in order and
you'll have the app running in your browser.

---

## 1. What you need to have installed

Only three things are required. **You almost certainly already have them:**

| Software | What it is | How to check if you have it |
| --- | --- | --- |
| **Node.js** | The "engine" that runs the app | Open Terminal, type `node -v` |
| **npm** | A tool that downloads the app's parts | Open Terminal, type `npm -v` |
| **Git** | Keeps track of versions of your project | Open Terminal, type `git --version` |

> If any of these shows "command not found", install Node.js from
> https://nodejs.org (choose the "LTS" version). Installing Node.js also
> installs npm. Git is included with Xcode Command Line Tools on a Mac —
> try `xcode-select --install` if it's missing.

---

## 2. Get the project onto your computer

You already have this project in a folder (it's where you opened VS Code).
You do **not** need to do anything else — skip to step 3.

If you ever need to download it fresh from GitHub:

```bash
git clone https://github.com/drsarthakpsychology/bind-lms-platform.git
cd bind-lms-platform
```

---

## 3. Download the project's "parts" (one-time)

The project lists its ingredients in a file called `package.json`. Run this
once — it downloads everything the project needs:

```bash
npm install
```

You'll see a lot of text. When it finishes, the folder `node_modules` will
exist. This usually takes 1–3 minutes.

---

## 4. Set up your secret keys (one-time)

The app talks to Supabase (the online database). It needs three secret values
in a file called `.env.local`:

1. Find a file called **`.env.example`** in the project folder.
2. Make a copy of it named **`.env.local`**.
   - In VS Code, right-click `.env.example` → **Copy** → right-click → **Paste**
     then rename the copy to `.env.local`.
   - Or in Terminal: `cp .env.example .env.local`
3. Open `.env.local` and replace the three placeholder values with your real
   ones from the **Supabase dashboard** → **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` → the **Project URL**
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → the **anon / publishable key**
   - `SUPABASE_SERVICE_ROLE_KEY` → the **service_role secret key**

> `.env.local` is already ignored by Git — your secrets will **never** be
> uploaded to GitHub. Do not rename it or commit it.

---

## 5. Start the app

In Terminal, inside the project folder, run:

```bash
npm run dev
```

Wait for the line that says **`✓ Ready`** (takes a few seconds).

---

## 6. Open it in your browser

Visit **http://localhost:3000** in your browser.

That's it — the app is running. You'll be sent to the **Sign in** page.

---

## 7. How to stop the app

- Click back into the Terminal where you started it, then press **Control + C**
  (hold `Control`, press `C`).

---

## 8. I want to keep working on it — the loop

For everyday development, you only ever need two commands:

| To start | `npm run dev` |
| --- | --- |
| To stop | `Control + C` in that terminal |

While the server is running, **every change you save** to a file is applied
instantly — just refresh the browser (or it auto-refreshes).

---

## 9. Common problems and how to fix them

| Problem | What it means | Fix |
| --- | --- | --- |
| **"Command not found: npm"** | npm isn't installed | Install Node.js from nodejs.org (LTS) |
| **"Error: Cannot find module ..."** | The parts weren't downloaded | Run `npm install` |
| **"Port 3000 is already in use"** | Another copy is already running | Stop it (step 7), or run on a new port: `npm run dev -- -p 3001` and visit localhost:3001 |
| **Browser shows a blank login / errors about Supabase** | The secret keys are wrong or missing | Re-check step 4 — `.env.local` must exist and have your real keys |
| **"ETIMEDOUT" / connection hangs to supabase.co** | A DNS quirk on this Mac | Retry, or temporarily use a different network. The app itself works (see below) |
| **The page says "Access has expired"** | Your account's access window ended | Contact your administrator |
| **I changed code but nothing changed in the browser** | Old cached version | Hard-refresh: `Command + Shift + R` |

---

## 10. Known note about your network

On **this specific Mac**, your Supabase project's address occasionally resolves
to a slow internet path, so Supabase calls can hang for a moment on first load.
If you ever see it hang, **refresh the page** — it normally connects on retry.
This is a local network quirk, not a problem with the project. The app itself
is verified working.

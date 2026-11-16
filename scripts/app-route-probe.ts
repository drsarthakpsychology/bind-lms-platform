/**
 * Read-only check of a live server: every GET the phone app makes, sent with
 * no token. Each must answer JSON in the contract's shape (401 is fine); an
 * HTML page or anything else that is not JSON is a failure.
 *
 *   npx tsx scripts/app-route-probe.ts [https://vibhapsychology.com]
 *
 * Exits 1 when any answer is not JSON. Sends only GETs, never a token.
 * Uses curl, so a configured HTTPS proxy is honoured.
 */
import { execFileSync } from "node:child_process";
import { PENDING, appCalls } from "../src/lib/app-api/route-sweep";

const base = (process.argv[2] ?? "https://vibhapsychology.com").replace(/\/$/, "") + "/api/app/v1";
const paths = [...new Set([...appCalls(), ...PENDING].filter((c) => c.method === "GET").map((c) => c.path))].sort();

function main() {
  let bad = 0;
  for (const p of paths) {
    const url = base + p.replace(/:p/g, "x");
    let line: string;
    try {
      const out = execFileSync("curl", ["-sS", "-m", "30", "-H", "Accept: application/json", "-H", "X-App-Platform: android", "-H", "X-App-Version: 1.0.0", "-w", "\n%{http_code} %{content_type}", url], { encoding: "utf8", maxBuffer: 20_000_000 });
      const cut = out.lastIndexOf("\n");
      const text = out.slice(0, cut);
      const [status, type = ""] = out.slice(cut + 1).split(" ");
      let code = "";
      try {
        const j = JSON.parse(text) as { ok?: boolean; error?: { code?: string } };
        code = j.ok === true ? "ok" : (j.error?.code ?? "?");
      } catch {
        code = "NOT JSON";
      }
      const fine = /json/.test(type) && code !== "NOT JSON" && code !== "?";
      if (!fine) bad++;
      line = `${fine ? "ok  " : "BAD "} ${status} ${code.padEnd(16)} GET ${p}`;
    } catch (e) {
      bad++;
      line = `BAD  ---  ${String(e).slice(0, 60)}  GET ${p}`;
    }
    console.log(line);
  }
  console.log(`\n${paths.length} GET paths, ${bad} not JSON`);
  process.exit(bad ? 1 : 0);
}
main();

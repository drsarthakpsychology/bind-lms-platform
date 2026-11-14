# Add the free design tools to your Claude

Written 2026-11-14. Every tool here is free. None needs a credit card.

| Tool | Needs a key? | Where to get it |
|---|---|---|
| Made Good Designs (Inspiration) | No | |
| Screenrove | No | |
| Inspo | No | |
| Lazyweb | No for basic search | A free token is made by their installer if you want more. Not needed. |
| Awwwards | No | Needs Node.js 22.13 or newer on your computer. |
| Context7 (code docs, not design) | Free key recommended | context7.com/dashboard, sign in, copy the key. Without a key it often says "quota exceeded". |

Made Good Designs and Screenrove are already connected in your claude.ai account. You only need the steps below for the others, or for Claude Code on your laptop.

---

## A. Claude Desktop or claude.ai (website)

You do this once per tool. The Free plan allows only one custom connector; Pro and up allow many.

1. Open Claude Desktop (or claude.ai in your browser).
2. Click your name (bottom left), then **Settings**.
3. Click **Connectors**.
4. Click **Add custom connector**.
5. In **Name**, type the name from the table below. In **URL**, paste the address from the table below.
6. Click **Add**.
7. Start a new chat. Click the **+** button under the message box, then **Connectors**. Make sure the new tool is switched on.

| Name to type | URL to paste |
|---|---|
| Inspo | `https://inspomcp.dev/api/mcp` |
| Lazyweb | `https://www.lazyweb.com/mcp/public` |
| Screenrove | `https://screenrove.com/mcp` |
| Made Good Designs | `https://madegooddesigns.com/inspiration/mcp` |
| Context7 | `https://mcp.context7.com/mcp` |

Awwwards has no web address. It runs on your computer, so it only works in Claude Code or with the file method in section C.

To test: in a new chat, type "Use Lazyweb to find Duolingo quiz screens." You should see Lazyweb results with links.

---

## B. Claude Code (the terminal app on your laptop)

1. Open the **Terminal** app (Mac: press Cmd and Space, type Terminal, press Enter).
2. Copy one line at a time, paste it into Terminal, press Enter.

```
claude mcp add --transport http --scope user inspo https://inspomcp.dev/api/mcp
claude mcp add --transport http --scope user lazyweb https://www.lazyweb.com/mcp/public
claude mcp add --transport http --scope user screenrove https://screenrove.com/mcp
claude mcp add --transport http --scope user madegood https://madegooddesigns.com/inspiration/mcp
claude mcp add --scope user awwwards -- npx -y awwwards-mcp
```

3. For Context7, first get your free key (see the table at the top), then paste this line with your key in place of `YOUR_KEY`:

```
claude mcp add --transport http --scope user context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: YOUR_KEY"
```

4. Type `claude` and press Enter. Then type `/mcp` and press Enter. Each tool should say **connected**.

`--scope user` means the tool works in every project on your laptop.

---

## C. The file method (if a button or command does not work)

Claude Desktop also reads a settings file.

1. Open Claude Desktop. Click **Settings**, then **Developer**, then **Edit Config**. A file called `claude_desktop_config.json` opens.
2. Select everything in it and replace it with the block below. If the file already has other tools in `"mcpServers"`, keep them and add these inside the same braces.

```json
{
  "mcpServers": {
    "inspo": { "command": "npx", "args": ["-y", "inspo-mcp"] },
    "awwwards": { "command": "npx", "args": ["-y", "awwwards-mcp"] }
  }
}
```

3. Save the file (Cmd and S). Quit Claude Desktop fully and open it again.

This needs Node.js. If you do not have it, download the "LTS" version from nodejs.org and install it first.

---

## What not to add

- **UXKIN** search needs a paid plan.
- **Mobbin, Refero, ScreensDesign, Page Flows, Nicelydone** need paid plans.
- **Godly** has no official tool. The community ones are too new to trust.
- Never install anything that promises to "unlock" a paid tool for free.

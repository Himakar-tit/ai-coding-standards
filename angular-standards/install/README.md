# Install into your Angular app

Run once per Angular workspace. Works for **Cursor**, **GitHub Copilot**, **Claude Code**, and **Claude Desktop**.

## After npm publish (recommended)

```bash
cd /path/to/your-angular-app
npx angular-standards-setup
```

## From this git repo (before npm publish)

```bash
cd angular-standards/mcp-server
npm install && npm run build

node scripts/setup.mjs --target /path/to/your-angular-app --local
```

## Host-specific

```bash
# GitHub Copilot (VS Code) + instructions
npx angular-standards-setup --host copilot

# Claude Code + CLAUDE.md
npx angular-standards-setup --host claude-code

# Claude Desktop (user profile config)
npx angular-standards-setup --host claude-desktop

# Cursor only
npx angular-standards-setup --host cursor
```

## What gets installed

| Host | Files |
|------|-------|
| GitHub Copilot | `.vscode/mcp.json`, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `AGENTS.md` |
| Claude Code | `.mcp.json`, `CLAUDE.md`, `AGENTS.md` |
| Claude Desktop | `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Cursor | `.cursor/mcp.json` |

MCP runtime: `npx -y angular-standards-mcp` (same on all hosts).

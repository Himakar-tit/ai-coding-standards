# Install into your Angular app

## After npm publish (use in any repo)

```bash
cd your-angular-app
npx angular-standards-setup
```

Or pin as devDependency:

```bash
npm install --save-dev angular-standards-mcp
npx angular-standards-setup
```

Package: https://www.npmjs.com/package/angular-standards-mcp

## From this git repo (before publish / local dev)

```bash
cd angular-standards/mcp-server
npm install && npm run build

node scripts/setup.mjs --target /path/to/your-angular-app --local
```

Publish instructions: [mcp-server/NPM_PUBLISH.md](../mcp-server/NPM_PUBLISH.md)

## Host-specific

```bash
npx angular-standards-setup --host copilot      # GitHub Copilot
npx angular-standards-setup --host claude-code  # Claude Code
npx angular-standards-setup --host claude-desktop
npx angular-standards-setup --host cursor
npx angular-standards-setup --host all
```

## What gets installed

| Host | Files |
|------|-------|
| GitHub Copilot | `.vscode/mcp.json`, `.github/copilot-instructions.md`, `.github/instructions/`, `AGENTS.md` |
| Claude Code | `.mcp.json`, `CLAUDE.md`, `AGENTS.md` |
| Claude Desktop | User `claude_desktop_config.json` |
| Cursor | `.cursor/mcp.json` |

MCP runtime: `npx -y angular-standards-mcp`

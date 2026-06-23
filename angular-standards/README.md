# Angular Standards Plugin

Angular architecture governance for **Cursor**, **GitHub Copilot**, **Claude Code**, and **Claude Desktop** — one MCP server, progressive token disclosure.

## Install into your Angular project

### Published npm (after `npm publish`)

```bash
cd your-angular-app
npx angular-standards-setup
```

### From this repository (dev / before publish)

```bash
cd angular-standards/mcp-server && npm install && npm run build
node scripts/setup.mjs --target /path/to/your-angular-app --local
```

See [install/README.md](./install/README.md) for host-specific options.

---

## Supported hosts

| Host | MCP config | Instructions | Verify |
|------|------------|--------------|--------|
| **GitHub Copilot** | `.vscode/mcp.json` (`servers` + `type: stdio`) | `.github/copilot-instructions.md`, `.github/instructions/` | VS Code → reload → Copilot agent mode → MCP panel |
| **Claude Code** | `.mcp.json` | `CLAUDE.md`, `AGENTS.md` | `claude mcp list` → approve project server |
| **Claude Desktop** | `claude_desktop_config.json` | Use MCP tools in chat | Full app restart after setup |
| **Cursor** | `.cursor/mcp.json` | `rules/`, `skills/`, `/angular-review` | Settings → MCP → green dot |

All hosts run the same MCP package:

```json
"command": "npx",
"args": ["-y", "angular-standards-mcp"]
```

---

## GitHub Copilot setup

1. Run `npx angular-standards-setup --host copilot` in your Angular repo
2. Reload VS Code (`Developer: Reload Window`)
3. Open **Copilot Chat** in **agent** mode (not ask mode)
4. Confirm **angular-standards** MCP server is connected

Copilot also uses repo instructions for **cloud agent** and **code review** when you commit:

- `.github/copilot-instructions.md` — workspace-wide
- `.github/instructions/angular.instructions.md` — `**/*.{ts,html,scss}`
- `.github/instructions/angular-pr-review.instructions.md` — PR review workflow

Docs: [VS Code custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)

---

## Claude setup

### Claude Code (CLI / IDE)

```bash
npx angular-standards-setup --host claude-code
```

Creates `.mcp.json` + `CLAUDE.md`. On first run, approve the project MCP server.

CLI alternative:

```bash
claude mcp add-json angular-standards '{"type":"stdio","command":"npx","args":["-y","angular-standards-mcp"]}'
```

### Claude Desktop

```bash
npx angular-standards-setup --host claude-desktop
```

Fully quit and restart Claude Desktop. MCP tools appear in chat.

---

## MCP tools (all hosts)

| Tool | Purpose |
|------|---------|
| `list_standards_sections` | Index (~200 tokens) |
| `get_standards_section` | One standards domain |
| `get_pr_review_brief` | PR review format + anti-patterns |
| `get_review_sections_for_diff` | Sections matched to changed files |
| `scan_angular_violations` | Heuristic `.ts`/`.html` scan |

---

## Cursor Marketplace

Install from Cursor Marketplace for rules, skills, and `/angular-review` without manual setup.

For Copilot and Claude, use `npx angular-standards-setup` in each Angular repo.

---

## Composability

```json
"angular-cli": {
  "command": "npx",
  "args": ["-y", "@angular/cli", "mcp", "--read-only"]
}
```

## License

MIT

## Publishing

[PUBLIC_LAUNCH.md](../PUBLIC_LAUNCH.md) · [PUBLISHING.md](../PUBLISHING.md)

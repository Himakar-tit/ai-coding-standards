# Angular Standards Plugin

Enterprise Angular architecture governance for **Cursor**, **GitHub Copilot (VS Code)**, **Claude Desktop**, and **Claude Code** — modeled after **Angular CLI MCP**.

## Supported Hosts

| Host | MCP config location | Config key | Instructions |
|------|---------------------|------------|--------------|
| **Cursor** | `.cursor/mcp.json` | `mcpServers` | `rules/`, `skills/`, `commands/` |
| **VS Code + Copilot** | `.vscode/mcp.json` | `servers` (+ `type: "stdio"`) | `.github/copilot-instructions.md` |
| **Claude Code** | `.mcp.json` (project root) | `mcpServers` | `CLAUDE.md` |
| **Claude Desktop** | `claude_desktop_config.json` | `mcpServers` | Manual — use MCP tools in chat |

All hosts share the **same MCP server** (stdio). Only the config file format differs.

## Quick Setup (All Hosts)

```bash
cd angular-standards/mcp-server
npm install && npm run build

# Install into your Angular app (replace --target path)
node ../scripts/setup.mjs --target /path/to/your-angular-app --host all
```

This writes:
- `.cursor/mcp.json` (Cursor)
- `.vscode/mcp.json` (GitHub Copilot)
- `.mcp.json` + `.mcp/angular-standards-entry.mjs` (Claude Code)
- `claude_desktop_config.json` (Claude Desktop — user profile)
- `.github/copilot-instructions.md` + `.github/instructions/angular.instructions.md`
- `CLAUDE.md`

Restart your IDE / Claude Desktop after setup.

## Manual Setup by Host

### Cursor

Copy [configs/cursor.mcp.json.example](./configs/cursor.mcp.json.example) to `.cursor/mcp.json`. Replace paths.

Or install as Cursor plugin (rules/skills/commands auto-discovered).

### GitHub Copilot (VS Code)

1. Copy [configs/vscode.mcp.json.example](./configs/vscode.mcp.json.example) to `.vscode/mcp.json`
2. Copy [templates/copilot-instructions.md](./templates/copilot-instructions.md) to `.github/copilot-instructions.md`
3. Copy [templates/angular.instructions.md](./templates/angular.instructions.md) to `.github/instructions/angular.instructions.md`
4. Reload VS Code → verify MCP server in Copilot Chat agent mode

**Critical:** VS Code uses `"servers"` not `"mcpServers"`. Each entry needs `"type": "stdio"`.

Copilot can also import Claude Desktop MCP config automatically (Settings → MCP → From Claude Desktop).

### Claude Code

1. Run setup with `--host claude-code`, or copy [configs/claude-code.mcp.json.example](./configs/claude-code.mcp.json.example) to project `.mcp.json`
2. Copy [templates/CLAUDE.md](./templates/CLAUDE.md) to project root
3. Approve project-scoped MCP on first run: `claude mcp list`

CLI alternative:

```bash
claude mcp add-json angular-standards '{"type":"stdio","command":"node","args":["/absolute/path/to/mcp-server/dist/index.js"]}'
```

### Claude Desktop

Claude Desktop requires **absolute paths** (no `${workspaceFolder}`).

Windows: `%APPDATA%\Claude\claude_desktop_config.json`  
macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`  
Linux: `~/.config/Claude/claude_desktop_config.json`

Merge [configs/claude-desktop.config.snippet.json](./configs/claude-desktop.config.snippet.json) into `mcpServers`. Fully quit and restart Claude Desktop.

## MCP Tools (All Hosts)

| Tool | Purpose | Typical tokens |
|------|---------|----------------|
| `list_standards_sections` | Index of available sections | ~200 |
| `get_standards_section` | One section only | ~150–400 |
| `get_pr_review_brief` | Review format + anti-patterns | ~800 |
| `get_review_sections_for_diff` | Sections matched to file types | ~600–2000 |
| `scan_angular_violations` | Fast heuristic file scan | ~100–300 |

## Token-Efficient Architecture

| Layer | Host support | Token cost |
|-------|-------------|------------|
| **MCP tools** | All hosts | On demand, 200–2000 per call |
| **Copilot instructions** | VS Code, GitHub.com | ~300 lines max, pointer to MCP |
| **Cursor rules/skills** | Cursor only | File-scoped / task-scoped |
| **CLAUDE.md** | Claude Code | ~40 lines, orchestration only |

Never paste the full 3,000+ token review prompt. Use MCP progressive disclosure.

## npm Distribution (Optional)

After publishing `@enterprise/angular-standards-mcp`:

```json
{
  "mcpServers": {
    "angular-standards": {
      "command": "npx",
      "args": ["-y", "@enterprise/angular-standards-mcp"]
    }
  }
}
```

Works identically on Cursor, Copilot, and Claude — same pattern as `npx @angular/cli mcp`.

## Composability

Pair with official Angular CLI MCP — do not duplicate:

```json
"angular-cli": {
  "command": "npx",
  "args": ["-y", "@angular/cli", "mcp", "--read-only"]
}
```

## Repository Layout

```
angular-standards/
├── configs/              # Per-host MCP config examples
├── templates/            # Copilot + Claude instruction templates
├── scripts/setup.mjs     # One-command multi-host installer
├── mcp-server/           # Shared stdio MCP server
├── standards/            # 13 progressive-disclosure sections
├── rules/                # Cursor-only .mdc rules
├── skills/               # Cursor-only skills
└── commands/             # Cursor-only /angular-review
```

## License

MIT

## Publishing

See [PUBLISHING.md](../PUBLISHING.md) for npm, Cursor Marketplace, and enterprise distribution procedures.

# angular-standards-mcp

MCP server for **Angular architecture standards** — progressive disclosure for Cursor, GitHub Copilot, Claude Code, and Claude Desktop.

Same pattern as `npx @angular/cli mcp`, but for enterprise Angular governance (components, RxJS, a11y, PR review).

## Install into an Angular repo

```bash
npx angular-standards-setup
```

Or add as a dev dependency:

```bash
npm install --save-dev angular-standards-mcp
npx angular-standards-setup
```

## MCP configuration (manual)

**Cursor** — `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "angular-standards": {
      "command": "npx",
      "args": ["-y", "angular-standards-mcp"]
    }
  }
}
```

**GitHub Copilot (VS Code)** — `.vscode/mcp.json`:

```json
{
  "servers": {
    "angular-standards": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "angular-standards-mcp"]
    }
  }
}
```

**Claude Code** — `.mcp.json`:

```json
{
  "mcpServers": {
    "angular-standards": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "angular-standards-mcp"]
    }
  }
}
```

## MCP tools

| Tool | Description |
|------|-------------|
| `list_standards_sections` | Index of standards domains |
| `get_standards_section` | One section on demand |
| `get_pr_review_brief` | PR review format + anti-patterns |
| `get_review_sections_for_diff` | Sections matched to changed file types |
| `scan_angular_violations` | Heuristic scan for `.ts`/`.html` |

## Host-specific setup

```bash
npx angular-standards-setup --host copilot      # VS Code + Copilot instructions
npx angular-standards-setup --host claude-code  # .mcp.json + CLAUDE.md
npx angular-standards-setup --host cursor
npx angular-standards-setup --host all
```

## Repository

https://github.com/Himakar-tit/ai-coding-standards

## License

MIT

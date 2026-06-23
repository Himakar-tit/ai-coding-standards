# Multi-Agent Instructions (Copilot + Claude Code)

Use the **angular-standards** MCP server for Angular work. Do not inline full architecture standards.

## MCP tools (all hosts)

1. `list_standards_sections`
2. `get_pr_review_brief` — PR reviews
3. `get_review_sections_for_diff` — load only relevant sections
4. `get_standards_section` — one domain at a time
5. `scan_angular_violations` — heuristic scan per file

## Defaults

- Signals-first, OnPush, standalone, `@if` / `@for` / `@switch`
- Smart vs presentational components
- RxJS: no side effects in `map()`; `takeUntilDestroyed()` or async pipe
- WCAG accessibility by default
- NgRx orchestration in Effects

Pair with `npx @angular/cli mcp` for official Angular documentation.

# Angular Standards (Claude Code)

Use the **angular-standards** MCP server. Never inline the full standards document.

## PR review workflow

1. MCP `get_pr_review_brief`
2. MCP `get_review_sections_for_diff` with changed file extensions
3. MCP `scan_angular_violations` per changed `.ts`/`.html`
4. Output using exact format from `review-format` section
5. Verdict: APPROVED | APPROVED WITH REQUIRED CHANGES | REJECTED — REFACTOR REQUIRED

## Implementation defaults

- Signals-first, OnPush, standalone, modern control flow
- Smart vs presentational component separation
- NgRx orchestration in Effects — not components
- WCAG accessibility by default

## Composability

If available, also use `@angular/cli mcp` (`get_best_practices`, `list_projects`).

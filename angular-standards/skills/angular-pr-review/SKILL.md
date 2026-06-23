---
name: angular-pr-review
description: >-
  Conduct production-critical Angular PR reviews using enterprise architecture
  standards. Use when reviewing pull requests, Angular diffs, or when the user
  asks for an Angular architecture review. Loads standards via MCP to minimize
  token usage.
---

# Angular PR Review

## Token-Efficient Workflow

Do NOT paste the full standards document into context. Use MCP tools (works in Cursor, VS Code Copilot, Claude Desktop, Claude Code):

1. **`get_pr_review_brief`** — load review format + anti-patterns (~800 tokens)
2. **`get_review_sections_for_diff`** — pass changed file extensions; loads only relevant sections
3. **`scan_angular_violations`** — heuristic pre-scan per changed `.ts`/`.html` file
4. **`get_standards_section`** — fetch individual sections when findings need deeper criteria

## Review Steps

1. Identify changed files and extensions from the diff
2. Call `get_review_sections_for_diff` with extensions
3. For each changed Angular file, call `scan_angular_violations` with path + source
4. Read the actual diff — scanners are heuristics, not sufficient alone
5. Classify every issue: BLOCKER | HIGH | MEDIUM | LOW
6. Output using the exact format from `get_pr_review_brief`

## Verdict Criteria

- **APPROVED**: No blockers, no high-severity issues
- **APPROVED WITH REQUIRED CHANGES**: No blockers; highs must be listed in Required Refactors
- **REJECTED — REFACTOR REQUIRED**: Any blocker or fundamental architectural violation

## Review Posture

Principal Staff Frontend Architect. Direct. No generic praise. Reject "works for now" patterns.
Prioritize: maintainability, deterministic rendering, immutable state, reactive correctness, a11y compliance.

## Composability with Angular CLI MCP

If `@angular/cli` MCP is available, also use:
- `get_best_practices` for official Angular guidance
- `list_projects` for workspace context
- `onpush_zoneless_migration` when reviewing change detection

Do not duplicate what Angular CLI MCP already provides.

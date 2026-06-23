---
applyTo: "**/*.{ts,html}"
description: Angular PR review using angular-standards MCP
---

# Angular PR Review

When reviewing Angular PRs:

1. Call MCP `get_pr_review_brief`
2. Call MCP `get_review_sections_for_diff` with changed file extensions
3. Call MCP `scan_angular_violations` on each changed `.ts` and `.html` file
4. Output verdict: APPROVED | APPROVED WITH REQUIRED CHANGES | REJECTED — REFACTOR REQUIRED

Use the exact section structure from `get_pr_review_brief`. Classify issues as BLOCKER | HIGH | MEDIUM | LOW.

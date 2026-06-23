---
name: angular-review
description: Run enterprise Angular PR review with MCP-backed standards
---

# /angular-review

Run the **angular-pr-review** skill workflow:

1. Load PR/diff scope from user context
2. Use MCP `angular-standards` tools (not inline standards text)
3. Produce review in mandatory output format
4. Verdict must be explicit: APPROVED | APPROVED WITH REQUIRED CHANGES | REJECTED — REFACTOR REQUIRED

If no diff provided, ask for files or branch comparison before reviewing.

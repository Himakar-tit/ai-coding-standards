---
applyTo: "**/*.{ts,html,scss}"
---

# Angular File Standards

When editing Angular files, call MCP tool `get_standards_section` for the relevant domain:

| Task | Section |
|------|---------|
| Components / templates | `modern-angular`, `architecture` |
| Services / RxJS | `rxjs` |
| Types / models | `typescript` |
| Templates / a11y | `accessibility` |
| Styles | `styling` |
| PR review | `get_pr_review_brief` then `get_review_sections_for_diff` |

Run `scan_angular_violations` on changed files before completing the task.

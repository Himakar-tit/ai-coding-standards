# Angular Architecture Governance

Do **not** load full architecture standards into context. Use the **angular-standards** MCP server.

## MCP workflow (token-efficient)

1. `list_standards_sections` — discover available sections
2. `get_pr_review_brief` — PR review format + anti-patterns (~800 tokens)
3. `get_review_sections_for_diff` — load only sections matching changed file types
4. `get_standards_section` — fetch one domain at a time when needed
5. `scan_angular_violations` — heuristic pre-scan per changed `.ts`/`.html` file

## Non-negotiables

- Standalone components, `ChangeDetectionStrategy.OnPush`, signals-first (`input()`, `output()`, `signal()`, `computed()`)
- Control flow: `@if`, `@for` (with `track`), `@switch` — not `*ngIf`/`*ngFor`
- No manual subscribe for template data; no `subs.sink` patterns
- Side effects in `tap()` only — never in `map()`/`switchMap()`
- WCAG accessibility: semantic HTML, keyboard support, accessible names
- Feature flags: sectional `@if` — no parallel legacy/redesign component trees

Compose with `@angular/cli mcp` for official Angular docs — do not duplicate.

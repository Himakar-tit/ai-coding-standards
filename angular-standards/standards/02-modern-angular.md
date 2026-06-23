# Modern Angular Standards

## Require
- `signal()`, `computed()`, `effect()` for component state
- `input()`, `output()` over `@Input`/`@Output`
- Standalone components
- `ChangeDetectionStrategy.OnPush` everywhere
- Control flow: `@if`, `@for` (with `track`), `@switch`, `@defer`
- Zoneless-friendly: no implicit CD triggers

## Flag
- `*ngIf`, `*ngFor`, `*ngSwitch` (deprecated)
- Default change detection
- Template function calls or recalculating getters
- Mutable component fields synced imperatively
- Unnecessary lifecycle hooks (`ngOnInit` for data that belongs in `computed`)
- Missing `track` in `@for`

## Signal Boundaries
- `computed()` for derived UI state only — no side effects
- `effect()` for intentional side effects only — not for state derivation
- Prefer declarative template bindings over imperative DOM sync

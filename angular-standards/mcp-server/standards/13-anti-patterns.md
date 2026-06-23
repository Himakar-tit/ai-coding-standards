# Consolidated Anti-Patterns (Reject List)

## Architecture
- God components / god services
- Orchestration mixed with rendering
- Cross-feature leakage
- Monolithic templates
- Duplicated markup across features

## Angular
- Default change detection
- Legacy structural directives (*ngIf, *ngFor, *ngSwitch)
- Legacy @Input/@Output when input()/output() available
- Template function calls
- Recalculating getters in templates
- Imperative UI synchronization

## RxJS
- Nested subscriptions
- subs.sink / Subscription[] patterns
- Side effects in map()/switchMap()
- Subscribe only to sync local template state
- Constructor subscriptions

## State
- Mutable shared state
- State duplication between store and component
- Component-orchestrated store synchronization
- Dispatch in constructors or tap() for sync

## Performance
- Unstable bindings / new objects in templates
- Missing @for track
- Avoidable rerenders

## Accessibility
- Non-semantic clickable elements
- Missing labels / broken focus management
- Invalid ARIA

## Feature Flags
- Parallel legacy/redesign component trees
- Duplicated orchestration for flag variants

## Dependencies
- Heavy legacy libraries (moment.js)
- Non-tree-shakeable imports
- Unnecessary third-party abstractions

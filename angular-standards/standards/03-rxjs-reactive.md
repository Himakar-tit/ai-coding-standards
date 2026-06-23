# RxJS & Reactive Systems

## Validate
- No nested subscriptions
- Proper flattening: `switchMap` (cancel prior), `concatMap` (serialize), `mergeMap` (parallel)
- `takeUntilDestroyed()` for component-scoped subscriptions
- Async pipe or signals for template rendering
- Side effects isolated in `tap()` — never in `map()`/`switchMap()` transforms
- No race conditions on rapid input changes

## Flag (BLOCKER/HIGH)
- `subs.sink`, `Subscription[]`, manual unsubscribe orchestration
- Subscribe used only to assign local state for template
- Side effects inside transformation operators
- Feature-flag logic deeply embedded in reactive chains
- Constructor subscriptions
- Dispatch from `tap()` for store synchronization (use Effects)

## Prefer
- Pure transformation pipelines
- Declarative reactive composition
- Observable → template via async pipe
- Signals/computed for derived UI state

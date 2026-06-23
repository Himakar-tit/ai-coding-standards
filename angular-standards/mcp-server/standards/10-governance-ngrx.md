# Frontend Governance, Feature Flags & NgRx

## Governance
- Architectural consistency with existing workspace patterns
- Shared library boundaries respected; no domain leakage
- Lightweight tree-shakeable dependencies (date-fns over moment)
- No duplicated platform infrastructure logic

## Feature Flags
- Prefer sectional conditional rendering over parallel legacy/redesign components
- Single shared component with localized `@if` for flagged sections
- Avoid duplicated orchestration and template paths

## NgRx
- Store synchronization via Effects — not components
- No dispatch in constructors
- No dispatch from `tap()` for slice synchronization
- Business orchestration outside presentation layers

## Flag
- Parallel component hierarchies for feature flags
- Constructor-based store orchestration
- Architecture drift from platform standards

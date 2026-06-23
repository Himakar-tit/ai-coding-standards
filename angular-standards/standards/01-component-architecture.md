# Component Architecture

## Validate
- Strict smart vs presentational separation
- Presentational components remain pure; orchestration isolated to containers
- List rendering: Collection component vs Item component
- Templates readable within one scroll; large sections decomposed
- Reusable UI primitives extracted; no duplicated markup
- No feature leakage, cross-domain coupling, or hidden shared dependencies
- No god components or mixed responsibilities

## Flag (BLOCKER/HIGH)
- Orchestration mixed with rendering
- Layout duplication across features
- Deeply nested template conditionals
- Oversized components (>300 lines TS or template > one scroll)
- Component APIs difficult to reason about

## Required Patterns
```
feature/
  containers/     # smart: store, routing, orchestration
  components/     # dumb: @Input/@Output or input()/output() only
  models/
  services/       # feature-scoped only
```

# Operational & Scalability

## Validate
- Resiliency under partial API failure
- Async race condition handling (switchMap on search/filter)
- Feature flag compatibility without divergence
- Observability hooks for critical user flows
- Maintainability under multi-team contribution

## Flag
- Unsafe async assumptions (stale responses applied)
- Scalability bottlenecks (unbounded lists without virtualization)
- Difficult cleanup paths after feature flag removal
- Hydration mismatch risks if SSR applies

# Performance & Rendering

## Validate
- Minimal rerender pressure under OnPush
- Stable object/array references in bindings
- No object/array creation in templates
- Memoized derived state via `computed()`
- Efficient DOM structures; lazy loading where appropriate
- `@for` with stable identity `track`

## Flag
- Rendering churn from unstable bindings
- Expensive template expressions
- Oversized DOM trees in single component
- Repeated recalculation on every CD cycle

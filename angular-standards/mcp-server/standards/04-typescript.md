# TypeScript Engineering

## Require
- Strict typing; zero unnecessary `any`
- Explicit domain models; readonly where appropriate
- Immutable data handling
- Explicit null safety
- Small composable pure functions

## Flag
- Magic strings for domain values (use const enums or union types)
- Unsafe casts (`as any`, unchecked `!`)
- Hidden mutation of shared objects
- Oversized methods (>40 lines)
- Branching-heavy logic without extraction

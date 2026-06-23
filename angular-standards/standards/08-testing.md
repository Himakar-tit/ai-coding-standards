# Testing & Reliability

## Validate
- Unit tests for critical paths and edge cases
- Loading, empty, and error states handled and tested
- API failures handled safely with user-visible feedback
- Deterministic behavior; no console/debug leftovers
- Resilient async handling

## Flag
- Missing coverage on state transitions
- Unhandled edge cases (null data, partial API failure)
- Nondeterministic timing-dependent tests without fakeAsync/tick

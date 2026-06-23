# Security & Production Readiness

## Validate
- No unsafe `[innerHTML]` without DomSanitizer justification
- No sensitive data in logs or client state
- Safe error handling — no stack traces to users
- Production-safe logging levels
- Defensive API contract handling

## Flag (BLOCKER)
- XSS risks via unsanitized dynamic HTML
- Production `console.log` / debug artifacts
- Sensitive tokens in localStorage without encryption strategy
